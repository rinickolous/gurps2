import { ActionsField } from "@data/fields/actions-field.ts"
import { ItemDataModel } from "../base.ts"
import { ActionType, ErrorGURPS } from "@util"
import { Action, ActionDataModelClasses } from "@data/action/types.ts"
import { ItemGURPS } from "@documents/item.ts"
import { AttackMelee, AttackRanged } from "@data/action/index.ts"

class ActionHolderTemplate extends ItemDataModel<ActionHolderSchema> {
	// static override defineSchema(): ActionHolderSchema {
	// 	return {
	// 		actions: new ActionsField({ required: true, nullable: false }),
	// 	}
	// }
	//
	// /* -------------------------------------------- */
	//
	// async createAction(
	// 	type: ActionType,
	// 	data: foundry.abstract.DataModel.ConstructorDataFor<Action>,
	// 	{ renderSheet }: { renderSheet: true },
	// ): Promise<foundry.applications.api.ApplicationV2>
	//
	// async createAction(
	// 	type: ActionType,
	// 	data: foundry.abstract.DataModel.ConstructorDataFor<Action>,
	// 	{ renderSheet }: { renderSheet: false },
	// ): Promise<null>
	//
	// async createAction(
	// 	type: ActionType,
	// 	data: foundry.abstract.DataModel.ConstructorDataFor<Action>,
	// 	{ renderSheet }: { renderSheet: boolean; [key: string]: unknown } = { renderSheet: true },
	// ): Promise<foundry.applications.api.ApplicationV2 | null> {
	// 	const cls = ActionDataModelClasses[type]
	// 	if (!cls) throw ErrorGURPS(`${type} is not a valid Action type`)
	//
	// 	const createData = foundry.utils.deepClone(data)
	// 	const action = new cls({ type, ...data }, { parent: this })
	// 	if (action.preCreate(createData) === false) return null
	//
	// 	await this.parent.update({
	// 		[`system.actions.${action.id}`]: action.toObject(),
	// 	})
	// 	const created = this.actions?.get(action.id)
	// 	return renderSheet ? (created?.sheet?.render({ force: true }) ?? null) : null
	// }
	//
	// /* -------------------------------------------- */
	//
	// updateAction(id: string, updates: object): Promise<ItemGURPS | undefined> {
	// 	if (!this.actions || !this.actions.has(id)) throw ErrorGURPS(`Action of ID ${id} could not be found to update`)
	// 	console.log(updates)
	// 	return this.parent.update({ [`system.actions.${id}`]: updates })
	// }
	//
	// /* -------------------------------------------- */
	//
	// async deleteAction(id: string): Promise<ItemGURPS | undefined> {
	// 	const action = this.actions?.get(id)
	// 	if (!action) return this.parent
	// 	await Promise.allSettled([...action.constructor._sheets.values()].map(e => e.close()))
	// 	return this.parent.update({ [`system.actions.-=${id}`]: null })
	// }
	//
	// /* -------------------------------------------- */
	//
	// get attacks(): (AttackMelee | AttackRanged)[] {
	// 	return [...this.meleeAttacks, ...this.rangedAttacks]
	// }
	//
	// /* -------------------------------------------- */
	//
	// get meleeAttacks(): AttackMelee[] {
	// 	return this.actions?.filter(e => e.isOfType(ActionType.AttackMelee)) as AttackMelee[]
	// }
	//
	// /* -------------------------------------------- */
	//
	// get rangedAttacks(): AttackRanged[] {
	// 	return this.actions?.filter(e => e.isOfType(ActionType.AttackRanged)) as AttackRanged[]
	// }
}

type ActionHolderSchema = {
	actions: ActionsField<{ required: true; nullable: false }>
}

export { ActionHolderTemplate, type ActionHolderSchema }
