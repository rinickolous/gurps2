import { SystemDataModel } from "@data/abstract.ts"
import { ItemDataModel } from "./base.ts"
import { BasicInformationTemplate } from "./templates/basic-information.ts"

export class TestItemData1 extends foundry.abstract.TypeDataModel<TestItemSchema, Item> {}

export class TestItemData2 extends SystemDataModel<TestItemSchema, Item> {}

export class TestItemData3 extends ItemDataModel<TestItemSchema> {}

export class TestItemData4 extends SystemDataModel.mixin<[typeof BasicInformationTemplate], TestItemSchema>(
	BasicInformationTemplate,
) {}

export class TestItemData5 extends ItemDataModel.mixin<[typeof BasicInformationTemplate], TestItemSchema>(
	BasicInformationTemplate,
) {}

type TestItemSchema = {}

// export { TestItemData, type TestItemSchema }
