///<reference path="modules/Osc.ts"/>
///<reference path="modules/Amp.ts"/>
///<reference path="modules/Env.ts"/>
///<reference path="modules/Noise.ts"/>

class Channel {
	private _osc: Osc;
	private _oscAmp: Amp;
	private _oscPitchEnv: Env;
	private _oscAmpEnv: Env;
	private _noise: Noise;
	private _noiseAmp: Amp;
	private _noiseAmpEnv: Env;
	private _output: Amp;
	
	// amp or summing buss
	// LFO?
	
	constructor(context: AudioContext) {
		this._output = new Amp(context, 1.0);
		
		this._osc = new Osc(context, 'sine', 440);
		this._oscAmp = new Amp(context);
		this._oscPitchEnv = new Env(context);
		this._oscAmpEnv = new Env(context);
		
		this._noise = new Noise(context);
		this._noiseAmp = new Amp(context);
		this._noiseAmpEnv = new Env(context);
		
		this._osc.connect(this._oscAmp);
		
		this._oscPitchEnv.connect(this._osc.oscillator.frequency);
		this._oscAmpEnv.connect(this._oscAmp.amplitude);
		this._oscAmp.connect(this._output);
		
		this._noise.connect(this._noiseAmp);
		this._noiseAmpEnv.connect(this._noiseAmp.amplitude);
		this._noiseAmp.connect(this._output);
		
		this._output.connect(context.destination);
	}
	
	start() {
		this._osc.oscillator.start();
		this._noise.noise.start();
		// may end up redundant as nodes have to be renewed if stopped
	}
	
	trigger() {
		this._oscAmpEnv.trigger();
		this._oscPitchEnv.trigger();
		this._noiseAmpEnv.trigger();
	}
	
	set wave(type: string) {
		this._osc.oscillator.type = type;
	}
	
	get level(): number {
		return this._output.amplitude.value;
	}
	
	set level(level: number) {
		this._oscAmp.amplitude.value = level;
		this._output.amplitude.value = level;
	}
}