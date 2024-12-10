import { i18n } from "@util/i18n.ts"

export namespace display {
	export enum Option {
		NotShown = "not_shown",
		Inline = "inline",
		Tooltip = "tooltip",
		InlineAndTooltip = "inline_and_tooltip",
	}

	export namespace Option {
		export function toString(O: Option): string {
			return i18n.localize(`GURPS.Enum.display.${O}.Name`)
		}

		export function toAltString(O: Option): string {
			return i18n.localize(`GURPS.Enum.display.${O}.Hint`)
		}

		export function isInline(O: Option): boolean {
			return O === Option.Inline || O === Option.InlineAndTooltip
		}

		export function isTooltip(O: Option): boolean {
			return O === Option.Tooltip || O === Option.InlineAndTooltip
		}
	}

	export const Options: Option[] = [Option.NotShown, Option.Inline, Option.Tooltip, Option.InlineAndTooltip]

	export const OptionsChoices: Readonly<Record<Option, string>> = Object.freeze({
		[Option.NotShown]: Option.toString(Option.NotShown),
		[Option.Inline]: Option.toString(Option.Inline),
		[Option.Tooltip]: Option.toString(Option.Tooltip),
		[Option.InlineAndTooltip]: Option.toString(Option.InlineAndTooltip),
	})
}
