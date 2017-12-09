$(document).ready(function() {

  'use strict';

  var apiEndpoint = 'https://wind-bow.glitch.me/twitch-api';
  var channels = [
    'brunofin',
    'comster404',
    'cretetion',
    'ESL_SC2',
    'freecodecamp',
    'habathcx',
    'noobs2ninjas',
    'OgamingSC2',
    'RobotCaleb',
    'storbeck'
  ];
  var missingLogoName = 'missing-logo.png';
  var searchInputElement = $('.header__search-input');
  var filterBtnElements = $('.header__filter');
  var channelsElement = $('.channels');

  function makeJSONRequest(type, id, success) {
    $.getJSON(apiEndpoint + '/' + type + '/' + id, success);
  }

  function makeChannelRequest(id) {
    makeJSONRequest('channels', id, function(data) {
      makeStreamRequest(getChannelInformation(id, data));
    });
  }

  function getChannelInformation(id, data) {
    var channelInformation = { id: id };

    if (data.hasOwnProperty('error')) {
      channelInformation.status = 'closed';
      channelInformation.href = '#';
      channelInformation.logo = missingLogoName;
      channelInformation.longDescription = getChannelErrorDescription(data.status);
      channelInformation.shortDescription = channelInformation.longDescription;
    } else {
      channelInformation.href = data.url;
      channelInformation.logo = data.logo || missingLogoName;
    }

    return channelInformation;
  }

  function getChannelErrorDescription(statusCode) {
    if (statusCode === 404) {
      return 'Channel does not exist';
    } else if (statusCode === 422) {
      return 'Channel is unavailable';
    } else {
      return 'Could not retrieve channel information';
    }
  }

  function makeStreamRequest(channelInformation) {
    if (channelInformation.status === 'closed') {
      addToDOM(channelInformation);
    } else {
      makeJSONRequest('streams', channelInformation.id, function(data) {
        addStreamInformation(data, channelInformation);
        addToDOM(channelInformation);
      });
    }
  }

  function addStreamInformation(data, channelInformation) {
    if (data.stream === null) {
      channelInformation.status = 'offline';
      channelInformation.longDescription = 'Offline';
      channelInformation.shortDescription = channelInformation.longDescription;
    } else {
      channelInformation.status = 'online';
      channelInformation.shortDescription = data.stream.channel.game;
      channelInformation.longDescription = channelInformation.shortDescription + ': ' + data.stream.channel.status;
    }
  }

  function addToDOM(channelInformation) {
    channelsElement.append(
      '<a href="' + channelInformation.href + '" target="_blank" class="channel channel--' + channelInformation.status + ' clearfix" id="' + channelInformation.id + '">' +
        '<div class="col-xs-12 col-sm-2 text-center">' +
          '<img src="' + channelInformation.logo + '" class="channel__img img-circle" alt="' + channelInformation.id + ' logo" title="' + channelInformation.id + '">' +
        '</div>' +
        '<div class="ellipsis col-sm-10">' +
          '<strong class="col-xs-12 col-sm-2 text-center">' + channelInformation.id + '</strong>' +
          '<div class="ellipsis col-xs-12 col-sm-9 col-sm-offset-1 text-center">' +
            '<span class="hidden-xs">' + channelInformation.longDescription + '</span>' +
            '<span class="hidden-sm hidden-md hidden-lg">' + channelInformation.shortDescription + '</span>' +
          '</div>' +
        '</div>' +
      '</a>'
    );
  }

  function applySearchFilters() {
    var filter = filterBtnElements.filter(':checked').val();
    var searchTerm = searchInputElement.val().toLowerCase();
    var channelLinks = $('.channel').show();

    // apply button filters
    if (filter === 'online') {
      channelLinks.not('.channel--online').hide();
    } else if (filter === 'offline') {
      channelLinks.not('.channel--offline, .channel--closed').hide();
    }

    // apply search box filters
    channelLinks.filter(':visible').each(function () {
      if (this.id.toLowerCase().indexOf(searchTerm) === -1) {
        $(this).hide();
      }
    });
  }

  filterBtnElements.change(applySearchFilters);
  searchInputElement.keyup(applySearchFilters);

  channels.forEach(function(channel, i) {
    makeChannelRequest(channel);
  });

});