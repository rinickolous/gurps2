import { ItemDataModel } from "../base.ts"
import fields = foundry.data.fields
import { SkillDefaultField } from "@data/fields/skill-default-field.ts"
import { SkillDefault } from "@data/skill-default.ts"

class SkillDefaultHolderTemplate extends ItemDataModel<SkillDefaultHolderSchema> {
	static override defineSchema(): SkillDefaultHolderSchema {
		const fields = foundry.data.fields
		return {
			defaults: new fields.ArrayField(new SkillDefaultField()),
		}
	}

	/** Namebales */
	protected _fillWithNameableKeysFromDefaults(m: Map<string, string>, existing: Map<string, string>): void {
		for (const sd of this.defaults) {
			sd.fillWithNameableKeys(m, existing)
		}
	}
}

type SkillDefaultHolderSchema = {
	defaults: fields.ArrayField<SkillDefaultField, SkillDefault, SkillDefault>
}

export { SkillDefaultHolderTemplate, type SkillDefaultHolderSchema }
