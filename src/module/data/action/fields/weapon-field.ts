import { ErrorGURPS, TooltipGURPS } from "@util"
import { BaseAttack } from "../base-attack.ts"
import { ItemGURPS } from "@documents/item.ts"

class WeaponField<
	Schema extends WeaponFieldSchema = WeaponFieldSchema,
	Parent extends BaseAttack = BaseAttack,
> extends foundry.abstract.DataModel<Schema, Parent> {
	get item(): ItemGURPS {
		return this.parent.item
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
