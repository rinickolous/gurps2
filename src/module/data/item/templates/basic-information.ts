import fields = foundry.data.fields
import { ExtendedStringField, StringArrayField } from "@data/fields/index.ts"
import { ItemTemplateType, Nameable, RegEx } from "@util"
import { ItemDataModel } from "../base.ts"

class BasicInformationTemplate extends ItemDataModel<BasicInformationSchema> {
	constructor(...args: any[]) {
		super(...args)
	}
	static override defineSchema(): BasicInformationSchema {
		return basicInformationSchema
	}

	/* -------------------------------------------- */

	hasTag(tag: string): boolean {
		return this.tags.includes(tag)
	}

	/* -------------------------------------------- */

	get combinedTags(): string {
		return this.tags.join(", ")
	}

	/* -------------------------------------------- */

	get processedName(): string {
		return this.nameWithReplacements
	}

	/* -------------------------------------------- */

	get processedNotes(): string {
		return RegEx.replace(RegEx.EvalEmbedded, this.notesWithReplacements, this.actor)
	}

	/* -------------------------------------------- */

	get enrichedDescription(): Promise<string> {
		let text = this.description
		text = RegEx.replace(RegEx.EvalEmbedded, text, this.actor)
		return TextEditor.enrichHTML(text, {
			// async: false,
		})
	}

	/* -------------------------------------------- */

	/** Replacements */
	get nameWithReplacements(): string {
		if (this.hasTemplate(ItemTemplateType.ReplacementHolder))
			return Nameable.apply(this.parent.name, this.replacements)
		return this.parent.name
	}

	/* -------------------------------------------- */

	get notesWithReplacements(): string {
		if (this.hasTemplate(ItemTemplateType.ReplacementHolder)) return Nameable.apply(this.notes, this.replacements)
		return this.notes
	}
}

const basicInformationSchema = {
	name: new ExtendedStringField({
		required: true,
		nullable: false,
		toggleable: true,
		replaceable: true,
		initial: "",
	}),
	description: new fields.HTMLField({ required: true, nullable: false, initial: "" }),
	notes: new ExtendedStringField({
		required: true,
		nullable: false,
		toggleable: true,
		replaceable: true,
		initial: "",
		label: "GURPS.Item.BasicInformation.FIELDS.Notes.Name",
	}),
	tags: new StringArrayField({
		required: true,
		nullable: false,
		initial: [],
		label: "GURPS.Item.BasicInformation.FIELDS.Tags.Name",
	}),
	vtt_notes: new ExtendedStringField({
		required: true,
		nullable: false,

		toggleable: true,
		initial: "",
	}),
	reference: new ExtendedStringField({
		required: true,
		nullable: false,
		toggleable: true,
		initial: "",
		label: "GURPS.Item.BasicInformation.FIELDS.Reference.Name",
	}),
	reference_highlight: new ExtendedStringField({
		required: true,
		nullable: false,

		toggleable: true,
		initial: "",
	}),
}

type BasicInformationSchema = typeof basicInformationSchema
export { BasicInformationTemplate, type BasicInformationSchema }
