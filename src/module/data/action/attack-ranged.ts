import { ActionType, i18n, TooltipGURPS } from "@util"
import fields = foundry.data.fields
import { BaseAttack, BaseAttackSchema } from "./base-attack.ts"
import { WeaponAccuracy } from "./fields/weapon-accuracy.ts"
import { WeaponBulk } from "./fields/weapon-bulk.ts"
import { WeaponRange } from "./fields/weapon-range.ts"
import { WeaponRecoil } from "./fields/weapon-recoil.ts"
import { WeaponROF } from "./fields/weapon-rof.ts"
import { WeaponShots } from "./fields/weapon-shots.ts"
import { ActionMetadata } from "./base-action.ts"
import { CellData, CellDataOptions } from "@data/cell-data.ts"

class AttackRanged extends BaseAttack<AttackRangedSchema> {
	static override metadata: ActionMetadata = Object.freeze({
		...super.metadata,
		type: ActionType.AttackMelee,
		title: "GURPS.Action.AttackRanged.Title",
	})

	/* -------------------------------------------- */

	override async getSheetData(context: Record<string, unknown>): Promise<void> {
		context.detailsParts = ["gurps.details-attack-ranged"]
	}

	/* -------------------------------------------- */

	static override defineSchema(): AttackRangedSchema {
		return {
			...super.defineSchema(),
			...attackRangedSchema
		}
	}

	/* -------------------------------------------- */

	override cellData(this: AttackRanged, _options: CellDataOptions = {}): Record<string, CellData> {
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
		const damage = this.damage.resolvedValue(buffer)
		const damageTooltip = addBuffer("", buffer)

		buffer.clear()
		const accuracy = this.accuracy.resolve(this, buffer)
		const accuracyTooltip = addBuffer(accuracy.tooltip(this), buffer)

		buffer.clear()
		const range = this.range.resolve(this, buffer)
		const rangeTooltip = addBuffer(range.tooltip(this), buffer)

		buffer.clear()
		const rateOfFire = this.rate_of_fire.resolve(this, buffer)
		const rateOfFireTooltip = addBuffer(rateOfFire.tooltip(this), buffer)

		buffer.clear()
		const shots = this.shots.resolve(this, buffer)
		const shotsTooltip = addBuffer(shots.tooltip(this), buffer)

		buffer.clear()
		const bulk = this.bulk.resolve(this, buffer)
		const bulkTooltip = addBuffer(bulk.tooltip(this), buffer)

		buffer.clear()
		const recoil = this.recoil.resolve(this, buffer)
		const recoilTooltip = addBuffer(recoil.tooltip(this), buffer)

		buffer.clear()
		const strength = this.strength.resolve(this, buffer)
		const strengthTooltip = addBuffer(strength.tooltip(this), buffer)

		const data: Record<string, CellData> = {
			name: new CellData({
				primary: this.processedName,
				secondary: this.processedNotes,
				classList: ["item-name"],
			}),
			usage: new CellData({
				primary: this.usageWithReplacements,
				classList: ["item-usage"],
			}),
			level: new CellData({ primary: level, tooltip: levelTooltip, classList: ["item-skill-level"] }),
			damage: new CellData({ primary: damage.toString(), tooltip: damageTooltip, classList: ["item-damage"] }),
			accuracy: new CellData({
				primary: accuracy.toString(),
				tooltip: accuracyTooltip,
				classList: ["item-accuracy"],
			}),
			// TODO: revise
			range: new CellData({ primary: range.toString(true), tooltip: rangeTooltip, classList: ["item-range"] }),
			rateOfFire: new CellData({
				primary: rateOfFire.toString(),
				tooltip: rateOfFireTooltip,
				classList: ["item-rof"],
			}),
			shots: new CellData({ primary: shots.toString(), tooltip: shotsTooltip, classList: ["item-shots"] }),
			bulk: new CellData({
				primary: bulk.toString(),
				tooltip: bulkTooltip,
				classList: ["item-bulk"],
			}),
			recoil: new CellData({
				primary: recoil.toString(),
				tooltip: recoilTooltip,
				classList: ["item-recoil"],
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

const attackRangedSchema = {
	accuracy: new fields.EmbeddedDataField(WeaponAccuracy),
	range: new fields.EmbeddedDataField(WeaponRange),
	rate_of_fire: new fields.EmbeddedDataField(WeaponROF),
	shots: new fields.EmbeddedDataField(WeaponShots),
	bulk: new fields.EmbeddedDataField(WeaponBulk),
	recoil: new fields.EmbeddedDataField(WeaponRecoil),
}

type AttackRangedSchema = BaseAttackSchema & typeof attackRangedSchema

export { AttackRanged, type AttackRangedSchema }
