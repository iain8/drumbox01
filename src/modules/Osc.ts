///<reference path="BaseModule.ts"/>

class Osc extends BaseModule {
	private _oscillator: OscillatorNode;
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
	
	start() {
		this._oscillator.start();
	}
	
	set type(type: string) {
		this._oscillator.type = type;
	}
	
	set frequencyValue(frequency: number) {
		this.frequency.value = frequency;
	}
}