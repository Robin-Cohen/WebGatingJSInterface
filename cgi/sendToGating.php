<?php
$ini = parse_ini_file('config.ini');
 include "findFile.php";
session_start();
set_time_limit(0);
 $Rscript_exec= $ini["R_path"];
 $Rscipt = "filter.R";

 $childrenName="gate";
 $currentImg="tmp/".session_id().".png";

$path=rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . session_id();
$firstFile = glob($path. DIRECTORY_SEPARATOR . "tree".DIRECTORY_SEPARATOR."*.fcs")[0];
$json = file_get_contents("php://input");
$content=json_decode($json);
$parentFile=$content->parentFile;

$fullPathFcsFile=findFile($path,$parentFile);
$parentDirectory=dirname($fullPathFcsFile);
$content->parentFile=$fullPathFcsFile;
$childenPathDirectory=$parentDirectory.DIRECTORY_SEPARATOR;
$gateNumber=$content->gateNumber;
if(!file_exists($childenPathDirectory)){
    mkdir($childenPathDirectory);
}
$curentPath=$childenPathDirectory.DIRECTORY_SEPARATOR."gate".$gateNumber;
mkdir($curentPath);
$fileName = $curentPath.DIRECTORY_SEPARATOR."tmpGateData.json";
$toWrite=json_encode($content);
$file = fopen($fileName, "w");
fwrite($file,$toWrite);
fclose($file);
$wherePlot= $curentPath.DIRECTORY_SEPARATOR."gate".$gateNumber.".png";
$whereFcs=$curentPath.DIRECTORY_SEPARATOR."gate".$gateNumber.".fcs";
$whereJson=$curentPath.DIRECTORY_SEPARATOR."gate".$gateNumber.".json";
$result=exec("$Rscript_exec $Rscipt $fileName $whereFcs $wherePlot $whereJson $firstFile");
unlink($fileName);
$resultSplit=explode(" ",$result);
$imglocation=array_pop($resultSplit);
$newLocation=dirname(__FILE__,2).DIRECTORY_SEPARATOR."tmp".DIRECTORY_SEPARATOR.session_id().".png";
copy($imglocation,$newLocation);
$result=implode(" ",$resultSplit);
$result= $result." ".$currentImg;

echo $result;

?>