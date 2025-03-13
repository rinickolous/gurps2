import { SYSTEM_NAME } from "@util"

export default function SystemFlagsMixin<T extends typeof foundry.abstract.Document>(Base: T) {
	class SystemFlags extends Base {
		get _systemFlagsDataModel(): typeof foundry.abstract.DataModel | null {
			return null
		}

		/* -------------------------------------------- */

		/** @inheritDoc */
		prepareData() {
			super.prepareData()
			if (SYSTEM_NAME in this.flags && this._systemFlagsDataModel) {
				this.flags[SYSTEM_NAME] = new this._systemFlagsDataModel(this._source.flags.dnd5e, { parent: this })
			}
		}

		/* -------------------------------------------- */

		/** @inheritDoc */
		async setFlag(scope, key, value) {
			if (scope === SYSTEM_NAME && this._systemFlagsDataModel) {
				let diff
				const changes = foundry.utils.expandObject({ [key]: value })
				if (this.flags[SYSTEM_NAME]) diff = this.flags[SYSTEM_NAME].updateSource(changes, { dryRun: true })
				else diff = new this._systemFlagsDataModel(changes, { parent: this }).toObject()
				return this.update({ flags: { dnd5e: diff } })
			}
			return super.setFlag(scope, key, value)
		}
	}
	return SystemFlags
}
