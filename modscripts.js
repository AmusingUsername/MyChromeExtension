switch (window.location.host) {
	case "www.usajobs.gov":
		//highlight part of qualifications section that varies by posting
		if(document.getElementById('qualifications') && document.getElementById('qualifications').childNodes && document.getElementById('qualifications').childNodes[3]){
			let qualifications = document.getElementById('qualifications').childNodes[3];
			const rambleEndingText = "appropriate for a given project. ";
			const highlightStartPosition = qualifications.innerHTML.indexOf(rambleEndingText) + rambleEndingText.length;
			const highlightEndPosition = qualifications.innerHTML.indexOf("<br>", highlightStartPosition);
			highlightTextInDOM(qualifications, highlightStartPosition, highlightEndPosition);
		} else {
			console.warn("Not a position-based page or DOM changed!!!");
		}
		break;
	default:
		console.log("unexpected domain = " + window.location.host);
}

function highlightTextInDOM(reference, highlightStartPosition, highlightEndPosition){
	const tagHighlightStart = "<span class='highlight'>";
	const tagHighlightEnd = "</span>";
	const newHTML = reference.innerHTML.slice(0,highlightStartPosition) 
					+ tagHighlightStart 
					+ reference.innerHTML.slice(highlightStartPosition, highlightEndPosition) 
					+ tagHighlightEnd
					+ reference.innerHTML.slice(highlightEndPosition); 
	reference.innerHTML = newHTML;
}