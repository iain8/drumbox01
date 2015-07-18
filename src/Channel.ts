///<reference path="modules/Osc.ts"/>
///<reference path="modules/Amp.ts"/>
///<reference path="modules/Env.ts"/>
///<reference path="modules/Noise.ts"/>

class Channel {
	private _osc: Osc;
	private _oscAmp: Amp;
	private _oscPitchEnv: Env;
	private _oscAmpEnv: Env;
	private _wave: string;
	private _frequency: number;
	
	private _noise: Noise;
	private _noiseAmp: Amp;
	private _noiseAmpEnv: Env;
	
	private _output: Amp;
	private _level: number;
	// amp or summing buss
	// LFO?
	
	constructor(context: AudioContext) {
		this._output = new Amp(context);
		
		this._osc = new Osc(context, 'sine', 440);
		this._oscAmp = new Amp(context);
		this._oscPitchEnv = new Env(context);
		this._oscAmpEnv = new Env(context);
		this._wave = this._osc.oscillator.type;
		
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
		this._level = this._output.amplitude.value;
	}
	
	start() {
		this._osc.oscillator.start();
		
		// start noise, LFO, etc
	}
	
	set wave(type: string) {
		this._wave = type;
	}
	
	get level(): number {
		return this._level;
	}
	
	set level(level: number) {
		this._level = level;
	}
}