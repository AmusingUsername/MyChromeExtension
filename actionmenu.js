document.addEventListener('DOMContentLoaded', function() {
	var fieldIds = ["linkedInUrl","PALDetails","TSEDetails"];
	var fieldDescs = [ new FieldDescriptor("linkedInUrl","LinkedIn Profile URL:", false),
						new FieldDescriptor("PALDetails", "PAL Summary:", true),
						new FieldDescriptor("TSEDetails", "Senior TSE Details:", true)];
	buildForm(fieldDescs);
	fieldDescs.forEach((field) => getFieldDataAndListen(field.fieldId));
}, false)


function set(event){
	console.debug("setting field to storage:\n\tfield: " + event.srcElement.id + "\n\tvalue: " + event.srcElement.value);
	ApiStorageSet(event.srcElement.id, event.srcElement.value);
}

function get(fieldId) {
	ApiStorageGet(fieldId);
}


function ApiStorageSet(fieldId, value) {
	let obj = {[fieldId] : value};
	chrome.storage.local.set(obj).then((result) => {
		console.debug("result: " + result);
	});
}
function ApiStorageGet(fieldId){
	chrome.storage.local.get(fieldId).then((result) => {
	  if(result && result[fieldId]){
		document.getElementById(fieldId).value = result[fieldId];
	  }
	});
}

function buildForm(arrayOfFields){
	const myForm = document.getElementById("myFields");
	arrayOfFields.forEach((field) =>
		document.getElementById("myFields").appendChild(field.getFieldTag()));
}

function getFieldDataAndListen(fieldId){
	console.debug("getFieldDataAndListen for fieldId= " + fieldId);
	var DOMelement = document.getElementById(fieldId);
	if(DOMelement){
		//retrieve the stored value from chrome local storage
		get(fieldId);
		//add a listener to the change event so we can save data
		DOMelement.addEventListener('change', set, false);
	} else {
		console.warn("fieldId does not existin action menu: " + fieldId);
	}
}

class FieldDescriptor {
	constructor(fieldId, fieldLabel, isMultiLine) {
		this.fieldId = fieldId;
		this.fieldLabel = fieldLabel;
		this.multiLine = isMultiLine;
	}
	
	getFieldTag(){
		let newInput = null;
		console.log("multiline: " + this.multiLine);
		if(this.multiLine){
			newInput = document.createElement("textarea");
		} else {
			newInput = document.createElement("input");
		}
		newInput.id = this.fieldId;
		let newLabel = document.createElement("label");
		newLabel.innerHTML = this.fieldLabel;
		newLabel.setAttribute("for",this.fieldId);
		let newDiv = document.createElement("div");
		newDiv.id = "prompt_" + this.fieldId;
		newDiv.className = "prompt";
		newDiv.appendChild(newLabel);
		newDiv.appendChild(newInput);
		return newDiv;
	}
}