//import Osc = DrumMachine.Osc;
///<reference path="modules/Osc.ts"/>
    
declare var webkitAudioContext: {
    new (): AudioContext;
}
    
var audioContext = new (AudioContext || webkitAudioContext)();
    
var osc = new Osc(audioContext, 'sine', 440);