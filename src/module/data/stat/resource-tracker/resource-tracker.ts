import { AbstractStat, AbstractStatSchema } from "../abstract-stat/abstract-stat.ts"
import fields = foundry.data.fields
import { ActorDataModel } from "@data/actor/base.ts"
import { ResourceTrackerDefinition } from "./resource-tracker-definition.ts"
import { CharacterSettings } from "@data/actor/fields/character-settings.ts"
import { PoolThreshold } from "../pool-threshold.ts"

class ResourceTracker extends AbstractStat<ResourceTrackerSchema, ActorDataModel> {
	// order: number
	// damage?: number

	// constructor(
	// 	data: DeepPartial<SourceFromSchema<ResourceTrackerSchema>>,
	// 	options?: AbstractStatConstructionOptions<ActorDataModel>,
	// ) {
	// 	super(data, options)
	// 	this.order = options?.order ?? 0
	// }

	static override defineSchema(): ResourceTrackerSchema {
		const fields = foundry.data.fields

		return {
			...super.defineSchema(),
			damage: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
		}
	}

	get definition(): ResourceTrackerDefinition | null {
		return CharacterSettings.for(this.actor).resource_trackers.find(att => att.id === this.id) ?? null
	}

	override get max(): number {
		return this.definition?.max ?? 0
	}

	get min(): number {
		return this.definition?.min ?? 0
	}

	override get current(): number {
		return this.max - (this.damage ?? 0)
	}

	get currentThreshold(): PoolThreshold | null {
		if (!this.actor || !this.definition) return null
		for (const threshold of this.definition.thresholds ?? []) {
			if (this.current <= threshold.threshold(this.parent)) return threshold
		}
		return null
	}

	// toTokenPool(): TokenPool | null {
	// 	return {
	// 		value: this.current,
	// 		max: this.definition?.isMaxEnforced ? this.max : Number.MAX_SAFE_INTEGER,
	// 		min: this.definition?.isMinEnforced ? this.min : Number.MIN_SAFE_INTEGER,
	// 	}
	// }
}

type ResourceTrackerSchema = AbstractStatSchema & {
	damage: fields.NumberField<{ required: true; nullable: false }>
}

export { ResourceTracker, type ResourceTrackerSchema }
