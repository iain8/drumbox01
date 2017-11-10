CREATE TABLE channels (
  id integer PRIMARY KEY NOT NULL,
  name text NOT NULL,
  options text NOT NULL,
  preset_id integer NOT NULL
);

INSERT INTO channels (name, options, preset_id)
VALUES (
  'kick',
  '{"frequency":105,"oscAmpAttack":0,"oscAmpDecay":0.630,"oscPitchAttack":0,"oscPitchDecay":0.380,"noiseLevel":0,"oscLevel":1.0,"level":0.8,"wave":"sine"}',
  1
), (
  'snare',
  '{"frequency":800,"noiseLevel":0.35,"noiseAttack":0,"noiseDecay":0.37,"oscLevel":0,"level":0.8,"wave":"sine"}',
  1
), (
  'hat',
  '{"frequency":1500,"noiseLevel":0.3,"oscLevel":0,"noiseAttack":0,"noiseDecay":0.15,"channelFilterFreq":15000,"channelFilterGain":10,"wave":"sine"}',
  1
), (
  'tom',
  '{"frequency":100,"noiseLevel":0.0,"oscLevel":0.3,"wave":"triangle","oscPitchAttack":0,"oscPitchDecay":4,"oscAmpAttack":0,"oscAmpDecay":4}',
  1
);
