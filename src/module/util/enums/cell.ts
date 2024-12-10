import { i18n } from "@util/i18n.ts"

export namespace cell {
	export enum Type {
		Text = "text",
		Tags = "tags",
		Toggle = "toggle",
		PageRef = "page_ref",
		Markdown = "markdown",
		Dropdown = "dropdown",
	}

	export namespace Type {
		export function ensureValid(T: Type): Type {
			if (Types.includes(T)) return T
			return Types[0]
		}

		export function toString(T: Type): string {
			return i18n.localize(`GURPS.Enum.cell.${T}`)
		}
	}
	export const Types: Type[] = [Type.Text, Type.Tags, Type.Toggle, Type.PageRef, Type.Markdown, Type.Dropdown]
}
