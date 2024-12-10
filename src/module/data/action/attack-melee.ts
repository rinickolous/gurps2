import fields = foundry.data.fields
import { WeaponBlock } from "./fields/weapon-block.ts"
import { WeaponParry } from "./fields/weapon-parry.ts"
import { WeaponReach } from "./fields/weapon-reach.ts"
import { BaseAttack, BaseAttackSchema } from "./base-attack.ts"
import { ActionMetadata } from "./base-action.ts"
import { CellData, CellDataOptions } from "@data/cell-data.ts"
import { ActionType, i18n, ItemTypes, TooltipGURPS } from "@util"

class AttackMelee extends BaseAttack<AttackMeleeSchema> {
	static override metadata: ActionMetadata = Object.freeze({
		...super.metadata,
		type: ActionType.AttackMelee,
		title: "GURPS.Action.AttackMelee.Title",
	})

	/* -------------------------------------------- */

	override async getSheetData(context: Record<string, unknown>): Promise<void> {
		context.detailsParts = ["gurps.details-attack-melee"]
	}

	/* -------------------------------------------- */

	static override defineSchema(): AttackMeleeSchema {
		const fields = foundry.data.fields

		return {
			...super.defineSchema(),
			reach: new fields.EmbeddedDataField(WeaponReach),
			parry: new fields.EmbeddedDataField(WeaponParry),
			block: new fields.EmbeddedDataField(WeaponBlock),
		}
	}

	/* -------------------------------------------- */

	override cellData(options: CellDataOptions = {}): Record<string, CellData> {
		const { type } = options
		const isItemSheet = !!type && ItemTypes.includes(type as any)

		function addBuffer(tooltip: string, buffer: TooltipGURPS): string {
			if (tooltip.length !== 0) {
				tooltip += "\n\n"
			}
			tooltip += i18n.localize("GURPS.Tooltip.IncludesModifiersFrom") + ":"
			tooltip += buffer.toString()
			return tooltip
		}

		const buffer = new TooltipGURPS()
		const level = this.skillLevel(buffer).toString()
		const levelTooltip = addBuffer("", buffer)

		buffer.clear()
		const parry = this.parry.resolve(this, buffer)
		const parryTooltip = addBuffer(parry.tooltip(this), buffer)

		buffer.clear()
		const block = this.block.resolve(this, buffer)
		const blockTooltip = addBuffer("", buffer)

		buffer.clear()
		const damage = this.damage.resolvedValue(buffer)
		const damageTooltip = addBuffer("", buffer)

		buffer.clear()
		const reach = this.reach.resolve(this, buffer)
		const reachTooltip = addBuffer(reach.tooltip(this), buffer)

		buffer.clear()
		const strength = this.strength.resolve(this, buffer)
		const strengthTooltip = addBuffer(strength.tooltip(this), buffer)

		const data: Record<string, CellData> = {
			name: new CellData({
				primary: this.processedName,
				secondary: this.processedNotes,
				classList: ["item-name"],
				condition: !isItemSheet,
			}),
			usage: new CellData({
				primary: this.usageWithReplacements,
				classList: ["item-usage"],
			}),
			level: new CellData({ primary: level, tooltip: levelTooltip, classList: ["item-skill-level"] }),
			damage: new CellData({
				primary: damage.toString(),
				tooltip: damageTooltip,

				classList: ["item-damage"],
			}),
			parry: new CellData({
				primary: parry.toString(),
				tooltip: parryTooltip,

				classList: ["item-parry"],
			}),
			block: new CellData({ primary: block.toString(), tooltip: blockTooltip, classList: ["item-block"] }),
			reach: new CellData({
				primary: reach.toString(),
				tooltip: reachTooltip,

				classList: ["item-reach"],
			}),
			strength: new CellData({
				primary: strength.toString(),
				tooltip: strengthTooltip,
				classList: ["item-strength"],
			}),
		}

		return data
	}
}

type AttackMeleeSchema = BaseAttackSchema & {
	reach: fields.EmbeddedDataField<typeof WeaponReach, { required: true; nullable: false }>
	parry: fields.EmbeddedDataField<typeof WeaponParry, { required: true; nullable: false }>
	block: fields.EmbeddedDataField<typeof WeaponBlock, { required: true; nullable: false }>
}

export { AttackMelee, type AttackMeleeSchema }
