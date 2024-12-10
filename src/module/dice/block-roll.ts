import { ItemGURPS } from "@documents/item.ts"
import { SuccessRoll, SuccessRollOptions } from "./success-roll.ts"
import { ActionType, ItemTemplateType } from "@util"

class BlockRoll extends SuccessRoll {
	protected override _getTargetFromItem(options: SuccessRollOptions): number {
		if (!options.item || !options.action) return 0
		if (!options.action) return 0
		const item = fromUuid(options.item.uuid)
		if (!(item instanceof ItemGURPS)) return 0
		if (!item.hasTemplate(ItemTemplateType.ActionHolder)) return 0

		const action = item.system.actions?.get(options.action.id) ?? null
		if (action === null) return 0
		if (!action.isOfType(ActionType.AttackMelee)) return 0

		return action.block.resolve(action, null).modifier
	}
}

export { BlockRoll }
