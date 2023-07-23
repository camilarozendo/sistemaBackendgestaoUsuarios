const UserRepository = require("./repository");
const { MongoClient } = require('mongodb');

describe("UserRepository", () => {

    let userRepository;
    let client;

    beforeAll(async () => {
        const dsn = 'mongodb://root:root@localhost?retryWrites=true&writeConcern=majority'
        client = new MongoClient(dsn);
        await client.connect();
        const collection = client.db('app_db').collection('users');
        userRepository = new UserRepository(collection);
    });

    afterAll(async () => {
        await client.close();
    });

    beforeEach(async () => {
        await userRepository.deleteAll();
    });

    test('Repositório deve criar um novo usuário (C)', async () => {
        const result = await userRepository.create({
            name: 'João Silva',
            email: 'joaosilva@email.com',
            password: 'password'
        });

        expect(result).toStrictEqual(expect.objectContaining({
            name: 'João Silva',
            email: 'joaosilva@email.com',
            password: 'password'
        }));

        const users = await userRepository.findAll();

        expect(users.length).toBe(1);
    });

    test('Repositório deve listar todos os usuários (R)', async () => {
        await userRepository.create({
            name: 'João Silva',
            email: 'joaosilva@email.com',
            password: 'password'
        });

        const result = await userRepository.findAll();

        expect(result.length).toBe(1);

        expect(result[0]).toStrictEqual(
            expect.objectContaining({
                name: 'João Silva',
                email: 'joaosilva@email.com',
                password: 'password'
            })
        );
    });

    test('Repositório deve atualizar um usuário (U)', async () => {
        // Criar um usuário no banco de dados
        const user = await userRepository.create({
            name: 'João Silva',
            email: 'joaosilva@email.com',
            password: 'password'
        });

        // Alterar o usuário
        user.name = 'João Augusto Silva';
        await userRepository.update(user);

        // Verificar se o usuário foi atualizado corretamente no banco de dados
        const updatedUser = await userRepository.findById(user._id);
        expect(updatedUser).toStrictEqual(expect.objectContaining({
            name: 'João Augusto Silva',
            email: 'joaosilva@email.com',
            password: 'password'
        }));
    });

    test('Repositório deve remover um usuário (D)', async () => {
        // Criar um usuário no banco de dados
        const user = await userRepository.create({
            name: 'João Silva',
            email: 'joaosilva@email.com',
            password: 'password'
        });

        // Remover o usuário
        await userRepository.delete(user);

        // Verificar se o usuário foi removido corretamente do banco de dados
        const users = await userRepository.findAll();
        expect(users.length).toBe(0);
    });
});