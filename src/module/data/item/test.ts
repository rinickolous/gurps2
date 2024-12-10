import { WeaponBulk } from "@data/action/fields/weapon-bulk.ts"
import { ItemDataModel } from "./base.ts"
import { ActionCollectionField } from "./fields/action-collection-field.ts"

class TestItem extends ItemDataModel<TestSchema> {
	static override defineSchema(): TestSchema {
		return {
			attributes: new CollectionField(WeaponBulk),
			actions: new ActionCollectionField(),
		}
	}

	testFunc() {}
}

type TestSchema = {
	attributes: CollectionField<typeof WeaponBulk>
	actions: ActionCollectionField
}

export { TestItem }
