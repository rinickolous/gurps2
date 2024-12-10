import { i18n } from "@util/i18n.ts"

export namespace NumericComparison {
	export enum Option {
		AnyNumber = "none",
		EqualsNumber = "is",
		NotEqualsNumber = "is_not",
		AtLeastNumber = "at_least",
		AtMostNumber = "at_most",
	}

	export const Options: Option[] = [
		Option.AnyNumber,
		Option.EqualsNumber,
		Option.NotEqualsNumber,
		Option.AtLeastNumber,
		Option.AtMostNumber,
	]

	export function toString(O: Option): string {
		return i18n.localize(`GURPS.Enum.NumericComparison.${O}.Name`)
	}

	export function altString(O: Option): string {
		return i18n.localize(`GURPS.Enum.NumericComparison.${O}.Tooltip`)
	}

	export const OptionsChoices: Readonly<Record<Option, string>> = Object.freeze(
		Object.fromEntries(Options.map(O => [O, NumericComparison.toString(O)])) as Record<Option, string>,
	)

	export function CustomOptionsChoices(key: string, exclude: Option[] = []): Record<Option, string> {
		return Object.fromEntries(
			Options.filter(k => !exclude.includes(k)).map(k => [
				k,
				i18n.format(key, { value: NumericComparison.toString(k) }),
			]),
		) as Record<Option, string>
	}
}
