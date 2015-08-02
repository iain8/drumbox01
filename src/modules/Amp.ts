///<reference path="BaseModule.ts"/>

/**
 * Amplifier module, wraps a GainNode
 */
class Amp extends BaseModule {
	private _gain: GainNode;
	amplitude: AudioParam;
	input: GainNode;
	output: GainNode;
	
	constructor(context: AudioContext) {
		super();
		
		this._gain = context.createGain();
		this._gain.gain.value = 0;
		this.amplitude = this._gain.gain;
		this.input = this._gain;
		this.output = this._gain;
	}
	
	set level(level: number) {
		this.amplitude.value = level;
	}
}