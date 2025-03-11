import { ActorDataModelClasses, ActorDataTemplateClasses } from "@data/actor/types.ts"
import { ActorTemplateType, ActorType } from "@util"

class ActorGURPS extends Actor {
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
		return this.system.hasTemplate(template)
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

export { ActorGURPS }
