import { ActorType, GID, i18n, ItemTemplateType, Nameable } from "@util"
import fields = foundry.data.fields
import { ReplaceableStringField, ToggleableNumberField, ToggleableStringField } from "./fields/index.ts"
import { Action } from "./action/types.ts"
import { ActorGURPS, ItemGURPS } from "@documents"
import { ItemDataModel } from "./item/base.ts"

const SKILL_BASED_DEFAULT_TYPES: Set<string> = new Set([GID.Skill, GID.Parry, GID.Block])

class SkillDefault extends foundry.abstract.DataModel<SkillDefaultSchema, ItemDataModel | Action> {
	static override defineSchema(): SkillDefaultSchema {
		const fields = foundry.data.fields
		return {
			type: new ToggleableStringField({
				required: true,
				nullable: false,
				blank: false,
				initial: GID.Dexterity,
			}),
			name: new ReplaceableStringField({ required: true, nullable: true, initial: null }),
			specialization: new ReplaceableStringField({ required: true, nullable: true, initial: null }),
			modifier: new ToggleableNumberField({ integer: true, required: true, nullable: false, initial: 0 }),
			level: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
			adjusted_level: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
			points: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
		}
	}

	static cleanData(
		source?: Partial<foundry.abstract.DataModel.ConstructorDataFor<SkillDefault>>,
		options?: Parameters<fields.SchemaField.Any["clean"]>[1],
	): object {
		if (source && source.type) {
			source.name = SKILL_BASED_DEFAULT_TYPES.has(source.type) ? source.name || "" : null
			source.specialization = SKILL_BASED_DEFAULT_TYPES.has(source.type) ? source.specialization || "" : null
		}

		return super.cleanData(source, options)
	}

	get skillBased(): boolean {
		return SKILL_BASED_DEFAULT_TYPES.has(this.type) ?? false
	}

	get item(): ItemGURPS {
		// TODO: see if never null
		return this.parent.item!
	}

	get index(): number {
		if (!this.parent.hasTemplate(ItemTemplateType.SkillDefaultHolder)) return -1
		return this.parent.defaults.indexOf(this)
	}

	get element(): Handlebars.SafeString {
		const enabled: boolean = (this.item.sheet as any).editable
		return new Handlebars.SafeString(this.toFormElement(enabled).outerHTML)
	}

	toFormElement(enabled: boolean): HTMLElement {
		const prefix = `system.study.${this.index}`

		const element = document.createElement("li")

		const replacements = this.item.hasTemplate(ItemTemplateType.ReplacementHolder)
			? this.item.system.replacements
			: new Map()

		const choices = Object.entries(
			getAttributeChoices(this.parent.actor, this.type, "GURPS.Item.Defaults.Fields.Attribute", {
				blank: false,
				ten: true,
				size: false,
				dodge: true,
				parry: true,
				block: true,
				skill: true,
			}).choices,
		).map(([value, label]) => {
			return { value, label }
		})

		if (!enabled) {
			element.append(createDummyElement(`${prefix}.type`, this.type))
			element.append(createDummyElement(`${prefix}.modifier`, this.modifier))
			element.append(createDummyElement(`${prefix}.level`, this.level))
			element.append(createDummyElement(`${prefix}.adjusted_level`, this.adjusted_level))
			element.append(createDummyElement(`${prefix}.points`, this.points))

			if (this.name !== null) element.append(createDummyElement(`${prefix}.name`, this.name))
			if (this.specialization !== null)
				element.append(createDummyElement(`${prefix}.specialization`, this.specialization))
		}

		const rowElement = document.createElement("div")
		rowElement.classList.add("form-fields")

		rowElement.append(
			createButton({
				icon: ["fa-regular", "fa-trash"],
				label: "",
				data: {
					action: "deleteDefault",
					index: this.index.toString(),
				},
				disabled: !enabled,
			}),
		)

		rowElement.append(
			foundry.applications.fields.createSelectInput({
				name: enabled ? `${prefix}.type` : "",
				value: this.type,
				localize: true,
				options: choices,
				disabled: !enabled,
			}),
		)

		rowElement.append(
			this.schema.fields.name.toInput({
				name: enabled ? `${prefix}.name` : "",
				value: this.name ?? "",
				localize: true,
				placeholder: i18n.localize("GURPS.Item.Defaults.ToggleableName"),
				disabled: !SKILL_BASED_DEFAULT_TYPES.has(this.type),
				replacements,
			}) as HTMLElement,
		)

		rowElement.append(
			this.schema.fields.specialization.toInput({
				name: enabled ? `${prefix}.specialization` : "",
				value: this.specialization ?? "",
				localize: true,
				placeholder: i18n.localize("GURPS.Item.Defaults.ToggleableSpecialization"),
				disabled: !SKILL_BASED_DEFAULT_TYPES.has(this.type),
				replacements,
			}) as HTMLElement,
		)

		rowElement.append(
			this.schema.fields.modifier.toInput({
				name: enabled ? `${prefix}.modifier` : "",
				value: this.modifier.signedString(),
			}) as HTMLElement,
		)

		element.append(rowElement)

		return element
	}

	cloneWithoutLevelOrPoints(): SkillDefault {
		return this.clone({ level: 0, adjusted_level: 0, points: 0 })
	}

	equivalent(replacements: Map<string, string>, other: SkillDefault | null): boolean {
		return (
			other !== null &&
			this.type === other.type &&
			this.modifier === other.modifier &&
			this.nameWithReplacements(replacements) === other.nameWithReplacements(replacements) &&
			this.specializationWithReplacements(replacements) === other.specializationWithReplacements(replacements)
		)
	}

	fullName(actor: ActorGURPS2, replacements: Map<string, string>): string {
		if (this.skillBased) {
			const buffer = new StringBuilder()
			buffer.push(this.nameWithReplacements(replacements))
			if (this.specialization !== null && this.specialization !== "") {
				buffer.push(` (${this.specializationWithReplacements(replacements)})`)
			}
			if (this.type === GID.Dodge) buffer.push(game.i18n.localize("GURPS.Attribute.Dodge"))
			else if (this.type === GID.Parry) buffer.push(game.i18n.localize("GURPS.Attribute.Parry"))
			else if (this.type === GID.Block) buffer.push(game.i18n.localize("GURPS.Attribute.Block"))
			return buffer.toString()
		}
		if (!actor.hasTemplate(ActorTemplateType.Attributes)) {
			console.error(`Actor "${actor.name}" does not contain any attributes.`)
			return ""
		}
		return actor.system.resolveAttributeName(this.type)
	}

	skillLevel(
		actor: ActorGURPS2,
		replacements: Map<string, string>,
		requirePoints: boolean,
		excludes: Set<string>,
		rule_of_20: boolean,
	): number {
		if (!actor.isOfType(ActorType.Character)) return 0
		let best = Number.MIN_SAFE_INTEGER
		switch (this.type) {
			case GID.Parry:
				best = this.best(actor, replacements, requirePoints, excludes)
				if (best !== Number.MIN_SAFE_INTEGER) best = best / 2 + 3 + actor.system.bonuses.parry.value
				return this.finalLevel(best)
			case GID.Block:
				best = this.best(actor, replacements, requirePoints, excludes)
				if (best !== Number.MIN_SAFE_INTEGER) best = best / 2 + 3 + actor.system.bonuses.block.value
				return this.finalLevel(best)
			case GID.Skill:
				return this.finalLevel(this.best(actor, replacements, requirePoints, excludes))
			default:
				return this.skillLevelFast(actor, replacements, requirePoints, excludes, rule_of_20)
		}
	}

	best(actor: ActorGURPS2, replacements: Map<string, string>, requirePoints: boolean, excludes: Set<string>): number {
		let best = Number.MIN_SAFE_INTEGER
		if (!actor.isOfType(ActorType.Character)) return best
		for (const s of actor.system.skillNamed(
			this.nameWithReplacements(replacements),
			this.specializationWithReplacements(replacements),
			requirePoints,
			excludes,
		)) {
			const level = s.system.calculateLevel().level
			if (best < level) best = level
		}
		return best
	}

	skillLevelFast(
		actor: ActorGURPS2,
		replacements: Map<string, string>,
		requirePoints: boolean,
		excludes: Set<string> = new Set(),
		rule_of_20 = false,
	): number {
		let level = 0
		let best = 0
		if (!actor.isOfType(ActorType.Character)) return 0
		switch (this.type) {
			case GID.Dodge:
				level = actor.system.encumbrance.currentLevel.dodge
				if (rule_of_20 && level > 20) level = 20
				return this.finalLevel(level)
			case GID.Parry:
				best = this.bestFast(actor, replacements, requirePoints, excludes)
				if (best !== Number.MIN_SAFE_INTEGER) best = Math.floor(best / 2) + 3 + actor.system.bonuses.parry.value
				return this.finalLevel(best)
			case GID.Block:
				best = this.bestFast(actor, replacements, requirePoints, excludes)
				if (best !== Number.MIN_SAFE_INTEGER) best = Math.floor(best / 2) + 3 + actor.system.bonuses.block.value
				return this.finalLevel(best)
			case GID.Skill:
				return this.finalLevel(this.bestFast(actor, replacements, requirePoints, excludes))
			case GID.Ten:
				return this.finalLevel(10)
			default:
				level = actor.system.resolveAttributeCurrent(this.type)
				if (rule_of_20) level = Math.min(level, 20)
				return this.finalLevel(level)
		}
	}

	bestFast(
		actor: ActorGURPS,
		replacements: Map<string, string>,
		requirePoints: boolean,
		excludes: Set<string> = new Set(),
	): number {
		let best = Number.MIN_SAFE_INTEGER
		if (!actor.isOfType(ActorType.Character)) return best
		for (const sk of actor.system.skillNamed(
			this.nameWithReplacements(replacements),
			this.specializationWithReplacements(replacements),
			requirePoints,
			excludes,
		)) {
			if (best < sk.system.level.level) best = sk.system.level.level
		}
		return best
	}

	finalLevel(level: number): number {
		if (level !== Number.MIN_SAFE_INTEGER) level += this.modifier
		return level
	}

	get noLevelOrPoints(): SkillDefault {
		return new SkillDefault({
			type: this.type,
			name: this.name,
			modifier: this.modifier,
			level: 0,
			adjusted_level: 0,
			points: 0,
		})
	}

	/**  Replacements */
	nameWithReplacements(replacements: Map<string, string>): string {
		return Nameable.apply(this.name ?? "", replacements)
	}

	specializationWithReplacements(replacements: Map<string, string>): string {
		return Nameable.apply(this.specialization ?? "", replacements)
	}

	/** Nameables */
	fillWithNameableKeys(m: Map<string, string>, existing: Map<string, string>): void {
		Nameable.extract(this.name ?? "", m, existing)
		Nameable.extract(this.specialization ?? "", m, existing)
	}
}

type SkillDefaultSchema = {
	// type: ToggleableStringField<{ required: true; nullable: false }, SkillDefaultType>
	type: ToggleableStringField<{ required: true; nullable: false; blank: false; initial: GID.Dexterity }>
	name: ReplaceableStringField<{ required: true; nullable: true; initial: null }>
	specialization: ReplaceableStringField<{ required: true; nullable: true; initial: null }>
	modifier: ToggleableNumberField<{ required: true; nullable: false }>
	level: fields.NumberField<{ required: true; nullable: false }>
	adjusted_level: fields.NumberField<{ required: true; nullable: false }>
	points: fields.NumberField<{ required: true; nullable: false }>
}

export { SkillDefault, type SkillDefaultSchema }
