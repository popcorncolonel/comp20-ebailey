
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
    createMarker(myLatlng, login, 'images/star.png', 'Myself!<br>Lat: ' + lat + '<br>Lng: ' + lng);
}

charmap = {
    'carmen':'images/carmen.png',
    'batman':'images/batman.png',
    'hescott':'images/hescott.png',
    'nr':'images/nr.png',
    'snape':'images/snape.png',
    'waldo':'images/waldo.png',
}

function char_apply(character) {
    var name = character['name'];
    var lat = character['loc']['latitude'];
    var lng = character['loc']['longitude'];
    var note = character['loc']['note'];
    var latlng = new google.maps.LatLng(lat, lng);
    //name, lat, lng, note
    var info = 'Name: ' + name + '<br>Lat: ' + lat + '<br>Lng: ' + lng + '<br>Note: ' + note;
    createMarker(latlng, name, charmap[name], info);
}

function student_apply(student) {
    var login = student['login'];
    var lat = student['lat'];
    var lng = student['lng'];
    var latlng = new google.maps.LatLng(lat, lng);
    var timestamp = student['created_at'];
    //login, lat, lng, timestamp
    var info = 'Login: ' + login + '<br>Lat: ' + lat + '<br>Lng: ' + lng + '<br>Timestamp: ' + timestamp;
    createMarker(latlng, login, '', info);
}

function drawPolylines(characters, myLat, myLng) {
    var myLatlng = new google.maps.LatLng(myLat, myLng); 
    characters.forEach(function(character) {
        var charLatlng = new google.maps.LatLng(character['loc']['latitude'],
                                                character['loc']['longitude']);
        var path = [myLatlng, charLatlng];
        var charPath = new google.maps.Polyline({
            path: path,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });           
        charPath.setMap(map);
    });
}

Number.prototype.toRad = function() {
    return this * Math.PI / 180;
}
//function restructured based on stackoverflow.com/questions/14560999
function getDist(charLatlng, myLatlng) {

    var lat2 = charLatlng.lat();
    var lon2 = charLatlng.lng();
    var lat1 = myLatlng.lat();
    var lon1 = myLatlng.lng();

    var R = 3961; // miles 
    var x1 = lat2-lat1;
    var dLat = x1.toRad();  
    var x2 = lon2-lon1;
    var dLon = x2.toRad();  
    var a = (Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
        Math.sin(dLon/2) * Math.sin(dLon/2));
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; 

    return Math.round(d*100)/100; //round
}

function pan(lat, lng) {
    var Latlng = new google.maps.LatLng(lat, lng); 
    map.panTo(Latlng);
}

function writeDistList(characters, myLat, myLng) {
    var myLatlng = new google.maps.LatLng(myLat, myLng); 
    var box = document.getElementById('dist_list');
    dist_list = [];
    characters.forEach(function(character) {
        var charLatlng = new google.maps.LatLng(character['loc']['latitude'],
                                                character['loc']['longitude']);
        var dist = getDist(charLatlng, myLatlng);
        dist_list.push([dist, character['name'], charLatlng]);
    });
    console.log(dist_list);
    dist_list.sort(function(a, b) {
        a = a[0];
        b = b[0];
        return a < b ? -1 : (a > b ? 1 : 0);
    });
    console.log(dist_list);
    dist_list.forEach(function(dist) {
            box.innerHTML += 'Name: <a href="javascript:;" onclick="pan('+dist[2].lat()+', '+dist[2].lng()+');">' + dist[1] + '</a>; Dist: ' + dist[0] + ' miles<br>';
    });
    
}

function addPoints(myLat, myLng) {
    var req = new XMLHttpRequest();
    url = 'http://chickenofthesea.herokuapp.com/sendLocation';
    req.open('POST', url, true)
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    params = "lat="+myLat+"&lng="+myLng+"&login="+login; 
    var response = new Object();
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            response = JSON.parse(req.responseText);
            char_array = response['characters']; 
            student_array = response['students'];
            char_array.forEach(char_apply);
            drawPolylines(char_array, myLat, myLng);
            writeDistList(char_array, myLat, myLng);
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

