const UserRepository = require("./repository");
const express = require('express');
const Container = require("./container");

const app = express();
app.use(express.json());
app.set('container', new Container());

app.get('/users', async (request, response) => {
    const repository = await app.get('container').getUserRepository();
    const users = await repository.findAll();
    response.json(users);
});

app.post('/users', async (request, response) => {
    const repository = await app.get('container').getUserRepository();
    try {
        const user = await repository.create(request.body);
        response.status(201).json(user);
    } catch (e) {
        response.status(500).json({ error: e.message });
    }
});

app.get('/users/:id', async (request, response) => {
    const repository = await app.get('container').getUserRepository();
    try {
        const user = await repository.findById(request.params.id);
        if (!user) {
            response.status(404).json({
                status: 404,
                error: 'Usuário não encontrado'
            });
        } else {
            response.json(user);
        }
    } catch (e) {
        console.log(e);
        response.status(500).json({ error: e.message });
    }
});

app.put('/users/:id', async (request, response) => {
    const repository = await app.get('container').getUserRepository();
    const user = await repository.findById(request.params.id);
    if (!user) {
        response.status(404).json({
            status: 404,
            error: 'Usuário não encontrado'
        });
    } else {
        const newUser = { ...user, ...request.body };
        await repository.update(newUser);
        response.json(newUser);
    }
});

app.delete('/users/:id', async (request, response) => {
    const repository = await app.get('container').getUserRepository();
    const user = await repository.findById(request.params.id);
    if (!user) {
        response.status(404).json({
            status: 404,
            error: 'Usuário não encontrado'
        });
    } else {
        await repository.delete(user);
        response.sendStatus(204);
    }
});

module.exports = app;