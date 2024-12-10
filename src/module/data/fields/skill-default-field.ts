import { SkillDefault } from "@data/skill-default.ts"
import fields = foundry.data.fields

interface SkillDefaultFieldOptions extends fields.EmbeddedDataField.Options<typeof SkillDefault> {
	typeChoices?: Record<string, string>
}

class SkillDefaultField<
	Options extends SkillDefaultFieldOptions = fields.EmbeddedDataField.DefaultOptions,
> extends fields.EmbeddedDataField<typeof SkillDefault, Options> {
	constructor(options?: Options, context?: fields.DataField.Context) {
		let typeChoices: Record<string, string> | null = null
		if (options?.typeChoices) typeChoices = options.typeChoices
		super(SkillDefault, options, context)
		if (typeChoices !== null) this.typeChoices = typeChoices
	}

	set typeChoices(value: Record<string, string>) {
		;(this.fields.type as any).choices = value
		;(this.fields.type as any).blank = Object.hasOwn(value, "")
	}
}

export { SkillDefaultField }
