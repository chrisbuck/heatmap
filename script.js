(function(window, google, mwin){

// ---- MAP PROPERTIES ---- //
//element
var mapEl = document.getElementById('map-canvas');

//options

var mapOpts = {
    center: {
        lat: 43.2706725,
        lng: -70.9046947
    },
    zoom: 20,
    minZoom: 15,
    keyboardShortcuts: true,
    mapTypeControlOptions: {
        mapTypeIds: 'satellite'
    },
    mapTypeId: google.maps.MapTypeId.SATELLITE
};
    
mwin = mwin.create(mapEl, mapOpts);
gMap = mwin.gMap;

//Arrays

var tempPts = [];   //Array for getting several locations (e.g., heatmaps)
var tempElevs = [];     //Array for returning several elevations (e.g., heatmaps)
    
// ---- FUNCTIONS ---- //


////end self-instigating function.
}(window, window.google, window.MapUtil || (window.MapUtil = {})));