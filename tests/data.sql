INSERT INTO user (name)
VALUES ('User 1'),
       ('User 2');

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

INSERT INTO score (fk_user, fk_game, score)
VALUES (1, 1, 1),
       (2, 1, 2);