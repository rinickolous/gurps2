import { EffectType } from "@util";
import { EffectDataModel } from "./base.ts";

export interface EffectDataModelClasses {
	[EffectType.Effect]: EffectDataModel
	[EffectType.Condition]: EffectDataModel
}
