class Noise {
	channels: number = 2;
	noise: AudioBufferSourceNode;
	input: AudioBufferSourceNode;
	
	constructor(context: AudioContext) {
		var size: number = 2 * context.sampleRate;
		var buffer: AudioBuffer = context.createBuffer(this.channels, size, context.sampleRate);
		var output: number[] = buffer.getChannelData(0);
		
		// more noise functions to be done
		for (var i = 0; i < size; ++i) {
			output[i] = Math.random() * 2 - 1;
		}
		
		this.noise = context.createBufferSource();
		this.noise.buffer = buffer;
		this.noise.loop = true;
		this.noise.start();
		
		this.input = this.noise;
	}
	
	connect(node: any) {
		if (node.hasOwnProperty('input')) {
			this.noise.connect(node.input);
		} else {
			this.noise.connect(node);
		}
	}
}