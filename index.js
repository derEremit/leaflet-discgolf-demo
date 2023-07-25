// Import stylesheets
import './style.css';

require('leaflet');
require('leaflet-overpass-layer');

var attr_osm = 'Map data &copy; <a href="http://openstreetmap.org/">OpenStreetMap</a> contributors';
var attr_overpass = 'POI via <a href="http://www.overpass-api.de/">Overpass API</a>';

var osm = new L.TileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        'opacity': 0.7,
        'attribution': [attr_osm, attr_overpass].join(', ')
    }
);

var greenIcon = L.icon({
    iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
    shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',

    iconSize:     [38, 95], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var map = new L.Map('map')
.addLayer(osm)
.fitWorld()
// todo get location from device
//.setView(new L.LatLng(52.265, 10.524), 14);

map.locate({setView: true, watch: false, maxZoom: 9});
//map.on('locationfound', onLocationFound);

var opl = new L.OverPassLayer({
    markerIcon: greenIcon,
    minZoom: 6,
    //'query': '(node({{bbox}})[organic];node({{bbox}})[second_hand];);out qt;',
    'query': 'node[sport=disc_golf]({{bbox}});out;'
});

map.addLayer(opl);

function onLocationFound(e) {
    var radius = e.accuracy;

    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

    L.circle(e.latlng, radius).addTo(map);
}

map.on('locationfound', onLocationFound);