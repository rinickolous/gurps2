import { ActorDataModel } from "./base.ts"
import fields = foundry.data.fields

export class TestTemplate extends ActorDataModel<TestSchema> {}

type TestSchema = {
	test: fields.StringField
}
