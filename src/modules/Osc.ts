///<reference path="BaseModule.ts"/>

/**
 * Oscillator module, wraps an OscillatorNode
 */
class Osc extends BaseModule {
	private _oscillator: any;	// due to iOS noteOn()
	input: OscillatorNode;
	output: OscillatorNode;
	frequency: AudioParam;
	
	constructor(context: AudioContext) {
		super();
		
		this._oscillator = context.createOscillator();
		this._oscillator.type = 'sine';
		this._oscillator.frequency.value = 440;
		this.input = this._oscillator;
		this.output = this._oscillator;
		this.frequency = this._oscillator.frequency;
	}
	
	/**
	 * Start oscillator oscillating
	 */
	start() {
		this._oscillator.start ? this._oscillator.start(0) : this._oscillator.noteOn(0);
	}
	
	get type(): string {
		return this._oscillator.type;
	}
	
	set type(type: string) {
		this._oscillator.type = type;
	}
	
	get frequencyValue() {
		return this.frequency.value;
	}
	
	set frequencyValue(frequency: number) {
		this.frequency.value = frequency;
	}
}