<?php 
session_start();
$json = file_get_contents("php://input");
$content=json_decode($json);


include "findFile.php";


$path= rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . session_id(). DIRECTORY_SEPARATOR."tree";
$img=$content->png;
$imglocation=findFile($path,basename($img));
$tmpImgFullPath=dirname(__FILE__,2).DIRECTORY_SEPARATOR."tmp".DIRECTORY_SEPARATOR.session_id().".png";
$newLocation="./tmp/".session_id().".png";
copy($imglocation,$tmpImgFullPath);
echo $newLocation;
?>