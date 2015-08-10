# drumbox01

An HTML5 drum machine, inspired by the usual retro classics and more modern takes such as the mighty Microtonic by Sonic Charge. Development started in Javascript but I had an object-oriented structure in mind already so I decided to take the opportunity to try out Typescript, having seen it pop up originally a few years ago.

The result is a better structured application, but one that unfortunately compiles into a big messy JS file at the moment. However there is the ability to compile into AMD type modules, so that is on the list for the future. The only dependencies are jQuery and jQuery Knob for the UI.

There are four channels, each comprises of:

*  An oscillator, with pitch and amplitude envelopes and choice of four waveforms
*  A noise generator (short audio buffer containing random noise) with amp envelope and planned filter
*  Mix controls and a peak filter on the output

The channels are connected to a simple step sequencer of 16 beats in length, you can alter the tempo or division size (step size) and eventually hopefully articulation. It triggers the envelopes of the channels per step, this gets around the Web Audio API limitation of having to recycle nodes after you call stop() (i.e. they never stop, their volume is just manipulated accordingly).

The result of this, combined with use of setInterval() rather than future scheduling, is that timing is not exactly super tight, and if you switch tabs it suddenly sounds drunk. This is an area to spend more development time on in the future.

There’s even support for mobile devices, at least as far as it making sound (after dealing with the iOS implementation of Web Audio being strangely behind the spec with methods like noteOn() rather than the modern start()).

Future plans are as mentioned to refactor the sequencer into something more robust, add the missing features to the channels and spruce up the interface. Some weird effects could be fun too but that might be a separate project.

References:
*  http://noisehack.com/generate-noise-web-audio-api/
*  https://developer.tizen.org/community/tip-tech/advanced-web-audio-api-usage
*  http://blog.chrislowis.co.uk/2013/06/17/synthesis-web-audio-api-envelopes.html

Design inspiration:
*  https://dribbble.com/shots/1177700-Font-Dashboard
