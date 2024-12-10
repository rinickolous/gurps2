import { DocumentSystemFlags } from "./system-flags.ts"
import fields = foundry.data.fields
import { ActorFlags } from "@util"
import { ActorGURPS } from "./actor.ts"
import { RollModifier } from "@data/roll-modifier.ts"

class ActorSystemFlags extends DocumentSystemFlags<ActorSystemFlagsSchema, ActorGURPS> {
	static override defineSchema(): ActorSystemFlagsSchema {
		const fields = foundry.data.fields
		return {
			[ActorFlags.SelfModifiers]: new fields.ArrayField(new fields.EmbeddedDataField(RollModifier)),
			[ActorFlags.TargetModifiers]: new fields.ArrayField(new fields.EmbeddedDataField(RollModifier)),
		}
	}
}

type ActorSystemFlagsSchema = {
	[ActorFlags.SelfModifiers]: fields.ArrayField<fields.EmbeddedDataField<typeof RollModifier>>
	[ActorFlags.TargetModifiers]: fields.ArrayField<fields.EmbeddedDataField<typeof RollModifier>>
}

export { ActorSystemFlags, type ActorSystemFlagsSchema }
