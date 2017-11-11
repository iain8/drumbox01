CREATE TABLE presets (
  id integer PRIMARY KEY NOT NULL,
  tempo real NOT NULL,
  division integer NOT NULL,
  master_volume integer NOT NULL,
  sequence_length integer NOT NULL
);

INSERT INTO presets (id, tempo, division, master_volume, sequence_length)
VALUES (1, 120.0, 4, 80, 16);
