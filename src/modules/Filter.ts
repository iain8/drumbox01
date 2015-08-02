///<reference path="BaseModule.ts"/>

/**
 * Filter module, wraps BiquadFilterNode
 */
class Filter extends BaseModule {
	private _filter: BiquadFilterNode;
	input: BiquadFilterNode;
	output: BiquadFilterNode;
	
	constructor(context: AudioContext) {
		super();
		
		this._filter = context.createBiquadFilter();
		
		this.input = this._filter;
		this.output = this._filter;
	}
	
	get gain(): number {
		return this._filter.gain.value;
	}
	
	set gain(value: number) {
		this._filter.gain.value = value;
	}
	
	get frequency() {
		return this._filter.frequency.value;
	}
	
	set frequency(value: number) {
		this._filter.frequency.value = value;
	}
	
	set type(value: string) {
		this._filter.type = value;
	}
}