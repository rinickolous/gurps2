import { SystemDataModel, SystemDataModelMetadata } from "@data/abstract.ts"
import { ActorSystemFlags } from "@documents/actor-system-flags.ts"
import { ActorGURPS } from "@documents/actor.ts"
import { ActorTemplateType, ActorType, equalFold, ErrorGURPS, feature, GID, ItemType, movelimit, Nameable, skillsel, stlimit, TooltipGURPS } from "@util"
import { ActorDataModelClasses, ActorDataTemplateClasses } from "./types.ts"
import { FeatureSet } from "@data/feature/types.ts"
import { CharacterSettings } from "./fields/character-settings.ts"
import { ItemInstance } from "@data/item/types.ts"
import { ItemGURPS } from "@documents"

type ActorDataModelMetadata = SystemDataModelMetadata<ActorSystemFlags>

class ActorDataModel<Schema extends ActorDataSchema = ActorDataSchema> extends SystemDataModel<Schema, ActorGURPS> {
	variableResolverExclusions = new Set<string>()

	/* -------------------------------------------- */

	declare features: FeatureSet

	/* -------------------------------------------- */

	cachedVariables = new Map<string, string>()

	/* -------------------------------------------- */

	static override metadata: ActorDataModelMetadata = Object.freeze(
		foundry.utils.mergeObject(
			super.metadata,
			{ systemFlagsModel: ActorSystemFlags },
			{ inplace: false },
		) as ActorDataModelMetadata,
	)

	override get metadata(): ActorDataModelMetadata {
		return this.constructor.metadata
	}

	/* -------------------------------------------- */

	/**
	 * Type safe way of verifying if an Actor is of a particular type.
	 */
	isOfType<T extends ActorType>(...types: T[]): this is ActorDataModelClasses[T] {
		return types.some(t => this.parent.type === (t as string))
	}

	/* -------------------------------------------- */

	/**
	 * Type safe way of verifying if an Actor contains a template
	 */
	hasTemplate<T extends ActorTemplateType>(template: T): this is ActorDataTemplateClasses[T] {
		return this.constructor._schemaTemplates.some(t => t.name === template)
	}

	/* -------------------------------------------- */

	resolveVariable(_variableName: string): string {
		throw ErrorGURPS(`ActorDataModel.resolveVariable must be implemented.`)
	}

	/* -------------------------------------------- */

	_prepareEmbeddedDocuments(): void { }

	/* -------------------------------------------- */


	/**
	 * @param attributeId - ID of attribute
	 * @param limitation - Strength attribute limitation
	 * @param tooltip - Tooltip to append bonus annotation to
	 * @param temporary - Is this feature provided by a temporary active effect?
	 * @returns Total bonus value
	 */
	attributeBonusFor(
		attributeId: string,
		limitation: stlimit.Option = stlimit.Option.None,
		tooltip: TooltipGURPS | null = null,
		temporary: boolean | null = null,
	): number {
		let total = 0
		for (const bonus of this.features.attributeBonuses) {
			if (
				bonus.actualLimitation === limitation &&
				bonus.attribute === attributeId &&
				(temporary === null || bonus.temporary === temporary)
			) {
				total += bonus.adjustedAmount
				bonus.addToTooltip(tooltip)
			}
		}
		return total
	}

	/* -------------------------------------------- */

	/**
	 * @param moveTypeId - ID of move type
	 * @param limitation - Strength attribute limitation
	 * @param tooltip - Tooltip to append bonus annotation to
	 * @param temporary - Is this feature provided by a temporary active effect?
	 * @returns Total bonus value
	 */
	moveBonusFor(
		moveTypeId: string,
		limitation: movelimit.Option,
		tooltip: TooltipGURPS | null = null,
		temporary: boolean | null = null,
	): number {
		let total = 0
		for (const bonus of this.features.moveBonuses) {
			if (
				bonus.limitation === limitation &&
				bonus.move_type === moveTypeId &&
				(temporary === null || bonus.temporary === temporary)
			) {
				total += bonus.adjustedAmount
				bonus.addToTooltip(tooltip)
			}
		}
		return total
	}

	/* -------------------------------------------- */

	/**
	 * @param attributeId - ID of attribute
	 * @param temporary - Is this feature provided by a temporary active effect?
	 * @returns Total bonus value
	 */
	costReductionFor(attributeId: string, temporary: boolean | null = null): number {
		let total = 0
		for (const bonus of this.features.costReductions) {
			if (bonus.attribute === attributeId && (temporary === null || bonus.temporary === temporary)) {
				total += bonus.adjustedAmount
			}
		}
		return total
	}

	/* -------------------------------------------- */

	/**
	 * @param locationId - ID of location
	 * @param tooltip - Tooltip to append to
	 * @param drMap - Existing DR map
	 * @param temporary - Is this bonus provided by a temporary active effect?
	 */
	addDRBonusesFor(
		locationId: string,
		tooltip: TooltipGURPS | null,
		drMap: Map<string, number> = new Map(),
		temporary: boolean | null = null,
	): Map<string, number> {
		let isTopLevel = false
		for (const location of CharacterSettings.for(this.parent).body_type.locations) {
			if (location.id === locationId) {
				isTopLevel = true
				break
			}
		}
		for (const bonus of this.features.drBonuses) {
			for (const location of bonus.locations) {
				if (
					((location === GID.All && isTopLevel) || equalFold(location, locationId)) &&
					(temporary === null || bonus.temporary === temporary)
				) {
					const spec = bonus.specialization.toLowerCase()
					drMap.set(spec, (drMap.get(spec) ?? 0) + bonus.adjustedAmount)
					bonus.addToTooltip(tooltip)
					break
				}
			}
		}
		return drMap
	}

	/* -------------------------------------------- */

	/**
	 * @param name - Name of skill/technique
	 * @param specialization - Specialization of skill/technique. Can be blank
	 * @param tags - Tags of skill/technique.
	 * @param tooltip - Reference to tooltip to which bonuses are appended
	 * @param temporary - Is this feature provided by a temporary active effect?
	 * @returns Total skill level bonus for the provided Skill(s).
	 */
	skillBonusFor(
		name: string,
		specialization: string,
		tags: string[],
		tooltip: TooltipGURPS | null = null,
		temporary: boolean | null = null,
	): number {
		let total = 0
		for (const bonus of this.features.skillBonuses) {
			if (bonus.selection_type === skillsel.Type.Name) {
				let replacements: Map<string, string> = new Map()
				const na = bonus.owner
				if (Nameable.isAccesser(na)) {
					replacements = na.replacements
				}
				if (
					bonus.name.matches(replacements, name) &&
					bonus.specialization.matches(replacements, specialization) &&
					bonus.tags.matchesList(replacements, ...tags) &&
					(temporary === null || bonus.temporary === temporary)
				) {
					total += bonus.adjustedAmount
					bonus.addToTooltip(tooltip)
				}
			}
		}
		return total
	}

	/* -------------------------------------------- */

	/**
	 * @param name - Name of skill/technique
	 * @param specialization - Specialization of skill/technique. Can be blank
	 * @param tags - Tags of skill/technique.
	 * @param tooltip - Reference to tooltip to which bonuses are appended
	 * @param temporary - Is this feature provided by a temporary active effect?
	 * @returns Total skill level bonus for the provided Skill(s).
	 */
	skillPointBonusFor(
		name: string,
		specialization: string,
		tags: string[],
		tooltip: TooltipGURPS | null = null,
		temporary: boolean | null = null,
	): number {
		let total = 0
		for (const bonus of this.features.skillPointBonuses) {
			let replacements: Map<string, string> = new Map()
			const na = bonus.owner
			if (Nameable.isAccesser(na)) {
				replacements = na.replacements
			}
			if (
				bonus.name.matches(replacements, name) &&
				bonus.specialization.matches(replacements, specialization) &&
				bonus.tags.matchesList(replacements, ...tags) &&
				(temporary === null || bonus.temporary === temporary)
			) {
				total += bonus.adjustedAmount
				bonus.addToTooltip(tooltip)
			}
		}
		return total
	}

	/* -------------------------------------------- */

	spellBonusFor(
		name: string,
		powerSource: string,
		colleges: string[],
		tags: string[],
		tooltip: TooltipGURPS | null = null,
		temporary: boolean | null = null,
	): number {
		let total = 0
		for (const bonus of this.features.spellBonuses) {
			let replacements: Map<string, string> = new Map()
			const na = bonus.owner
			if (Nameable.isAccesser(na)) {
				replacements = na.replacements
			}
			if (
				bonus.tags.matchesList(replacements, ...tags) &&
				bonus.matchForType(replacements, name, powerSource, colleges) &&
				(temporary === null || bonus.temporary === temporary)
			) {
				total += bonus.adjustedAmount
				bonus.addToTooltip(tooltip)
			}
		}
		return total
	}

	/* -------------------------------------------- */

	spellPointBonusFor(
		name: string,
		powerSource: string,
		colleges: string[],
		tags: string[],
		tooltip: TooltipGURPS | null = null,
		temporary: boolean | null = null,
	): number {
		let total = 0
		for (const bonus of this.features.spellPointBonuses) {
			let replacements: Map<string, string> = new Map()
			const na = bonus.owner
			if (Nameable.isAccesser(na)) {
				replacements = na.replacements
			}
			if (
				bonus.tags.matchesList(replacements, ...tags) &&
				bonus.matchForType(replacements, name, powerSource, colleges) &&
				(temporary === null || bonus.temporary === temporary)
			) {
				total += bonus.adjustedAmount
				bonus.addToTooltip(tooltip)
			}
		}
		return total
	}

	/* -------------------------------------------- */

	addWeaponWithSkillBonusesFor(
		name: string,
		specialization: string,
		usage: string,
		tags: string[],
		dieCount: number,
		tooltip: TooltipGURPS | null = null,
		m: Set<WeaponBonus> = new Set(),
		allowedFeatureTypes: Set<feature.Type> = new Set(),
		temporary: boolean | null = null,
	): Set<WeaponBonus> {
		let rsl = Number.MIN_SAFE_INTEGER
		for (const sk of this.skillNamed(name, specialization, true)) {
			if (rsl < sk.system.level.relativeLevel) rsl = sk.system.level.relativeLevel
		}
		for (const bonus of this.features.weaponBonuses) {
			if (
				allowedFeatureTypes.has(bonus.type) &&
				bonus.selection_type === wsel.Type.WithRequiredSkill &&
				bonus.level?.matches(rsl) &&
				(temporary === null || bonus.temporary === temporary)
			) {
				let replacements: Map<string, string> = new Map()
				const na = bonus.owner
				if (Nameable.isAccesser(na)) {
					replacements = na.replacements
				}
				if (
					bonus.name.matches(replacements, name) &&
					bonus.specialization.matches(replacements, specialization) &&
					bonus.usage.matches(replacements, usage) &&
					bonus.tags.matchesList(replacements, ...tags)
				) {
					addWeaponBonusToSet(bonus, dieCount, tooltip, m)
				}
			}
		}
		return m
	}

	/* -------------------------------------------- */

	addNamedWeaponBonusesFor(
		name: string,
		usage: string,
		tags: string[],
		dieCount: number,
		tooltip: TooltipGURPS | null = null,
		m: Set<WeaponBonus> = new Set(),
		allowedFeatureTypes: Set<feature.Type> = new Set(),
		temporary: boolean | null = null,
	): void {
	}

	/* -------------------------------------------- */

	namedWeaponSkillBonusesFor(
		name: string,
		usage: string,
		tags: string[],
		temporary: boolean,
		tooltip: TooltipGURPS | null,
	): SkillBonus[] {
		const bonuses: SkillBonus[] = []
		for (const bonus of this.features.skillBonuses) {
			if (bonus.selection_type === skillsel.Type.Name) {
				let replacements: Map<string, string> = new Map()
				const na = bonus.owner
				if (Nameable.isAccesser(na)) {
					replacements = na.replacements
				}
				if (
					bonus.name.matches(replacements, name) &&
					bonus.specialization.matches(replacements, usage) &&
					bonus.tags.matchesList(replacements, ...tags) &&
					(temporary === null || bonus.temporary === temporary)
				) {
					bonuses.push(bonus)
					bonus.addToTooltip(tooltip)
				}
			}
		}
		return bonuses
	}

	/* -------------------------------------------- */

	/**
	 * Return array of skills matching the provieed parameters.
	 * @param name - Name of skill/technique to search for
	 * @param specialization - Specialization to search for. Can be blank.
	 * @param requirePoints - Does the skill need to have 1 or more points assigned?
	 * @param excludes - Skills to exclude from the search
	 * @returns Array of Skills/Techniques
	 */
	skillNamed(
		name: string,
		specialization: string,
		requirePoints: boolean,
		excludes: Set<string> | null = null,
	): ItemInstance<ItemType.Skill | ItemType.Technique>[] {
		const list: ItemGURPS[] = []
		// this.parent.items.forEach(sk => {
		// TODO: implement
		this.parent.itemCollections.skills.forEach(sk => {
			if (!sk.isOfType(ItemType.Skill, ItemType.Technique)) return
			if (excludes?.has(sk.system.processedName)) return

			if (!requirePoints || sk.type === ItemType.Technique || sk.system.adjustedPoints() > 0) {
				if (equalFold(sk.system.nameWithReplacements, name)) {
					if (specialization === "" || equalFold(sk.system.specializationWithReplacements, specialization)) {
						list.push(sk as any)
					}
				}
			}
		})
		return list as ItemInstance<ItemType.Skill | ItemType.Technique>[]
	}

}

interface ActorDataModel<Schema extends ActorDataSchema> extends SystemDataModel<Schema, ActorGURPS> {
	constructor: typeof ActorDataModel
}

type ActorDataSchema = {}

export { ActorDataModel }
