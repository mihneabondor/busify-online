const options = {
    timeout: 5000, 
    maximumAge: 2000, 
};

Array.prototype.random = function () {
    return this[Math.floor((Math.random()*this.length))];
  }

navigator.geolocation.watchPosition(success, error, options);
// Fires success function immediately and when user position changes

function success(pos) {

    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    const accuracy = pos.coords.accuracy; // Accuracy in metres

}

function error(err) {

    if (err.code === 1) {
        alert("Please allow geolocation access");
        // Runs if user refuses access
    } else {
        alert("Cannot get current location");
        // Runs if there was a technical problem.
    }

}

const map = L.map('map'); 
// Initializes map

map.setView([46.7712, 23.6236], 13); 
// Sets initial coordinates and zoom level

L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    className: 'map-tiles'
}).addTo(map);
// Sets map data source and associates with map

var locationIcon = L.icon({
    iconUrl:'Resources/bus_icon.png',
    iconSize: [24,36],
    iconAnchor: [12,36]
});

let marker, circle, zoomed;
let viewMoved = false;

navigator.geolocation.watchPosition(success, error);

var violetIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

function success(pos) {

    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    const accuracy = pos.coords.accuracy;

    if (marker) {
        map.removeLayer(marker);
    }

    marker = L.marker([lat, lng], {icon: violetIcon}).addTo(map);

    if(!viewMoved) {
        map.setView([lat, lng], 18);
        viewMoved = true
    }

}

function error(err) {

    if (err.code === 1) {
        alert("Please allow geolocation access");
    } else {
        alert("Cannot get current location");
    }

}

let keys = ["RqLxPgpNIJ4VfvXQCJ2eh10ZJ5Sppa4QaamWEmmu", "ZneVtEgE4PaLRwkd0HGid36HRx1bhLVs42tTtNol", "CGKMc5bsdz8SkRzHLg8MU4O4I19XwexO8NKTMBzB", "PHi9G7A06660ToNAsRgkh1YKjeqfjUCS9h6W22oB", "aSVGUmECaW8VbAPYnzJFM21KeFiz1suP2z55ZZhL"]

const headers = {
    'Content-Type': 'application/json',
    'X-Agency-Id': 2,
    'X-API-KEY': keys.random()
  };

let vehicleMarker, markers = [];
function fetchStatus() {
    fetch('https://api.tranzy.dev/v1/opendata/vehicles', {
        method: 'GET',
        headers: headers
    }).then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(vehicles => {
        fetch('https://api.tranzy.dev/v1/opendata/routes', {
        method: 'GET',
        headers: headers
    }).then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(routes => {
        //start after everything is setup

        markers.forEach(marker => {
            map.removeLayer(marker)
        })
        vehicles.forEach(vehicle => {
            if(vehicle.latitude != null && vehicle.longitude != null) {
                let route = routes.find(elem => elem.route_id == vehicle.route_id)
                if(route != undefined) {
                    var myIcon = L.divIcon({className: 'bus-icon', html: "<h3 id='bus_icon_text'> 42 </h3>", iconAnchor: [12, 36], shadowAnchor: [4, 62], popupAnchor: [-3, -76]});
                    vehicleMarker = L.marker([vehicle.latitude, vehicle.longitude], {icon: myIcon});
                    vehicleMarker.addTo(map);
                    markers.push(vehicleMarker)
                    let markerElement = vehicleMarker._icon;
                    markerElement.innerHTML = "<h3 id='bus_icon_text'> " + route.route_short_name + " </h3>"
                }
            }
        });
    })
    .catch(error => {
        console.log('Error:', error);
    });
    })
    .catch(error => {
        console.log('Error:', error);
    });
}

  window.addEventListener('load', function () {
    fetchStatus()
    var fetchInterval = 5000;
    setInterval(fetchStatus, fetchInterval);
  });