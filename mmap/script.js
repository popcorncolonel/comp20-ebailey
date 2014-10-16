
var myLat = 42.3553;
var myLng = -71.10;
var myOptions = {
      zoom: 12, // The larger the zoom number, the bigger the zoom
      center: new google.maps.LatLng(myLat, myLng),
      mapTypeId: google.maps.MapTypeId.ROADMAP
};
var map;
var trainList;

function init()
{
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    addTrains();
}

function addTrains()
{
    var req = new XMLHttpRequest();
    url = 'http://google.com';
    //req.open('GET', url, true)
    //req.send();
    var response = new Object();
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            response = JSON.parse(req.responseText);
        }
    }
    console.log(response);
    var myLatlng2 = new google.maps.LatLng(myLat, myLng);
    //createMarker(myLatlng2, map, 'hey :-^)');
} 

function createMarker (latLng, map, title) {
    var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        title:title
    });
    marker.setMap(map);
}
console.log(navigator.geolocation);

function success(pos) {
    console.log(pos);
    console.log(pos.coords);
    console.log("HERE in success");
}

function error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
}

var options = {
    enableHighAccuracy: true
}

//navigator.geolocation.getCurrentPosition(success, error, options);

