CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    "isCompleted" BOOLEAN DEFAULT FALSE,
    assignee VARCHAR(50)
);

INSERT INTO tasks (title, "isCompleted", assignee) VALUES
    ('Réviser Git', false, 'Cassidy'),
    ('Passer son rattrapage', false, 'Pharah'),
    ('Trouver une alternance', true, 'Moira'),
    ('Ranger son ordinateur', false, NULL);