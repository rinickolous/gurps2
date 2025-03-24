import fields = foundry.data.fields
import { SkillDefaultField } from "@data/fields/skill-default-field.ts"
import { SystemDataModel } from "@data/abstract.ts"
import { BaseAction } from "@data/action/base-action.ts"

class SkillDefaultHolderTemplate extends SystemDataModel<SkillDefaultHolderSchema> {
	static override defineSchema(): SkillDefaultHolderSchema {
		return skillDefaultHolderSchema
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

const skillDefaultHolderSchema = {
	defaults: new fields.ArrayField(new SkillDefaultField()),
}

type SkillDefaultHolderSchema = typeof skillDefaultHolderSchema

export { SkillDefaultHolderTemplate, type SkillDefaultHolderSchema }
