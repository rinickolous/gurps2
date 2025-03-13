import { ItemGURPS } from "./item.ts"
import { DocumentSystemFlags } from "./system-flags.ts"

import fields = foundry.data.fields
import { contents } from "@util"

class ItemSystemFlags extends DocumentSystemFlags<ItemSystemFlagsSchema, ItemGURPS> {
	static override defineSchema(): ItemSystemFlagsSchema {
		return {
			container: new fields.SchemaField({
				id: new fields.ForeignDocumentField(ItemGURPS, { idOnly: true }),
				contentType: new fields.StringField({ required: true, nullable: true, choice: contents.TypesChoices }),
			}),
		}
	}
}

type ItemSystemFlagsSchema = {}

export { ItemSystemFlags, type ItemSystemFlagsSchema }
