var selection;
var selectedLayer;

L.mapbox.accessToken = 'pk.eyJ1IjoicHNvbHNydWQiLCJhIjoiY2pwZDIzZndjM2RhNDNwbzFhMGt1eDNuaiJ9.lQ5fHmv-vd8z25m4nTdSlQ';

var map = L.mapbox.map('map').setView([45.74172, -95.943603], 19);

var drawnItems = new L.FeatureGroup().addTo(map);
var geocoder = L.mapbox.geocoder('mapbox.places'); //,map = null;

function showMap(err, data) {
    // The geocoder can return an area, like a city, or a
    // point, like an address.

    drawnItems.clearLayers();

    if (data.latlng) {
        map.setView([data.latlng[0], data.latlng[1]], 13);
    } else if (data.lbounds) {
        map.fitBounds(data.lbounds);
    }

    if (data.latlng) {
        var feature = null;
        polygons.eachLayer(function (polyLayer) {
            polyLayer.eachLayer(function (poly) {
                if (isMarkerInsidePolygon([data.latlng[0], data.latlng[1]], poly)) {
                    feature = poly.feature;
                }
            });
        });

        if (feature)
            serviceModel(feature);
        else
            $('#no-service-modal').modal({
                show: 'true'
            });
    }

    $('#search-modal').modal('hide');

    // L.geoJson(data['results'], {onEachFeature: forEachMarker}).addTo(drawnItems);
    if (data.latlng) {
        L.marker(data.latlng).on('click', function(event) {
            var feature = null;
            polygons.eachLayer(function (polyLayer) {
                polyLayer.eachLayer(function (poly) {
                    if (isMarkerInsidePolygon(data.latlng, poly)) {
                        feature = poly.feature;
                    }
                });
            });
            if (feature)
                serviceModel(feature);
            else
                $('#no-service-modal').modal({
                    show: 'true'
                });
        }).addTo(drawnItems);
    }
}

L.control.layers({
    'Mapbox Streets': L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11').addTo(map),
    'Mapbox Satellite': L.mapbox.styleLayer('mapbox://styles/mapbox/satellite-streets-v9'),
}).addTo(map);

// Set style function that sets fill color property
// define the styles for the my layer (unselected and selected)
function myStyle(feature) {
    return {
        // fillColor: "#FF00FF",
        // fillOpacity: 1,
        // color: '#B04173',
        fillColor: 'gray',
        weight: 2,
        opacity: .1, //Outline opacity
        color: 'gray',  //Outline color
        fillOpacity: .1
    };
}

function mySelectedStyle(feature) {
    return {
        fillColor: 'gray',
        color: 'gray',
        fillOpacity: .2
    };
}

// handle clicks on the map that didn't hit a feature
map.addEventListener('click', function (e) {
    if (selection) {
        resetStyles();
        selection = null;
    }
    $('#no-service-modal').modal({
        show: 'true'
    });
});

// function to set the old selected feature back to its original symbol. Used when the map or a feature is clicked.
function resetStyles() {
    selectedLayer.resetStyle(selection);
}



// handle click events on my features
function forEachFeature(feature, layer) {
    layer.on({
        click: function (e) {
            if (selection) {
                resetStyles();
            }

            e.target.setStyle(mySelectedStyle());
            selection = e.target;
            selectedLayer = myLayer;

            /////////////// this zooms map to fit screen on click
            //map.fitBounds(e.target.getBounds());

            L.DomEvent.stopPropagation(e); // stop click event from being propagated further
        }
    });
}

function isMarkerInsidePolygon(marker, poly) {
    var inside = false;
    var x = marker[0], y = marker[1];
    for (var ii=0;ii<poly.getLatLngs().length;ii++){
        var polyPoints = poly.getLatLngs()[ii][0];
        for (var i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
            var xi = polyPoints[i].lat, yi = polyPoints[i].lng;
            var xj = polyPoints[j].lat, yj = polyPoints[j].lng;

            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
    }

    return inside;
};

function forEachMarker(feature, layer) {
    layer.on('click', function(event) {
        var feature = null;
        polygons.eachLayer(function (polyLayer) {
            polyLayer.eachLayer(function (poly) {
                if (isMarkerInsidePolygon([layer.getLatLng().lat, layer.getLatLng().lng], poly)) {
                    feature = poly.feature;
                }
            });
        });
        if (feature)
            serviceModel(feature);
        else
            $('#no-service-modal').modal({
                show: 'true'
            });
    });
}

function serviceModel(feature) {
    $('#service-modal').modal({
        show: 'true'
    });

    // reset classes
    $(".title").empty();
    $(".speed").empty();
    $(".digital_tv").empty();
    $(".phone").empty();
    $(".home_automation").empty();
    $(".btn-custom").remove();



    //comment out the following services that don't apply to the provider, to change service names and descriptions, update geojson

    $(".title").prepend('Available Services');
    $(".speed").prepend('<div class="product-content"><img src="https://static.wixstatic.com/media/aee650_e9aef2187fc2461895dcea75419f37cb~mv2_d_3517_3350_s_4_2.png/v1/fill/w_66,h_65,al_c,q_80,usm_0.66_1.00_0.01/Sytek%20Icons-01.webp" style="vertical-align: middle;width:60px;height:60px;">' + '&nbsp;&nbsp;<span>' + feature.properties.speed + '</span></div>');
    //$(".digital_tv").prepend('<div class="product-content"><img src="https://static.wixstatic.com/media/aee650_20ebd546c5524639a900e589108450e5~mv2.png/v1/fill/w_188,h_188,al_c/aee650_20ebd546c5524639a900e589108450e5~mv2.png" style="vertical-align: middle;width:60px;height:60px;">' + '&nbsp;&nbsp;' + feature.properties.digital_tv + '</div>');
    $(".phone").prepend('<div class="product-content"><img src="https://static.wixstatic.com/media/aee650_fba80802eb42472dad1a3286ebee75e0~mv2_d_3517_3350_s_4_2.png/v1/fill/w_66,h_59,al_c,q_80,usm_0.66_1.00_0.01/Sytek%20Icons-02.webp" style="vertical-align: middle;width:60px;height:60px;">' + '&nbsp;&nbsp;<span>' + feature.properties.phone + '</span></div>');
    //$(".home_automation").prepend('<div class="product-content"><img src="https://static.wixstatic.com/media/aee650_7d28d8b31fb849b1aaf528ca5296ea06~mv2.png/v1/fill/w_188,h_188,al_c/aee650_7d28d8b31fb849b1aaf528ca5296ea06~mv2.png" style="vertical-align: middle;width:60px;height:60px;">' + '&nbsp;&nbsp;' + feature.properties.home_autom + '</div>');
    $("#service-modal .modal-footer").prepend('<a class="btn btn-custom center-block" href="' + feature.properties.url + '" target="_parent" role="button">Learn More</a>');
}

// executed when feature is clicked
function polygonClick(e) {
    var feature = e.layer.feature;

    serviceModel(feature);
}

// Null variable that will hold layer
var myLayer = L.geoJson(null, { onEachFeature: forEachFeature, style: myStyle }).addTo(map);

// empty featureGroup() used to determine extents of selectedLayer
var polygons = L.featureGroup().on('click', polygonClick).addTo(map);

// AJAX used here to load local geojson
var territories = "data/data.geojson";
$.getJSON(territories, function (data) {
    L.geoJson(data, {
        onEachFeature: forEachFeature,
        style: myStyle
    }).addTo(polygons);
});

// Fit all markers after 1/2 second.
//    used to counter async loading
setTimeout(function () {
    map.fitBounds(polygons.getBounds());
}, 500);


// var map = L.map('map').setView([38.83, -98.5], 7);
// L.esri.basemapLayer('Gray').addTo(map);

// var url = 'https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Petroleum/KGS_OilGasFields_Kansas/MapServer';


$(document).ready(function(){
    $('#search-modal').modal({
        show: true
    });


    $("#userSearch").keypress(function(e){
        if(e.which == 13){
            var text = document.getElementById('userSearch').value;
            if (text.length >= 5) {
                geocoder.query(text, showMap);
            }
        }
    });
    $("#modalUserSearch").keypress(function(e){
        if(e.which == 13){
            var text = document.getElementById('modalUserSearch').value;
            if (text.length >= 5) {
                geocoder.query(text, showMap);
            }
        }
    });
    $(".btn-search").click(function() {
        var text = document.getElementById('userSearch').value;
        if (text.length >= 5) {
            geocoder.query(text, showMap);
        }
    });
    $(".modal-btn-search").click(function() {
        var text = document.getElementById('modalUserSearch').value;
        if (text.length >= 5) {
            geocoder.query(text, showMap);
        }
    });
});