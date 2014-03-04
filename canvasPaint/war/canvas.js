/**
 * @author victor
 * 
 * Tool for Canvas drawing
 */

var canvas = null;
var contextCanvas = null;
var puntos;
var clickable = true;
var pointerCounter;

var CONST_STRAIGHT_LINE = Math.PI / 8;

/**
 * Initialize the tool
 */
function initialize(){	
	if (canvas === null){
		canvas = document.getElementById("areaDibujo");
		contextCanvas = canvas.getContext("2d");
		
		puntos = new Array();
		pointerCounter = 0;
	}
	else{
		alert("Reload the webpage");
	}
}

/**
 * Draw the sharp by clicking on the canvas area
 * @param event
 */
function drawSharp(event){
	var dot;
	
	if (!canvas){
		initialize();
	}
	
	if (clickable){
		if (puntos.length > 0){
			if (isShiftPressed(event)){
				var code = parseInt(whichStraightLine(
										puntos[pointerCounter-1].split(',')[0], 
										puntos[pointerCounter-1].split(',')[1],
										event.offsetX,
										event.offsetY));
				console.log(code);
				switch(code){
					
					case 1:
						drawLine(contextCanvas, event.offsetX, puntos[pointerCounter-1].split(',')[1]);
						showInput(event.offsetX, puntos[pointerCounter-1].split(',')[1]);
						break;
					case 2:
						drawLine(contextCanvas, puntos[pointerCounter-1].split(',')[0], event.offsetY);
						showInput(puntos[pointerCounter-1].split(',')[0], event.offsetY);
						break;
					default:
						drawLine(contextCanvas, event.offsetX, event.offsetY);
						showInput(event.offsetX, event.offsetY);
						break;
				}
			}
			else{
				drawLine(contextCanvas, event.offsetX, event.offsetY);
				showInput(event.offsetX, event.offsetY);
			}
		}
		else{
			contextCanvas.moveTo(event.offsetX, event.offsetY);
		}
		dot = event.offsetX + ',' + event.offsetY;
		puntos.push(dot);
		++pointerCounter;
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
	cc.stroke();
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
	
	console.log(x0, y0, x1, y1);
	
	if (measure !== -1){		
		var distance = getDistance(x0, y0, x1, y1);
		var alfa = Math.asin((y1 - y0) / distance);
		console.log(distance, alfa);
		var posY = parseInt((distance / 2) * Math.sin(alfa));
		var posX = parseInt((distance / 2) * Math.cos(alfa));

		console.log('antes ', posX, posY);
		posY += parseInt(y0);
		posX += parseInt(x0);
		console.log('despues ', posX, posY);
		
		cc.font = '18px Arial';
		
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
}

/**
 * Detect the 'intro' key and write the text in the canvas
 * @param event
 */
function getMeasureIntro(event){
	var code = event.which ? event.which : event.keyCode;
	
	if (code === 13){
		if (canvas){
			writeMeasure(
					contextCanvas, 
					puntos[pointerCounter-2].split(',')[0],
					puntos[pointerCounter-2].split(',')[1],
					puntos[pointerCounter-1].split(',')[0],
					puntos[pointerCounter-1].split(',')[1]);
			
			var inputMedida = document.getElementById('inputMedida');
			inputMedida.style.display = 'none';
			inputMedida.children[0].value = '';
		}
	}
}

/**
 * Close the sharp by adding the last line on the polygon
 */
function closeShape(){
	var finalX, finalY;
	var inicioX, inicioY;
	
	if (clickable){
		if (puntos.length > 2){
			finalX = puntos[puntos.length-1].split(',')[0];
			finalY = puntos[puntos.length-1].split(',')[1];
			inicioX = puntos[0].split(',')[0];
			inicioY = puntos[0].split(',')[1];
			
			contextCanvas.moveTo(finalX, finalY);
			contextCanvas.lineTo(inicioX, inicioY);
			contextCanvas.stroke();
			
			document.getElementById('idCloseShape').disabled = true;
			hideInput();
			clickable = false;
		}
		else{
			alert("You have to draw more than two lines to create the shape");
		}
	}
	
}

/**
 * Clean the shape
 * @see http://stackoverflow.com/questions/2142535/how-to-clear-the-canvas-for-redrawing for the canvas cleaning
 */
function cleanShape(){
	canvas.width = canvas.width;
	contextCanvas = null;
	canvas = null;
	puntos = null;
	clickable = true;
	document.getElementById('inputMedida').style.display = 'none';
	document.getElementById('idCloseShape').disabled = false;
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
 * Calculate the distance between two points: (x0, y0) - (x1, y1)
 * @param x0
 * @param y0
 * @param x1
 * @param y1
 * @returns the distance or -1 if error
 */
function getDistance(x0, y0, x1, y1){
	try{
		return Math.sqrt(Math.pow((x1 - x0), 2) + Math.pow((y1 - y0), 2));
	}catch(e){
		console.log(e);
		return -1;
	}
}