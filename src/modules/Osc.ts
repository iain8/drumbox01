class Osc {
	oscillator: OscillatorNode;
	context: AudioContext;
	input: OscillatorNode;
	
	constructor(context: AudioContext, type: string, frequency: number) {
		this.context = context;
		this.oscillator = context.createOscillator();
		this.oscillator.type = type;
		this.oscillator.frequency.value = frequency;
		this.input = this.oscillator;
	}
	
	connect(node) {
		if (node.hasOwnProperty('input')) {
			this.oscillator.connect(node.input);
		} else {
			this.oscillator.connect(node);
		}
	}
}