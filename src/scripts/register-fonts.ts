import { SYSTEM_NAME } from "@util"

export function registerFonts(): void {
	CONFIG.fontDefinitions["Roboto Flex"] = {
		editor: true,
		fonts: [{ url: [`systems/${SYSTEM_NAME}/fonts/roboto_flex.ttf`], style: "normal", weight: "400" }],
	}

	CONFIG.fontDefinitions["GCS"] = {
		editor: false,
		fonts: [{ url: [`systems/${SYSTEM_NAME}/fonts/gcs.woff2`], style: "normal", weight: "400" }],
	}
}
