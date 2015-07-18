///<reference path="Channel.ts"/>
///<reference path="Sequencer.ts"/>

declare var webkitAudioContext: {
    new (): AudioContext;
}
    
var audioContext: any = new (AudioContext || webkitAudioContext)();
var tempo: number = 80;

var channels = {};
channels['kick'] = new Channel(audioContext);

var sequencer = new Sequencer(channels, 80);
sequencer.start();

// then jq knobs
// namespaces
// gui code