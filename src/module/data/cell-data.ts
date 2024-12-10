import { ActionType, align, cell, ItemType } from "@util"
import fields = foundry.data.fields
import { SystemDataModel } from "./abstract.ts"
import { SheetButton } from "./sheet-button.ts"

type CellDataOptions = {
	type?: string | ItemType
	level?: number
}

type ItemCell = {
	name: string
	id: string
	sort: number
	uuid: string
	type: ItemType | ActionType
	cells: Record<string, CellData>
	buttons: SheetButton[]
	children?: ItemCell[]
}

class CellData extends foundry.abstract.DataModel<CellDataSchema, SystemDataModel> {
	static override defineSchema(): CellDataSchema {
		const fields = foundry.data.fields
		return {
			// The type of cell determines several display values
			type: new fields.StringField({
				required: true,
				nullable: false,
				choices: cell.Types,
				initial: cell.Type.Text,
			}),
			// Determines whether the cell is struck through
			disabled: new fields.BooleanField({ required: true, nullable: true, initial: null }),
			// Determiens whether the cell is dimmed out
			dim: new fields.BooleanField({ required: true, nullable: true, initial: null }),
			// [Type.Toggle Only] deterines if cell is checked
			checked: new fields.BooleanField({ required: true, nullable: true, initial: null }),
			// Alignemnt [Start|Middle|End|Fill]
			alignment: new fields.StringField({
				required: true,
				nullable: false,
				choices: align.Options,
				initial: align.Option.Start,
			}),
			// Primary Text displayed prominently
			primary: new fields.StringField({ required: true, nullable: true, initial: null }),
			// Secondary Text displayed as notes
			secondary: new fields.StringField({ required: true, nullable: true, initial: null }),
			// Text displayed in tooltip
			tooltip: new fields.StringField({ required: true, nullable: true, initial: null }),
			// Unsatisfied reason displayed as tag
			unsatisfiedReason: new fields.StringField({ required: true, nullable: true, initial: null }),
			// [Template Picker fields only]: template info displayed as tag
			templateInfo: new fields.StringField({ required: true, nullable: true, initial: null }),
			// Tag displayed inline with primary text (e.g. Trait Container type)
			inlineTag: new fields.StringField({ required: true, nullable: true, initial: null }),
			// Classes to add to field
			classList: new fields.ArrayField(
				new fields.StringField({ required: true, nullable: false, blank: false }),
				{ required: true, nullable: false, initial: [] },
			),
			// Condition which determines whether the cell should be displayed
			condition: new fields.BooleanField({ required: true, nullable: false, initial: true }),
			// [Dropdown fields only]: template info displayed as tag
			open: new fields.BooleanField({ required: true, nullable: true, initial: null }),
			indentLevel: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
		}
	}

	get element(): Handlebars.SafeString {
		return new Handlebars.SafeString(this.toFormElement()?.outerHTML ?? "")
	}

	toFormElement(): HTMLElement | null {
		if (!this.condition) return null
		const element = document.createElement(this._getElementType())
		this._getFormValuesForType(element)
		element.style.setProperty("justify-content", this._getAlignment())
		element.style.setProperty("padding-left", this._getIndent())
		element.classList.add("item-detail", ...this.classList)
		return element
	}

	private _getElementType(): string {
		switch (this.type) {
			case cell.Type.Toggle:
			case cell.Type.Dropdown:
				return "a"
			default:
				return "div"
		}
	}

	private _getIndent(): string {
		return `${this.indentLevel + 0.3}rem`
	}

	private _getAlignment(): string {
		switch (this.alignment) {
			case align.Option.Start:
				return "flex-start"
			case align.Option.Middle:
				return "flex-middle"
			case align.Option.End:
				return "flex-end"
			case align.Option.Fill:
				return "flex-stretch"
			default:
				return "flex-stretch"
		}
	}

	private _getFormValuesForType(element: HTMLElement): void {
		switch (this.type) {
			case cell.Type.Dropdown: {
				element.classList.add("fa-solid", this.open ? "fa-caret-down" : "fa-caret-right")
				element.dataset.action = "toggleDropdown"
				return
			}
			case cell.Type.Toggle: {
				element.classList.add("fa-solid", "fa-check")
				if (this.checked) element.classList.add("enabled")
				element.dataset.action = "toggleCheckbox"
				return
			}
			case cell.Type.Text:
				const nameElement = document.createElement("div")
				nameElement.classList.add("name")
				nameElement.innerHTML = this.primary ?? ""

				if (this.secondary !== null) {
					const notesElement = document.createElement("div")
					notesElement.classList.add("item-notes")
					notesElement.innerHTML = this.secondary
					nameElement.append(notesElement)
				}

				element.append(nameElement)

				return
			case cell.Type.Tags: {
				element.innerHTML = this.primary ?? ""
				return
			}
			case cell.Type.PageRef: {
				element.innerHTML = this.primary ?? ""
				return
			}
		}
	}
}

type CellDataSchema = {
	type: fields.StringField<{ required: true; nullable: false }, cell.Type>
	disabled: fields.BooleanField<{ required: true; nullable: true }, boolean>
	dim: fields.BooleanField<{ required: true; nullable: true }, boolean>
	checked: fields.BooleanField<{ required: true; nullable: true }, boolean>
	alignment: fields.StringField<{ required: true; nullable: false }, align.Option>
	primary: fields.StringField<{ required: true; nullable: true }, string>
	secondary: fields.StringField<{ required: true; nullable: true }, string>
	tooltip: fields.StringField<{ required: true; nullable: true }, string>
	unsatisfiedReason: fields.StringField<{ required: true; nullable: true }, string>
	templateInfo: fields.StringField<{ required: true; nullable: true }, string>
	inlineTag: fields.StringField<{ required: true; nullable: true }, string>
	classList: fields.ArrayField<
		fields.StringField<{ required: true; nullable: false }, string>,
		string,
		string,
		{ required: true; nullable: false }
	>
	condition: fields.BooleanField<{ required: true; nullable: false }, boolean>
	open: fields.BooleanField<{ required: true; nullable: true }, boolean>
	indentLevel: fields.NumberField<{ required: true; nullable: false }, number>
}

export { CellData, type CellDataOptions, type ItemCell }
