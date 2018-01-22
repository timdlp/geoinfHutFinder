/**
 * Created by timdlp on 08.01.18.
 */
var map;
var mapboxClient = new MapboxClient('pk.eyJ1IjoidGltZGxwIiwiYSI6ImNqYjZraDM0NjB1aWEyd216M2pnZWRsZHgifQ.7WtnMDNVwnS7hjzhRCWe3A');
var MQ_SMARTPHONE = '(max-width: 41em)';

$(function(){
  var RESULT_TEMPLATE = $('.resTemplate').clone();
    map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM({
                  attributions:"Données cartographiques : © 2018 OpenStreetMap et ses contributeurs."
                })
            })
        ]
    });
    var resultat = new ol.layer.Vector({
        source: new ol.source.Vector()
    });
    map.addLayer(resultat);
    map.getView().setCenter(ol.proj.transform([6.5, 46.5], "EPSG:4326", "EPSG:3857"));
    map.getView().setZoom(4);

    $('#nomCabane').keyup(function (e) {
        if(e.keyCode == 13){
            $('.searchBtn').click();
        }
    });
    $('.searchBtn').on('click',function(){
        mapboxClient.geocodeForward($('#nomCabane').val(),function(err,data,res){
            showResults(data);
            var x = $('.results').find('.place').attr('data-x');
            var y = $('.results').find('.place').attr('data-y');
            var center = [x,y];
            showPlace(center);
            var cabanes = new ol.layer.Vector({
                source: new ol.source.Vector({
                    url:"http://pingouin.heig-vd.ch/~timothee.delapier/geoInf/getCabanes.php"+"?x="+x+"&y="+y,
                    format: new ol.format.GeoJSON({
                        defaultDataProjection:"EPSG:3857"
                    })
                })
            });
            map.addLayer(cabanes);
        });

    });
// responsive

    $(window).on("resize", function(){

        if(Modernizr.mq(MQ_SMARTPHONE)){
            $("aside").off("click");
            $("aside").on("click", function(){
                $(".RechercheCabanes").show();

            });
        } else {
            $("aside").off("click");
            $(".RechercheCabanes").show();
        }
    });
    $(window).trigger("resize");


// TESTS
function showResults(data){
  $('.results').empty();
  $(data.features).each( function(index,e){
    var result = RESULT_TEMPLATE.clone();
    result.removeClass('resTemplate');
    result.find('a').html(e.place_name);
    x = e.geometry.coordinates[0];
    y = e.geometry.coordinates[1];
    center = convert3857([x,y]);
    result.find('a').attr('data-x',center[0]);
    result.find('a').attr('data-y',center[1]);
    result.appendTo('.results');
  })
}

function convert3857(center){
  result = ol.proj.transform(center,"EPSG:4326", "EPSG:3857");
  return result
}

function showPlace(center){
  resultat.getSource().clear();
  map.getView().setCenter(center);
  map.getView().setZoom(12);
  var feature = new ol.Feature({
      geometry: new ol.geom.Point(center)
  });
  resultat.getSource().addFeature(feature);

}
$('.results').on('click','a',function(){
  x = $(this).attr('data-x');
  y = $(this).attr('data-y');
  showPlace([x,y]);
});
});
