import { StringCriteria, StringCriteriaSchema } from "./string-criteria.ts"
import { ReplaceableStringField } from "@module/data/fields/replaceable-string-field.ts"

class ReplaceableStringCriteria extends StringCriteria {

	static override defineSchema(): StringCriteriaSchema {
		return {
			...super.defineSchema(),
			...replaceableStringCriteriaSchema
		}
	}
}

const replaceableStringCriteriaSchema = {
	qualifier: new ReplaceableStringField({ required: true, nullable: false }),
}

// type ReplaceableStringCriteriaSchema = Omit<StringCriteriaSchema,"qualifier"> & typeof replaceableStringCriteriaSchema


export { ReplaceableStringCriteria }
