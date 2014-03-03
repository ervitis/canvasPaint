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
				switch(code){
					
					case 1:
						contextCanvas.lineTo(event.offsetX, puntos[pointerCounter-1].split(',')[1]);
						contextCanvas.stroke();
						break;
					case 2:
						break;
					case 3:
						contextCanvas.lineTo(puntos[pointerCounter-1].split(',')[0], event.offsetY);
						contextCanvas.stroke();
						break;
				}
			}
			else{
				contextCanvas.lineTo(event.offsetX, event.offsetY);
				contextCanvas.stroke();
			}
		}
		else{
			contextCanvas.moveTo(event.offsetX, event.offsetY);
		}
		dot = event.offsetX + ',' + event.offsetY;
		puntos.push(dot);
		//console.log(pointerCounter, puntos.length);
		++pointerCounter;
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
 * @returns 1 for horizontal, 2 for diagonal, 3 for vertical
 */
function whichStraightLine(x0, y0, x1, y1){
	var distance = Math.sqrt(Math.pow((x1 - x0), 2) + Math.pow((y1 - y0), 2));
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
			return 3;
		}
		else{
			return 2;
		}
	}
}