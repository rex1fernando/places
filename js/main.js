var snabbdom = require('snabbdom');
var patch = snabbdom.init([ // Init patch function with chosen modules
  require('snabbdom/modules/class').default, // makes it easy to toggle classes
  require('snabbdom/modules/props').default, // for setting properties on DOM elements
  require('snabbdom/modules/style').default, // handles styling on elements with support for animations
  require('snabbdom/modules/eventlisteners').default, // attaches event listeners
]);
var h = require('snabbdom/h').default;


var map = L.map('map').setView([51.505, -0.09], 13);
var mainView = document.getElementById("mainView");
var greenIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var blueIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var OpenStreetMap_DE = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                                    maxZoom: 18,
                                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'});
OpenStreetMap_DE.addTo(map);


// Click to get location helper
let onMapClick = (e) => {
  var popup = L.popup()
  .setLatLng(e.latlng)
  .setContent("{ latlon: [" + e.latlng.lat + ", " + e.latlng.lng + "], zoom: " + map.getZoom() + "}")
  .openOn(map);
}
map.on('click', onMapClick);


var vnode = h('div#container', {}, [
  h('h1', {}, 'Trips')
]);
// Patch into empty DOM element – this modifies the DOM as a side effect
patch(mainView, vnode);


var data = require('./data').data;

var clickHandler = (place) => {
  map.flyTo(place.loc.latlon, place.loc.zoom)
}

var vnodes = [
  h('h1', {}, "Rex And Elodie's Trips"),
  h('p', {}, "I had an idea to make a website where we can add trips on a map. You can't add new places yet but if you like the idea I will do it. Click on a place to zoom there in the map."),
];
for (var trip of data.trips) {
  L.marker(trip.loc.latlon, {icon: blueIcon}).addTo(map);
  
  vnodesForPlaces = []
  for (var place of trip.places) {
    L.marker(place.loc.latlon, {icon: greenIcon}).addTo(map);
    vnodesForPlaces.push(h('li', {on: {click: [clickHandler, place]}}, place.title));
  }
  vnodes.push(h('div#container', {}, [
    h('h2', {on: {click: [clickHandler, trip]}}, trip.title),
    h('p', {}, trip.text),
    h('ul', {}, vnodesForPlaces)
  ]));
  
}



var newvnode = h('div#container', {}, vnodes);
patch(vnode, newvnode);
