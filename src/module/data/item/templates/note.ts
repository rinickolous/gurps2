import { ItemDataModel } from "../base.ts"
import fields = foundry.data.fields
import { RegEx } from "@util"

class NoteTemplate extends ItemDataModel<NoteTemplateSchema> {
	constructor(...args: any[]) {
		super(...args)
	}

	/*--------------------------------------------*/

	static override defineSchema(): NoteTemplateSchema {
		return noteTemplateSchema
	}

	/*--------------------------------------------*/

	get enrichedText(): Promise<string> {
		let text = this.text
		text = RegEx.replace(RegEx.EvalEmbedded, text, this.actor)
		return TextEditor.enrichHTML(text)
	}
}

/*--------------------------------------------*/

const noteTemplateSchema = {
	text: new fields.HTMLField({ required: true, nullable: false, default: "", sanitize: true }),
}

type NoteTemplateSchema = typeof noteTemplateSchema

/*--------------------------------------------*/

export { NoteTemplate, type NoteTemplateSchema }
