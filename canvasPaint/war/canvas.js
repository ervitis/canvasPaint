/**
 * @author victor
 * 
 * Tool for Canvas drawing
 */

var canvas = null;
var contextCanvas = null;
var puntos;
var clickable = true;
var isDrawGrid = false;
var isShapeClosed = false;
var isLastMeasure = false;
var pointerCounter;
var offsetX = -1, offsetY;

var CONST_GRILL_COLOR = '#8DDAB3';
var CONST_GRILL_STROKE_WIDTH = 1;
var CONST_LINE_STROKE_WIDTH = 3;
var CONST_STRAIGHT_LINE = Math.PI / 8;
var CONST_SEPARATION = 8;
var CONST_RADIUS = 10;
var CONST_CIRCLE = 2*Math.PI;
var CONST_GRID_LEFT = -1;
var CONST_GRID_TOP = -1;
var CONST_GRID_MEASURES_TOP_MINUS = 10;

/**
 * Initialize the tool
 */
function initialize(){	
	document.getElementById('btnSave').setAttribute("disabled", "disabled");
	if (canvas === null){
		canvas = document.getElementById("areaDibujo");
		contextCanvas = canvas.getContext("2d");
		
		puntos = new Array();
		pointerCounter = 0;
		offsetX = -1;
		
		CONST_GRID_LEFT = getCanvasWidth(canvas);
		CONST_GRID_TOP = getCanvasHeight(canvas) / 2;
		
		if (createGrill(canvas) !== 0){
			alert('Something went wrong creating the grill, please reload the web page');
		}
	}
	else{
		alert("Reload the webpage");
	}
}

function drawGuideLine(event){
	if (puntos){
		if (puntos.length > 0){
			
		}
	}
}

/**
 * Draw the sharp by clicking on the canvas area
 * @param event
 */
function drawSharp(event){
	var dot;

	if (offsetX === -1){
		getOffsetXY(event);
	}
	
	if (!canvas){
		initialize();
	}
	
	if (puntos.length === 4 && !isShapeClosed){
		clickable = false;
		alert('Un plato de ducha debe tener 4 lados solamente, pulse sobre \"Cerrar figura\"');
	}
	
	if (clickable){
		if (puntos.length > 0){
			if (document.getElementById('inputMedida').style.display === 'inline'){
				if (document.getElementById('inputM').value === ''){
					alert('Introduzca la medida que pide');
					document.getElementById('inputM').focus();
				}
			}
			else{
			
				if (isShiftPressed(event)){
					getOffsetXY(event);
					var code = parseInt(whichStraightLine(
											puntos[pointerCounter-1].split(',')[0], 
											puntos[pointerCounter-1].split(',')[1],
											offsetX,
											offsetY));
					switch(code){
						
						case 1:
							getOffsetXY(event);
							
							dot = offsetX + ',' + offsetY;
							puntos.push(dot);
							++pointerCounter;
							
							drawLine(contextCanvas, offsetX, puntos[pointerCounter-1].split(',')[1]);
							showInput(offsetX, puntos[pointerCounter-1].split(',')[1]);
							break;
						case 2:
							getOffsetXY(event);
							
							dot = offsetX + ',' + offsetY;
							puntos.push(dot);
							++pointerCounter;
							
							drawLine(contextCanvas, puntos[pointerCounter-1].split(',')[0], offsetY);
							showInput(puntos[pointerCounter-1].split(',')[0], offsetY);
							break;
						default:
							getOffsetXY(event);
						
							dot = offsetX + ',' + offsetY;
							puntos.push(dot);
							++pointerCounter;
						
							drawLine(contextCanvas, offsetX, offsetY);
							showInput(offsetX, offsetY);
							break;
					}
				}
				else{
					getOffsetXY(event);
					
					dot = offsetX + ',' + offsetY;
					puntos.push(dot);
					++pointerCounter;
					
					drawLine(contextCanvas, offsetX, offsetY);
					showInput(offsetX, offsetY);
				}
			}
		}
		else{
			getOffsetXY(event);
			
			dot = offsetX + ',' + offsetY;
			puntos.push(dot);
			++pointerCounter;
			
			contextCanvas.beginPath();
			contextCanvas.moveTo(offsetX, offsetY);
		}
		/*
		getOffsetXY(event);
		dot = offsetX + ',' + offsetY;
		puntos.push(dot);
		++pointerCounter;
		*/
		clickable = true;
	}
	
	if (isDrawGrid && isShapeClosed){
		console.log(isDrawGrid, isShapeClosed);
		if (puntos.length > 3 && isLastMeasure){
			console.log(puntos.length, isLastMeasure);
			getOffsetXY(event);
			if (offsetX !== -1){
				getCoordinatesGrid(offsetX, offsetY);
				isDrawGrid = false;
			}
		}
		else{
			alert('Introduzca la medida');
		}
	}
	
}

/**
 * Draw a line
 * @param cc context
 * @param x point
 * @param y point
 */
function drawLine(cc, x, y){
	cc.lineTo(x, y);
	cc.lineWidth = CONST_LINE_STROKE_WIDTH;
	cc.strokeStyle = '#000000';
	cc.stroke();
}

/**
 * Draw a line and set it with color and stroke style
 * @param cc context
 * @param x point
 * @param y point
 * @param c color
 * @param l line stroke style
 */
function drawLineWithColor(cc, x, y, c, l){
	cc.lineTo(x, y);
	cc.lineWidth = l;
	cc.strokeStyle = c;
	cc.stroke();
	cc.closePath();
}

/**
 * Re-write the offsetX and offsetY
 * @see http://www.jacklmoore.com/notes/mouse-position/
 * @param e
 */
function getOffsetXY(e){
	e = e || window.event;
	
	var target = e.target || e.srcElement;
	var style = target.currentStyle || window.getComputedStyle(target, null);
	var borderLeftWidth = parseInt(style['borderLeftWidth'], 10);
	var borderTopWidth = parseInt(style['borderTopWidth'], 10);
	var rect = target.getBoundingClientRect();
	offsetX = e.clientX - borderLeftWidth - rect.left;
	offsetY = e.clientY - borderTopWidth - rect.top;
}

/**
 * Show the input text
 * @param x
 * @param y
 */
function showInput(x, y){
	var inputMedida = document.getElementById('inputMedida');
	inputMedida.style.position = 'absolute';
	inputMedida.style.left = x + 'px';
	inputMedida.style.top = y + 'px';
	inputMedida.style.display = 'inline';
	document.getElementById('inputM').focus();
}

/**
 * Hide input text
 */
function hideInput(){
	var inputMedida = document.getElementById('inputMedida');
	inputMedida.value = '';
	inputMedida.style.display = 'none';
}

/**
 * Get the measure from the input element
 * @returns the value in float format
 */
function getMeasure(){
	var measure = document.getElementById('inputM').value;
	
	if (measure.indexOf(',') > -1){
		measure = measure.replace(',', '.');
		measure = parseFloat(measure);
	}
	
	if (!isNaN(measure)){
		return parseFloat(measure);
	}
	return -1;
}

function getGridMeasureParsed(value){
	var v;
	
	if (value.indexOf('.') > -1){
		v = value.replace('.', ',');
		return v;
	}
	
	return value;
}

/**
 * Write the measure inside the canvas
 * @param cc the context
 * @param x0
 * @param y0
 * @param x1
 * @param y1
 */
function writeMeasure(cc, x0, y0, x1, y1){
	var measure = getMeasure();
	
	if (measure !== -1){		
		var distance = getDistance(x0, y0, x1, y1);
		var alfa = Math.asin((y1 - y0) / distance);
		var posY = parseInt((distance / 2) * Math.sin(alfa));
		var posX = parseInt((distance / 2) * Math.cos(alfa));

		var sx = parseInt(x1) - parseInt(x0);
		var sy = parseInt(y1) - parseInt(y0);
		
		if (sx >= 0 && sy >= 0){
			posY += parseInt(y0) - CONST_SEPARATION;
			posX += parseInt(x0) + CONST_SEPARATION;
		}
		else if (sx >= 0 && sy < 0){
			posY += parseInt(y0) + CONST_SEPARATION;
			posX += parseInt(x0) + CONST_SEPARATION;
		}
		else if (sx < 0 && sy >= 0){
			posY += parseInt(y0) - CONST_SEPARATION;
			posX += parseInt(x0) - CONST_SEPARATION;
		}
		else{
			posY += parseInt(y0) + CONST_SEPARATION;
			posX += parseInt(x0) - CONST_SEPARATION;
		}
		
		
		cc.font = '20px Arial';
		cc.fillStyle = 'blue';
		
		if (!isNaN(measure)){
			measure = measure.toString();
		}
		
		if (measure.indexOf('.') > -1){
			measure = measure.replace('.', ',');
		}
		cc.fillText(measure, posX, posY);
	}
	else{
		alert('Invalid measure');
	}
	
	if (pointerCounter === 4 && !isShapeClosed && !isDrawGrid){
		document.getElementById('idCloseShape').removeAttribute('disabled');
		isLastMeasure = true;
	}
}

/**
 * Detect the 'intro' key and write the text in the canvas
 * @param event
 */
function getMeasureIntro(event){
	var code = event.which ? event.which : event.keyCode;
	
	if (code === 13){
		if (document.getElementById('inputM').value !== ''){
			if (canvas){			
				if (clickable){
					if (parseInt(puntos[pointerCounter-2].split(',')[0]) <= parseInt(puntos[pointerCounter-1].split(',')[0])){
						writeMeasure(
								contextCanvas, 
								puntos[pointerCounter-2].split(',')[0],
								puntos[pointerCounter-2].split(',')[1],
								puntos[pointerCounter-1].split(',')[0],
								puntos[pointerCounter-1].split(',')[1]);
					}
					else{
						writeMeasure(
								contextCanvas, 
								puntos[pointerCounter-1].split(',')[0],
								puntos[pointerCounter-1].split(',')[1],
								puntos[pointerCounter-2].split(',')[0],
								puntos[pointerCounter-2].split(',')[1]);
					}
				}
				else{
					if (parseInt(puntos[0].split(',')[0]) <= parseInt(puntos[pointerCounter-1].split(',')[0])){
						writeMeasure(
								contextCanvas,
								puntos[0].split(',')[0],
								puntos[0].split(',')[1],
								puntos[pointerCounter-1].split(',')[0],
								puntos[pointerCounter-1].split(',')[1]);
					}
					else{
						writeMeasure(
								contextCanvas,
								puntos[pointerCounter-1].split(',')[0],
								puntos[pointerCounter-1].split(',')[1],
								puntos[0].split(',')[0],
								puntos[0].split(',')[1]);
					}
					document.getElementById('btnSave').removeAttribute('disabled');
				}
				var inputMedida = document.getElementById('inputMedida');
				inputMedida.style.display = 'none';
				inputMedida.children[0].value = '';
			}
		}
		else{
			alert('Debe insertar la medida');
		}
		/*
		 * Fixed bug
		if (puntos.length >= 4){
			isDrawGrid = true;
		}
		*/
	}
}

/**
 * Close the sharp by adding the last line on the polygon
 */
function closeShape(){
	var finalX, finalY;
	var inicioX, inicioY;
	
	if (puntos.length > 4){
		alert('Ha creado una figura que no se corresponde con un plato, se procede a limpiar el cuadro');
		cleanShape();
	}
	else if (puntos.length > 3){
		finalX = puntos[puntos.length-1].split(',')[0];
		finalY = puntos[puntos.length-1].split(',')[1];
		inicioX = puntos[0].split(',')[0];
		inicioY = puntos[0].split(',')[1];
		
		contextCanvas.moveTo(finalX, finalY);
		contextCanvas.lineTo(inicioX, inicioY);
		contextCanvas.stroke();
		
		document.getElementById('idCloseShape').setAttribute("disabled", "disabled");
		showInput(inicioX, inicioY);
		clickable = false;
		
		isDrawGrid = true;
		isShapeClosed = true;
	}
	else{
		alert("Debe crear alguna/s líneas más para cerrar la figura");
	}
	
}

/**
 * Clean the shape
 * @see http://stackoverflow.com/questions/2142535/how-to-clear-the-canvas-for-redrawing for the canvas cleaning
 */
function cleanShape(){
	var width = getCanvasWidth(canvas);
	var height = getCanvasHeight(canvas);
	
	document.getElementById('btnSave').disabled = true;
	document.getElementById('drawShowerPlate').style.display = 'none';
	document.getElementById('gridMeasures').style.display = 'none';
	document.getElementById('inputPosX').value = '';
	document.getElementById('inputPosY').value = '';
	document.getElementById('inputM').value = '';
	
	if (width !== -1 && height !== -1){
		contextCanvas.fillStyle = '#E6E6FF';
		contextCanvas.clearRect(0, 0, width, height);
		canvas.width = canvas.width;
		createGrill(canvas);
		contextCanvas = null;
		canvas = null;
		puntos = null;
		clickable = true;
		isDrawGrid = false;
		isShapeClosed = false;
		isLastMeasure = false;
		document.getElementById('inputMedida').style.display = 'none';
		document.getElementById('idCloseShape').setAttribute("disabled", "disabled");
	}
	else{
		alert('Something went wrong with the canvas, refresh the web page');
	}
}

/**
 * Check if shift key is pressed
 * @param event
 * @returns true if is pressed, false if it's not
 */
function isShiftPressed(event){
	if (event.shiftKey == 1){
		return true;
	}
	return false;
}

/**
 * Return what kind of line will draw
 * @param x0 initial x-position
 * @param y0 initial y-position
 * @param x1 last x-position
 * @param y1 last y-position
 * @returns 1 for horizontal, 2 for vertical, 0 for normal
 */
function whichStraightLine(x0, y0, x1, y1){
	var distance = getDistance(x0, y0, x1, y1);
	var proyX, proyY;
	var resArcCoseno;
	
	proyX = Math.abs(x1 - x0);
	proyY = Math.abs(y1 - y0);
	
	if (distance > 0){
		resArcCoseno = Math.acos(proyX/distance);
		
		if (CONST_STRAIGHT_LINE > resArcCoseno){
			return 1;
		}
		else if (CONST_STRAIGHT_LINE * 2 < resArcCoseno){
			return 2;
		}
		else{
			return 0;
		}
	}
}


/**
 * Get the width of the canvas element
 * @param canvas
 * @returns the width or -1 if error
 */
function getCanvasWidth(canvas){
	if (canvas){
		return parseInt(canvas.width);
	}
	else{
		return -1;
	}
}

/**
 * Get the height of the canvas element
 * @param canvas
 * @returns the height or -1 if error
 */
function getCanvasHeight(canvas){
	if (canvas){
		return parseInt(canvas.height);
	}
	else{
		return -1;
	}
}

/**
 * Create a grill for drawing
 * @param canvas
 * @returns 0->correct, -1->error in contextCanvas, -2->error in canvas element
 */
function createGrill(canvas){
	var width, height;
	var canvasGrill = document.getElementById('areaDibujo');
	var contextCanvasGrill = canvasGrill.getContext('2d');
	
	if (canvasGrill){
		width = getCanvasWidth(canvasGrill);
		height = getCanvasHeight(canvasGrill);
		
		if (contextCanvasGrill){
			for(var i=0;i<height;i += 20){
				contextCanvasGrill.moveTo(0, i);
				drawLineWithColor(contextCanvasGrill, width, i, CONST_GRILL_COLOR, CONST_GRILL_STROKE_WIDTH);
			}
			
			for(var i=0;i<width; i += 20){
				contextCanvasGrill.moveTo(i, 0);
				drawLineWithColor(contextCanvasGrill, i, height, CONST_GRILL_COLOR, CONST_GRILL_STROKE_WIDTH);
			}
			return 0;
		}
		else{
			return -1;
		}
	}
	else{
		return -2;
	}
}

/**
 * Calculate the distance between two points: (x0, y0) - (x1, y1)
 * @param x0
 * @param y0
 * @param x1
 * @param y1
 * @returns the distance or -1 if error
 */
function getDistance(x0, y0, x1, y1){
	var d;
	x0 = parseInt(x0);
	x1 = parseInt(x1);
	y0 = parseInt(y0);
	y1 = parseInt(y1);
	try{
		d = parseFloat(Math.sqrt(Math.pow((x1 - x0), 2) + Math.pow((y1 - y0), 2)));
		return d;
	}catch(e){
		console.log(e);
		return -1;
	}
}

/**
 * Save the canvas to png image
 */
function saveImage(){
	if (canvas){
		var img = canvas.toDataURL('image/png');
		var drawShower = document.getElementById('drawShowerPlate');
		drawShower.width = getCanvasWidth(canvas);
		drawShower.height = getCanvasHeight(canvas);
		drawShower.src = img;
		drawShower.style.display = 'inline';
		
		var codeBase = getBase64Image();
		if (codeBase !== -1){
			sendEmail(codeBase);
		}
	}
	else{
		alert('Something wrong happened with the canvas, please refresh the web page and try again');
	}
}

/**
 * Get the Base64 code of the image
 * @see http://stackoverflow.com/questions/934012/get-image-data-in-javascript
 * @returns the code in base64 format or -1 if error
 */
function getBase64Image(){
	if (canvas){
		var data = canvas.toDataURL('image/png');
		return data.replace(/^data:image\/(png|jpg);base64,/, "");
	}
	return -1;
}

/**
 * Function to send an email
 * @param code the base64 code
 */
function sendEmail(code){
	var request;
	
	if (window.XMLHttpRequest){
		request = new XMLHttpRequest();
	}
	else{
		request = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	try{
		request.open("POST", "/SendMessage", false);
		request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		request.send("code=" + code);
	}catch(e){
		console.log(e);
	}
}

/**
 * Function to get the coordinates to draw a grid
 * @param x
 * @param y
 */
function getCoordinatesGrid(x, y){
	var xGrid = x;
	var yGrid = y;
	
	setGrid(x, y);
}

/**
 * Function to set a grid
 * @param x
 * @param y
 */
function setGrid(x, y){
	drawCircle(x, y);
	
}

/**
 * Function to draw a circle
 * @param x
 * @param y
 */
function drawCircle(x, y){
	var inputMedidasGrid = document.getElementById('gridMeasures');
	
	if (canvas){
		contextCanvas.beginPath();
		contextCanvas.arc(x, y, CONST_RADIUS, 0, CONST_CIRCLE);
		contextCanvas.stroke();
		isDrawGrid = false;
		
		if (CONST_GRID_TOP !== -1 && CONST_GRID_LEFT !== -1){
			inputMedidasGrid.style.display = 'inline';
			inputMedidasGrid.style.position = 'absolute';
			inputMedidasGrid.style.top = CONST_GRID_TOP + 'px';
			inputMedidasGrid.style.left = CONST_GRID_LEFT + 'px';
			
			document.getElementById('inputPosX').focus();
		}
		else{
			alert('Please refresh the web page');
		}
	}
	else{
		alert('Please refresh the web page');
	}
}

/**
 * Get the measures from the input text for the grid
 * @param event
 */
function getGridIntro(event){
	var key = event.which ? event.which : event.keyCode;
	
	if (key === 13){
		var measureX = document.getElementById('inputPosX');
		var measureY = document.getElementById('inputPosY');
		
		if (measureX.value !== '' && measureY.value !== ''){
			//write the measures in the canvas layer
			var gridX = getGridMeasureParsed(measureX.value);
			var gridY = getGridMeasureParsed(measureY.value);
			
			var measures = 'Horizontal desde izq= ' + gridX + ' Vertical desde der= ' + gridY;
			measureX.value = '';
			measureY.value = '';
			document.getElementById('gridMeasures').style.display = 'none';
			
			if (canvas && contextCanvas){
				contextCanvas.font = '20px Arial';
				contextCanvas.fillStyle = 'blue';
				contextCanvas.fillText(measures, 0, getCanvasHeight(canvas) - CONST_GRID_MEASURES_TOP_MINUS);
			}
			else{
				alert('Please refresh the web page');
			}
		}
		else{
			alert('Ahora introduzca la otra medida que queda');
			if (measureX.value === ''){
				measureX.focus();
			}
			else{
				measureY.focus();
			}
		}
	}
}