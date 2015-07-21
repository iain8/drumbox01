///<reference path="jquery.d.ts"/>
///<reference path="Channel.ts"/>
///<reference path="Sequencer.ts"/>
///<reference path="UI.ts"/>
///<reference path="jquery.knob.d.ts"/>

declare var webkitAudioContext: {
    new (): AudioContext;
}
    
var audioContext: any = new (AudioContext || webkitAudioContext)();
var tempo: number = 120;

var channels = {
    // better but still clicky
    'kick': new Channel(audioContext, {
        frequency: 105,
        oscAmpAttack: 0,
        oscAmpDecay: 0.630,
        oscPitchAttack: 0,
        oscPitchDecay: 0.380,
        noiseLevel: 0,
        oscLevel: 1.0,
        level: 0.8
    }),
    // need to tailor noise level (it is V LOUD)
    'snare': new Channel(audioContext, {
        frequency: 800,
        noiseLevel: 0.35,
        noiseAmpAttack: 0,
        noiseAmpDecay: 0.37,
        oscLevel: 0,
        level: 0.8
    }),
    'hat': new Channel(audioContext, {
        frequency: 1500,
        noiseLevel: 0.3,
        oscLevel: 0.3
    }),
    'thing': new Channel(audioContext, {
        frequency: 1000,
        noiseLevel: 0.0,
        oscLevel: 0.3
    })
};

// there's some encoding to be done here
var patterns = {
    kick: '1010101010101010',
    snare: '0010001000100010',
    hat: '0101010101010101'
};

var sequencer = new Sequencer(channels, 80);

$.each(channels, (name, channel) => {
    UI.addChannel(name, channel, sequencer.length, patterns[name]);
});

UI.indicator(sequencer.length);

// put these things in the UI class
$('.sequence li').click(function() {
	$(this).toggleClass('on');
});

$('#mute').click(() => {
    if (sequencer.started) {
        sequencer.stop();
    } else {
        sequencer.start();
    }
    
    return false;
});

$('#tempo').knob({
    min: 1,
    max: 300,
    change: function(value) {
        sequencer.setTempo(value);
    }
});

sequencer.start();