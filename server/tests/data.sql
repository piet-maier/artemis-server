INSERT INTO game_type (name, function)
VALUES ('Type 1', 'MAX'),
       ('Type 2', NULL),
       ('Type 3', NULL),
       ('Type 4', NULL);

INSERT INTO game (fk_game_type, creation_timestamp)
VALUES (1, 0),
       (2, 31536000),
       (2, 63072000),
       (3, 126230400),
       (3, 94694400);

INSERT INTO user (name)
VALUES ('User 1'),
       ('User 2'),
       ('User 3'),
       ('User 4'),
       ('User 5');

INSERT INTO round (fk_game, number)
VALUES (1, 0),
       (1, 1),
       (1, 2);

INSERT INTO score (fk_user, fk_game, score, fk_round)
VALUES (1, 1, 1, 1),
       (2, 1, 2, 2),
       (1, 1, -5, 2);