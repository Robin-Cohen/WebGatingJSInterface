<?php
$ini = parse_ini_file('config.ini');
session_start();

$Rscript_exec= $ini["R_path"];
 $Rscipt ="plotMarkers.R";
 
$path=rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . session_id().DIRECTORY_SEPARATOR."tree";

$currentImg="tmp" .DIRECTORY_SEPARATOR .session_id().".png";

header("Content-Type: application/json");

$json = file_get_contents("php://input");
$data = json_decode($json);

 $file=$path. DIRECTORY_SEPARATOR ."gate1.fcs";
 $imgPath= $path. DIRECTORY_SEPARATOR ."gate1.png";
 $jsonPath= $path. DIRECTORY_SEPARATOR ."tmpGateData.json";

 $marker1=$data->marker1;
 $marker2=$data->marker2;
$tmpImgFullPath=dirname(__FILE__,2).DIRECTORY_SEPARATOR."tmp".DIRECTORY_SEPARATOR.session_id().".png";
$result =exec("$Rscript_exec $Rscipt $file $marker1 $marker2 $imgPath $jsonPath");
copy($imgPath,$tmpImgFullPath); //  copy because javascript is not allow to look into tmp file
$result= $result." ".$currentImg;
  

  echo $result;
?>
