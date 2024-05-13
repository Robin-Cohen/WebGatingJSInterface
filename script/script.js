	var savedGate={};
	var step=0;
	var test;
	var markerXaxe,markerYaxe,fcsFileUrl,marker1Url,marker2Url,step,getmarkers,marker1SelectUpload,marker2SelectUpload,handleTailoring,drawSVG;
	var allArg = [markerXaxe,markerYaxe,fcsFileUrl,marker1Url,marker2Url];
	var select= document.getElementById("selectGate");
	var mouse,dragCircle,newPoints,circle;
	function loaderOn(){
		document.getElementById("loader").style.display = "block";
	}
	function loaderOff(){
		document.getElementById("loader").style.display = "none";
	}
	function deleteElementbyIDforReplacement(id){ //test if an ID exist and delete it. Usefull for not having element accumulation and just replace it
		var testId= document.getElementById(id);
		if(testId  != null	){
			testId.remove();
		}
	}
	function cleanSession(){

		var xhr = new XMLHttpRequest();
		xhr.open("POST", "cgi/eraseTree.php", true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send();
	}


	function uploadFile(selector){
		var files = selector.files;
	if(files.length > 0 ){
		loaderOn();
	var formData = new FormData();
	formData.append("file", files[0]);

	var xhttp = new XMLHttpRequest();

	xhttp.open("POST", "cgi/upload.php", true);

	xhttp.onreadystatechange = function() {
		
		if (this.readyState == 4 && this.status == 200) {
			loaderOff();
		var response = this.responseText;
		var form= document.getElementById("formChoosingFile");
		var idSelectFileDiv="selectFile";
		getmarkers = response;
		
		deleteElementbyIDforReplacement(idSelectFileDiv);
		var selectMarker= addSelectMarker(response);
		selectMarker.setAttribute("id",idSelectFileDiv);
		form.appendChild(selectMarker);
		
		}
	};

	xhttp.send(formData);

	}	

	//document.getElementById('fileSelector').onchange = uploadFile();

	}
	function getFileData(myFile){
		var file = myFile.files[0];  
		return file.name;
	}

	function printSavedGate(){
		selectGate= document.getElementById("selectGate");
		for (const [key, subObject] of Object.entries(savedGate)) {
			if(marker1Url == subObject.markers.marker1 & marker2Url == subObject.markers.marker2){
			var option= subObject.option;
			option.setAttribute("value",option.value+"_saved")
			option.setAttribute("save",false);
			option.style.color="black";
			selectGate.appendChild(option);
			drawSVG.append(() => subObject.gate);
		}
			
			
			
	}
	drawSVG.selectAll("circle").call(dragger)
	}

	function handleResponseAndPrintIt(response){
		response = response.split(" ");
		
		markerXaxe = response[0];
		markerYaxe = response[1];
		marker1Url = response[2];
		marker2Url = response[3];
		fcsFileUrl = response[4];
		currentPlot=response[5];
		
		
	makeSvg();
	drawSVG.selectAll(".drawing").remove();
	eraseChild("selectGate");
	printSavedGate();


	}
	function makeUploadForTailoringGate(){
		var modalPart= document.getElementById("contentTree");
		var idUpload="uploadTailoring";
		var textUploadTailoring= document.createElement("p");
		textUploadTailoring.innerHTML="Make tailoring Gate:";
		var uploadinput=document.createElement("input");
		uploadinput.setAttribute("type","file");
		uploadinput.setAttribute("id",idUpload);
		modalPart.append(textUploadTailoring);
		modalPart.appendChild(uploadinput);
		handleTailoring=document.getElementById(idUpload).onchange = function(){
			loaderOn();
			eraseModal();
			doTailoring(this);
			
			
		};
	}
	function doTailoring(selector){var files = selector.files;
		if(files.length > 0 ){
			loaderOn();
		var formData = new FormData();
		formData.append("file", files[0]);
		
		var xhttp = new XMLHttpRequest();
		
		xhttp.open("POST", "cgi/makeTailoredGate.php", true);
		
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				loaderOff();
				handleResponseAndPrintIt(this.responseText);
			}

	}
	xhttp.send(formData);
	}
	}
	function sendToMakeFirstGate(fcsFile){
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "cgi/makeFirstGate.php", true);
		xhr.setRequestHeader('Content-Type', 'application/json');

		xhr.send(JSON.stringify({	
			"marker1": marker1SelectUpload,
			"marker2": marker2SelectUpload,
			"file":fcsFile.files[0]
		}));
		
		xhr.onload = function() {
			
			loaderOff();
		handleResponseAndPrintIt(this.responseText);
		addSelectMarkerGatingToSelectGateDiv();
		}
	}
	function getPlot(){
		step=0;
		var fcsFile= document.getElementById("fileSelector");
		var marker1Tag= document.getElementById("marker1");
		marker1SelectUpload = marker1Tag.options[marker1Tag.selectedIndex].value;
		var marker2Tag= document.getElementById("marker2");
		marker2SelectUpload = marker2Tag.options[marker2Tag.selectedIndex].value;
		loaderOn();
		sendToMakeFirstGate(fcsFile);
		}

	function makeSelectMarkerTag(){
	var selectMarker1 = document.createElement("select"),
	selectMarker2 = document.createElement("select");

		selectMarker1.setAttribute('name','marker1');
		selectMarker1.setAttribute('id','marker1');

		selectMarker2.setAttribute('name','marker2');
		selectMarker2.setAttribute('id','marker2');
		
		return[selectMarker1,selectMarker2]
	}
	function makeSelectMarkerLabel(){
		var labelMarker1= document.createElement("label"),
		labelMarker2= document.createElement("label");
		labelMarker1.innerHTML = "First Marker";
		labelMarker1.setAttribute('for','marker1');
		labelMarker2.innerHTML="Second Marker";
		labelMarker2.setAttribute('for','marker2');
		return [labelMarker1,labelMarker2]
	}
	function transformIntoMarkerList(markersToAdd){
		
		markersToAdd = markersToAdd.replaceAll('\"',"").split(/\r?\n/);
		
		markersToAdd.pop();// blank element
		return markersToAdd
	}
	function addSelectMarker(markersToAdd){
		form= document.createElement("div")
		markersToAdd=transformIntoMarkerList(markersToAdd)
		var selectMarker1,selectMarker2,labelMarker1,labelMarker2;

		[selectMarker1,selectMarker2]=makeSelectMarkerTag();
		[labelMarker1,labelMarker2]=makeSelectMarkerLabel();

		var submit= document.createElement("button");

		

		
		

		for (let i in markersToAdd) {
			
			var value= markersToAdd[i].split(" ");
			var genericMarkerName = value[0];
			var markerName = "("+value[1]+")";
			selectMarker1.add(new Option(genericMarkerName + markerName,genericMarkerName,false));
			selectMarker2.add(new Option(genericMarkerName + markerName,genericMarkerName,false));

	}

		submit.setAttribute("onclick",'getPlot()');
		submit.innerHTML='Submit';

		form.appendChild(labelMarker1);
		
		form.appendChild(selectMarker1);
		form.appendChild(labelMarker2);
		form.appendChild(selectMarker2);
		form.appendChild(submit);
		return form
	}

	function callMarkers(){
		var xhttp = new XMLHttpRequest();
		loaderOn();
		xhttp.open("POST", "cgi/readmarkers.php", true);

		xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			loaderOff();
			var listMarkers= this.responseText;
			var div =document.getElementById("selectGateDiv");
			div.appendChild(addSelectMarker(listMarkers));
		}
		};
	
		xhttp.send("");
	}
	/////////////////////////////////////
	/////////////////////////////////////
	/////////////////////////////////////


	function askActualPlot(){
		
	}

	var dragging = false,
		drawing = false,
		startPoint,
		actualtool = "polygon";


	var width = 800,
		height = 800,
		widthDraw=700,
		heightDraw=700;

	var svg,xscalelog,yscalelog,x_axis,xAxisTranslate,y_axis,currentPlot;


	function createSVG(){
		svg=d3.select("body")
		.append("svg")
		.attr("id","svgCore")
		.attr("width", width)
		.attr("height", height);
		drawSVG=svg.append("svg")
		.attr("id","svgDraw")
		.attr("width", widthDraw)
		.attr("height", heightDraw)
		.attr("x", 50)
		.attr("y", 10);}


	function makeXScalelog(){
		xscalelog = d3.scaleLog()
					.domain([0.01, markerXaxe])
					.range([0, width-100]);
	}
	function makeXLabel(){
		svg.append("text")
		.attr("text-anchor", "end")
		.attr("x", width/2)
		.attr("y", height)
		.text(marker1Url);
	}
	function makeYscaleLog(){
		yscalelog = d3.scaleLog()
					.domain([0.01, markerYaxe])
					.range([height-100,0]);
	}
	function makeYLabel(){
		svg.append("text")
		.attr("text-anchor", "end")
		.attr("transform", "rotate(-90,"+width/2+","+height/2+")")
		.attr("x", width/2)
		.attr("y", 12)
		.text(marker2Url)
	}

	function makeXaxis(){
		var xAxisTranslate = height-100+10;
		x_axis = d3.axisBottom()
					.scale(xscalelog);
		svg.append("g")
		.attr("transform", "translate(50, " + xAxisTranslate  + ")")
		.call(x_axis)
	}
	function makeYaxis(){y_axis = d3.axisLeft()
		.scale(yscalelog);
	svg.append("g")
	.attr("transform", "translate(50, 10)")
	.call(y_axis);}



	function makeImg(){
		drawSVG.append('svg:image')
		.attr('xlink:href', currentPlot+"?"+ new Date().getTime())// force the script to look for a new image by adding a value as argument
		.attr("draggable",false)
		.attr('class',"plotimg")
		.attr("width", widthDraw)
		.attr("height", heightDraw);}
		

		function makeSvg(){
			
			if(svg != null){
				svg.remove()
			}
			createSVG();
			makeXScalelog();
			makeYscaleLog();
			makeXaxis();
			makeYaxis();
			makeXLabel()
			makeYLabel();
			makeImg();

			
			drawSVG.on('mouseup', function(){
				
				if(dragging) return;
				drawing = true;
				mouse=d3.pointer(event,drawSVG.node());
				mouse=[mouse[0] -50, mouse[1] - 10];
				test=this;
				startPoint = [mouse[0], mouse[1]];
				if(drawSVG.select('g.drawForm').empty()) g = drawSVG.append('g').attr('class', 'drawForm');
				if(event.target.hasAttribute('is-handle') && actualtool==="polygon") {
					
					var closeform = selectFunction[actualtool].closeForm;
					closeform();
					return;
				};
				points.push(mouse);
				var mouseupfct = selectFunction[actualtool].mouseup;
				
				mouseupfct();
			});
			
			
			drawSVG.on('mousemove', function() {
				mouse=d3.pointer(event,drawSVG.node());
				mouse=[mouse[0] -50, mouse[1] - 10];
				if(!drawing) return;
				var g = d3.select('g.drawForm');
				var mousemovefct = selectFunction[actualtool].mousemove;
				mousemovefct();
			});
		}
		/////////////////////////////////////////////////////
	function clean(){
		drawSVG.selectAll(".drawing").remove();
		eraseChild("selectGate");
	}

	var points = [],
		g;

	var dragger = d3.drag()
		.on('drag', handleDrag)
		.on('end', function(d){
			dragging = false;
		});

	function selectTool(value){
	actualtool = value;
	}
	function calculRadius(x1,x2,y1,y2){
			return Math.sqrt(Math.pow(x2 - x1,2) +  Math.pow(y2 - y1,2))
	}
	function pointDistance(x1,x2,y1,y2){
		return Math.sqrt(Math.pow(x1 - x2,2)+ Math.pow(y1 - y2,2));
	}
	function makeRect(x1,y1,x2,y2){

		var startX,
			startY,
			endX,
			endY,
			width,
			height;
		if(x1 < x2){
			startX = x1;
			endX = x2;
		}
		else{
			startX = x2;
			endX = x1;
		};
		if (y1 < y2) {
			startY = y1;
			endY = y2;
		}
		else{

			startY = y2;
			endY = y1;
		}
		
		width = endX - startX;
		height = endY - startY;
		
		return [startX, startY, width, height, endX, endY]
	}


	function renameSelectGate(){
		var select = document.getElementById('selectGate');
		var input= document.getElementById("renameInput");
		var id=select.options[select.selectedIndex].value;
		d3.select('#'+id).attr("id",input.value);
		select.options[select.selectedIndex].innerHTML= input.value;
		if(select.options[select.selectedIndex].save){
			select.options[select.selectedIndex].save=false;
			saveSelectGate();
		}
		input.value="";
		
		
	}
	function removeSelectGate(){
		var select = document.getElementById('selectGate');
		if(typeof select.options[select.selectedIndex] === "undefined"){
			return
		}
		
		var id=select.options[select.selectedIndex].value;
		select.options[select.selectedIndex].remove();
		d3.select('#'+id).remove();
		delete savedGate[id];
	}
	function saveSelectGate(){
		unhighlightAll();
		var select = document.getElementById('selectGate');
		var id=select.options[select.selectedIndex].value;
		
		if(typeof select.options[select.selectedIndex] === "undefined"){
			return
		}
		if (!select.options[select.selectedIndex].save){
		select.options[select.selectedIndex].style.color= "green";
		select.options[select.selectedIndex].save = true;
		
		var actualGate=document.getElementById(id).cloneNode(true);
		actualGate.setAttribute("id",id+("_saved"));
		savedGate[id.replaceAll(/['_saved']/g, '')]={
			option:select.options[select.selectedIndex],
			gate:actualGate,
			markers:{marker1:marker1Url,marker2:marker2Url}
		};
	}else{
		select.options[select.selectedIndex].style.color= "black";
		select.options[select.selectedIndex].save = false; 
		delete savedGate[id];

	}

	}
	function unhighlightAll(){
		var figure=drawSVG.selectAll('g.drawing');
		figure.selectAll("rect").attr('stroke', '#FF0000');
		figure.selectAll("polygon").attr('stroke', '#FF0000');
		figure.selectAll("elliple").attr('stroke', '#FF0000');

	}
	function highlightSelected(){ 
		var select = document.getElementById('selectGate');
		var id=select.options[select.selectedIndex].value;
		var name= id.replaceAll(/[0-9,'_saved']/g, '');
		if (name === "rectangle"){name="rect"} //exeption due to d3js
		var figure=d3.select('#'+id).select(name);
		unhighlightAll();
		figure.attr('stroke', '#4f33ff');

	}
	function assignNewOption(type,number){
		var select = document.getElementById('selectGate');
		var option = document.createElement('option');
		option.setAttribute('value',type+number);
		option.setAttribute('name',type+number);
		option.setAttribute('class',type+'class');
		option.innerHTML=type+" "+number
		select.appendChild(option);
	}

	function assignID(type){
		var classSelectOption = type+"class";
		
		var everyClass = document.getElementsByClassName(classSelectOption);
		

		assignNewOption(type,everyClass.length);
		
		return(type + (everyClass.length-1))

	}


	function closePolygon() {
		var id= assignID("polygon");
		drawSVG.select('g.drawForm').remove();
		var g = drawSVG.append('g')
		.attr('class','drawing')
		.attr('id',id);
		g.append('polygon')
		.attr("class","polygon") // to get element 
		.attr('points', points)
		.attr('fill', 'none')
		.attr('stroke', '#FF0000')// maybe random color 
		.attr('stroke-width', 2);
		
		for(var i = 0; i < points.length; i++) {
			var circle = g.selectAll('circles')
			.data([points[i]])
			.enter()
			.append('circle')
			.attr('class',"polygon")
			.attr('cx', points[i][0])
			.attr('cy', points[i][1])
			.attr('r', 4)
			.attr('fill', '#FDBC07')
			.attr('stroke', '#000')
			.attr('xcor', xscalelog.invert(mouse[0]))
			.attr('is-handle', 'true')
			.call(dragger)
			.style({cursor: 'move'});

		}
		
		points.splice(0);
		drawing = false;
	}

	function closeRect(){
		var figureTypeName ="rect";
		var id= assignID("rectangle");
		var rectParameter = makeRect(points[0][0],points[0][1],points[1][0],points[1][1]);
		drawSVG.select('g.drawForm').remove();
		var g = drawSVG.append('g')
		.attr('class','drawing')
		.attr('id',id);
			g.append(figureTypeName)
					.attr("class","rectangle") // to get element
					.attr('x', rectParameter[0])
					.attr('y', rectParameter[1])
					.attr('width', rectParameter[2])
					.attr('height', rectParameter[3])
					.attr("x2",rectParameter[4])
					.attr("y2",rectParameter[5])
					.attr('stroke', '#FF0000')
					.attr('fill', 'none')
					.attr('stroke-width', 2);

		for(var i = 0; i < points.length; i++) {
			var circle = g.selectAll('circles')
			.data([points[i]])
			.enter()
			.append('circle')
			.attr('class',"rectangle")
			.attr('cx', points[i][0])
			.attr('cy', points[i][1])
			.attr('r', 4)
			.attr('fill', '#FDBC07')
			.attr('stroke', '#000')
			.attr('xcor', xscalelog.invert(mouse[0]))
			.attr('is-handle', 'true')
			.call(dragger)
			.style({cursor: 'move'});
		}
		
		points.splice(0);
		drawing = false;
	}


	function caluleAngle(x1,x2,y1,y2){
		return Math.atan(( y2-y1 )/(x2 - x1))* 180/Math.PI;
	}


	function closeEllipse(){
		var centerX= points[0][0];
		var centerY= points[0][1];
		var rx= pointDistance(points[1][0], centerX ,points[1][1],centerY);
		var ry = Math.sqrt(Math.pow(points[2][0] - centerX,2)+ Math.pow(points[2][1] - centerY,2));
		var angle = caluleAngle(points[0][0],points[1][0],points[0][1],points[1][1]);
		var id= assignID("ellipse");
		drawSVG.select('g.drawForm').remove();
		var g = drawSVG.append('g')
		.attr('class','drawing')
		.attr('id',id);
				g.append('ellipse')
					.attr('class',"ellipse")
					.attr('transform',"rotate("+ angle+","+ points[0][0]+","+points[0][1]+")")
					.attr('cx', points[0][0])
					.attr('cy', points[0][1])
					.attr('rx', rx)
					.attr('ry', ry)
					.attr("angle",angle)
					.attr('fill','None')
					.attr('stroke', '#FF0000')
					.attr('stroke-width', 1);
			var chooseEllipsePointName={ // on drag each point have a different function identifiable with a different name
				0: "centerEllipse",
				1: "topEllipse",
				2: "sideEllipse"
			};

			var lastPoint= placePointOnEllipse(points[0][0],points[0][1],rx,ry,0,angle);
			points[2]=[lastPoint.x,lastPoint.y]
			for(var i = 0; i < points.length ; i++) 
					var circle = g.selectAll('circles')
					.data([points[i]])
					.enter()
					.append('circle')
					.attr("id", chooseEllipsePointName[i])
					.attr('class',"ellipse")
					.attr('cx', points[i][0])
					.attr('cy', points[i][1])
					.attr('r', 4)
					.attr('fill', '#FDBC07')
					.attr('stroke', '#000')
					.attr('xcor', xscalelog.invert(mouse[0]))
					.attr('is-handle', 'true')
					.call(dragger)
					.style({cursor: 'move'});

		
		points.splice(0);
		drawing = false;
	}

	function dragPolygon(node){
		var form = d3.select(node.parentNode).select('polygon');
			var circles = d3.select(node.parentNode).selectAll('circle');
			
				dragCircle
					.attr('cx', fixDragPostionX(mouse[0]))
					.attr('cy', fixDragPostionY(mouse[1]));
				for (var i = 0; i < circles._groups[0].length; i++) {
				circle = d3.select(circles._groups[0][i]);
				newPoints.push([circle.attr('cx'), circle.attr('cy')]);
				}
				form.attr('points', newPoints);
	}
	function dragRect(node){
		var form = d3.select(node.parentNode).select('rect');
				var circles = d3.select(node.parentNode).selectAll('circle');
				dragCircle
					.attr('cx', fixDragPostionX(mouse[0]))
					.attr('cy', fixDragPostionY(mouse[1]));
				for (var i = 0; i < circles._groups[0].length; i++) {
				circle = d3.select(circles._groups[0][i]);
					newPoints.push([Number(circle.attr('cx')),Number(circle.attr('cy'))]);
				}
				var rectParameter = makeRect(newPoints[0][0],newPoints[0][1],newPoints[1][0],newPoints[1][1]);
				form
				.attr('x', rectParameter[0] )
				.attr('y', rectParameter[1])
				.attr('width', rectParameter[2])
				.attr('height', rectParameter[3])
				;
	}
	function dragEllipse(node){

		var shape = d3.select(node.parentNode).select('ellipse');
		var circles = d3.select(node.parentNode).selectAll('circle');
		var cx = fixDragPostionX(mouse[0]),
			cy =fixDragPostionY(mouse[1]);
		var cxCenter = parseFloat(shape._groups[0][0].getAttribute("cx")),
			cyCenter = parseFloat(shape._groups[0][0].getAttribute("cy")); 

		var rx,ry,angle;
		
		function moveCenterPointEllipse(node){
			var sideEllipse = d3.select(node.parentNode).select('#sideEllipse');
			var topEllipse = d3.select(node.parentNode).select('#topEllipse');
			var angle = shape._groups[0][0].transform.baseVal[0].angle;
			rx= parseFloat(shape._groups[0][0].getAttribute("rx"));
			ry= parseFloat(shape._groups[0][0].getAttribute("ry"));

			var pointSideEllipse= placePointOnEllipse(cx,cy,rx,ry,0,angle);
			var pointTopEllipse =placePointOnEllipse(cx,cy,rx,ry,90,angle);

			shape
			.attr('cx', cx)
			.attr('cy', cy)
			.attr('transform','rotate('+angle+','+cx+','+cy+')');


			dragCircle
			.attr('cx', cx)
			.attr('cy', cy);


			sideEllipse
			.attr('cx',pointSideEllipse.x)
			.attr('cy',pointSideEllipse.y);

			topEllipse
			.attr('cx',pointTopEllipse.x)
			.attr('cy',pointTopEllipse.y);

		}
		function moveTopPointEllipse(node){
			var ry= parseFloat(shape._groups[0][0].getAttribute("ry"));
				var otherPoint;
					angle= Math.atan((cy - cyCenter)/(cx - cxCenter))* 180/Math.PI;
					rx =Math.sqrt(Math.pow(cxCenter - cx,2)+ Math.pow(cyCenter - cy,2));
					
					shape
						.attr('rx',rx)
						.attr('transform',"rotate("+ angle+","+ cxCenter+","+cyCenter+")")
				dragCircle
					.attr('cx', cx)
					.attr('cy', cy);
				var newPoint= placePointOnEllipse(cxCenter,cyCenter,rx,ry,0,angle);
				otherPoint = d3.select(node.parentNode).select('#sideEllipse');

				otherPoint
					.attr('cx',newPoint.x)
					.attr('cy',newPoint.y);

		}
		function moveSidePointEllipse(node){
			ry =Math.sqrt(Math.pow(cxCenter - cx,2)+ Math.pow(cyCenter - cy,2));
				rx = parseFloat(shape._groups[0][0].getAttribute("rx"));
				angle = parseFloat(shape._groups[0][0].getAttribute("angle"));
				var newPoint= placePointOnEllipse(cxCenter,cyCenter,rx,ry,1,angle);
				
				shape
					.attr('ry',ry);
				dragCircle
					.attr('cx',newPoint.x)
					.attr('cy',newPoint.y)

		}
		var selectEllipseDragPointAction ={
			centerEllipse:moveCenterPointEllipse,
			topEllipse:moveTopPointEllipse,
			sideEllipse:moveSidePointEllipse
		}
		var idDragPoint=dragCircle._groups[0][0].getAttribute("id");
		if(selectEllipseDragPointAction.hasOwnProperty(idDragPoint)){
			selectEllipseDragPointAction[idDragPoint](node);
		}
		
	}
	function fixDragPostionX(x){
		return x -50
	}
	function fixDragPostionY(y){
		return y -10
	}
	function handleDrag() {  // all dragging function
		mouse=d3.pointer(event,drawSVG.node());
		

		if(drawing) return;
		dragCircle = d3.select(this),
			newPoints = [],
			circle;
		dragging = true;
		actualtool = dragCircle._groups[0][0].className.baseVal; 

		selectFunction[actualtool].drag(this);

	}


	/////////////////////////////////////
	/////////////////////////////////////
	/////////////////////////////////////



	function appendPoint(i){
		g.append('circle')
			.attr('cx', points[i][0])
			.attr('cy', points[i][1])
			.attr('r', 4)
			.attr('fill', 'yellow')
			.attr('stroke', '#000')
			.attr('is-handle', 'true')
			.style({cursor: 'pointer'});
	}

	function mouseupPoly(){
		g.select('polyline').remove();
		var polyline = g.append('polyline').attr('points', points)
						.style('fill', 'none')
						.attr('stroke', '#000');
		for(var i = 0; i < points.length; i++) {
			appendPoint(i);

		}
	}


	function mouseupRect(){
		g.select('formline').remove();
		var formline = g.append('formline').attr('points', points)
						.style('fill', 'none')
						.attr('stroke', '#000');
		for(var i = 0; i < points.length; i++) {
			appendPoint(i);
			if (i === 1){
			closeRect();
			}

		}
	}
	function mouseupEllipse(){
		g.select('formline').remove();
		var formline = g.append('formline').attr('points', points)
						.style('fill', 'none')
						.attr('stroke', '#000');
		for(var i = 0; i < points.length; i++) {
			appendPoint(i);
			if (i === 2){
			closeEllipse();
			}

		}
	}

	function mouvsemovePoly(){
		g.select('line').remove();
		var line = g.append('line')
					.attr('x1', startPoint[0])
					.attr('y1', startPoint[1])
					.attr('x2', mouse[0] + 2)
					.attr('y2', mouse[1])
					.attr('stroke', '#53DBF3')
					.attr('stroke-width', 1);
				}


	function mouvsemoveRect(){
		var figureTypeName= "rect";
		g.select(figureTypeName).remove();
		var rectParameter = makeRect(startPoint[0], startPoint[1], mouse[0], mouse[1]);
		var rectangle = g.append(figureTypeName)
					.attr('x', rectParameter[0] )
					.attr('y', rectParameter[1])
					.attr('width', rectParameter[2])
					.attr('height', rectParameter[3])
					.attr('stroke', '#53DBF3')
					.attr('fill', 'none');
	}

	function mousemoveEllipse(){
		g.select('ellipse').remove();
		if (points.length == 2){
			var centerX= points[0][0];
			var centerY= points[0][1];
			var angle = caluleAngle(centerX,points[1][0],centerY,points[1][1]);
			var ry= pointDistance(mouse[0],centerX,mouse[1],centerY);
			var rx= pointDistance(points[1][0],centerX,points[1][1],centerY);
			var line = g.append('ellipse')
					.attr('transform',"rotate("+ angle +","+ centerX+","+centerY+")")
					.attr('cx', centerX)
					.attr('cy', centerY)
					.attr('rx', rx)
					.attr('ry', ry)
					.attr('fill','None')
					.attr('stroke', '#53DBF3')
					.attr('stroke-width', 1)
					;
	}}
	var selectFunction = {
		"polygon" : {
			"mousemove":mouvsemovePoly,
			"mouseup":mouseupPoly,
			"closeForm":closePolygon,
			"drag":dragPolygon,

		},

		"rectangle":{
			"mousemove":mouvsemoveRect,
			"mouseup":mouseupRect,
			"closeForm":closeRect,
			"drag":dragRect,
		},
		"ellipse":{
			"mousemove":mousemoveEllipse,
			"mouseup":mouseupEllipse,
			"closeForm":closeEllipse,
			"drag":dragEllipse,
		}
	}


	/////////////////////////////////////
	/////////////////////////////////////
	/////////////////////////////////////
	var modal = document.getElementById("myModal");
	var span = document.getElementsByClassName("close")[0];
	var btn = document.getElementById("hierarchyBtn");


	////////////////////////////////////
	/////////////////////////////////////
	/////////////////////////////////////

	function putToScaleX(xcoordinate){
		
		return xscalelog.invert(xcoordinate)
	}

	function putToScaleY(ycoordinate){
		return yscalelog.invert(ycoordinate)
	}


	function placePointOnEllipse(centerX, centerY, radiusX, radiusY, angleInDegrees,ellipseAngle) { // use for place the draggable point on the ellipse but also to create the polygon looking like ellipse

				var angleInRadianCercle = (ellipseAngle * Math.PI)/180,
					angleInRadiansEllipse = ((angleInDegrees-90)* Math.PI / 180.0);
				var xNoAngle= centerX + (radiusX * Math.cos(angleInRadiansEllipse)),
					yNoAngle= centerY + (radiusY * Math.sin(angleInRadiansEllipse));

				var newPointX = xNoAngle - centerX,
					newPointY = yNoAngle - centerY;

				x = newPointX * Math.cos(-angleInRadianCercle) + newPointY * Math.sin(-angleInRadianCercle) + centerX;
				y = -newPointX * Math.sin(-angleInRadianCercle) + newPointY * Math.cos(-angleInRadianCercle) + centerY;
				return{
					x: x,
					y: y
				}
				};

	function returnYposition(originalYCoordinate){
		return heightDraw - originalYCoordinate
	}
	function assignSessionInformations(){
		var sessionInformation={};
			sessionInformation["type"]="info";
			sessionInformation["marker1"]=marker1Url;
			sessionInformation["marker2"]=marker2Url;
			sessionInformation["FCS_File"]=fcsFileUrl;
			sessionInformation["range"]=xscalelog.range();
		return sessionInformation;
	}
	function assignPolyCoordinates(element){
		var polyCoordinates ={type:"polygon"}
		for (let i = 0; i < element.points.length; i++){
			
			polyCoordinates["point" + i] ={"x":putToScaleX(element.points[i].x),
								"y":putToScaleY(element.points[i].y),
							"printX":element.points[i].x,
							"printY":returnYposition(element.points[i].y)}
			
			}
			
			return polyCoordinates;
		}


	function assignEllipseCoordinates(element){
			var circleNumbers = 100; //number of point for the polygon which is consierate as a ellipse
			var degree = 360 / circleNumbers;
			var pointsToAssign={type:"polygon"};
			var cx = element.getAttribute("cx"),
			cy = element.getAttribute("cy"),
			rx = element.getAttribute("rx"),
			ry = element.getAttribute("ry"),
			cx = element.getAttribute("cx"),
			angle = element.getAttribute("angle");
			for (i=0;i<circleNumbers;i++){
				var circlePosition=placePointOnEllipse(parseFloat(cx),parseFloat(cy),rx,ry,i*degree,angle);
				circlePosition={x:putToScaleX(circlePosition.x),y:putToScaleY(circlePosition.y),
					printX:circlePosition.x, printY:returnYposition(circlePosition.y)
				}
				pointsToAssign["points" + i ]=circlePosition;
			};
			return (pointsToAssign)
		}

		
	function assignRectangleCoordinates(element){
		var x=putToScaleX(element.x.baseVal.value),
			y= putToScaleY(element.y.baseVal.value),
			x2=putToScaleX(element.x.baseVal.value + element.width.baseVal.value),
			y2=putToScaleY(element.y.baseVal.value + element.height.baseVal.value),
			printX=element.x.baseVal.value,
			printY=returnYposition(element.y.baseVal.value),
			printX2=element.x.baseVal.value + element.width.baseVal.value,
			printY2=returnYposition(element.y.baseVal.value + element.height.baseVal.value);


		var rectangleCoordinates= {
			"type":"rectangle",
			"x":x,
			"y":y,
			"x2":x2,
			"y2":y2,
			"printX":printX,
			"printY":printY,
			"printX2":printX2,
			"printY2":printY2

		}
		

		return rectangleCoordinates

	}
	var assignElements = {
		"polygon":assignPolyCoordinates,			
		"ellipse":assignEllipseCoordinates,
		"rectangle":assignRectangleCoordinates
	}

	function eraseChild(id){
		const elem = document.getElementById(id);
	while (elem.firstChild) {
		elem.removeChild(elem.lastChild);
	}
	}

	function eraseModal(){
		modal.style.display = "none";
	eraseChild("contentTree");
	}
	btn.onclick = function() {
		modal.style.display = "block";
		makeUploadForTailoringGate();
		getTree();
	}

	span.onclick = eraseModal();

	window.onclick = function(event) {
		if (select.options.selectedIndex !== -1){
			if (event.target.parentNode.id !== "selectGate" && event.target.nodeName !== "BUTTON"){
				select.options.selectedIndex = -1;
				unhighlightAll();
				
			}
		}

	if (event.target == modal) {
		eraseModal() }
	} 
		function deleteThisChoosingMarker(className){
			choosingMarker=document.getElementById(className);
			choosingMarker.remove();
		}


		function createSaveGateCheckBox(){
			var checkBox=  document.createElement("input");
			checkBox.setAttribute("type","checkbox");
			return checkBox;
		}


	function createSelectMarkerFilled(markersToAdd){
		markersToAdd=transformIntoMarkerList(markersToAdd)
		var selectMarker = document.createElement('select');
		for(i in markersToAdd){
			var data= markersToAdd[i].replaceAll('\"',"").split(" ");
			var text= (data[0] + "("+ data[1] + ")");
			var option = document.createElement("option");
			option.value =data[0];
			option.text = text;
			selectMarker.appendChild(option);
		}
		return selectMarker
	}



	function getmarkerToPlot(){
		var marker1  =document.getElementById("selectGateDiv").getElementsByTagName("select").marker1;
		var marker2  =document.getElementById("selectGateDiv").getElementsByTagName("select").marker2;
		return{
			marker1:marker1[marker1.selectedIndex].value,
			marker2:marker2[marker2.selectedIndex].value
		}

	}

	function isThereIsAnyGate(){
		return document.getElementsByClassName('drawing').length > 0;
	}
	function sendGating(){
		step+=1;
		var gating = getCoordinates();
		if (!isThereIsAnyGate()){
			alert("Draw a gate before submiting");
			return
		}
		
		gating["toPlot"]=getmarkerToPlot();
		sendJsonForGating(gating);
		

	}



	function makeSubmitButton(){
		var submitButton= document.createElement("button");
		submitButton.innerHTML="Submit selected gate";
		submitButton.setAttribute("onclick","sendGating()");
		return submitButton
	}




	function createSendGating(){
		
		var div = document.createElement("div");
		var selectMarker = createSelectMarkerFilled(getmarkers);
		selectMarker.setAttribute("class","selectMarkerForGating");
		var selectMarker2 = selectMarker.cloneNode(true);
		selectMarker.setAttribute("name","marker1");
		selectMarker2.setAttribute("name","marker2");
		var submitButton= makeSubmitButton();
		submitButton.style.width="100%";
		submitButton.style.height="5em";

		div.appendChild(selectMarker);
		div.appendChild(selectMarker2);
		div.appendChild(document.createElement("br"))
		div.appendChild(submitButton);
		return div
	}
	function getCoordinates(){
		var elements = document.getElementsByClassName('drawing');

		var elementsCoordinates = {gate:{}};
		var sessionInformation = assignSessionInformations();
		elementsCoordinates["fcsInformation"] = sessionInformation;
		elementsCoordinates["parentFile"]= sessionInformation.FCS_File;
		elementsCoordinates["gateNumber"]= parseInt(step)+1;
		
		
		for (let i=0; i < elements.length; i++){
			elementsCoordinates.gate[i] = assignElements[elements[i].id.replaceAll(/[0-9]/g, '').replaceAll("_saved","")](elements[i].firstChild);
	}


		return elementsCoordinates
	}

	function sendJsonForGating(object){
		
		var data = JSON.stringify(object); 
		var xhr = new XMLHttpRequest();
		let url = "cgi/sendToGating.php";
		loaderOn();
		document.getElementById("loader").style.display = "block";
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.onreadystatechange = function () {
					if (xhr.readyState === 4 && xhr.status === 200) {
							loaderOff();
							handleResponseAndPrintIt(this.responseText);
						
						
					}

		
		
	}
	xhr.send(data);
}
	function addSelectMarkerGatingToSelectGateDiv(){
		var targetDiv= document.getElementById("selectGateDiv");
		d3.select("#"+"selectMarkerGating").remove();
		var newDiv= createSendGating();
		newDiv.setAttribute("id","selectMarkerGating");
		targetDiv.appendChild(newDiv);
	}

