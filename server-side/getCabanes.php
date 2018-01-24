<?php
/**
 * Created by PhpStorm.
 * User: timdlp
 * Date: 08.01.18
 * Time: 15:28
 */
error_reporting(E_ALL);
require_once 'GeoManager.php';
$poi = urldecode($_GET['poi']);
$conn = new Connection("host=pingouin.heig-vd.ch port=5432 dbname=timothee.delapier user=****** password=*******");

$query = "SELECT title, elevation, ST_AsGeoJSON(wkb_geometry) from ogrgeojson WHERE ST_DWithin(wkb_geometry,POINT($poi),10000)";
$result = $conn->selectQuery($query);


$i = 0;
$fc = new FeatureCollection();
while ($row = pg_fetch_row($result)) {
    $fc->addFeature(new Feature($i++, (json_decode($row[1])), array("name" => $row[0],"elevation"=> $row[1])));
}
header("Content-Type:application/json");
echo json_encode($fc);
?>

