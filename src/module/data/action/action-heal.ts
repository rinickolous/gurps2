import { BaseAction, BaseActionSchema } from "./base-action.ts"

class ActionHeal extends BaseAction<ActionHealSchema> {
	static override defineSchema(): ActionHealSchema {
		return super.defineSchema()
	}
}

type ActionHealSchema = BaseActionSchema & {}

export { ActionHeal, type ActionHealSchema }
