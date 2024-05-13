<?php 
$ini = parse_ini_file('config.ini');
ini_set('post_max_size', $ini['post_max_size']);
ini_set('upload_max_filesize',$ini['upload_max_filesize']); //configure file size allow
ob_start();
include "readTree.php";
include "findFile.php";



$directory =rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . session_id().DIRECTORY_SEPARATOR;
$markerFile=$directory . 'marker.txt';
$tree="tree";
$path= $directory . $tree.DIRECTORY_SEPARATOR;


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


$Rscript_exec= $ini["R_path"];
$Rscipt = "./remodelTree.R";
header("Content-Type: application/json");
$directories = glob($path . '/*', GLOB_ONLYDIR);
$childrenExist=sizeof($directories)>=1;
if($childrenExist){
    
    $tree = ob_get_clean();
    $jsondata=$directory."treeGate.json";
    $file=fopen($jsondata,"w");
    fwrite($file,$tree);
    $result=exec("$Rscript_exec $Rscipt $jsondata");
    $tmpImgDirectPath="tmp".DIRECTORY_SEPARATOR.session_id().".png";
    $tmpImgFullPath=dirname(__FILE__,2).DIRECTORY_SEPARATOR.$tmpImgDirectPath;
    $realImgLocation=$path.DIRECTORY_SEPARATOR."gate1.png";
    copy($realImgLocation,$tmpImgFullPath);
    $answerJS=$result ." ".$tmpImgDirectPath;
    echo $answerJS;
    
}
      }
}
}
exit(1);
?> 