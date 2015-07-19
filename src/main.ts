///<reference path="jquery.d.ts"/>
///<reference path="Channel.ts"/>
///<reference path="Sequencer.ts"/>
///<reference path="UI.ts"/>

declare var webkitAudioContext: {
    new (): AudioContext;
}
    
var audioContext: any = new (AudioContext || webkitAudioContext)();
var tempo: number = 80;

var channels = {
    'kick': new Channel(audioContext, {
        frequency: 200,
        noiseLevel: 0.001,
        oscLevel: 0.9
    }),
    'snare': new Channel(audioContext, {
        frequency: 800,
        noiseLevel: 0.7,
        oscLevel: 0.3
    }),
    'hat': new Channel(audioContext, {
        frequency: 1500,
        noiseLevel: 0.7,
        oscLevel: 0.3
    }),
    'thing': new Channel(audioContext, {
        frequency: 1000,
        noiseLevel: 0.0,
        oscLevel: 0.3
    })
};

var sequencer = new Sequencer(channels, 80);

$.each(channels, (name, channel) => {
    UI.addChannel(name, channel, sequencer.length);
});

$('.sequence li').click(function() {
	$(this).toggleClass('on');
});

$('#mute').click(() => {
	sequencer.stop();
});

sequencer.start();

// then jq knobs
// namespaces
// gui code