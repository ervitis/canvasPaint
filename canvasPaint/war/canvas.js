/**
 * @author VMA
 * 
 * Tool for Canvas drawing
 */

var canvas = null;
var contextCanvas = null;
var puntos;

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

function drawSharp(event){
	var dot;
	
	dot = event.offsetX + ',' + event.offsetY;
	puntos.push(dot);
	console.log(puntos.length, dot);
	
	
	if (puntos.length > 1){
		contextCanvas.lineTo(event.offsetX, event.offsetY);
		contextCanvas.stroke();
	}
	else{
		contextCanvas.moveTo(event.offsetX, event.offsetY);
	}
}