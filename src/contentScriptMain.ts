import { waitUntil } from "async-wait-until";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
window.addEventListener("message", async (event: any) => {
	if (event.source !== window) return;
	if (event.data.type !== "fromIsolatedWorld") return;
	const pasteEvent = new ClipboardEvent("paste", {
		clipboardData: new DataTransfer(),
		bubbles: true,
	});
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	pasteEvent.clipboardData!.setData("text/plain", event.data.message);

	const ta = (await waitUntil(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		() => document.querySelector("#prompt-textarea") as any,
		{
			timeout: 10_000,
		},
	)) as HTMLTextAreaElement;
	ta.dispatchEvent(pasteEvent);
});
