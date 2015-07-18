///<reference path="Channel.ts"/>

declare var webkitAudioContext: {
    new (): AudioContext;
}
    
var audioContext: any = new (AudioContext || webkitAudioContext)();
var tempo: number = 120;

var channel: Channel = new Channel(audioContext);
channel.start();

// also jquery
// then jq knobs
// namespaces
// gui code