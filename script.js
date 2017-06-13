$(document).ready(function () {

  "use strict";

  var apiEndpoint = "https://wind-bow.glitch.me/twitch-api",
    streamers = [
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
    missingLogoName = "missing-logo.png";

  streamers.forEach(makeChannelRequest);

  function makeChannelRequest(id) {
    $.getJSON(apiEndpoint + "/channels/" + id, channelRequestCallback);

    function channelRequestCallback(data) {
      var channelInformation = getChannelInformation(id, data);
      makeStreamRequest(channelInformation);
    }
  }

  function getChannelInformation(id, data) {
    var channelInformation = {
      id: id
    };

    if (data.hasOwnProperty("error")) {
      channelInformation.status = "closed";
      channelInformation.href = "#";
      channelInformation.logo = missingLogoName;
      channelInformation.longDescription = getChannelErrorDescription(data);
      channelInformation.shortDescription = channelInformation.longDescription;
    } else {
      channelInformation.href = data.url;
      channelInformation.logo = data.logo || missingLogoName;
    }

    return channelInformation;
  }

  function getChannelErrorDescription(data) {
    switch (data.status) {
      case 404:
        return "Channel does not exist";
      case 422:
        return "Channel is unavailable";
      default:
        return "Could not retrieve channel information";
    }
  }

  function makeStreamRequest(channelInformation) {
    if (channelInformation.status === "closed") {
      addChannelInformationToDOM(channelInformation);
    } else {
      $.getJSON(apiEndpoint + "/streams/" + channelInformation.id, streamRequestCallback);
    }

    function streamRequestCallback(data) {
      addStreamInformation(data, channelInformation);
      addChannelInformationToDOM(channelInformation);
    }
  }

  function addStreamInformation(data, channelInformation) {
    if (data.stream === null) {
      channelInformation.status = "offline";
      channelInformation.longDescription = "Offline";
      channelInformation.shortDescription = channelInformation.longDescription;
    } else {
      channelInformation.status = "online";
      channelInformation.shortDescription = data.stream.channel.game;
      channelInformation.longDescription = channelInformation.shortDescription +
        ": " + data.stream.channel.status;
    }
  }

  function addChannelInformationToDOM(channelInformation) {
    var a = "<a href='" + channelInformation.href + "' " +
      "target='_blank' class='" + channelInformation.status + " clearfix'>" +
      "<span class='col-xs-2 text-center'>" +
      "<img src='" + channelInformation.logo + "' class='img-circle' " +
      "alt='" + channelInformation.id + " logo' title='" +
      channelInformation.id + "'>" +
      "</span>" +
      "<span class='col-xs-10'>" +
      "<strong class='col-xs-12 col-sm-2 text-center'>" +
      channelInformation.id + "</strong>" +
      "<span class='col-xs-12 col-sm-9 col-sm-offset-1 text-center'>" +
      "<span class='hidden-xs'>" + channelInformation.longDescription +
      "</span>" +
      "<span class='hidden-sm hidden-md hidden-lg'>" +
      channelInformation.shortDescription + "</span>" +
      "</span>" +
      "</span>" +
      "</a>";
    $("main").append(a);
  }

  //  $("input:radio").change(function (event) {
  //    console.log(event.target.value);
  //  });

});
