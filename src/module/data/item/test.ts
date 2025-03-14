import { SystemDataModel } from "@data/abstract.ts"
import { ItemDataModel } from "./base.ts"
import { BasicInformationTemplate } from "./templates/basic-information.ts"

export class TestItemData1 extends foundry.abstract.TypeDataModel<TestItemSchema, Item> {}

export class TestItemData2 extends SystemDataModel<TestItemSchema, Item> {}

export class TestItemData3 extends ItemDataModel<TestItemSchema> {}

export class TestItemData4 extends SystemDataModel.mixin<[typeof TestSystemData], TestItemSchema>(TestSystemData) {}

export class TestItemData5 extends ItemDataModel.mixin<[typeof BasicInformationTemplate], TestItemSchema>(
	BasicInformationTemplate,
) {}

class TestSystemData extends SystemDataModel<TestSystemSchema> {}

type TestItemSchema = {}
type TestSystemSchema = {}

// export { TestItemData, type TestItemSchema }
