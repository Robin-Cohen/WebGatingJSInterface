var gating=[];
var selected;
var nodes;
var setNewChildButtonID="setNewChildButton";
var downloadButton="downloadFcsFileButton";
var newChildBtn;
var parentSelect;


function makeNewChildBtn(){

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "cgi/gateBasedOnOtherParent.php", true);
xhr.setRequestHeader('Content-Type', 'application/json');

xhr.send(JSON.stringify({	
  "png":parentSelect.png
}));


xhr.onload = function() {
  var values = parentSelect.json.toPlot.marker1Value+" "+ parentSelect.json.toPlot.marker2Value +" "+ parentSelect.json.toPlot.marker1 +" "+ parentSelect.json.toPlot.marker2 +" "+ parentSelect.fcs +" "+ this.responseText;

  handleResponseAndPrintIt(values);
  eraseModal();
  
}
};
function downloadFcs(url){
  window.location=url;
}
function makeRenameField(){
  var renameDiv = document.createElement("div");
  var renameButton = document.createElement("button");
  var inputRename = document.createElement("input");
  inputRename.setAttribute("type","text");
  inputRename.setAttribute("id","inputRename");
  renameButton.innerHTML="Rename";
  renameButton.setAttribute("onclick","renameNode()");
  renameDiv.appendChild(inputRename);
  renameDiv.appendChild(renameButton);
  return renameDiv
}
function displayNodeInformationAndOption(){
  var divID="makeNewChild";
  d3.selectAll(".treeCircle").attr("fill","white");
  d3.select(this).attr("fill","steelblue");
  data=this.__data__.data;
  d3.select("#"+divID).remove();
  selected=this.parentNode;
  contentTree=document.getElementById("contentTree");
  var selectNode= document.createElement("div");
  selectNode.setAttribute("id",divID);
  var nodeInformation= document.createElement("p");
  var text = document.createTextNode("Markers: "+ data.json.toPlot.marker1 +"/"+ data.json.toPlot.marker2);
  
  var downloadButton= document.createElement("button");
  downloadButton.innerHTML="Download file";
  var url="cgi/download.php?";
  url=url + "file="+data.fcs;
  downloadButton.setAttribute("onclick","downloadFcs(\'"+url+"\')");


  var renameDiv=makeRenameField();

  var button= document.createElement("button");
  button.innerHTML="Make new gate";
  button.setAttribute("id",setNewChildButtonID);
  button.setAttribute("onclick","makeNewChildBtn()");

  nodeInformation.appendChild(text);
  
  selectNode.appendChild(nodeInformation);
  selectNode.appendChild(button);
  selectNode.appendChild(downloadButton);
  selectNode.appendChild(renameDiv);
  contentTree.appendChild(selectNode);
  parentSelect= data;
}

function getTree(){

         var xhr = new XMLHttpRequest();
 
         var url = 'cgi/readTree.php';
         xhr.open("GET", url, true);
   

         xhr.onreadystatechange = function () {
             if (this.readyState == 4 && this.status == 200) {
                 makeTree(JSON.parse(this.responseText));
             }
         } 
         xhr.send();
 
 }
 function renameNode(){
  var newNameInput=document.getElementById("inputRename");
  if(newNameInput.value!=""){
  var toSend={oldName:data.fcs,newName:newNameInput.value};
  var xhr = new XMLHttpRequest();
  var url = 'cgi/renameNode.php';
  xhr.open("POST", url, true);


  xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
          console.log(this.responseText);
          if (this.responseText==0){
            selected.childNodes[1].innerHTML=newNameInput.value;
            newNameInput.value="";
            eraseChild("contentTree");
            makeUploadForTailoringGate();
	          getTree();
          }
      }
  } 
  xhr.send(JSON.stringify(toSend));
}
 }
function makeTree(treeData){
  var margin = {top: 40, right: 90, bottom: 50, left: 90},
  width = 1000 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var treemap = d3.tree()
  .size([width, height]);


nodes = d3.hierarchy(treeData);


nodes = treemap(nodes);

var svg = d3.select(".modal-content").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom),
  g = svg.append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var link = g.selectAll(".link")
  .data( nodes.descendants().slice(1))
.enter().append("path")
  .attr("class", "link")
  .attr("d", function(d) {
     return "M" + d.x + "," + d.y+ "C"+ d.x + "," + (d.y + d.parent.y) / 2+ " " + d.parent.x + "," +  (d.y + d.parent.y) / 2+ " " + d.parent.x + "," + d.parent.y;

    });

var node = g.selectAll(".node")
  .data(nodes.descendants())
.enter().append("g")
  .attr("class", function(d) { 
    return "node" + 
      (d.children ? " node--internal" : " node--leaf"); })
  .attr("transform", function(d) { 
    return "translate(" + d.x + "," + d.y + ")"; });

node.append("circle")
.on("click",displayNodeInformationAndOption)
.attr("class","treeCircle")
.attr("r", 10)
.attr("fill","white")
.data(nodes.descendants());


node.append("text")
.attr("dy", ".35em")
.attr("y", function(d) { return d.children ? -20 : 20; })
.style("text-anchor", "middle")
.text(function(d) { return d.data.fcs; })

}