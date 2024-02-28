import { Glob } from "bun";
import { copyFile } from "fs/promises";
await Bun.build({
	entrypoints: ["./src/background.ts", "./src/contentScript.ts"],
	outdir: "./out",
	target: "browser",
});

const glob = new Glob("!*.{ts,tsx,js,jsx}");
for await (const file of glob.scan({ cwd: "./src" })) {
	await copyFile(`./src/${file}`, `./out/${file}`);
}
await copyFile("./README.md", "./out/README.md");
