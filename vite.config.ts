import * as Vite from "vite"
import path from "path"
import fs from "fs-extra"
import tsconfigPaths from "vite-tsconfig-paths"
import esbuild from "esbuild"
import { viteStaticCopy } from "vite-plugin-static-copy"
import checker from "vite-plugin-checker"
import { SYSTEM_NAME } from "./src/module/util/constants.ts"

const config = Vite.defineConfig(({ command, mode }): Vite.UserConfig => {
	const buildMode = mode === "production" ? "production" : "development"
	const outDir = "dist"

	const plugins = [checker({ typescript: true }), tsconfigPaths({ loose: true })]

	if (buildMode === "production") {
		plugins.push(
			{
				name: "minify",
				renderChunk: {
					order: "post",
					async handler(code, chunk) {
						return chunk.fileName.endsWith(".mjs")
							? esbuild.transform(code, {
									keepNames: true,
									minifyIdentifiers: false,
									minifySyntax: true,
									minifyWhitespace: true,
								})
							: code
					},
				},
			},
			...viteStaticCopy({
				targets: [
					{ src: "CHANGELOG.md", dest: "." },
					{ src: "README.md", dest: "." },
					{ src: "CONTRIBUTING.md", dest: "." },
				],
			}),
		)
	} else {
		plugins.push(
			// Foundry expects all esm files listed in system.json to exist: create empty vendor module when in dev mode
			{
				name: "touch-vendor-mjs",
				apply: "build",
				writeBundle: {
					async handler() {
						fs.closeSync(fs.openSync(path.resolve(outDir, "vendor.mjs"), "w"))
					},
				},
			},
			// Vite HMR is only preconfigured for css files: add handler for HBS templates and localization JSON
			{
				name: "hmr-handler",
				apply: "serve",
				handleHotUpdate(context) {
					if (context.file.startsWith(outDir)) return

					if (context.file.endsWith("en.json")) {
						const basePath = context.file.slice(context.file.indexOf("lang/"))
						console.log(`Updating lang file at ${basePath}`)
						fs.promises.copyFile(context.file, `${outDir}/${basePath}`).then(() => {
							context.server.ws.send({
								type: "custom",
								event: "lang-update",
								data: { path: `systems/${SYSTEM_NAME}/${basePath}` },
							})
						})
					} else if (context.file.endsWith(".hbs")) {
						const basePath = context.file.slice(context.file.indexOf("templates/"))
						console.log(`Updating template file at ${basePath}`)
						fs.promises.copyFile(context.file, `${outDir}/${basePath}`).then(() => {
							context.server.ws.send({
								type: "custom",
								event: "template-update",
								data: { path: `systems/${SYSTEM_NAME}/${basePath}` },
							})
						})
					}
				},
			},
		)
	}

	return {
		plugins,
		publicDir: "static",
		define: {
			BUILD_MODE: JSON.stringify(buildMode),
			fu: "foundry.utils",
		},
		build: {
			target: "es2022",
			outDir,
			emptyOutDir: false,
			minify: false,
			sourcemap: buildMode === "development",
			lib: {
				name: SYSTEM_NAME,
				entry: "src/gurps.ts",
				formats: ["es"],
				fileName: SYSTEM_NAME,
			},
			rollupOptions: {
				output: {
					chunkFileNames: "[name].mjs",
					entryFileNames: "gurps.mjs",
				},
			},
		},
		css: { devSourcemap: buildMode === "development" },
	}
})
export default config
