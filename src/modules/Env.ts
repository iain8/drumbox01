class Env {
	attack: number;
	decay: number;
	max: number;
	min: number;
	param: AudioParam;
	context: AudioContext;
	
	constructor(context: AudioContext, attack: number = 0.01, decay: number = 0.1, max: number = 1, min: number = 0) {
		this.context = context;
		this.attack = attack;
		this.decay = decay;
		this.max = max;
		this.min = min;
	}
	
	trigger() {
		var now: number = this.context.currentTime;
		
		this.param.cancelScheduledValues(now);
		this.param.setValueAtTime(this.min, now);
		this.param.linearRampToValueAtTime(this.max, now + this.attack);
		this.param.linearRampToValueAtTime(this.min, now + this.attack + this.decay);
	}
	
	connect(param: AudioParam) {
		this.param = param;
	}
}