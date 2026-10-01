CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    "isCompleted" BOOLEAN DEFAULT FALSE,
    assignee VARCHAR(50)
);

INSERT INTO tasks (title, "isCompleted", assignee) VALUES
    ('Réviser Git', false, 'Nathan'),
    ('Passer son rattrapage', false, 'Thomas'),
    ('Trouver une alternance', true, 'Théo'),
    ('Ranger son ordinateur', false, NULL);