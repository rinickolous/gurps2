import { ActiveEffectGURPS } from "./active-effect.ts"
import { DocumentSystemFlags } from "./system-flags.ts"

class EffectSystemFlags extends DocumentSystemFlags<EffectSystemFlagsSchema, ActiveEffectGURPS> {
	static override defineSchema(): EffectSystemFlagsSchema {
		return {}
	}
}

type EffectSystemFlagsSchema = {}

export { EffectSystemFlags, type EffectSystemFlagsSchema }
