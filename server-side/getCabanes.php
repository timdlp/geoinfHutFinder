<?php
/**
 * Created by PhpStorm.
 * User: timdlp
 * Date: 08.01.18
 * Time: 15:28
 */
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require_once 'GeoManager.php';
if(isset($_GET['x'])){
  $x = urldecode($_GET['x']);
}
if(isset($_GET['y'])){
  $y = urldecode($_GET['y']);
 }
$conn = new Connection("host=*** port=*** dbname=*** user=*** password=***");


$query = "SELECT title, elevation,ST_Distance(wkb_geometry,ST_GeomFromText('POINT($x $y)',3857)) as distance, ST_AsGeoJSON(wkb_geometry) from ogrgeojson";
if (isset($x) && isset($y)){
$where = " WHERE ST_DWithin(wkb_geometry,ST_GeomFromText('POINT($x $y)',3857),10000)";
$query .= $where;
}
$result = $conn->selectQuery($query);


$i = 0;
$fc = new FeatureCollection();
while ($row = pg_fetch_row($result)) {
    $fc->addFeature(new Feature($i++, (json_decode($row[3])), array("name" => $row[0],"elevation"=> $row[1], "distance" => $row[2])));
}
header("Content-Type:application/json");
echo json_encode($fc);
?>
