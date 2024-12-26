var clickedElementId = null;

document.addEventListener("contextmenu", function(event){
    clickedElementId = event.target.id;
}, true);

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (message && message.funct == "setClickedElementValue" && message.valueKey) {
		chrome.storage.local.get(message.valueKey).then((result) => {
			if (result && result[message.valueKey] && clickedElementId) {
				//set the value according to field clicked in item
				document.getElementById(clickedElementId).value = result[message.valueKey];
			}
		});
	} else if (message && message.funct == "hidePayWall") {
		if (window.location.host == "www.cnn.com") {
			removeNewsPaywall();
		}
	}
});

switch (window.location.host) {
	case "www.usajobs.gov":
		//highlight part of qualifications section that varies by posting
		if(document.getElementById('qualifications') && document.getElementById('qualifications').childNodes && document.getElementById('qualifications').childNodes[3]){
			let qualifications = document.getElementById('qualifications').childNodes[3];
			
			highlightQualifications(qualifications, "appropriate for a given project. ", "\n", false);
			highlightQualifications(qualifications, "Specialized experience is defined as", "\n");
			highlightQualifications(qualifications, "Creditable specialized experience includes:", "</ul>");
			highlightQualifications(qualifications, "In addition to the Basic Requirement listed above, you must meet the required", "<strong>");
		} else if(document.getElementById("questionsContainer")){
			//find the text after "The assignments must have shown completion of the following, or the equivalent:" ending with next <br>
		} else {
			console.log("Not a page selected for highlighting or DOM changed!!!");
		}
		break;
	case "www.linkedin.com":
		if(document.location.pathname.startsWith("/jobs/"))//for now will always be met, manifest only allows this path
		{
			const details = document.getElementById("job-details");
			if(details){ //job details lazy load, will have to modify to do this based on an event.. load, loadeddata?
				// let highlightStartPos =  details.innerHTML.indexOf("travel");
				// highlightTextInDOM(details, highlightStartPos, highlightStartPos + "travel".length);
			}
		}
		break;
	case "www.cnn.com":
		removeNewsHeader();
		break;
	case "www.nytimes.com":
		//removeWordleHeader();
		break;
	default:
		console.log("unexpected domain = " + window.location.host);
}

function highlightQualifications(reference, textStart, textEnd, includeText = true){
	let foundText = false;
	const highlightStartPos = ((includeText)? reference.innerHTML.indexOf(textStart) : reference.innerHTML.indexOf(textStart)+ textStart.length);
	let highlightEndPos = reference.innerHTML.indexOf(textEnd, highlightStartPos);
	if(textEnd.indexOf("</") >= 0) {
		highlightEndPos += textEnd.length;//if text is an ending tag, must include it or cause improper nesting
	}
	if(highlightEndPos > 0 &&(
		(highlightStartPos >= 0 && includeText) 
		|| (highlightStartPos >= 0 + textStart.length && !includeText))) //if text not included, highlightStartPos needs to be >= length of it
	{
		highlightTextInDOM(reference, highlightStartPos, highlightEndPos);
		foundText = true;
	}
	return foundText;
}

function highlightTextInDOM(reference, highlightStartPos, highlightEndPos){
	const taghighlightStartPos = "<span class='highlight'>";
	const tagHighlightEnd = "</span>";
	const newHTML = reference.innerHTML.slice(0,highlightStartPos) 
					+ taghighlightStartPos 
					+ reference.innerHTML.slice(highlightStartPos, highlightEndPos) 
					+ tagHighlightEnd
					+ reference.innerHTML.slice(highlightEndPos); 
	reference.innerHTML = newHTML;
}

function removeNewsHeader(className = "ad-slot-header__wrapper"){
	removeElementByClassName(className);
}

function removeNewsPaywall(className = "user-account-reg-wall user-account-reg-wall--sub") {
	removeElementByClassName(className);
}

function removeWordleHeader(id = "ad-top"){
	removeElementById(id);
}

function removeElementById(id){
	removeElement(document.getElementById(id));
}

function removeElementByClassName(className){
	removeElement(document.getElementsByClassName(className)[0]);
}

function removeElement(reference){
	reference.parentElement.removeChild(reference);
}