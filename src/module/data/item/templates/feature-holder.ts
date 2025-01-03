import { ItemDataModel } from "../base.ts"
import { Feature, FeatureClass, FeatureTypes } from "@data/feature/types.ts"
import fields = foundry.data.fields
import { feature } from "@util"

class FeatureHolderTemplate extends ItemDataModel<FeatureHolderSchema> { }

type FeatureHolderSchema = {
	features: fields.ArrayField<fields.TypedSchemaField<Record<feature.Type, FeatureClass>>>
}

export { FeatureHolderTemplate, type FeatureHolderSchema }
