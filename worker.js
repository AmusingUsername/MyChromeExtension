chrome.runtime.onInstalled.addListener(buildContextMenu);
chrome.contextMenus.onClicked.addListener((item, tab) =>
	{handleConextClick(item, tab)});

function buildContextMenu(info) {

	chrome.contextMenus.create({
		documentUrlPatterns: ["*://*.amazon.com/*dp/*", "*://*.amazon.com/*gp/*"],
		title: "Check CamelCamelCamel price history",
		id: "camelcamelcamel"
		}
	);
	chrome.contextMenus.create({
		documentUrlPatterns: ["*://*.linkedin.com/*", "*://*.dice.com/*", "*://*.indeed.com/*"],
		contexts: ["selection"],
		title: "Lookup company on glassdoor",
		id: "glassdoorsearch"
		}
	);
//Fill in details parent and submenu items
	chrome.contextMenus.create({
		documentUrlPatterns: ["*://*/*"],
		contexts: ["editable"],
		title: "Fill in details",
		id: "fillDetails"
		}
	);	
	chrome.contextMenus.create({
		documentUrlPatterns: ["*://*/*"],
		contexts: ["editable"],
		title: "LinkedIn URL",
		parentId: "fillDetails",
		id: "linkedInUrl"
		}
	);
	chrome.contextMenus.create({
		documentUrlPatterns: ["*://*.myworkdayjobs.com/*"],
		contexts: ["editable"],
		title: "PAL Summary",
		parentId: "fillDetails",
		id: "PALDetails"
		}
	);
	chrome.contextMenus.create({
		documentUrlPatterns: ["*://*.myworkdayjobs.com/*"],
		contexts: ["editable"],
		title: "TSE Summary",
		parentId: "fillDetails",
		id: "TSEDetails"
		}
	);
	chrome.contextMenus.create({
		documentUrlPatterns: ["*://*.myworkdayjobs.com/*"],
		contexts: ["editable"],
		title: "VMC Summary",
		parentId: "fillDetails",
		id: "VMCDetails"
		}
	);
	chrome.contextMenus.create({
		documentUrlPatterns: ["*://*.cnn.com/*"],
		title: "Hide Paywall",
		id: "hidePayWall"
	})
//End of Fill in details parent and submenu items

}

function handleConextClick(item, tab){
	switch(item.menuItemId) {
		case 'camelcamelcamel':
			openCccTab(tab);
			break;
		case 'glassdoorsearch':
			searchCompanyGlassdoor(item, tab);
			break;
		case 'hidePayWall':
			hidePayWall(tab, item);
			break;
		case 'linkedInUrl':
		case 'PALDetails':
		case 'TSEDetails':
		case 'VMCDetails':
			setValueFromStorage(tab, item, item.menuItemId);
			break;
	}
}

function setValueFromStorage(tab, item, valueKey){
	chrome.tabs.sendMessage(tab.id, {funct: "setClickedElementValue", valueKey: valueKey}, {frameId: item.frameId});
}

function hidePayWall(tab, item) {
	chrome.tabs.sendMessage(tab.id, {funct: "hidePayWall", valueKey: "" }, { frameId: item.frameId});
}

function openCccTab(tab){
	if(tab && tab.url){
		let dp = "/dp/";//an identifier in URL before product code on MOST products
		let dpIndex = tab.url.indexOf(dp);
		if(dpIndex < 0){
			dp = "/gp/product/";//an identifier in URL before at least some products!?
			dpIndex = tab.url.indexOf(dp);
		}
		let dpId = tab.url.substring(dpIndex + dp.length, dpIndex + dp.length + 10);
		let ccc	= "https://camelcamelcamel.com/product/" + dpId;			
		chrome.tabs.create({ url: ccc, index: tab.index + 1});
	}
}

function searchCompanyGlassdoor(item, tab) {
	if(item){
		let company = item.selectionText;//testing, need to find property with selected text
		let searchUrl	= "https://www.glassdoor.com/Search/results.htm?keyword=" + company;			
		chrome.tabs.create({ url: searchUrl, index: tab.index + 1});
	}
}