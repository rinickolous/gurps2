export default function SystemDocumentMixin<T>(Base: T) {
	class SystemDocument extends SystemFlagsMixin(Base) {
		get _systemFlagsModel() {
			return this.system?.metadata?.systemFlagsModel ?? null
		}
	}
	return SystemDocument
}
