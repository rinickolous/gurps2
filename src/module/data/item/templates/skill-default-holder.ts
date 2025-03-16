import fields = foundry.data.fields
import { SkillDefaultField } from "@data/fields/skill-default-field.ts"
import { SkillDefault } from "@data/skill-default.ts"
import { SystemDataModel } from "@data/abstract.ts"
import { BaseAction } from "@data/action/base-action.ts"

class SkillDefaultHolderTemplate extends SystemDataModel<SkillDefaultHolderSchema> {
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

	get item(): Item.Implementation | null {
		if (!this.parent) {
			console.error("SkillDefaultHolderTemplate.item | No parent")
			return null
		}
		if (this.parent instanceof CONFIG.Item.documentClass) return this.parent
		if (this.parent instanceof BaseAction) return this.parent.item
		return null
	}
}

type SkillDefaultHolderSchema = {
	defaults: fields.ArrayField<SkillDefaultField, SkillDefault, SkillDefault>
}

export { SkillDefaultHolderTemplate, type SkillDefaultHolderSchema }
