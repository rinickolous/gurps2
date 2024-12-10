import { ItemDataModel } from "./base.ts"
import { ActionHolderTemplate } from "./templates/action-holder.ts"
import { BasicInformationTemplate } from "./templates/basic-information.ts"
import { FeatureHolderTemplate } from "./templates/feature-holder.ts"
import { PrereqHolderTemplate } from "./templates/prereq-holder.ts"
import { ReplacementHolderTemplate } from "./templates/replacement-holder.ts"
import { StudyHolderTemplate } from "./templates/study-holder.ts"

class TraitData extends ItemDataModel.mixin(
	FeatureHolderTemplate,
	ActionHolderTemplate,
	BasicInformationTemplate,
	FeatureHolderTemplate,
	PrereqHolderTemplate,
	ReplacementHolderTemplate,
	StudyHolderTemplate,
) {}

type TraitSchema = {}

export { TraitData, type TraitSchema }
