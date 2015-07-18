///<reference path="BaseModule.ts"/>

class Osc extends BaseModule {
	oscillator: OscillatorNode;
	context: AudioContext;
	input: OscillatorNode;
	output: OscillatorNode;
	
	constructor(context: AudioContext, type: string, frequency: number) {
		super();
		
		this.context = context;
		this.oscillator = context.createOscillator();
		this.oscillator.type = type;
		this.oscillator.frequency.value = frequency;
		this.input = this.oscillator;
		this.output = this.oscillator;
	}
}