INSERT INTO game_type (name)
VALUES ('Type 1'),
       ('Type 2'),
       ('Type 3'),
       ('Type 4');

INSERT INTO game (fk_game_type, creation_timestamp)
VALUES (1, 0),
       (2, 31536000),
       (2, 63072000),
       (3, 126230400),
       (3, 94694400);