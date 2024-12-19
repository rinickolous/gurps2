import { SheetSettings } from "@module/settings/sheet-settings-config.ts"
import fields = foundry.data.fields
import { ActorGURPS } from "@documents/actor.ts"

// export const RESERVED_IDS: string[] = [gid.Skill, gid.Parry, gid.Block, gid.Dodge, gid.SizeModifier, gid.Ten]

abstract class AbstractStatDefinition<
	Schema extends AbstractStatDefinitionSchema = AbstractStatDefinitionSchema,
	Parent extends SheetSettings = SheetSettings
> extends foundry.abstract.DataModel<Schema, Parent> {
	static override defineSchema(): AbstractStatDefinitionSchema {
		const fields = foundry.data.fields

		return {
			id: new fields.StringField(),
			base: new fields.StringField(),
		}
	}

	get actor(): ActorGURPS | null {
		return this.parent.actor
	}

	abstract baseValue(resolver: unknown): number

	// static createInstance<T extends AbstractStatDef>(
	// 	this: ConstructorOf<T>,
	// 	_reservedIds: string[],
	// ): T {
	// 	const id = "a" // TODO: replace
	// 	// const id = getNewAttributeId(
	// 	// 	reservedIds.map(e => {
	// 	// 		return { id: e }
	// 	// 	}),
	// 	// )
	// 	return new this({ id }) as T
	// }
}

type AbstractStatDefinitionSchema = {
	id: fields.StringField<{ required: true; nullable: false }, string>
	base: fields.StringField<{ required: true; nullable: false }, string>
}

export { AbstractStatDefinition, type AbstractStatDefinitionSchema }
