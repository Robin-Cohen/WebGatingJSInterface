<?php
session_start();
function deleteTree($dir){
    foreach(glob($dir . "/*") as $element){
        if(is_dir($element)){
            deleteTree($element); // On rappel la fonction deleteTree           
            rmdir($element); // Une fois le dossier courant vidé, on le supprime
        } else { // Sinon c'est un fichier, on le supprime
            unlink($element);
        }
        // On passe à l'élément suivant
    }
}

function createTempDir(): ?string
{
    $path = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . session_id(). DIRECTORY_SEPARATOR;
    // deleteTree($path);
    
    if (!file_exists($path)) {
        mkdir($path);
        
    }
    else{
        deleteTree($path);
        rmdir($path);
        createTempDir();

    }
    return $path;
}
createTempDir();







 ?>


<!DOCTYPE html>


<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate"/>
<meta http-equiv="Pragma" content="no-cache"/>
<meta http-equiv="Expires" content="0"/>
<title>Draw gating</title>
<link rel="stylesheet" href="style.css">

<script src="https://d3js.org/d3.v7.min.js" charset="utf-8"></script>

</head>
<body>
    <header>
	<ul class="menu">

    
    <li><div id="formChoosingFile"><label for="fileSelector">Select fcs file</label><input type="file" placeholder="Enter File" name="fileSelector" onchange="uploadFile(this);cleanSession()" id="fileSelector"> </div></li>
    
</ul>
<ul class="tools">

    <li><button onclick="selectTool(this.value)" value="polygon" href="#modal">Polygon</button></li>
    <li><button  onclick="selectTool(this.value)" value="rectangle">Rectangle</button></li>
    <li><button  onclick="selectTool(this.value)" value="ellipse">Ellipse</button></li>
    <li><button onclick="clean()" class="clean">Clean</button></li>
    <li><button id="hierarchyBtn">Hierarchy</button></li>
</ul>
    </header>
<div id="myModal" class="modal">
	<div class="modal-content" id="contentTree">
    <span class="close">&times;</span>
    
  </div>

  </div>
</div>
<div id="loader"></div>
<div id="selectGateDiv">
    <ul>
        <li>
        <select id="selectGate" size="10" style="width: 100%;" onchange="highlightSelected()">
        
    </select>
        </li>
    <li>
        <button onclick="removeSelectGate()">Remove selected gate</button>
    </li>
    <li>
        <button onclick="renameSelectGate()">Rename selected gate</button><input type="text" id="renameInput"> 
    </li>
    <li>
        <button onclick="saveSelectGate()">Save selected gate</button>
    </li>
    <br><br><br>
    </ul>
</div>

<script type="text/javascript" src="script/script.js"></script>
<script type="text/javascript" src="script/tree.js"></script>
</body>
</html>
