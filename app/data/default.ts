const data = [{
  "name": "kick",
  "options": {
    "frequency": 105,
    "oscAmpAttack": 0,
    "oscAmpDecay": 0.630,
    "oscPitchAttack": 0,
    "oscPitchDecay": 0.380,
    "noiseLevel": 0,
    "oscLevel": 1.0,
    "level": 0.8
  },
  "pattern": "1001001101000100"
}, {
  "name": "snare", 
  "options": {
    "frequency": 800,
    "noiseLevel": 0.35,
    "noiseAttack": 0,
    "noiseDecay": 0.37,
    "oscLevel": 0,
    "level": 0.8
  },
  "pattern": "0000100000001000"
}, {
  "name": "hat", 
  "options": {
    "frequency": 1500,
    "noiseLevel": 0.3,
    "oscLevel": 0,
    "noiseAttack": 0,
    "noiseDecay": 0.15,
    "channelFilterFreq": 15000,
    "channelFilterGain": 10
  },
  "pattern": "0010001000100010"
}, {
  "name": "tom",
  "options": {
    "frequency": 100,
    "noiseLevel": 0.0,
    "oscLevel": 0.3,
    "wave": "triangle",
    "oscPitchAttack": 0,
    "oscPitchDecay": 4,
    "oscAmpAttack": 0,
    "oscAmpDecay": 4
  },
  "pattern": "1001001101000100"
}];

export default data;
