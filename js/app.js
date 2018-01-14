/**
 * Created by timdlp on 08.01.18.
 */
var map;
var mapboxClient = new MapboxClient('pk.eyJ1IjoidGltZGxwIiwiYSI6ImNqYjZraDM0NjB1aWEyd216M2pnZWRsZHgifQ.7WtnMDNVwnS7hjzhRCWe3A');
var MQ_SMARTPHONE = '(max-width: 41em)';

$(function () {
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
        if (e.keyCode == 13) {
            $('.searchBtn').click();
        }
    });
    $('.searchBtn').on('click', function () {
        resultat.getSource().clear();
        mapboxClient.geocodeForward($('#nomCabane').val(), function (err, data, res) {
            var x = data.features[0].geometry.coordinates[0];
            var y = data.features[0].geometry.coordinates[1];
            var center = [x, y];
            var centerPSM = ol.proj.transform(center, "EPSG:4326", "EPSG:3857");
            map.getView().setCenter(centerPSM);
            map.getView().setZoom(12);
            var feature = new ol.Feature({
                geometry: new ol.geom.Point(centerPSM)
            });
            resultat.getSource().addFeature(feature);
            var cabanes = new ol.layer.Vector({
                source: new ol.source.Vector({
                    url: "http://pingouin.heig-vd.ch/~timothee.delapier/geoInf/getCabanes.php" + "?x=" + centerPSM[0] + "&y=" + centerPSM[1],
                    format: new ol.format.GeoJSON({
                        defaultDataProjection: "EPSG:3857"
                    })
                })
            });
            map.addLayer(cabanes);
            console.log(map.getLayers());
        });

    });

// responsive
    $(window).on("resize", function () {
        if (Modernizr.mq(MQ_SMARTPHONE)) {
            $("aside").off("click");

            $("aside").on("click", function () {
                $(".RechercheCabanes").show();
                console.log("dxqe");
            });

        } else {
            $("aside").off("click");
            console.log("de");
            $(".RechercheCabanes").show();
        }
        ;
    });
    $(window).trigger("resize");

});