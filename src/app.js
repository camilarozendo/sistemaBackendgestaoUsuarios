const UserRepository = require("./repository");
const express = require('express');
const Container = require("./container");
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({
    exposedHeaders: ['x-total-count'],
}));
app.set('container', new Container());

const normalizePk = (user) => {
    user.id = user._id;
    delete user._id;
    return user;
};

app.get('/users', async (request, response) => {
    const repository = await app.get('container').getUserRepository();
    const users = (await repository.findAll()).map(normalizePk);
    response.set('X-Total-Count', users.length);
    response.json(users);
});

app.post('/users', async (request, response) => {
    const repository = await app.get('container').getUserRepository();
    try {
        const user = await repository.create(request.body);
        response.status(201).json(normalizePk(user));
    } catch (e) {
        response.status(500).json({ error: e.message });
    }
});

app.delete('/users', async(request, response) => {
    const repository = await app.get('container').getUserRepository();
    await repository.deleteAll();
    response.sendStatus(204);
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
            response.json(normalizePk(user));
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
        response.json(normalizePk(newUser));
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