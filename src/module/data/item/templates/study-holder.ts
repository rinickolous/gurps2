import { Study } from "@data/study.ts"
import fields = foundry.data.fields
import { ItemDataModel } from "../base.ts"
import { ExtendedStringField } from "@data/fields/extended-string-field.ts"
import { study } from "@util"

class StudyHolderTemplate extends ItemDataModel<StudyHolderSchema> {
	constructor(...args: any[]) {
		super(...args)
	}

	/* -------------------------------------------- */

	static override defineSchema(): StudyHolderSchema {
		return studyHodlerSchema
	}

	/* -------------------------------------------- */

	get studyCurrent(): number {
		return Study.resolveHours(this)
	}

	/* -------------------------------------------- */

	get studyTotal(): number {
		return parseInt(this.studyHoursNeeded) ?? 0
	}
}

const studyHodlerSchema = {
	study: new fields.ArrayField(new fields.EmbeddedDataField(Study, { required: true, nullable: false })),
	studyHoursNeeded: new ExtendedStringField({
		required: true,
		nullable: false,
		default: 0,
		choices: study.LevelsChoices,
		initial: study.Level.Standard,
	}),
}

type StudyHolderSchema = typeof studyHodlerSchema

export { StudyHolderTemplate, type StudyHolderSchema }
