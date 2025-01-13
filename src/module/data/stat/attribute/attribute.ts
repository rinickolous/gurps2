import { AbstractStat, AbstractStatSchema } from "../abstract-stat/abstract-stat.ts"
import fields = foundry.data.fields
import { ActorTemplateType, attribute, Int, stlimit, threshold } from "@util"
import { AttributeDefinition } from "./attribute-definition.ts"
import { CharacterSettings } from "@data/actor/fields/character-settings.ts"

class AttributeGURPS extends AbstractStat<AttributeSchema> {
	// order: number


	// constructor(
	// 	data?: foundry.abstract.DataModel.ConstructorData<Schema>,
	// 	options?: foundry.abstract.DataModel.DataValidationOptions<Parent> & AnyObject
	// ) {
	// 	super(data, options)
	// }

	static override defineSchema(): AttributeSchema {
		const fields = foundry.data.fields

		return {
			...super.defineSchema(),
			adj: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
			damage: new fields.NumberField({ required: true, nullable: true, initial: null }),
			applyOps: new fields.BooleanField({ required: true, nullable: true, initial: null }),
			manualThreshold: new fields.NumberField({ required: true, nullable: true, initial: null }),
		}
	}

	get bonus(): number {
		if (this.parent.hasTemplate(ActorTemplateType.Featu)) {
			return this.parent.attributeBonusFor(this.id, stlimit.Option.None)
		}
		return 0
	}

	get temporaryBonus(): number {
		if (this.actor.hasTemplate(ActorTemplateType.Features)) {
			return this.actor.system.attributeBonusFor(this.id, stlimit.Option.None, null, true)
		}
		return 0
	}

	get definition(): AttributeDefinition | null {
		const definition = CharacterSettings.for(this.actor).attributes.find(att => att.id === this.id)
		if (!definition) {
			console.error(`Attribute with ID ${this.id} has no definition`)
			return null
		}
		return definition
	}

	override get max(): number {
		const def = this.definition
		if (!def) return 0
		const max = super.max + this.adj + this.bonus
		if (![attribute.Type.Decimal, attribute.Type.DecimalRef].includes(this.definition?.type)) return Math.floor(max)
		return max
	}

	override get current(): number {
		if (this.definition && this.definition.type === attribute.Type.Pool) return this.max - (this.damage ?? 0)
		return this.max
	}

	override get temporaryMax(): number {
		const def = this.definition
		if (!def) return 0
		const eff = this.max + this.temporaryBonus
		if (![attribute.Type.Decimal, attribute.Type.DecimalRef].includes(this.definition?.type)) return Math.floor(eff)
		// TODO: come back to this
		// if (this.id === gid.Strength) return this.actor.system.temporaryST(eff)
		return eff
	}

	get points(): number {
		const def = this.definition
		if (!def) return 0
		let sm = 0
		if (this.actor?.hasTemplate(ActorTemplateType.Features)) sm = this.actor.system.adjustedSizeModifier
		return def.computeCost(this.actor.system, this.adj, this.costReduction, sm)
	}

	get costReduction(): number {
		if (this.actor.hasTemplate(ActorTemplateType.Features)) {
			return this.actor.system.costReductionFor(this.id)
		}
		return 0
	}

	get currentThreshold(): PoolThreshold | null {
		if (!this.actor) {
			console.error(`No actor found for attribute "${this.id}`)
			return null
		}
		if (!this.definition) {
			console.error(`No definition found for attribute "${this.id}`)
			return null
		}
		if (!this.definition.thresholds) {
			console.error(`No thresholds found for attribute "${this.id}`)
			return null
		}

		if (this.manualThreshold !== null) return this.definition.thresholds[this.manualThreshold]

		for (const threshold of this.definition.thresholds ?? []) {
			if (this.current <= threshold.threshold(this.actor.system)) return threshold
		}
		return null
	}

	get isSeparator(): boolean {
		if (!this.definition) return false
		return [
			attribute.Type.PrimarySeparator,
			attribute.Type.SecondarySeparator,
			attribute.Type.PoolSeparator,
		].includes(this.definition.type)
	}

	get isPool(): boolean {
		if (!this.definition) return false
		return [attribute.Type.Pool, attribute.Type.PoolSeparator].includes(this.definition.type)
	}

	get isPrimary(): boolean {
		if (!this.definition) return false
		if (this.definition.type === attribute.Type.PrimarySeparator) return true
		if (this.definition.type === attribute.Type.Pool || this.isSeparator) return false
		const [, err] = Int.fromString(this.definition.base.trim())
		return err === null
	}

	get isSecondary(): boolean {
		if (!this.definition) return false
		if (this.definition.type === attribute.Type.SecondarySeparator) return true
		if (this.definition.type === attribute.Type.Pool || this.isSeparator) return false
		const [, err] = Int.fromString(this.definition.base.trim())
		return err !== null
	}

	toTokenPool(): TokenPool | null {
		if (!this.isPool) return null
		return {
			value: this.current,
			max: this.max,
			min: Number.MIN_SAFE_INTEGER,
		}
	}

	static isThresholdOpMet(op: threshold.Op, attributes: Collection<AttributeGURPS>): boolean {
		for (const att of attributes) {
			const t = att.currentThreshold
			if (t !== null && t.ops.includes(op)) return true
		}
		return false
	}
}

type AttributeSchema = AbstractStatSchema & {
	adj: fields.NumberField<{ required: true, nullable: false }>
	damage: fields.NumberField<{ required: true, nullable: true }>
	applyOps: fields.BooleanField<{ required: true, nullable: true }>
	manualThreshold: fields.NumberField<{ required: true, nullable: true }>
}

export { AttributeGURPS, type AttributeSchema }
