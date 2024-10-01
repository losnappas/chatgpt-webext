import wait from "wait";

browser.contextMenus.create({
	id: "chatgpt-webext-context-menu",
	title: "ChatGPT",
	contexts: ["selection"],
});

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

function resetSelectedText(info: string) {
	wait(5000).then(() => {
		if (selectedText === info) {
			selectedText = "";
		}
	});
}
