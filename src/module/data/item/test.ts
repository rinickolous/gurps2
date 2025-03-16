import { SystemDataModel } from "@data/abstract.ts"
import { ItemDataModel } from "./base.ts"
import { BasicInformationTemplate } from "./templates/basic-information.ts"

declare class TestSystemData extends SystemDataModel<TestSystemSchema> {
	constructor(...args: any[])

	static name: "foo"

	static static1: 123
	instance1: "foo"
}

declare class TestSystemData2 extends SystemDataModel<TestSystemSchema2> {
	constructor(...args: any[])

	static name: "bar"

	protected static static2: 456
	instance2: "bar"
}

export class TestItemData1 extends foundry.abstract.TypeDataModel<TestItemSchema, Item> {}

export class TestItemData2 extends SystemDataModel<TestItemSchema, Item> {}

export class TestItemData3 extends ItemDataModel<TestItemSchema> {}

export class TestItemData4 extends SystemDataModel.mixin(TestSystemData, TestSystemData2) {}
TestItemData4.name
//            ^ string
// The given class names are intentionally completely ignored as they're immiscible

TestItemData4.static1
TestItemData4["static2"]

const test = new TestItemData4()
test.instance1
test.instance2
test.schemaProp1
test.schemaProp2

export class TestItemData5 extends ItemDataModel.mixin(BasicInformationTemplate) {}

type TestItemSchema = {}

import fields = foundry.data.fields
type TestSystemSchema = {
	schemaProp1: fields.NumberField
}

type TestSystemSchema2 = {
	schemaProp2: fields.StringField
}

// export { TestItemData, type TestItemSchema }
