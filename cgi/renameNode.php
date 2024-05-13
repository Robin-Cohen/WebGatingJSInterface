<?php 
header("Content-Type: application/json");
session_start();
include "findFile.php";


$json = file_get_contents("php://input");
$data = json_decode($json);

$oldName = $data->oldName;
$newName = $data->newName;
$newNameInfoPath=pathinfo($newName);
$newNameRightExtension=$newNameInfoPath["filename"].".fcs";
$path=rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . session_id().DIRECTORY_SEPARATOR."tree";
$oldNamePath=findFile($path,$oldName);
$newNamePath=dirname($oldNamePath).DIRECTORY_SEPARATOR.$newNameRightExtension;
rename($oldNamePath,$newNamePath);
if(findFile($path,$newNameRightExtension)==""){
exit(0);
};
?>