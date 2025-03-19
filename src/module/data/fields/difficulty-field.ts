import { Difficulty } from "@data/difficulty.ts"
import fields = foundry.data.fields
import { AnyObject } from "fvtt-types/utils"

class DifficultyField<Options extends Difficulty.Options = Difficulty.DefaultOptions> extends fields.EmbeddedDataField<
	typeof Difficulty,
	Options
> {
	constructor(options?: Options, context?: fields.DataField.Context) {
		super(Difficulty, options, context)
	}

	/* -------------------------------------------- */

	// TODO: check if we can use this function to pass through attribute and difficulty choices
	override initialize(
		value: fields.EmbeddedDataField.PersistedType<typeof Difficulty, Options>,
		model: foundry.abstract.DataModel.Any,
		options?: AnyObject,
	):
		| fields.EmbeddedDataField.InitializedType<typeof Difficulty, Options>
		| (() => fields.EmbeddedDataField.InitializedType<typeof Difficulty, Options> | null) {
		return super.initialize(value, model, options)
	}
}

export { DifficultyField }
// class DifficultyField extends fields.EmbeddedDataField<Difficulty, Options extends Difficulty.Options = fields.EmbeddedDataField.DefaultOptions

// > {
// 	}
