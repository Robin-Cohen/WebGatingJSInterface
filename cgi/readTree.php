<?php
session_start();

function readJsonInfo($file){
    $readFile = file_get_contents($file);
    $jsonDecode= json_decode($readFile);
    return $jsonDecode;
}
function scanTree($dir){
    $dictionary=new stdClass();
    foreach(glob($dir . "/*") as $element){
        
        if(is_dir($element)){
            if(!property_exists($dictionary,'children')){
                $children= array();
                
            }
            array_push($children,scanTree($element));
            $dictionary-> children= $children;
            
        } else { //
            $file_parts = pathinfo($element);
            $extension= $file_parts['extension'];
            if($extension == "json"){
                $markersData= readJsonInfo($element);
                $dictionary->$extension= $markersData;
                $dictionary->jsonPath=realpath($element);}
           else{ $dictionary->$extension=basename($element);
                $realpath=$extension."path";
                $dictionary->$realpath=realpath($element);
                
        }
        }
    }
    return $dictionary;
}

$path= rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . session_id(). DIRECTORY_SEPARATOR."tree";
$tree=scanTree($path);
echo json_encode($tree);

?>