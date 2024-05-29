import { waitUntil } from "async-wait-until";

(async () => {
	const response = await browser.runtime.sendMessage({
		type: "READY",
	});
	if (!response?.text) return;

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const ta = (await waitUntil(() => document.querySelector("textarea") as any, {
		timeout: 10_000,
	})) as HTMLTextAreaElement;

	const int = setInterval(() => {
		if (ta.value === response.text) {
			clearInterval(int);
			return;
		}
		ta.focus();

		ta.innerHTML = response.text;
		ta.value = response.text;
		ta.dispatchEvent(new Event("input", { bubbles: true }));
	}, 700);
})();
