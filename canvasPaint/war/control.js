/**
 * @author victor
 */

function isFloat(event){
	var code = event.which ? event.which : event.keyCode;
	
	if (code === 44 || code === 46){
		return true;
	}
	else if (code > 31 && (code < 48 || code > 57)){
		return false;
	}
	return true;
}