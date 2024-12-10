import { ItemGURPS } from "./item.ts"
import { DocumentSystemFlags } from "./system-flags.ts"

class ItemSystemFlags extends DocumentSystemFlags<ItemSystemFlagsSchema, ItemGURPS> {
	static override defineSchema(): ItemSystemFlagsSchema {
		return {}
	}
}

type ItemSystemFlagsSchema = {}

export { ItemSystemFlags, type ItemSystemFlagsSchema }
