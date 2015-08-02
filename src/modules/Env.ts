class Env {
	attack: number;
	decay: number;
	max: number;
	min: number;
	param: AudioParam;
	context: AudioContext;
	
	constructor(context: AudioContext) {
		this.context = context;
		this.attack = 0.01;
		this.decay = 0.5;
		this.max = 1;
		this.min = 0;
	}
	
	trigger() {
		var now: number = this.context.currentTime;
		
		this.param.cancelScheduledValues(now);
		this.param.setValueAtTime(this.min, now);
		this.param.linearRampToValueAtTime(this.max, now + this.attack);
		this.param.exponentialRampToValueAtTime(this.min, now + this.attack + this.decay);
	}
	
	connect(param: AudioParam) {
		this.param = param;
	}
}