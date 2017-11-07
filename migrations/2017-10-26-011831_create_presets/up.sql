CREATE TABLE presets (
  id integer PRIMARY KEY NOT NULL,
  tempo real NOT NULL,
  division integer NOT NULL,
  master_volume integer NOT NULL
);

INSERT INTO presets (id) VALUES (1);
