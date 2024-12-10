import { ItemDataModel } from "../base.ts"
import fields = foundry.data.fields
import { ItemGURPS } from "@documents"
import { ReplaceableStringField, StringArrayField, ToggleableStringField } from "@data/fields/index.ts"
import { ItemTemplateType, Nameable, RegEx } from "@util"

class BasicInformationTemplate extends ItemDataModel<BasicInformationSchema> {
	static override defineSchema(): BasicInformationSchema {
		const fields = foundry.data.fields
		return {
			//@ts-expect-error weird type issue
			container: new fields.ForeignDocumentField(ItemGURPS, { idOnly: true }),
			name: new ReplaceableStringField({ required: true, nullable: false, initial: "" }),
			description: new fields.HTMLField({ required: true, nullable: false, initial: "" }),
			notes: new ReplaceableStringField({
				required: true,
				nullable: false,
				initial: "",
				label: "GURPS.Item.BasicInformation.FIELDS.Notes.Name",
			}),
			tags: new StringArrayField({
				required: true,
				nullable: false,
				initial: [],
				label: "GURPS.Item.BasicInformation.FIELDS.Tags.Name",
			}),
			vtt_notes: new ToggleableStringField({ required: true, nullable: false, initial: "" }),
			reference: new ToggleableStringField({
				required: true,
				nullable: false,
				initial: "",
				label: "GURPS.Item.BasicInformation.FIELDS.Reference.Name",
			}),
			reference_highlight: new ToggleableStringField({ required: true, nullable: false, initial: "" }),
		}
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

type BasicInformationSchema = {
	name: ReplaceableStringField<{ required: true; nullable: false; initial: "" }>
	description: fields.HTMLField<{ required: true; nullable: false; initial: "" }>
	notes: ReplaceableStringField<{
		required: true
		nullable: false
		initial: ""
		label: "GURPS.Item.BasicInformation.FIELDS.Notes.Name"
	}>
	tags: StringArrayField<{
		required: true
		nullable: false
		initial: []
		label: "GURPS.Item.BasicInformation.FIELDS.Tags.Name"
	}>
	vtt_notes: ToggleableStringField<{ required: true; nullable: false; initial: "" }>
	reference: ToggleableStringField<{
		required: true
		nullable: false
		initial: ""
		label: "GURPS.Item.BasicInformation.FIELDS.Reference.Name"
	}>
	keference_highlight: ToggleableStringField<{ required: true; nullable: false; initial: "" }>
}
export { BasicInformationTemplate, type BasicInformationSchema }
