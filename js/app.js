/**
 * Created by timdlp on 08.01.18.
 */
var map;
var mapboxClient = new MapboxClient('pk.eyJ1IjoidGltZGxwIiwiYSI6ImNqYjZraDM0NjB1aWEyd216M2pnZWRsZHgifQ.7WtnMDNVwnS7hjzhRCWe3A');

$(function(){
    map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ]
    });
    var resultat = new ol.layer.Vector({
        source: new ol.source.Vector()
    });
    map.addLayer(resultat);
    map.getView().setCenter(ol.proj.transform([6.15, 40], "EPSG:4326", "EPSG:3857"));
    map.getView().setZoom(3);

    $('#nomCabane').keyup(function (e) {
        if(e.keyCode == 13){
            $('.searchBtn').click();
        }
    });
    $('.searchBtn').on('click',function(){
        resultat.getSource().clear();
        mapboxClient.geocodeForward($('#nomCabane').val(),function(err,data,res){
            console.log(data);
            var x = data.features[0].geometry.coordinates[0];
            var y = data.features[0].geometry.coordinates[1];
            var center = [x,y];
            map.getView().setCenter(ol.proj.transform(center,"EPSG:4326", "EPSG:3857"));
            map.getView().setZoom(12);
            var feature = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.transform(center,"EPSG:4326", "EPSG:3857"))
            });
            resultat.getSource().addFeature(feature);
        });
    });
});
