import { GID } from "@util"
import { ActorDataModel } from "./base.ts"
import { AttributeHolderTemplate, SettingsHolderTemplate } from "./templates/index.ts"
import { CharacterBonuses } from "./fields/character-bonuses.ts"

// @ts-expect-error TODO: fix later
class CharacterData extends ActorDataModel.mixin(SettingsHolderTemplate, AttributeHolderTemplate) {
	bonuses: CharacterBonuses = new CharacterBonuses()

	/* -------------------------------------------- */

	override prepareDerivedData(): void {
		super.prepareDerivedData()
	}

	/* -------------------------------------------- */
	/*  Getters                                     */
	/* -------------------------------------------- */

	get strikingStrength(): number {
		let st = 0
		if (this.resolveAttribute(GID.StrikingStrength) !== null) {
			st = this.resolveAttributeCurrent(GID.StrikingStrength)
		} else {
			st = Math.max(this.resolveAttributeCurrent(GID.Strength))
		}
		st += this.bonuses.strikingStrength
		return Math.trunc(st)
	}

	/* -------------------------------------------- */

	get liftingStrength(): number {
		let st = 0
		if (this.resolveAttribute(GID.LiftingStrength) !== null) {
			st = this.resolveAttributeCurrent(GID.LiftingStrength)
		} else {
			st = Math.max(this.resolveAttributeCurrent(GID.Strength))
		}
		st += this.bonuses.liftingStrength
		return Math.trunc(st)
	}

	/* -------------------------------------------- */

	get throwingStrength(): number {
		let st = 0
		if (this.resolveAttribute(GID.ThrowingStrength) !== null) {
			st = this.resolveAttributeCurrent(GID.ThrowingStrength)
		} else {
			st = Math.max(this.resolveAttributeCurrent(GID.Strength))
		}
		st += this.bonuses.throwingStrength
		return Math.trunc(st)
	}
}

export { CharacterData }
