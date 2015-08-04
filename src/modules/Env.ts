/**
 * (A)ttack (D)ecay envelope generator
 */
class Env {
	private _param: AudioParam;
	private _context: AudioContext;
	
	attack: number;
	decay: number;
	private _max: number;
	private _min: number;
	
	constructor(context: AudioContext) {
		this._context = context;
		this.attack = 0.1;
		this.decay = 0.5;
		this.max = 1;
		this.min = 0.0001;
	}
	
	/**
	 * Trigger an envelope
	 * CAUTION: any 0 values passed to exponentialRamp cause FF errors
	 */
	trigger() {
		var now: number = this._context.currentTime;
		
		this._param.cancelScheduledValues(now);
		this._param.setValueAtTime(this._min, now);
		this._param.linearRampToValueAtTime(this._max, now + this.attack);
		
		this._param.exponentialRampToValueAtTime(this._min, now + this.attack + this.decay);
	}
	
	/**
	 * Connect to an AudioParam of another node
	 */
	connect(param: AudioParam) {
		this._param = param;
	}
	
	set max(value: number) {
		this._max = value > 0 ? value : 0.0001; 
	}
	
	get max(): number {
		return this._max;
	}
	
	set min(value: number) {
		this._min = value > 0 ? value : 0.0001; 
	}
	
	get min(): number {
		return this._min;
	}
}