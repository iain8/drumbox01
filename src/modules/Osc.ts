class Osc {
	oscillator: OscillatorNode;
	context: AudioContext;
	input: OscillatorNode;
	output: OscillatorNode;
	
	constructor(context: AudioContext, type: string, frequency: number) {
		this.context = context;
		this.oscillator = context.createOscillator();
		this.oscillator.type = type;
		this.oscillator.frequency.value = frequency;
		this.input = this.oscillator;
		this.output = this.oscillator;
	}
	
	connect(node: any) {
		if (node.hasOwnProperty('input')) {
			this.output.connect(node.input);
		} else {
			this.output.connect(node);
		}
	}
}