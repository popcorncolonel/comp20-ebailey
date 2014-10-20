
var login = "ParvatiPatil";
var map;

function init(lat, lng) {
    lat = lat || 42.3553;
    lng = lng || -71.10;
    var myLatlng = new google.maps.LatLng(lat, lng); 
    var myOptions = {
      zoom: 12, // The larger the zoom number, the bigger the zoom
      center: myLatlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    createMarker(myLatlng, login, 'images/star.png', 'Myself!')
}

charmap = {
    'carmen':'images/carmen.png',
    'batman':'images/batman.png',
    'hescott':'images/hescott.png',
    'nr':'images/nr.png',
    'snape':'images/snape.png',
    'waldo':'images/waldo.png',
}

function char_apply(element) {
    var name = element['name'];
    var lat = element['loc']['latitude'];
    var lng = element['loc']['longitude'];
    var note = element['loc']['note'];
    var latlng = new google.maps.LatLng(lat, lng);
    //name, lat, lng, note
    var info = 'Name: ' + name + '<br>Lat: ' + lat + '<br>Lng: ' + lng + '<br>Note: ' + note;
    createMarker(latlng, name, charmap[name], info);
}

function student_apply(element) {
    var login = element['login'];
    var lat = element['lat'];
    var lng = element['lng'];
    var latlng = new google.maps.LatLng(lat, lng);
    var timestamp = element['created_at'];
    //login, lat, lng, timestamp
    var info = 'Login: ' + login + '<br>Lat: ' + lat + '<br>Lng: ' + lng + '<br>Timestamp: ' + timestamp;
    createMarker(latlng, login, '', info);
}

function addPoints(lat, lng) {
    var req = new XMLHttpRequest();
    url = 'http://chickenofthesea.herokuapp.com/sendLocation';
    req.open('POST', url, true)
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    params = "lat="+lat+"&lng="+lng+"&login="+login; 
    var response = new Object();
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            response = JSON.parse(req.responseText);
            char_array = response['characters']; 
            console.log(char_array);
            student_array = response['students'];
            char_array.forEach(char_apply);
            student_array.forEach(student_apply);
        }
    }
    req.send(params);
} 

function createMarker (latLng, title, image, info) {
    info = info || '';
    image = image || '';
    var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        title:title,
        icon:image,
    });
    marker.setMap(map);
    var infowindow = new google.maps.InfoWindow({
        content: info
    });
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker);
    });

}

function success(pos) {
    init(pos.coords.latitude, pos.coords.longitude);
    addPoints(pos.coords.latitude, pos.coords.longitude);
}

function error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
}

var options = {
    enableHighAccuracy: true
}

navigator.geolocation.getCurrentPosition(success, error, options);

