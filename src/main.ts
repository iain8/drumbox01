///<reference path="Channel.ts"/>
///<reference path="Sequencer.ts"/>

declare var webkitAudioContext: {
    new (): AudioContext;
}
    
var audioContext: any = new (AudioContext || webkitAudioContext)();
var tempo: number = 80;

var channels = {};
channels['kick'] = new Channel(audioContext, {
    frequency: 200,
    noiseLevel: 0.001,
    oscLevel: 0.9,
    type: 'sine'
});

var sequencer = new Sequencer(channels, 80);
sequencer.start();

// then jq knobs
// namespaces
// gui code