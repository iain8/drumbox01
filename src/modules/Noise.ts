///<reference path="BaseModule.ts"/>

class Noise extends BaseModule {
	channels: number = 1;
	noise: AudioBufferSourceNode;
	input: AudioBufferSourceNode;
	output: AudioBufferSourceNode;
	
	constructor(context: AudioContext) {
		super();
		
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
		
		this.input = this.noise;
		this.output = this.noise;
	}
}