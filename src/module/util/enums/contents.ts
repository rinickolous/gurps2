import { i18n } from "@util/i18n.ts"

export namespace contents {
	export enum Type {
		Child = "child",
		Modifier = "modifier",
	}

	export namespace Type {
		export function ensureValid(T: Type): Type {
			if (Types.includes(T)) return T
			return Types[0]
		}

		export function toString(T: Type): string {
			return i18n.localize(`GURPS.Enum.contents.${T}.Name`)
		}

		export function inlineTag(T: Type): string {
			return i18n.localize(`GURPS.Enum.contents.${T}.Tag`)
		}
	}

	export const Types: Type[] = [Type.Child, Type.Modifier]

	export const TypesChoices: Readonly<Record<Type, string>> = Object.freeze(
		Object.fromEntries(Types.map(T => [T, Type.toString(T)])) as Record<Type, string>,
	)
}
