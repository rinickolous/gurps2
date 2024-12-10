import { SystemDataModel, SystemDataModelMetadata } from "@data/abstract.ts"
import { ActorSystemFlags } from "@documents/actor-system-flags.ts"
import { ActorGURPS } from "@documents/actor.ts"
import { ActorTemplateType, ActorType, ErrorGURPS } from "@util"
import { ActorDataModelClasses, ActorDataTemplateClasses } from "./types.ts"

type ActorDataModelMetadata = SystemDataModelMetadata<ActorSystemFlags>

class ActorDataModel<Schema extends ActorDataSchema = ActorDataSchema> extends SystemDataModel<Schema, ActorGURPS> {
	variableResolverExclusions = new Set<string>()

	/* -------------------------------------------- */

	cachedVariables = new Map<string, string>()

	/* -------------------------------------------- */

	static override metadata: ActorDataModelMetadata = Object.freeze(
		foundry.utils.mergeObject(
			super.metadata,
			{ systemFlagsModel: ActorSystemFlags },
			{ inplace: false },
		) as ActorDataModelMetadata,
	)

	override get metadata(): ActorDataModelMetadata {
		return this.constructor.metadata
	}

	/* -------------------------------------------- */

	/**
	 * Type safe way of verifying if an Actor is of a particular type.
	 */
	isOfType<T extends ActorType>(...types: T[]): this is ActorDataModelClasses[T] {
		return types.some(t => this.parent.type === (t as string))
	}

	/* -------------------------------------------- */

	/**
	 * Type safe way of verifying if an Actor contains a template
	 */
	hasTemplate<T extends ActorTemplateType>(template: T): this is ActorDataTemplateClasses[T] {
		return this.constructor._schemaTemplates.some(t => t.name === template)
	}

	/* -------------------------------------------- */

	resolveVariable(_variableName: string): string {
		throw ErrorGURPS(`ActorDataModel.resolveVariable must be implemented.`)
	}

	/* -------------------------------------------- */

	_prepareEmbeddedDocuments(): void {}
}

interface ActorDataModel<Schema extends ActorDataSchema> extends SystemDataModel<Schema, ActorGURPS> {
	constructor: typeof ActorDataModel
}

type ActorDataSchema = {}

export { ActorDataModel }
