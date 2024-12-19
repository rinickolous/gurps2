import { i18n } from "@util/i18n.ts"

export namespace movelimit {
	export enum Option {
		Base = "base",
		Enhanced = "enhanced",
	}

	export namespace Option {
		export function toString(O: Option): string {
			return i18n.localize(`GURPS.Enum.movelimit.${O}.Name`)
		}
	}

	export const Options: Option[] = [Option.Base, Option.Enhanced]


	export const OptionsChoices: Readonly<Record<Option, string>> = Object.freeze({
		[Option.Base]: Option.toString(Option.Base),
		[Option.Enhanced]: Option.toString(Option.Enhanced),
	})

}
