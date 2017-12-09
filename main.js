/*global $*/

$(document).ready(function () {

  "use strict";

  var apiEndpoint = "https://wind-bow.glitch.me/twitch-api",
    channels = [
      "freecodecamp",
      "ESL_SC2",
      "OgamingSC2",
      "brunofin",
      "cretetion",
      "storbeck",
      "habathcx",
      "RobotCaleb",
      "comster404",
      "noobs2ninjas"
    ],
    missingLogoName = "missing-logo.png",
    i,
    length,
    id,
    makeJSONRequest,
    makeChannelRequest,
    getChannelInformation,
    getChannelErrorDescription,
    makeStreamRequest,
    addStreamInformation,
    addToDOM,
    applySearchFilters,
    filterButtons = $("input[name=filter]"),
    searchBox = $("input[type='search']");

  makeJSONRequest = function (type, id, success) {
    $.getJSON(apiEndpoint + "/" + type + "/" + id, success);
  };

  makeChannelRequest = function (id) {
    makeJSONRequest("channels", id, function (data) {
      var channelInformation = getChannelInformation(id, data);
      makeStreamRequest(channelInformation);
    });
  };

  getChannelInformation = function (id, data) {
    var channelInformation = {
      id: id
    };

    if (data.hasOwnProperty("error")) {
      channelInformation.status = "closed";
      channelInformation.href = "#";
      channelInformation.logo = missingLogoName;
      channelInformation.longDescription = getChannelErrorDescription(data.status);
      channelInformation.shortDescription = channelInformation.longDescription;
    } else {
      channelInformation.href = data.url;
      channelInformation.logo = data.logo || missingLogoName;
    }

    return channelInformation;
  };

  getChannelErrorDescription = function (statusCode) {
    if (statusCode === 404) {
      return "Channel does not exist";
    } else if (statusCode === 422) {
      return "Channel is unavailable";
    } else {
      return "Could not retrieve channel information";
    }
  };

  makeStreamRequest = function (channelInformation) {
    if (channelInformation.status === "closed") {
      addToDOM(channelInformation);
    } else {
      makeJSONRequest("streams", channelInformation.id, function (data) {
        addStreamInformation(data, channelInformation);
        addToDOM(channelInformation);
      });
    }
  };

  addStreamInformation = function (data, channelInformation) {
    if (data.stream === null) {
      channelInformation.status = "offline";
      channelInformation.longDescription = "Offline";
      channelInformation.shortDescription = channelInformation.longDescription;
    } else {
      channelInformation.status = "online";
      channelInformation.shortDescription = data.stream.channel.game;
      channelInformation.longDescription = channelInformation.shortDescription + ": " + data.stream.channel.status;
    }
  };

  addToDOM = function (channelInformation) {
    var content = 
    
      "<a href='" + channelInformation.href + "' target='_blank' class='channel channel--" + channelInformation.status + " clearfix' id='" + channelInformation.id + "'>" +
        "<span class='col-xs-12 col-sm-2 text-center'>" +
          "<img src='" + channelInformation.logo + "' class='channel__img img-circle' alt='" + channelInformation.id + " logo' title='" + channelInformation.id + "'>" +
        "</span>" +
        "<span class='ellipsis col-sm-10'>" +
          "<strong class='col-xs-12 col-sm-2 text-center'>" + channelInformation.id + "</strong>" +
          "<span class='ellipsis col-xs-12 col-sm-9 col-sm-offset-1 text-center'>" +
            "<span class='hidden-xs'>" + channelInformation.longDescription + "</span>" +
            "<span class='hidden-sm hidden-md hidden-lg'>" + channelInformation.shortDescription + "</span>" +
          "</span>" +
        "</span>" +
      "</a>";
    $("main").append(content);
  };

  applySearchFilters = function () {
    var filter = filterButtons.filter(":checked").val(),
      searchTerm = searchBox.val().toLowerCase(),
      channelLinks = $("main a").show();

    // apply button filters
    if (filter === "online") {
      channelLinks.not(".online").hide();
    } else if (filter === "offline") {
      channelLinks.not(".offline, .closed").hide();
    }

    // apply search box filters
    channelLinks.filter(":visible").each(function () {
      if (this.id.toLowerCase().indexOf(searchTerm) === -1) {
        $(this).hide();
      }
    });
  };

  filterButtons.change(applySearchFilters);
  searchBox.keyup(applySearchFilters);

  for (i = 0, length = channels.length; i < length; i += 1) {
    id = channels[i];
    makeChannelRequest(id);
  }

});