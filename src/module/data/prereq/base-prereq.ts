import { ItemDataModel } from "@data/item/base.ts";
import fields = foundry.data.fields
import { prereq } from "@util";

abstract class BasePrereq<
	Schema extends BasePrereqSchema = BasePrereqSchema,
	Parent extends ItemDataModel = ItemDataModel
> extends foundry.abstract.DataModel<
	Schema,
	Parent
> {
}

const basePrereqSchema = {
	id: new fields.StringField({ required: true, nullable: false, blank: false, initial: () => foundry.utils.randomID() }),
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		choices: prereq.TypesChoices,
		initial: this.TYPE,
	}),
	has: new BooleanSelectField({
		required: true,
		nullable: true,
		choices: {
			true: "GURPS.Item.Prereqs.FIELDS.Has.Choices.true",
			false: "GURPS.Item.Prereqs.FIELDS.Has.Choices.false",
		},
		initial: true,
	}),
}
