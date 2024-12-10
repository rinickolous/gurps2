function localize(key: string): string {
	// @ts-expect-error weird types
	return game.i18n?.localize(key) ?? key
}

function format(key: string, variables: Record<string, unknown>): string {
	return game.i18n?.format(key, variables) ?? key
}

function has(key: string) {
	return game.i18n?.has(key) ?? false
}

export const i18n = {
	localize,
	format,
	has,
}
