CREATE TABLE sequences (
  id integer PRIMARY KEY NOT NULL,
  position integer NOT NULL,
  pattern text NOT NULL,
  preset_id integer NOT NULL
);

INSERT INTO sequences (position, pattern, preset_id)
VALUES
  (0, '1001001101000100', 1),
  (1, '0000100000001000', 1),
  (2, '0010001000100010', 1),
  (3, '1001001101000100', 1);