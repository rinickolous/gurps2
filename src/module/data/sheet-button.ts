import fields = foundry.data.fields
import { ItemDataModel } from "./item/base.ts"

class SheetButton extends foundry.abstract.DataModel<SheetButtonSchema, ItemDataModel> {
	static override defineSchema(): SheetButtonSchema {
		const fields = foundry.data.fields

		return {
			tag: new fields.StringField({ required: true, nullable: false, initial: "a" }),
			classList: new fields.ArrayField(new fields.StringField({ required: true, nullable: false, initial: "" }), {
				required: true,
				nullable: false,
			}),
			name: new fields.StringField({ required: true, nullable: true, initial: null }),
			action: new fields.StringField({ required: true, nullable: false, initial: "" }),
			dataset: new fields.ObjectField({ required: true, nullable: false }),
			permission: new fields.NumberField({
				required: true,
				nullable: false,
				choices: Object.values(foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS),
				initial: foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE,
			}),
		}
	}

	get element(): Handlebars.SafeString {
		return new Handlebars.SafeString(this.toFormElement()?.outerHTML ?? "")
	}

	get document(): foundry.abstract.Document.Any | null {
		return this.parent.parent
	}

	toFormElement(): HTMLElement {
		const element = document.createElement(this.tag)

		if (this.permission !== foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE) {
			if (!this.document?.testUserPermission(game.user!, this.permission)) element.setAttribute("disabled", "")
		}

		element.classList.add(...this.classList)
		if (this.name) element.innerHTML = this.name
		Object.entries(this.dataset).forEach(([key, value]) => {
			element.dataset[key] = value as string
		})
		element.dataset.action = this.action
		return element
	}
}

type SheetButtonSchema = {
	tag: fields.StringField<{ required: true; nullable: false }, string>
	classList: fields.ArrayField<
		fields.StringField<{ required: true; nullable: false }, string>,
		string,
		string,
		{ required: true; nullable: false }
	>
	name: fields.StringField<{ required: true; nullable: true }, string>
	action: fields.StringField<{ required: true; nullable: false }, string>
	dataset: fields.ObjectField<{ required: true; nullable: false }, Record<string, string>>
	// dataset: RecordField<
	// 	fields.StringField<{ required: true; nullable: false }, string>,
	// 	fields.StringField<{ required: true; nullable: false }, string>,
	// 	true,
	// 	false,
	// 	true
	// >
	permission: fields.DataField<{ required: true; nullable: false }, foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS>
}

export { SheetButton, type SheetButtonSchema }
