import missingLogo from '../images/missing-logo.png';

const apiEndpoint = 'https://wind-bow.glitch.me/twitch-api';
const channels = [
  'brunofin',
  'comster404',
  'cretetion',
  'ESL_SC2',
  'freecodecamp',
  'habathcx',
  'noobs2ninjas',
  'OgamingSC2',
  'RobotCaleb',
  'storbeck',
];
const searchInputElement = $('.header__search-input');
const filterBtnElements = $('.header__filter');
const channelsElement = $('.channels');

function makeJSONRequest(type, id, success) {
  $.getJSON(`${apiEndpoint}/${type}/${id}`, success);
}

function getChannelErrorDescription(statusCode) {
  if (statusCode === 404) {
    return 'Channel does not exist';
  }
  if (statusCode === 422) {
    return 'Channel is unavailable';
  }
  return 'Could not retrieve channel information';
}

function getChannelInformation(id, data) {
  const channelInformation = { id };

  if ('error' in data) {
    channelInformation.status = 'closed';
    channelInformation.href = '#';
    channelInformation.logo = missingLogo;
    channelInformation.longDescription = getChannelErrorDescription(data.status);
    channelInformation.shortDescription = channelInformation.longDescription;
  } else {
    channelInformation.href = data.url;
    channelInformation.logo = data.logo || missingLogo;
  }

  return channelInformation;
}

function addToDOM(channelInformation) {
  channelsElement.append(
    `<a href="${channelInformation.href}" target="_blank" class="channel channel--${channelInformation.status} clearfix" id="${channelInformation.id}">`
    + '<div class="col-xs-12 col-sm-2 text-center">'
    + `<img src="${channelInformation.logo}" class="channel__img img-circle" alt="${channelInformation.id} logo" title="${channelInformation.id}">`
    + '</div>'
    + '<div class="ellipsis col-sm-10">'
    + `<strong class="col-xs-12 col-sm-2 text-center">${channelInformation.id}</strong>`
    + '<div class="ellipsis col-xs-12 col-sm-9 col-sm-offset-1 text-center">'
    + `<span class="hidden-xs">${channelInformation.longDescription}</span>`
    + `<span class="hidden-sm hidden-md hidden-lg">${channelInformation.shortDescription}</span>`
    + '</div>'
    + '</div>'
    + '</a>',
  );
}

function addStreamInformation(data, channelInformation) {
  const withStreamInformation = Object.assign({}, channelInformation);

  if (data.stream === null) {
    withStreamInformation.status = 'offline';
    withStreamInformation.longDescription = 'Offline';
    withStreamInformation.shortDescription = channelInformation.longDescription;
  } else {
    withStreamInformation.status = 'online';
    withStreamInformation.shortDescription = data.stream.channel.game;
    withStreamInformation.longDescription = `${withStreamInformation.shortDescription}: ${data.stream.channel.status}`;
  }

  return withStreamInformation;
}

function makeStreamRequest(channelInformation) {
  if (channelInformation.status === 'closed') {
    addToDOM(channelInformation);
  } else {
    makeJSONRequest('streams', channelInformation.id, (data) => {
      const withStreamInformation = addStreamInformation(data, channelInformation);
      addToDOM(withStreamInformation);
    });
  }
}

function makeChannelRequest(id) {
  makeJSONRequest('channels', id, (data) => {
    makeStreamRequest(getChannelInformation(id, data));
  });
}

function applySearchFilters() {
  const filter = filterBtnElements.filter(':checked').val();
  const searchTerm = searchInputElement.val().toLowerCase();
  const channelLinks = $('.channel').show();

  // apply button filters
  if (filter === 'online') {
    channelLinks.not('.channel--online').hide();
  } else if (filter === 'offline') {
    channelLinks.not('.channel--offline, .channel--closed').hide();
  }

  // apply search box filters
  channelLinks.filter(':visible').each((_, e) => {
    if (e.id.toLowerCase().indexOf(searchTerm) === -1) {
      $(e).hide();
    }
  });
}

filterBtnElements.change(applySearchFilters);
searchInputElement.keyup(applySearchFilters);

channels.forEach((channel) => {
  makeChannelRequest(channel);
});
