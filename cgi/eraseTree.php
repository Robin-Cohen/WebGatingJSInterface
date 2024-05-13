<?php
session_start();
$directory =rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . session_id().DIRECTORY_SEPARATOR;
$tree="tree";
$path=$directory . $tree.DIRECTORY_SEPARATOR;
function deleteTree($dir){ 
    foreach(glob($dir . "/*") as $element){
        if(is_dir($element)){
            deleteTree($element);       
            rmdir($element); 
        } else { 
            unlink($element);
        }
 
    }
    
 }
 
 
 function makeTree($path){ //replace allready existing tree by new tree base on new upload file
    if (!file_exists($path)) {
       mkdir($path);
 }else{
    deleteTree($path);
    rmdir($path);
    makeTree($path);
 
 }
    return $path;
 }
 makeTree($path)
?>