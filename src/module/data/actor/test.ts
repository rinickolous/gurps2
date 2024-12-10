import { ActorDataModel } from "./base.ts"
import { TestTemplate } from "./test-temp.ts"

export class TestActor extends ActorDataModel.mixin(TestTemplate) {
	testFunc() {
		this.test
	}
}
