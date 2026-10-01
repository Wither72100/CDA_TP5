const express = require('express');
const cors = require('cors');
const Joi = require('joi');
const app = express();
const port = 3000;

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}));

app.use(express.json());

const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const createSchema = Joi.object({
    title: Joi.string().trim().min(1).max(255).required(),
    isCompleted: Joi.boolean()
});

const updateSchema = Joi.object({
    title: Joi.string().trim().min(1).max(255),
    isCompleted: Joi.boolean()
}).min(1);

app.get('/', (req, res) => {
    res.json({
        message: "bravo"
    });
});

app.post('/tasks', async (req, res) => {
    const { error: validationError, value } = createSchema.validate(req.body);

    if (validationError) {
        return res.status(400).json({
            message: validationError.details[0].message
        });
    }

    const { title, isCompleted } = value;

    try {
        const result = await pool.query(
            `INSERT INTO tasks (title, "isCompleted")
            VALUES ($1, $2)
            RETURNING *`,
            [title, isCompleted ?? false]
        );

        res.status(201).json({
            message: 'task created',
            newTask: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Database error'
        });
    }
});

app.get('/tasks', async (req, res) => {
    const { status } = req.query;

    try {

        if (status === undefined) {
            const result = await pool.query(
                'SELECT * FROM tasks ORDER BY id'
            );

            return res.json({
                message: `${result.rows.length} tasks found`,
                tasks: result.rows
            });
        }

        if (status !== 'completed' && status !== 'uncompleted') {
            return res.status(400).json({
                message: 'incorrect status'
            });
        }

        let query;

        if (status === 'completed') {
            query = `
                SELECT * FROM tasks
                WHERE "isCompleted" = true
                ORDER BY id
            `;
        } else {
            query = `
                SELECT * FROM tasks
                WHERE "isCompleted" = false
                ORDER BY id
            `;
        }

        const result = await pool.query(query);

        res.json({
            message: `${result.rows.length} ${status} tasks found`,
            filteredTasks: result.rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Database error'
        });
    }
});

app.put('/tasks/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { error: validationError, value } = updateSchema.validate(req.body);

    if (validationError) {
        return res.status(400).json({
            message: validationError.details[0].message
        });
    }

    const { title, isCompleted } = value;

    try {
        const result = await pool.query(
            `UPDATE tasks
            SET title = COALESCE($1, title),
                "isCompleted" = COALESCE($2, "isCompleted")
            WHERE id = $3
            RETURNING *`,
            [title, isCompleted, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'task not found'
            });
        }

        res.json({
            message: 'task modified',
            task: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Database error'
        });
    }
});

app.delete('/tasks/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const result = await pool.query(
            `DELETE FROM tasks
            WHERE id = $1
            RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'task not found'
            });
        }

        res.json({
            message: 'task deleted',
            task: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Database error'
        });
    }
});

app.patch('/tasks/:id/completed', async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const result = await pool.query(
            `UPDATE tasks
            SET "isCompleted" = NOT "isCompleted"
            WHERE id = $1
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'task not found'
            });
        }

        res.json({
            message: 'task status toggled',
            task: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Database error'
        });
    }
});

app.listen(port, () => {
    console.log(`Serveur Express en cours sur http://localhost:${port}`);
});