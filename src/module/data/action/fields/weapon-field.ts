import { ErrorGURPS, TooltipGURPS } from "@util"
import { ItemGURPS } from "@documents/item.ts"
import { BaseAction } from "../base-action.ts"

class WeaponField<
	Schema extends WeaponFieldSchema = WeaponFieldSchema,
	Parent extends BaseAction = BaseAction,
> extends foundry.abstract.DataModel<Schema, Parent> {
	get item(): ItemGURPS | null {
		if (this.parent === null) return null
		return (this.parent as BaseAction).item
	}

	static fromString(_s: string): WeaponField {
		throw ErrorGURPS("Function #WeaponField.fromString must be implemented.")
	}

	override toString(..._args: unknown[]): string {
		throw ErrorGURPS("Function WeaponField#toString must be implemented.")
	}

	tooltip(_w: Parent): string {
		throw ErrorGURPS("Function WeaponField#tooltip must be implemented.")
	}

	resolve(_w: Parent, _tooltip: TooltipGURPS | null, ..._args: unknown[]): WeaponField {
		throw ErrorGURPS("Function WeaponField#resolve must be implemented.")
	}
}

type WeaponFieldSchema = {}

export { WeaponField, type WeaponFieldSchema }
