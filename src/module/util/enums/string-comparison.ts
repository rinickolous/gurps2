import { i18n } from "@util/i18n.ts"

export namespace StringComparison {
	export enum Option {
		AnyString = "none",
		IsString = "is",
		IsNotString = "is_not",
		ContainsString = "contains",
		DoesNotContainString = "does_not_contain",
		StartsWithString = "starts_with",
		DoesNotStartWithString = "does_not_start_with",
		EndsWithString = "ends_with",
		DoesNotEndWithString = "does_not_end_with",
	}

	export const Options: Option[] = [
		Option.AnyString,
		Option.IsString,
		Option.IsNotString,
		Option.ContainsString,
		Option.DoesNotContainString,
		Option.StartsWithString,
		Option.DoesNotStartWithString,
		Option.EndsWithString,
		Option.DoesNotEndWithString,
	]

	export function toString(O: Option): string {
		return i18n.localize(`GURPS.Enum.StringComparison.${O}.Name`)
	}

	export function altString(O: Option): string {
		return i18n.localize(`GURPS.Enum.StringComparison.${O}.NamePlural`)
	}

	export function tooltipString(O: Option): string {
		return i18n.localize(`GURPS.Enum.StringComparison.${O}.Tooltip`)
	}

	export const OptionsChoices: Readonly<Record<Option, string>> = Object.freeze(
		Object.fromEntries(Options.map(O => [O, StringComparison.toString(O)])) as Record<Option, string>,
	)

	export function CustomOptionsChoices(key: string, exclude: Option[] = []): Record<Option, string> {
		return Object.fromEntries(
			Options.filter(k => !exclude.includes(k)).map(k => [
				k,
				i18n.format(key, { value: StringComparison.toString(k) }),
			]),
		) as Record<Option, string>
	}

	export function CustomOptionsChoicesPlural(keySingle: string, keyPlural: string): Record<Option, string> {
		return {
			[Option.AnyString]: i18n.format(keySingle, {
				value: StringComparison.toString(Option.AnyString),
			}),
			[Option.IsString]: i18n.format(keySingle, {
				value: StringComparison.toString(Option.IsString),
			}),
			[Option.IsNotString]: i18n.format(keyPlural, {
				value: StringComparison.altString(Option.IsNotString),
			}),
			[Option.ContainsString]: i18n.format(keySingle, {
				value: StringComparison.toString(Option.ContainsString),
			}),
			[Option.DoesNotContainString]: i18n.format(keyPlural, {
				value: StringComparison.altString(Option.DoesNotContainString),
			}),
			[Option.StartsWithString]: i18n.format(keySingle, {
				value: StringComparison.toString(Option.StartsWithString),
			}),
			[Option.DoesNotStartWithString]: i18n.format(keyPlural, {
				value: StringComparison.altString(Option.DoesNotStartWithString),
			}),
			[Option.EndsWithString]: i18n.format(keySingle, {
				value: StringComparison.toString(Option.EndsWithString),
			}),
			[Option.DoesNotEndWithString]: i18n.format(keyPlural, {
				value: StringComparison.altString(Option.DoesNotEndWithString),
			}),
		}
	}
}
