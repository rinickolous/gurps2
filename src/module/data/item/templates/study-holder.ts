import { ItemDataModel } from "../base.ts"
import fields = foundry.data.fields

class StudyHolderTemplate extends ItemDataModel<StudyHolderSchema> {}

type StudyHolderSchema = {
	study: fields.StringField<{ required: true; nullable: false }>
}

export { StudyHolderTemplate, type StudyHolderSchema }
