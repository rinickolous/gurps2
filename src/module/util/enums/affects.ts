import { i18n } from "@util/i18n.ts"

export namespace affects {
	export enum Option {
		Total = "total",
		BaseOnly = "base_only",
		LevelsOnly = "levels_only",
	}

	export namespace Option {
		export function ensureValid(O: Option): Option {
			if (Options.includes(O)) return O
			return Options[0]
		}

		export function toString(O: Option): string {
			return i18n.localize(`GURPS.Enum.affects.${O}.Name`)
		}

		export function altString(O: Option): string {
			return i18n.localize(`GURPS.Enum.affects.${O}.Alt`)
		}
	}
	export const Options: Option[] = [Option.Total, Option.BaseOnly, Option.LevelsOnly]

	export const OptionsChoices: Readonly<Record<Option, string>> = Object.freeze({
		[Option.Total]: Option.toString(Option.Total),
		[Option.BaseOnly]: Option.toString(Option.BaseOnly),
		[Option.LevelsOnly]: Option.toString(Option.LevelsOnly),
	})
}
