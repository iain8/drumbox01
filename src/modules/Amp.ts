class Amp {
	gain: GainNode;
	amplitude: AudioParam;
	input: AudioParam;
	
	constructor(context: AudioContext) {
		this.gain = context.createGain();
		this.gain.gain.value = 0;
		this.amplitude = this.gain.gain;
		this.input = this.gain.gain;
	}
	
	connect(node: any) {
		if (node.hasOwnProperty('input')) {
			this.gain.connect(node.input);
		} else {
			this.gain.connect(node);
		}
	}
}