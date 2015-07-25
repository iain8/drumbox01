///<reference path="modules/Osc.ts"/>
///<reference path="modules/Amp.ts"/>
///<reference path="modules/Env.ts"/>
///<reference path="modules/Noise.ts"/>
///<reference path="modules/Filter.ts"/>

class Channel {
	private _osc: Osc;
	private _oscAmp: Amp;
	private _oscPitchEnv: Env;
	private _oscAmpEnv: Env;

	private _noise: Noise;
	private _noiseAmp: Amp;
	private _noiseAmpEnv: Env;
	
	private _channelFilter: Filter;
	private _channelCleanAmp: Amp;

	private _preOutput: Amp;
	private _postOutput: Amp;
	
	// LFO?
	
	/**
	 * options = {
	 *     frequency: 440,
	 *     noiseAttack: 0.1,
	 *     noiseDecay: 0.5,
	 *     noiseLevel: 1.0,
	 *     outputLevel: 1.0,
	 *     oscAmpAttack: 0.1,
	 *     oscAmpDecay: 0.5,
	 *     oscLevel: 1.0,
	 *     oscPitchAttack: 0.1,
	 *     oscPitchDecay: 0.5,
	 *     type: 'sine'
	 * }
	 */
	constructor(context: AudioContext, options: any = {}) {
		this._preOutput = new Amp(context);
		this._preOutput.level = 1.0;
		
		this._postOutput = new Amp(context);
		this._postOutput.level = options.hasOwnProperty('outputLevel') ? options.outputLevel : 1.0;
		
		this._osc = new Osc(context);
		this._osc.type = options.hasOwnProperty('type') ? options.type : 'sine';
		this._osc.frequencyValue = options.hasOwnProperty('frequency') ? options.frequency : 440;
		
		this._oscAmp = new Amp(context);
		
		this._oscPitchEnv = new Env(context);
		this._oscPitchEnv.attack = options.hasOwnProperty('oscPitchAttack') ? options.oscPitchAttack : 0.1;
		this._oscPitchEnv.decay = options.hasOwnProperty('oscPitchDecay') ? options.oscPitchDecay : 0.5;
		this._oscPitchEnv.max = options.hasOwnProperty('frequency') ? options.frequency : 440;
		
		this._oscAmpEnv = new Env(context);
		this._oscAmpEnv.attack = options.hasOwnProperty('oscAmpAttack') ? options.oscAmpAttack : 0.2;
		this._oscAmpEnv.decay = options.hasOwnProperty('oscAmpDecay') ? options.oscAmpDecay : 0.8;
		this._oscAmpEnv.max = options.hasOwnProperty('oscLevel') ? options.oscLevel : 1.0;
		
		this._noise = new Noise(context);

		this._noiseAmp = new Amp(context);
		
		this._noiseAmpEnv = new Env(context);
		this._noiseAmpEnv.attack = options.hasOwnProperty('noiseAmpAttack') ? options.noiseAmpAttack : 0.1;
		this._noiseAmpEnv.decay = options.hasOwnProperty('noiseAmpDecay') ? options.noiseAmpDecay : 0.5;
		this._noiseAmpEnv.max = options.hasOwnProperty('noiseLevel') ? options.noiseLevel : 1.0;
		
		// single peak filter for channel
		this._channelFilter = new Filter(context);
		this._channelFilter.frequency = 500;
		this._channelFilter.type = 'peaking';
		this._channelFilter.gain = 0;
		
		// choice of high/mid/low pass for noise
		
		// wiring!
		this._osc.connect(this._oscAmp);
		this._oscPitchEnv.connect(this._osc.frequency);
		this._oscAmpEnv.connect(this._oscAmp.amplitude);
		this._oscAmp.connect(this._preOutput);
		this._noise.connect(this._noiseAmp);
		this._noiseAmpEnv.connect(this._noiseAmp.amplitude);
		this._noiseAmp.connect(this._preOutput);
		
		this._preOutput.connect(this._channelFilter);
		this._channelFilter.connect(this._postOutput);
		
		this._postOutput.connect(context.destination);
		
		this._osc.start();
		this._noise.noise.start();
	}
	
	trigger() {
		this._oscAmpEnv.trigger();
		this._oscPitchEnv.trigger();
		this._noiseAmpEnv.trigger();
	}
	
	// this sure seems like it sucks
	
	get level(): number {
		return this._preOutput.amplitude.value;
	}
	
	set level(level: number) {
		this._preOutput.amplitude.value = level;
	}
	
	get oscLevel(): number {
		return this._oscAmpEnv.max;
	}
	
	set oscLevel(level: number) {
		this._oscAmpEnv.max = level;
	}
	
	get noiseLevel(): number {
		return this._noiseAmpEnv.max;
	}
	
	set noiseLevel(level: number) {
		this._noiseAmpEnv.max = level;
	}
	
	set wave(type: string) {
		this._osc.type = type;
	}
	
	get frequency() {
		return this._osc.frequencyValue;
	}
	
	set frequency(frequency: number) {
		this._osc.frequencyValue = frequency;
		this._oscPitchEnv.max = frequency;
	}
	
	get oscAttack(): number {
		return this._oscAmpEnv.attack;
	}
	
	set oscAttack(value: number) {
		this._oscAmpEnv.attack = value;
	}
	
	get oscDecay(): number {
		return this._oscAmpEnv.decay;
	}
	
	set oscDecay(value: number) {
		this._oscAmpEnv.decay = value;
	}
	
	get pitchAttack(): number {
		return this._oscPitchEnv.attack;
	}
	
	set pitchAttack(value: number) {
		this._oscPitchEnv.attack = value;
	}
	
	get pitchDecay(): number {
		return this._oscPitchEnv.decay;
	}
	
	set pitchDecay(value: number) {
		this._oscPitchEnv.decay = value;
	}
	
	get noiseAttack(): number {
		return this._noiseAmpEnv.attack;
	}
	
	set noiseAttack(value: number) {
		this._noiseAmpEnv.attack = value;
	}
	
	get noiseDecay(): number {
		return this._noiseAmpEnv.decay;
	}
	
	set noiseDecay(value: number) {
		this._noiseAmpEnv.decay = value;
	}
	
	get channelFilterGain(): number {
		return this._channelFilter.gain;
	}
	
	set channelFilterGain(value: number) {
		this._channelFilter.gain = value;
	}
	
	get channelFilterFreq(): number {
		return this._channelFilter.frequency;
	}
	
	set channelFilterFreq(value: number) {
		this._channelFilter.frequency = value;
	}
	
	// changing osc/noise individual levels must change env max also!
}