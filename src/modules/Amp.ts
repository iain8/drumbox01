///<reference path="BaseModule.ts"/>

class Amp extends BaseModule {
	private _gain: GainNode;
	amplitude: AudioParam;
	input: GainNode;
	output: GainNode;
	
	constructor(context: AudioContext, level: number = 0) {
		super();
		
		this._gain = context.createGain();
		this._gain.gain.value = level;
		this.amplitude = this._gain.gain;
		this.input = this._gain;
		this.output = this._gain;
	}
}