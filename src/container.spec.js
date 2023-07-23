const Container = require("./container");

describe('Container', () => {

    let container;

    beforeEach(() => {
        container = new Container();
    });

    test('Deve criar um cliente do mongodb', () => {
        const client = container.getClient();
        expect(client).not.toBe(null);
        expect(client).not.toBe(undefined);
    });

    test('Deve criar e retornar sempre a mesma instancia', () => {
        const clientA = container.getClient();
        const clientB = container.getClient();
        expect(clientA).toStrictEqual(clientB);
    });

    test('Deve criar um repositorio de usuários', async () => {
        const userRepository = await container.getUserRepository();
        expect(userRepository).not.toBe(null);
        expect(userRepository).not.toBe(undefined);
    });
});