import * as ActionDataModels from "./index.ts"
import { ActionType } from "@util"

export type Action =
	| ActionDataModels.AttackMelee
	| ActionDataModels.AttackRanged
	| ActionDataModels.ActionHeal
	| ActionDataModels.ActionUtility

export type ActionClass =
	| typeof ActionDataModels.AttackMelee
	| typeof ActionDataModels.AttackRanged
	| typeof ActionDataModels.ActionHeal
	| typeof ActionDataModels.ActionUtility

export type ActionSchema =
	| ActionDataModels.AttackMeleeSchema
	| ActionDataModels.AttackRangedSchema
	| ActionDataModels.ActionHealSchema
	| ActionDataModels.ActionUtilitySchema

export const ActionDataModelClasses: Readonly<Record<ActionType, ActionClass>> = Object.freeze({
	[ActionType.AttackMelee]: ActionDataModels.AttackMelee,
	[ActionType.AttackRanged]: ActionDataModels.AttackRanged,
	[ActionType.Heal]: ActionDataModels.ActionHeal,
	[ActionType.Utility]: ActionDataModels.ActionUtility,
})

export interface ActionDataModelClasses {
	[ActionType.AttackMelee]: ActionDataModels.AttackMelee
	[ActionType.AttackRanged]: ActionDataModels.AttackRanged
	[ActionType.Heal]: ActionDataModels.ActionHeal
	[ActionType.Utility]: ActionDataModels.ActionUtility
}
