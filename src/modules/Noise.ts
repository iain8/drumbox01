///<reference path="BaseModule.ts"/>

/**
 * Noise generator, fills a buffer with random white noise
 */
class Noise extends BaseModule {
	private _channels: number = 1;
	private _noise: AudioBufferSourceNode;
	input: AudioBufferSourceNode;
	output: AudioBufferSourceNode;
	
	constructor(context: AudioContext) {
		super();
		
		var size: number = 2 * context.sampleRate;
		var buffer: AudioBuffer = context.createBuffer(this._channels, size, context.sampleRate);
		var output: number[] = buffer.getChannelData(0);
		
		// white noise
		for (var i = 0; i < size; ++i) {
			output[i] = Math.random() * 2 - 1;
		}
		
		this._noise = context.createBufferSource();
		this._noise.buffer = buffer;
		this._noise.loop = true;
		
		this.input = this._noise;
		this.output = this._noise;
	}
	
	/**
	 * Start generating noise
	 */
	start() {
		this._noise.start();
	}
}