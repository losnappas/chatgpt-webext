Object.assign(document.documentElement.style, {
	height: "590px",
	width: "800px",
	margin: "0",
	padding: "0",
});
Object.assign(document.body.style, {
	height: "590px",
	width: "800px",
	margin: "0",
	padding: "0",
});

(async () => {
	const response = await browser.runtime.sendMessage({
		type: "READY",
	});
	if (!response?.text) return;

	window.postMessage({ message: response.text, type: "fromIsolatedWorld" });
})();
