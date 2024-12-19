import { ActorBody } from "@data/hit-location.ts"
import fields = foundry.data.fields
import { SystemDataModel } from "@data/abstract.ts"

class TestItem extends SystemDataModel<TestSchema> {

	testFunc() {
		const a: TestItem = {} as any
		const b = a.toObject()

		b.body.locations


	}
}

class TestModel extends foundry.abstract.DataModel<TestModelSchema> { }

type TestSchema = {
	test: fields.EmbeddedDataField<typeof TestModel>
	body: fields.EmbeddedDataField<typeof ActorBody>
	foo: fields.StringField
}

type TestModelSchema = {
	foo: fields.SchemaField<{
		bar: fields.ArrayField<fields.StringField>
	}>
	body: fields.EmbeddedDataField<typeof ActorBody>
}

export { TestItem }
