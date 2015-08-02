/**
 * (A)ttack (D)ecay envelope generator
 */
class Env {
	private _param: AudioParam;
	private _context: AudioContext;
	
	attack: number;
	decay: number;
	max: number;
	min: number;
	
	constructor(context: AudioContext) {
		this._context = context;
		this.attack = 0.01;
		this.decay = 0.5;
		this.max = 1;
		this.min = 0;
	}
	
	/**
	 * Trigger an envelope
	 */
	trigger() {
		var now: number = this._context.currentTime;
		
		this._param.cancelScheduledValues(now);
		this._param.setValueAtTime(this.min, now);
		this._param.linearRampToValueAtTime(this.max, now + this.attack);
		
		var min = this.min > 0.0 ? this.min : 0.001;
		
		this._param.exponentialRampToValueAtTime(min, now + this.attack + this.decay);
	}
	
	/**
	 * Connect to an AudioParam of another node
	 */
	connect(param: AudioParam) {
		this._param = param;
	}
}