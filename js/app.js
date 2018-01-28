/**
 * Created by timdlp on 08.01.18.
 */
var map;
var mapboxClient = new MapboxClient('pk.eyJ1IjoidGltZGxwIiwiYSI6ImNqYjZraDM0NjB1aWEyd216M2pnZWRsZHgifQ.7WtnMDNVwnS7hjzhRCWe3A');
var MQ_SMARTPHONE = '(max-width: 41em)';
var greenStyle = new ol.style.Style({
  image: new ol.style.Icon({
    src:"img/icon_green.png",
    anchor:[0.5,1],
    scale:0.6
  })
});
var redStyle = new ol.style.Style({
  image: new ol.style.Icon({
    src:"img/icon_red.png",
    anchor:[0.5,1],
    scale:0.6
  })
});
var attribution = new ol.control.Attribution({
        collapsible: false
      });
$(function(){
  var RESULT_TEMPLATE = $('.resTemplate').clone();
  var mr = Math.random();
        /**
         * Elements that make up the popup.
         */
        var container = document.getElementById('popup');
        var content = document.getElementById('popup-content');
        var closer = document.getElementById('popup-closer');

  /**
   * Create an overlay to anchor the popup to the map.
   */
  var overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
      duration: 250
    }
  });
    map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
         overlays: [overlay],
         controls: ol.control.defaults({attribution: false}).extend([attribution])
    });
    var resultat = new ol.layer.Vector({
        source: new ol.source.Vector()
    });
    var cabanes = new ol.layer.Vector({
        source: new ol.source.Vector()
    });

          /**
      * Add a click handler to hide the popup.
      * @return {boolean} Don't follow the href.
      */
     closer.onclick = function() {
       overlay.setPosition(undefined);
       closer.blur();
       return false;
     };
    map.addLayer(resultat);
    map.addLayer(cabanes);
    map.getView().setCenter(ol.proj.transform([6.5, 46.5], "EPSG:4326", "EPSG:3857"));
    map.getView().setZoom(4);
    map.on('click',function(event){
      coord = event.coordinate;
      pixel = event.pixel;
      map.forEachFeatureAtPixel(pixel,function(feature){
        var distance = Number(feature.get('distance'))/1000;
        var distancePretty = Math.round(distance*100)/100;
        content.innerHTML = '<b>'+feature.get('name')+'</b><div class="elevation">Altitude : '+feature.get('elevation')+' m</div><div class="distance">Distance '+distancePretty+' km</div>';
        overlay.setPosition(coord);
      },{
        layerFilter: function(layer){
          return layer === cabanes;
        }
      });
    });

    $('#nomCabane').keyup(function (e) {
        if(e.keyCode == 13){
            $('.searchBtn').click();
        }
    });
    $('.searchBtn').on('click',function(){
        mapboxClient.geocodeForward($('#nomCabane').val(),function(err,data,res){
            showResults(data);
            var x = Number($('.results').find('.place').attr('data-x'));
            var y = Number($('.results').find('.place').attr('data-y'));
            var center = [x,y];
            showPlace(center);
            lookUpForHuts(center);
        });

    });
// TESTS
function showResults(data){
  $('.results').empty();
  $(data.features).each( function(index,e){
    var result = RESULT_TEMPLATE.clone();
    result.removeClass('resTemplate');
    result.find('a').html(e.text+", "+parseReverseGeo(e));
    x = e.geometry.coordinates[0];
    y = e.geometry.coordinates[1];
    center = convert3857([x,y]);
    result.find('a').attr('data-x',center[0]);
    result.find('a').attr('data-y',center[1]);
    result.appendTo('.results');
  });
  $('.results').find('a').first().addClass('current');
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
  feature.setStyle(greenStyle);
  resultat.getSource().addFeature(feature);
}

function lookUpForHuts(center){
  cabanes.getSource().clear();
  var x = center[0];
  var y = center[1];
  source =  new ol.source.Vector({
        url:"http://pingouin.heig-vd.ch/~timothee.delapier/geoInf/getCabanes.php"+"?x="+x+"&y="+y+"&autokey="+mr,
        format: new ol.format.GeoJSON({
            defaultDataProjection:"EPSG:3857"
        })
  });
  cabanes.setSource(source);
  cabanes.setStyle(redStyle);
  source.once('change',function(e){
    if (source.getState() === 'ready'){
      source.forEachFeature(function(feature){
        var result = $('.resHutTemplate').clone();
        result.removeClass('resHutTemplate');
        result.find('a').html(feature.get('name'));
        result.appendTo('.hutResults');
      });
    }
  })
}

function parseReverseGeo(geoData) {
  // debugger;
  var region, countryName, placeName, returnStr;
  if (geoData.context) {
    $.each(geoData.context, function(i, v) {
      if (v.id.indexOf('region') >= 0) {
        region = v.text;
      }
      if (v.id.indexOf('country') >= 0) {
        countryName = v.text;
      }
    });
  }
  if (region && countryName) {
    returnStr = region + ", " + countryName;
  } else {
    returnStr = geoData.place_name;
  }
  return returnStr;
}

$('.results').delegate('a','click',function(){
  $('.current').removeClass('current');
  $(this).addClass('current');
  var x = Number($(this).attr('data-x'));
  var y = Number($(this).attr('data-y'));
  showPlace([x,y]);
  lookUpForHuts([x,y]);
});




























































// responsive

    $(window).on("resize", function(){
        if(Modernizr.mq(MQ_SMARTPHONE)){
            $(".icon").off("click");
            $(".icon").on("click", function(){
                $("aside").toggle();
                $("aside").toggleClass('hidden');
                $('#map').toggleClass('half');
                map.updateSize();
            });
        } else {
            $(".icon").off("click");
            $("aside").show();
        }
    });
    $(window).trigger("resize");

});
