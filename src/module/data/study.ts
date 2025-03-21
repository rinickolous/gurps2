import { i18n, study } from "@util"
import fields = foundry.data.fields
import { StudyHolderTemplate } from "./item/templates/study-holder.ts"

class Study extends foundry.abstract.DataModel<StudySchema, StudyHolderTemplate> {
	static override defineSchema(): StudySchema {
		return studySchema
	}

	/* -------------------------------------------- */

	static progressText(hours: number, needed: study.Level, force: boolean): string {
		if (hours <= 0) {
			hours = 0
			if (!force) return ""
		}
		return i18n.format("GURPS.Study.Studied.Alt", {
			hours,
			total: needed,
		})
	}

	/* -------------------------------------------- */

	static resolveHours<Parent extends Study["parent"]>(parent: Parent): number {
		let total = 0
		for (const entry of parent.study) {
			total += entry.hours * study.Type.multiplier(entry.type)
		}
		return total
	}

	/* -------------------------------------------- */

	get item(): Item.Implementation {
		return this.parent.parent
	}

	/* -------------------------------------------- */

	get index(): number {
		return this.parent.study.indexOf(this)
	}

	/* -------------------------------------------- */

	get element(): Handlebars.SafeString {
		// TODO: constrain
		const enabled: boolean = (this.item.sheet as any).editable
		return new Handlebars.SafeString(this.toFormElement(enabled).outerHTML)
	}

	/* -------------------------------------------- */

	// TODO: implement
	toFormElement(enabled: boolean): HTMLElement {
		return new HTMLElement()
	}
}

const studySchema = {
	type: new fields.StringField({ required: true, nullable: false, choices: study.TypesChoices }),
	hours: new fields.NumberField({ required: true, nullable: false, integer: true, min: 0, initial: 0 }),
	note: new fields.StringField({ required: true, nullable: false, initial: "" }),
}

type StudySchema = typeof studySchema

export { Study }
