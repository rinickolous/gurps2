import { BaseAction, BaseActionSchema } from "./base-action.ts"
import fields = foundry.data.fields
import {
	ActionType,
	ActorType,
	ItemTemplateType,
	ItemType,
	StringBuilder,
	TooltipGURPS,
	encumbrance,
	feature,
	i18n,
	skillsel,
	wsel,
	wswitch,
} from "@util"
import { Nameable } from "@module/util/nameable.ts"
import { ItemDataTemplateClasses, ItemInstance, ItemTemplateInstance } from "@data/item/types.ts"
import { SkillDefault } from "@data/skill-default.ts"
import { ExtendedStringField } from "@data/fields/index.ts"
import { SkillDefaultField } from "@data/fields/skill-default-field.ts"
import { Feature } from "@data/feature/types.ts"
import { WeaponBonus } from "@data/feature/weapon-bonus.ts"
import { WeaponStrength } from "./fields/weapon-strength.ts"
import { WeaponDamage } from "./fields/weapon-damage.ts"

class BaseAttack<Schema extends BaseAttackSchema = BaseAttackSchema> extends BaseAction<Schema> {
	declare protected _weaponLevel: number

	static override defineSchema(): BaseAttackSchema {
		return {
			...super.defineSchema(),
			...baseAttackSchema,
		}
	}

	/* -------------------------------------------- */

	/**
	 * HACK: only used to ensure hasTemplate is true for SkillDefaultHolder for weapons
	 */
	override hasTemplate<T extends ItemTemplateType>(template: T): this is ItemDataTemplateClasses[T] {
		return template === ItemTemplateType.SkillDefaultHolder
	}

	/* -------------------------------------------- */

	get processedName(): string {
		// const container = this.item
		// if (!(container instanceof Promise) && container !== null) {
		// 	if (container.hasTemplate(ItemTemplateType.BasicInformation)) return container.system.nameWithReplacements
		// 	return container.name
		// }
		return this.usageWithReplacements
	}

	/* -------------------------------------------- */

	get processedNotes(): string {
		const buffer = new StringBuilder()
		const container = this.item
		if (!(container instanceof Promise) && container !== null) {
			if (container.hasTemplate(ItemTemplateType.BasicInformation)) buffer.push(container.system.processedNotes)
		}
		buffer.appendToNewLine(this.usageNotesWithReplacements)
		return buffer.toString()
	}

	/* -------------------------------------------- */

	get usesCrossbowSkill(): boolean {
		const replacements = this.replacements
		return (this as BaseAttack).defaults.some(def => def.nameWithReplacements(replacements) === "Crossbow")
	}

	/* -------------------------------------------- */

	get level(): number {
		return (this._weaponLevel ??= this.skillLevel(null))
	}

	/* -------------------------------------------- */

	skillLevel(this: BaseAttack, tooltip: TooltipGURPS | null): number {
		const actor = this.actor
		if (actor === null || !actor.isOfType(ActorType.Character)) return 0

		const primaryTooltip = tooltip !== null ? new TooltipGURPS() : null
		const adj =
			this.skillLevelBaseAdjustment(actor, primaryTooltip) + this.skillLevelPostAdjustment(actor, primaryTooltip)
		let best = Number.MIN_SAFE_INTEGER
		const replacements = this.replacements
		for (const def of this.defaults) {
			let level = def.skillLevelFast(actor, replacements, false, new Set(), true)
			if (level !== Number.MIN_SAFE_INTEGER) {
				level += adj
				if (best < level) best = level
			}
		}
		if (best === Number.MIN_SAFE_INTEGER) return 0
		tooltip?.appendToNewLine(primaryTooltip)
		if (best < 0) best = 0
		return best
	}

	/* -------------------------------------------- */

	skillLevelBaseAdjustment(this: BaseAttack, actor: this["actor"], tooltip: TooltipGURPS | null): number {
		if (actor === null || !actor.isOfType(ActorType.Character)) return 0

		const container = this.item
		if (container instanceof Promise || container === null) return 0
		const tags = container.hasTemplate(ItemTemplateType.BasicInformation) ? container.system.tags : []

		let adj = 0
		let minST = this.strength.resolve(this, null).min
		if (!this.isOfType(ActionType.AttackRanged) || (this.range.musclePowered && !this.usesCrossbowSkill)) {
			minST -= actor.strikingStrength
		} else {
			minST -= actor.liftingStrength
		}
		if (minST > 0) {
			adj -= minST
			if (tooltip !== null) {
				tooltip.push("\n")
				tooltip.push(
					i18n.format("GURPS.Tooltip.SkillLevelStrengthRequirement", {
						name: this.processedName,
						modifier: -minST,
					}),
				)
			}
		}
		const nameQualifier = this.processedName
		for (const bonus of actor.system.namedWeaponSkillBonusesFor(
			nameQualifier,
			this.usageWithReplacements,
			tags,
			false,
			tooltip,
		)) {
			adj += bonus.adjustedAmount
		}
		if (container.hasTemplate(ItemTemplateType.FeatureHolder)) {
			for (const f of container.system.features) {
				adj += this.extractSkillBonusForThisWeapon(f, tooltip)
			}
		}
		// if (container.isOfType(ItemType.Trait, ItemType.Equipment, ItemType.EquipmentContainer)) {
		if (container.isOfType(ItemType.Trait)) {
			for (const mod of container.system.allModifiers as Collection<ItemInstance<ItemType.TraitModifier>>) {
				for (const f of mod.system.features) {
					adj += this.extractSkillBonusForThisWeapon(f, tooltip)
				}
			}
		}
		return adj
	}

	/* -------------------------------------------- */

	skillLevelPostAdjustment(actor: this["actor"], tooltip: TooltipGURPS | null): number {
		if (actor === null || !actor.isOfType(ActorType.Character)) return 0

		const penalty = encumbrance.Level.penalty(actor.system.encumbranceLevel(true))
		if (penalty !== 0 && tooltip !== null) {
			tooltip.push("\n")
			tooltip.push(
				i18n.format("GURPS.Tooltip.EncumbrancePenalty", {
					modifier: penalty.signedString(),
				}),
			)
		}
		return penalty
	}

	/* -------------------------------------------- */

	extractSkillBonusForThisWeapon(f: Feature, tooltip: TooltipGURPS | null): number {
		if (f.isOfType(feature.Type.SkillBonus)) {
			if (f.selection_type === skillsel.Type.ThisWeapon) {
				if (f.specialization.matches(this.replacements, this.usageWithReplacements)) {
					f.addToTooltip(tooltip)
					return f.adjustedAmount
				}
			}
		}
		return 0
	}

	/* -------------------------------------------- */

	resolveBoolFlag(switchType: wswitch.Type, initial: boolean): boolean {
		const actor = this.actor
		if (actor === null) return initial

		let t = 0
		let f = 0
		for (const bonus of this.collectWeaponBonuses(1, null, feature.Type.WeaponSwitch)) {
			if (bonus.switch_type === switchType) {
				if (bonus.switch_type_value) t += 1
				else f += 1
			}
		}
		if (t > f) return true
		if (f > t) return false
		return initial
	}

	/* -------------------------------------------- */

	collectWeaponBonuses(
		this: BaseAttack,
		dieCount: number,
		tooltip: TooltipGURPS | null,
		...allowedFeatureTypes: feature.Type[]
	): WeaponBonus[] {
		const actor = this.actor
		if (actor === null || !actor.isOfType(ActorType.Character)) return []
		// HACK: to remove if this requires proper async support
		if (this.item === null || this.item instanceof Promise) return []
		const parent = this.item

		const allowed = new Set(allowedFeatureTypes)
		let bestDef: SkillDefault | null = null
		let best = Number.MIN_SAFE_INTEGER
		const replacements = this.replacements
		for (const one of this.defaults) {
			if (one.skillBased) {
				const level = one.skillLevelFast(actor, replacements, false, new Set(), true)
				if (level > best) {
					best = level
					bestDef = one
				}
			}
		}
		const bonusSet = new Set<WeaponBonus>()
		const tags = parent.hasTemplate(ItemTemplateType.BasicInformation) ? parent.system.tags : []
		let [name, specialization] = ["", ""]
		if (bestDef !== null) {
			name = bestDef.nameWithReplacements(replacements)
			specialization = bestDef.specializationWithReplacements(replacements)
		}
		actor.system.addWeaponWithSkillBonusesFor(
			name,
			specialization,
			this.usageWithReplacements,
			tags,
			dieCount,
			tooltip,
			bonusSet,
			allowed,
		)
		const nameQualifier = this.processedName
		actor.system.addNamedWeaponBonusesFor(
			nameQualifier,
			this.usageWithReplacements,
			tags,
			dieCount,
			tooltip,
			bonusSet,
			allowed,
		)
		if (parent.hasTemplate(ItemTemplateType.FeatureHolder)) {
			for (const f of parent.system.features) {
				this.extractWeaponBonus(f, bonusSet, allowed, dieCount, tooltip)
			}
		}
		if (parent.hasTemplate(ItemTemplateType.Container)) {
			// TODO: verify that this works for items inside of compendia
			// const modifiers = parent.system.allModifiers as Collection<
			// 	ItemTemplateInstance<ItemTemplateType.FeatureHolder>
			// >
			for (const mod of parent.modifiers) {
				for (const f of mod.system.features) {
					const bonus = f.clone()
					bonus.subOwner = mod
					this.extractWeaponBonus(bonus, bonusSet, allowed, dieCount, tooltip)
				}
			}
		}
		if (bonusSet.size === 0) return []
		return [...bonusSet]
	}

	/* -------------------------------------------- */

	extractWeaponBonus(
		f: Feature,
		set: Set<WeaponBonus>,
		allowedFeatureTypes: Set<feature.Type>,
		dieCount: number,
		tooltip: TooltipGURPS | null = null,
	): void {
		let tags: string[] = []
		if (
			this.item !== null &&
			!(this.item instanceof Promise) &&
			this.item.hasTemplate(ItemTemplateType.BasicInformation)
		)
			tags = this.item.system.tags

		if (allowedFeatureTypes.has(f.type)) {
			if (f.isOfType(...feature.WeaponBonusTypes)) {
				const savedLevel = f.featureLevel
				const savedDieCount = f.dieCount
				f.featureLevel = f.derivedLevel
				f.dieCount = dieCount
				const replacements = this.replacements

				switch (f.selection_type) {
					case wsel.Type.WithRequiredSkill:
						break
					case wsel.Type.ThisWeapon:
						{
							if (f.specialization.matches(replacements, this.usageWithReplacements)) {
								if (!set.has(f)) {
									set.add(f)
									f.addToTooltip(tooltip)
								}
							}
						}
						break
					case wsel.Type.WithName: {
						if (
							f.name.matches(replacements, this.processedName) &&
							f.specialization.matches(replacements, this.usageWithReplacements) &&
							f.tags.matchesList(replacements, ...tags)
						) {
							if (!set.has(f)) {
								set.add(f)
								f.addToTooltip(tooltip)
							}
						}
					}
				}
				f.featureLevel = savedLevel
				f.dieCount = savedDieCount
			}
		}
	}

	/* -------------------------------------------- */

	get replacements(): Map<string, string> {
		const container = this.item
		if (!(container instanceof Promise)) {
			if (container?.hasTemplate(ItemTemplateType.ReplacementHolder)) return container.system.replacements
		}
		return new Map<string, string>()
	}

	/* -------------------------------------------- */

	/** Nameables */
	fillWithNameableKeys(this: BaseAttack, m: Map<string, string>, existing: Map<string, string>): void {
		Nameable.extract(this.name, m, existing)
		Nameable.extract(this.notes, m, existing)

		this._fillWithNameableKeysFromDefaults(m, existing)
	}

	/* -------------------------------------------- */

	protected _fillWithNameableKeysFromDefaults(m: Map<string, string>, existing: Map<string, string>): void {
		for (const sd of this.defaults as SkillDefault[]) {
			sd.fillWithNameableKeys(m, existing)
		}
	}

	/* -------------------------------------------- */

	/** Replacements */
	get usageWithReplacements(): string {
		return Nameable.apply((this as BaseAttack).name, this.replacements)
	}

	/* -------------------------------------------- */

	get usageNotesWithReplacements(): string {
		return Nameable.apply((this as BaseAttack).notes, this.replacements)
	}

	/* -------------------------------------------- */

	override prepareBaseData(): void {
		super.prepareBaseData()
		const container = this.item
		if (!(container instanceof Promise) && container?.hasTemplate(ItemTemplateType.ReplacementHolder)) {
			container.system.prepareNameableKeys()
		}
	}
}

const baseAttackSchema = {
	notes: new ExtendedStringField({
		required: true,
		nullable: false,
		toggleable: true,
		replaceable: true,
		initial: "",
		label: "GURPS.Item.BasicInformation.FIELDS.Notes.Name",
	}),
	damage: new fields.EmbeddedDataField(WeaponDamage),
	strength: new fields.EmbeddedDataField(WeaponStrength),
	// Is the weapon currently unready?
	unready: new fields.BooleanField({ required: true, nullable: false, initial: false }),
	defaults: new fields.ArrayField(new SkillDefaultField()),
}

type BaseAttackSchema = BaseActionSchema & typeof baseAttackSchema

export { BaseAttack, type BaseAttackSchema }
