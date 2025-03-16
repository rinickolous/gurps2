// import { DocumentSystemFlags } from "./system-flags.ts"
import { contents } from "@util"
import fields = foundry.data.fields
// class ItemSystemFlags extends DocumentSystemFlags<ItemSystemFlagsSchema, Item> {
// 	static override defineSchema(): ItemSystemFlagsSchema {
// 		return {}
// 	}
// }

class ItemSystemFlags extends foundry.abstract.DataModel<ItemSystemFlagsSchema, Item.Implementation> {
	static override defineSchema(): ItemSystemFlagsSchema {
		return itemSystemFlagsSchema
	}
}

const itemSystemFlagsSchema = {
	containerId: new fields.StringField({ required: true, nullable: true, initial: null }),
	containerRelationship: new fields.StringField({
		required: true,
		nullable: true,
		options: contents.TypesChoices,
		initial: null,
	}),
}

type ItemSystemFlagsSchema = typeof itemSystemFlagsSchema

export { ItemSystemFlags, type ItemSystemFlagsSchema }
