//$(document).ready(function () {
//  
//  "use strict";
//  
//  var originalApiEndpoint = "https://api.twitch.tv/kraken";
//  var updatedApiEndpoint = "https://wind-bow.glitch.me/twitch-api";
//  
//  function getRequest(query, id, success, error) {
//    $.getJSON(updatedApiEndpoint + "/" + query + "/" + id, success, error);
//  }
//  
//  function getStream(id, success, error) {
//    getRequest("streams", id, success, error);
//  }
//  
//  function getChannel(id, success, error) {
//    getRequest("channels", id, success, error);
//  }
//  
//  function getUser(id, success, error) {
//    getRequest("users", id, success, error);
//  }
//  
//  function showImage(data) {
//    if (data.stream !== null) {
//      var img = $("<img>").attr("src", data.stream.channel.logo).addClass("img-circle");
//      $(document.body).append(img);
//    }
//  }
//  
//  function showError(error) {
//    console.error(error);
//  }
//  
//  getStream("freecodecamp", showImage, showError);
//  getStream("ESL_SC2", showImage, showError);
//  
//});

$(document).ready(function () {

  $("input:radio").change(function (event) {
    console.log(event.target.value);
  })

});
