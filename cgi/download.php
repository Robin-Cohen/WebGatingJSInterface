<?php 
include "findFile.php";
session_start();
if(isset($_GET['file']))
{
$filename = $_GET['file'];
$path= rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . session_id(). DIRECTORY_SEPARATOR."tree";
$fcslocation=findFile($path,$filename);
if(file_exists($fcslocation)) {
header('Content-Description: File Transfer');
header('Content-Type: application/octet-stream');
header("Cache-Control: no-cache, must-revalidate");
header("Expires: 0");
header('Content-Disposition: attachment; filename="'.basename($fcslocation).'"');
header('Content-Length: ' . filesize($fcslocation));
header('Pragma: public');
flush();
readfile($fcslocation);
die();
}
else{
echo "File does not exist.";
}
}
else
echo "Filename is not defined."
?>