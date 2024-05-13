<?php function findFile($dir,$file){
    foreach(glob($dir . "/*") as $element){
        
        if(is_dir($element)){
            $element= findFile($element,$file);
        }
        if(basename($element) == $file){
            return $element;
        }
    }
}
?>