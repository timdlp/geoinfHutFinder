<?php
/**
 * Created by PhpStorm.
 * User: timdlp
 * Date: 08.01.18
 * Time: 15:28
 */
<?php
require_once 'GeoManager.php';
$conn = new Connection("host=pingouin.heig-vd.ch port=5432 dbname=ogrgeojson user=timothee.delapier password=testm44");

$query = "SELECT name, ST_AsGeoJSON(the_geom) from my4capitals";
$result = $conn->selectQuery($query);

$i = 0;
$fc = new FeatureCollection();
while ($row = pg_fetch_row($result)) {
    $fc->addFeature(new Feature($i++, (json_decode($row[1])), array("name" => $row[0])));
}
header("Content-Type:application/json");
echo json_encode($fc);
?>