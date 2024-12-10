import { i18n } from "@util/i18n.ts"

export namespace container {
	export enum Type {
		Group = "group",
		AlternativeAbilities = "alternative_abilities",
		Ancestry = "ancestry",
		Attributes = "attributes",
		MetaTrait = "meta_trait",
	}

	export namespace Type {
		export function ensureValid(T: Type): Type {
			if (Types.includes(T)) return T
			return Types[0]
		}

		export function toString(T: Type): string {
			return i18n.localize(`GURPS.Enum.container.${T}.Name`)
		}

		export function inlineTag(T: Type): string {
			return i18n.localize(`GURPS.Enum.container.${T}.Tag`)
		}
	}

	export const Types: Type[] = [Type.Group, Type.AlternativeAbilities, Type.Ancestry, Type.Attributes, Type.MetaTrait]

	export const TypesChoices: Readonly<Record<Type, string>> = Object.freeze(
		Object.fromEntries(Types.map(T => [T, Type.toString(T)])) as Record<Type, string>,
	)
}
