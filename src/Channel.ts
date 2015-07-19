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
		this._output = new Amp(context);
		this._output.level = options.outputLevel || 1.0;
		
		this._osc = new Osc(context);
		this._osc.type = options.type || 'sine';
		this._osc.frequencyValue = options.frequency || 440;
		
		this._oscAmp = new Amp(context);
		
		this._oscPitchEnv = new Env(context);
		this._oscPitchEnv.attack = options.oscPitchAttack || 0.1;
		this._oscPitchEnv.decay = options.oscPitchDecay || 0.5;
		this._oscPitchEnv.max = options.frequency || 440;
		
		this._oscAmpEnv = new Env(context);
		this._oscAmpEnv.attack = options.oscAmpAttack || 0.2;
		this._oscAmpEnv.decay = options.oscAmpDecay || 0.8;
		this._oscAmpEnv.max = options.oscLevel || 1.0;
		
		this._noise = new Noise(context);
		
		this._noiseAmp = new Amp(context);
		
		this._noiseAmpEnv = new Env(context);
		this._noiseAmpEnv.attack = options.noiseAmpAttack || 0.1;
		this._noiseAmpEnv.decay = options.noiseAmpDecay || 0.5;
		this._noiseAmpEnv.max = options.noiseLevel || 1.0;
		
		// wiring!
		this._osc.connect(this._oscAmp);
		this._oscPitchEnv.connect(this._osc.frequency);
		this._oscAmpEnv.connect(this._oscAmp.amplitude);
		this._oscAmp.connect(this._output);
		this._noise.connect(this._noiseAmp);
		this._noiseAmpEnv.connect(this._noiseAmp.amplitude);
		this._noiseAmp.connect(this._output);
		this._output.connect(context.destination);
	}
	
	start() {
		this._osc.start();
		this._noise.noise.start();
		// may end up redundant as nodes have to be renewed if stopped
	}
	
	trigger() {
		this._oscAmpEnv.trigger();
		this._oscPitchEnv.trigger();
		this._noiseAmpEnv.trigger();
	}
	
	set wave(type: string) {
		this._osc.type = type;
	}
	
	get frequency() {
		return this._osc.frequencyValue;
	}
	
	set frequency(frequency: number) {
		this._osc.frequencyValue = frequency;
	}
	
	get level(): number {
		return this._output.amplitude.value;
	}
	
	set level(level: number) {
		this._output.amplitude.value = level;
	}
	
	// changing osc/noise individual levels must change env max also!
}