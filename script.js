$(document).ready(function () {
  
  "use strict";
  
  var twitchApiEndpoint = "https://wind-bow.glitch.me/twitch-api";
  
  function getRequest(query, id, success, error) {
    $.getJSON(twitchApiEndpoint + "/" + query + "/" + id, success, error);
  }
  
  function getStream(id, success, error) {
    getRequest("streams", id, success, error);
  }
  
  function getChannel(id, success, error) {
    getRequest("channels", id, success, error);
  }
  
  function getUser(id, success, error) {
    getRequest("users", id, success, error);
  }
  
  function showImage(data) {
    if (data.stream !== null) {
      var img = $("<img>").attr("src", data.stream.channel.logo);
      $(document.body).append(img);
    }
  }
  
  function showError(error) {
    console.error(error);
  }
  
  getStream("freecodecamp", showImage, showError);
  getStream("ESL_SC2", showImage, showError);
  
});