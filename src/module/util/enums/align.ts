import { i18n } from "@util/i18n.ts"

export namespace align {
	export enum Option {
		Start = "start",
		Middle = "middle",
		End = "end",
		Fill = "fill",
	}

	export namespace Option {
		export function toString(O: Option): string {
			return i18n.localize(`GURPS.Enum.align.${O}.Name`)
		}
	}
	export const Options: Option[] = [Option.Start, Option.Middle, Option.End, Option.Fill]
}
