<?php
$ini = parse_ini_file('config.ini');
session_start();

ini_set('post_max_size', $ini['post_max_size']);
ini_set('upload_max_filesize',$ini['upload_max_filesize']); //configure file size allow

$directory =rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . session_id().DIRECTORY_SEPARATOR;
$markerFile=$directory . 'marker.txt';
$tree="tree";
$path= $directory . $tree.DIRECTORY_SEPARATOR;


$Rscript_exec= $ini["R_path"];
$Rscipt ="./getMarker.R";

$filename = $_FILES['file']['name'];
if(isset($_FILES['file']['name'])){
   
   $file = $path."gate1.fcs";
   $file_extension = pathinfo($file, PATHINFO_EXTENSION); 
   $file_extension = strtolower($file_extension);

   $valid_ext = array("fcs");
   $response = $_FILES['file']['tmp_name'];
   if(in_array($file_extension,$valid_ext)){
      if (!file_exists($path)) {
         mkdir($path);
   }
      if(file_exists($file)){
         unlink($file);
      }
      if(move_uploaded_file($_FILES['file']['tmp_name'],$file)){
        
         exec("$Rscript_exec $Rscipt $file $markerFile");
         $file_content = file_get_contents($markerFile);
         echo $file_content;
         
      }
   }

   
   exit;
}

 ?>