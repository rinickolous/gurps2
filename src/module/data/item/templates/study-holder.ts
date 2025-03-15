import fields = foundry.data.fields
import { SystemDataModel } from "@data/abstract.ts"

class StudyHolderTemplate extends SystemDataModel<StudyHolderSchema> {
	constructor(...args: any[]) {
		super(...args)
	}
}

type StudyHolderSchema = {
	study: fields.StringField<{ required: true; nullable: false }>
}

export { StudyHolderTemplate, type StudyHolderSchema }
