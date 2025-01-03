import { ActorGURPS } from "@documents/actor.ts"
import { SheetSettings } from "@module/settings/sheet-settings-config.ts"
import fields = foundry.data.fields

// export const RESERVED_IDS: string[] = [gid.Skill, gid.Parry, gid.Block, gid.Dodge, gid.SizeModifier, gid.Ten]

abstract class AbstractStatDefinition<
	Schema extends AbstractStatDefinitionSchema = AbstractStatDefinitionSchema,
	Parent extends SheetSettings = SheetSettings
> extends foundry.abstract.DataModel<Schema, Parent> {
	static override defineSchema(): AbstractStatDefinitionSchema {

		return abstractStatDefinitionSchema
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

const abstractStatDefinitionSchema = {
	id: new fields.StringField({ required: true, nullable: false }),
	base: new fields.StringField({ required: true, nullable: false }),
}

type AbstractStatDefinitionSchema = typeof abstractStatDefinitionSchema

export { AbstractStatDefinition, abstractStatDefinitionSchema, type AbstractStatDefinitionSchema }
