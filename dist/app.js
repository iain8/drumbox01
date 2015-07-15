var Osc = (function () {
    function Osc(context, type, frequency) {
        this.context = context;
        this.oscillator = context.createOscillator();
        this.oscillator.type = type;
        this.oscillator.frequency.value = frequency;
        this.input = this.oscillator;
    }
    Osc.prototype.connect = function (node) {
        if (node.hasOwnProperty('input')) {
            this.oscillator.connect(node.input);
        }
        else {
            this.oscillator.connect(node);
        }
    };
    return Osc;
})();
//import Osc = DrumMachine.Osc;
///<reference path="modules/Osc.ts"/>
var audioContext = new (AudioContext || webkitAudioContext)();
var osc = new Osc(audioContext, 'sine', 440);
//# sourceMappingURL=app.js.map