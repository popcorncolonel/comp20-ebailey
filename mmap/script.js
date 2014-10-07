console.log(navigator.geolocation)

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

navigator.geolocation.getCurrentPosition(success, error, options);

