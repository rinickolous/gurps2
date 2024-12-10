class ActiveEffectGURPS extends ActiveEffect {
	/* -------------------------------------------- */

	/**
	 * Type safe way of verifying if an ActiveEffect is of a particular type.
	 */
	isOfType<T extends ActiveEffectType>(...types: T[]): this is { system: EffectDataModelClasses[T] } {
		return types.some(t => this.type === t)
	}
}

export { ActiveEffectGURPS }
