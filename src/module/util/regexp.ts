const EvalEmbedded = /\|\|[^|]+\|\|/g
const NewLine = /(?:\n|<br>)/g

export function replace(re: RegExp, src: string, repl: { embeddedEval: (s: string) => string } | null): string {
	if (!repl) return src
	const b = src.replace(re, function (s) {
		return repl.embeddedEval(s)
	})
	return b
}

export const RegEx = {
	EvalEmbedded,
	NewLine,
	replace,
}
