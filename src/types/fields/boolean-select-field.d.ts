import { SimpleMerge } from "fvtt-types/utils";
import fields = foundry.data.fields

declare global {

	namespace BooleanSelectField {
		type Options = fields.BooleanField.Options & {
			choices?:
			| readonly boolean[]
			| Record<string, string>
			| (() => readonly boolean[] | Record<string | number, string>)

		}

		type DefaultOptions = SimpleMerge<
			fields.DataField.DefaultOptions,
			{
				required: true;
				nullable: false;
				initial: boolean;
				choices: {
					true: "true",
					false: "false"
				}
			}
		>;
	}
}
