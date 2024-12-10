import { i18n } from "@util/i18n.ts"

export namespace picker {
	export enum Type {
		NotApplicable = "not_applicable",
		Count = "count",
		Points = "points",
	}

	export namespace Type {
		export function toString(T: Type): string {
			return i18n.localize(`GURPS.Enum.picker.${T}.Name`)
		}
	}

	export const Types: Type[] = [Type.NotApplicable, Type.Count, Type.Points]
}
