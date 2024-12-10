import Handlebars from "handlebars"

/* -------------------------------------------- */

function eachInMap(map: Map<string, unknown>, options: Handlebars.HelperOptions): string {
	let out = ""
	;[...map.keys()].forEach((prop: string) => {
		out += options.fn({ key: prop, value: map.get(prop) })
	})
	return out
}

/* -------------------------------------------- */

export function registerHandlebarsHelpers(): void {
	Handlebars.registerHelper({
		eachInMap,
	})
}
