import { Action, ActionClass, ActionDataModelClasses } from "@data/action/types.ts"
import fields = foundry.data.fields
import { MappingField } from "@data/fields/mapping-field.ts"
import type { AnyObject } from "@league-of-foundry-developers/foundry-vtt-types/src/types/utils.d.mts"
import { ActionType } from "@util"
import { ItemDataModel } from "@data/item/base.ts"
import { BaseAction } from "@data/action/base-action.ts"

class ActionsField<Options extends MappingField.Options<ActionField, typeof ActionCollection>> extends MappingField<
	ActionField,
	typeof ActionCollection,
	ActionField,
	ActionField,
	Options
> {
	constructor(options: Options) {
		super(new ActionField(), options)
	}

	/* -------------------------------------------- */

	override initialize(value: any, model: foundry.abstract.DataModel.Any, options?: AnyObject): ActionCollection {
		super.initialize(value, model)
		const actions = Object.values(super.initialize(value, model, options) as unknown as Record<string, Action>)
		actions.sort((a, b) => a.sort - b.sort)
		return new ActionCollection(model, actions)
	}
}

class ActionField<
	const Options extends DataFieldOptions<Action> = fields.DataField.DefaultOptions,
> extends fields.DataField<Options, Action, Action, AnyObject> {
	/* -------------------------------------------- */

	static override recursive = true

	/* -------------------------------------------- */

	protected override _cast(value: Action): Action {
		console.log(value)
		return value
	}

	/* -------------------------------------------- */

	protected override _cleanType(value: Action, options?: fields.DataField.CleanOptions): Action {
		// if (!(typeof value === "object")) value = {}

		const cls = this.getModel(value)
		if (cls) return cls.cleanData(value, { ...options }) as Action
		return value
	}

	/* -------------------------------------------- */

	getModel(value: object): ActionClass | null {
		if (
			// isObject(value) &&
			Object.hasOwn(value, "type") &&
			Object.keys(ActionDataModelClasses).includes((value as any).type)
		) {
			return ActionDataModelClasses[(value as any).type as ActionType] as ActionClass
		}
		return null
	}

	/* -------------------------------------------- */

	override initialize(value: AnyObject, model: ItemDataModel, options?: AnyObject): Action {
		const cls = this.getModel(value)
		if (cls) return new cls(value as object, { parent: model, ...options })
		return foundry.utils.deepClone(value) as unknown as Action
	}

	/* -------------------------------------------- */

	migrateSource(_sourceData: object, fieldData: any) {
		const cls = this.getModel(fieldData)
		if (cls) cls.migrateDataSafe(fieldData)
	}
}

/* -------------------------------------------- */

class ActionCollection extends Collection<Action> {
	#model: foundry.abstract.DataModel.Any
	/* -------------------------------------------- */

	#types: Map<string, Set<string>> = new Map()

	constructor(model: foundry.abstract.DataModel.Any, entries: Action[]) {
		super()
		this.#model = model
		for (const entry of entries) {
			if (!(entry instanceof BaseAction)) continue
			this.set(entry._id, entry)
		}
	}

	/* -------------------------------------------- */

	get model(): foundry.abstract.DataModel.Any {
		return this.#model
	}

	/* -------------------------------------------- */

	override set(key: string, value: Action) {
		if (!this.#types.has(value.type)) this.#types.set(value.type, new Set())
		this.#types.get(value.type)?.add(key)
		return super.set(key, value)
	}

	/* -------------------------------------------- */

	// @ts-expect-error I don't even know what this means
	override delete(key: string): boolean {
		this.#types.get(this.get(key)?.type ?? "")?.delete(key)
		return super.delete(key)
	}

	/* -------------------------------------------- */

	toObject(source = true) {
		return this.map(doc => doc.toObject(source))
	}
}
export { ActionsField, ActionField, ActionCollection }
