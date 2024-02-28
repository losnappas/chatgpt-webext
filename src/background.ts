import wait from "wait";

browser.contextMenus.create({
	id: "chatgpt-webext-context-menu",
	title: "ChatGPT",
	contexts: ["selection"],
});

const extensionId = browser.runtime.getURL("");

let selectedText = "";
browser.contextMenus.onClicked.addListener(async (info, tab) => {
	if (info.menuItemId === "chatgpt-webext-context-menu" && tab?.id) {
		const t = info.selectionText || "";
		resetSelectedText(t);
		selectedText = t;
		await browser.browserAction.openPopup();
	}
});

browser.runtime.onMessage.addListener(async (message, sender) => {
	// Handle message from content script
	// biome-ignore lint/suspicious/noExplicitAny: Missing type
	if ((sender as any).envType !== "content_child") {
		return;
	}
	switch (message.type) {
		case "READY":
			return { text: selectedText };
	}
	return { text: "I got nothing" };
});

browser.webRequest.onHeadersReceived.addListener(
	(details) => {
		if (!details.responseHeaders) return;
		for (const requestHeader of details.responseHeaders) {
			switch (requestHeader.name) {
				case "content-security-policy":
					requestHeader.value = requestHeader.value?.replace(
						"frame-ancestors",
						`frame-ancestors ${extensionId}`,
					);
					break;
			}
		}
		return { responseHeaders: details.responseHeaders };
	},
	{ urls: ["https://chat.openai.com/*"] },
	["blocking", "responseHeaders"],
);

function resetSelectedText(info: string) {
	wait(5000).then(() => {
		if (selectedText === info) {
			selectedText = "";
		}
	});
}
