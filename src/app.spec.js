const app = require('./app');
const Container = require('./container');
const request = require('supertest')(app);

describe('User Management API', () => {

    let userRepository;
    let client;

    beforeAll(async () => {
        const container = new Container();
        client = container.getClient();
        userRepository = await container.getUserRepository();
    });

    afterAll(async () => {
        await client.close();
    });

    beforeEach(async () => {
        await userRepository.deleteAll();
    });

    describe('Endpoints de coleção', () => {
        test('GET /users', async () => {
            await userRepository.create({
                name: 'João Silva',
                email: 'joaosilva@email.com',
                password: 'password'
            });

            const response = await request
                .get('/users')
                .expect('Content-type', /application\/json/);

            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(1);
            expect(response.body[0]).toStrictEqual(expect.objectContaining({
                name: 'João Silva',
                email: 'joaosilva@email.com',
                password: 'password'
            }));
        });

        test('POST /users', async () => {
            const user = {
                name: 'João Silva',
                email: 'joaosilva@email.com',
                password: 'password'
            };

            const response = await request.post('/users')
                .send(user);

            expect(response.statusCode).toBe(201);
            expect(response.body).toStrictEqual(expect.objectContaining(user));
        });
    });

    describe('Endpoints de item', () => {

        describe('GET /users/:id', () => {
            test('Deve retornar 200 para um usuário existente', async () => {
                // 1. criar um usuário
                const user = await userRepository.create({
                    name: 'João Silva',
                    email: 'joaosilva@email.com',
                    password: 'password'
                });

                // 2. fazer a chamada de detalhamento do usuário
                const response = await request.get(`/users/${user._id}`)
                    // 3. verificar o header
                    .expect('Content-type', /application\/json/);

                // 4. verificar status code
                expect(response.statusCode).toBe(200);

                // 5. verificar body
                expect(response.body).toStrictEqual(expect.objectContaining({
                    name: 'João Silva',
                    email: 'joaosilva@email.com',
                    password: 'password'
                }));
            });

            test('Deve retornar 404 para um usuário inexistente', async () => {
                // 1. fazer a chamada de detalhamento do usuário
                const response = await request.get('/users/649b7a272150835d525b7335')
                    // 2. verificar o header
                    .expect('Content-type', /application\/json/);

                // 3. verificar status code
                expect(response.statusCode).toBe(404);

                // 4. verificar body
                expect(response.body).toStrictEqual({
                    status: 404,
                    error: 'Usuário não encontrado'
                });
            });
        });

        describe('PUT /users/:id', () => {
            test('Deve retornar 200 para um usuário existente', async () => {
                // 1. criar um usuário
                const user = await userRepository.create({
                    name: 'João Silva',
                    email: 'joaosilva@email.com',
                    password: 'password'
                });

                // 2. fazer a chamada de atualização do usuário
                const response = await request.put(`/users/${user._id}`)
                    .send({
                        name: 'Maria Silva',
                        email: 'mariasilva@email.com',
                        password: 'newpassword'
                    })
                    // 3. conferir o header
                    .expect('Content-type', /application\/json/);

                // 4. conferir o status code
                expect(response.statusCode).toBe(200);

                // 5. conferir o body
                expect(response.body).toStrictEqual(expect.objectContaining({
                        name: 'Maria Silva',
                        email: 'mariasilva@email.com',
                        password: 'newpassword'
                }));

                // 6. conferir se o usuário foi atualizado no banco de dados.
                const newUser = await userRepository.findById(user._id);
                expect(newUser).toStrictEqual(expect.objectContaining({
                    name: 'Maria Silva',
                    email: 'mariasilva@email.com',
                    password: 'newpassword'
                }));
            });

            test('Deve retornar 404 para um usuário inexistente', async () => {
                // 1. fazer a chamada de detalhamento do usuário
                const response = await request.put('/users/649b7a272150835d525b7335')
                    .send({
                        name: 'Maria Silva',
                        email: 'mariasilva@email.com',
                        password: 'newpassword'
                    })
                    // 2. verificar o header
                    .expect('Content-type', /application\/json/);

                // 3. verificar status code
                expect(response.statusCode).toBe(404);

                // 4. verificar body
                expect(response.body).toStrictEqual({
                    status: 404,
                    error: 'Usuário não encontrado'
                });
            });
        });

        describe('DELETE /users/:id', () => {
            test('Deve retornar 204 para um usuário existente', async () => {

                // 1. criar um usuário
                const user = await userRepository.create({
                    name: 'João Silva',
                    email: 'joaosilva@email.com',
                    password: 'password'
                });

                // 2. fazer a chamada de atualização do usuário
                const response = await request.delete(`/users/${user._id}`);

                // 3. conferir o status code
                expect(response.statusCode).toBe(204);

                // 4. conferir o body
                expect(response.body).toStrictEqual({});

                // 5. conferir se o usuário foi atualizado no banco de dados.
                const newUser = await userRepository.findById(user._id);
                expect(newUser).toBe(null);

            });

            test('Deve retornar 404 para um usuário inexistente', async () => {
                // 1. fazer a chamada de detalhamento do usuário
                const response = await request.delete('/users/649b7a272150835d525b7335')
                    // 2. verificar o header
                    .expect('Content-type', /application\/json/);

                // 3. verificar status code
                expect(response.statusCode).toBe(404);

                // 4. verificar body
                expect(response.body).toStrictEqual({
                    status: 404,
                    error: 'Usuário não encontrado'
                });
            });
        });
    });
});