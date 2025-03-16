import { ActorDataModelClasses, ActorDataTemplateClasses } from "@data/actor/types.ts"
import { ActorTemplateType, ActorType, SYSTEM_NAME } from "@util"
import { ActorDataModel } from "@data/actor/base.ts"

class ActorGURPS<SubType extends Actor.SubType> extends Actor<SubType> {
	/* -------------------------------------------- */
	/*  System Flags Functionality                  */
	/* -------------------------------------------- */

	get _systemFlagsDataModel() {
		return this.system?.metadata?.systemFlagsModel ?? null
	}

	/* -------------------------------------------- */

	prepareData() {
		super.prepareData()
		if (SYSTEM_NAME in this.flags && this._systemFlagsDataModel) {
			this.flags[SYSTEM_NAME] = new this._systemFlagsDataModel(this._source.flags[SYSTEM_NAME], { parent: this })
		}
	}

	/* -------------------------------------------- */

	async setFlag(scope: string, key: string, value: any): Promise<this> {
		if (scope === SYSTEM_NAME && this._systemFlagsDataModel) {
			let diff
			const changes = foundry.utils.expandObject({ [key]: value })
			if (this.flags[SYSTEM_NAME]) diff = this.flags[SYSTEM_NAME].updateSource(changes, { dryRun: true })
			else diff = new this._systemFlagsDataModel(changes, { parent: this }).toObject()
			return this.update({ flags: { [SYSTEM_NAME]: diff } }, {})
		}
		return super.setFlag(scope, key, value)
	}

	/* -------------------------------------------- */

	/**
	 * Type safe way of verifying if an Actor is of a particular type.
	 */
	isOfType<T extends ActorType>(...types: T[]): this is { system: ActorDataModelClasses[T] } {
		return types.some(t => this.type === t)
	}

	/* -------------------------------------------- */

	/**
	 * Type safe way of verifying if an Actor contains a template
	 */
	hasTemplate<T extends ActorTemplateType>(template: T): this is { system: ActorDataTemplateClasses[T] } {
		return this.system instanceof ActorDataModel && this.system.hasTemplate(template)
	}

	/* -------------------------------------------- */
	/*  Getters                                     */
	/* -------------------------------------------- */

	get strikingStrength(): number {
		if (this.isOfType(ActorType.Character)) return this.system.strikingStrength
		return 0
	}

	/* -------------------------------------------- */

	get liftingStrength(): number {
		if (this.isOfType(ActorType.Character)) return this.system.liftingStrength
		return 0
	}

	/* -------------------------------------------- */

	/**
	 * Resolves an embedded expression
	 */
	embeddedEval(s: string): string {
		const ev = new Evaluator(this.system)
		const exp = s.slice(2, s.length - 2)
		const result = String(ev.evaluate(exp))
		return result
	}
}

// interface ActorGURPS extends Actor {
// 	items: foundry.abstract.EmbeddedCollection<ItemGURPS, this>
// }

export { ActorGURPS }
