/**
 * @author victor
 * 
 * Tool for Canvas drawing
 */

var canvas = null;
var contextCanvas = null;
var puntos;
var clickable = true;

/**
 * Initialize the tool
 */
function initialize(){	
	if (canvas === null){
		canvas = document.getElementById("areaDibujo");
		contextCanvas = canvas.getContext("2d");
		
		puntos = new Array();
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
			contextCanvas.lineTo(event.offsetX, event.offsetY);
			contextCanvas.stroke();
		}
		else{
			contextCanvas.moveTo(event.offsetX, event.offsetY);
		}
		dot = event.offsetX + ',' + event.offsetY;
		puntos.push(dot);
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
			console.log(finalX, finalY);
			inicioX = puntos[0].split(',')[0];
			inicioY = puntos[0].split(',')[1];
			
			contextCanvas.moveTo(finalX, finalY);
			contextCanvas.lineTo(inicioX, inicioY);
			contextCanvas.stroke();
			
			document.getElementById('idCloseShape').disabled = true;
			clickable = false;
		}
		else{
			alert("You drew only a line");
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