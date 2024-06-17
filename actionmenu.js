document.addEventListener('DOMContentLoaded', function() {
	var fieldIds = ["linkedInUrl"];
	for(var fieldId of fieldIds){
		console.debug("fieldId= " + fieldId);
		var DOMelement = document.getElementById(fieldId);
		if(DOMelement){
			//retrieve the stored value from chrome local storage
			get(fieldId);
			DOMelement.addEventListener('change', set, false);
		} else {
			console.warn("fieldId does not existin action menu: " + fieldId);
		}
	}
}, false)

function set(event){
	console.debug("\tfield: " + event.srcElement.id + "\n\tvalue: " + event.srcElement.value);
	ApiStorageSet(event.srcElement.id, event.srcElement.value);
}

function get(fieldId) {
	ApiStorageGet(fieldId);
}


function ApiStorageSet(fieldId, value) {
	let obj = {[fieldId] : value};
	chrome.storage.local.set(obj).then((result) => {
		console.log("result: " + result);
	});
}
function ApiStorageGet(fieldId){
	chrome.storage.local.get("linkedInUrl").then((result) => {
	  if(result && result[fieldId]){
		document.getElementById(fieldId).value = result[fieldId];
	  }
	});
}