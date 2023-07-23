const { MongoClient } = require('mongodb');
const UserRepository = require('./repository');

class Container {
    services = {};
    params = {};

    setParam(name, value) {
        this.params[name] = value;
    }

    getClient() {
        if (this.services.client !== undefined) {
            return this.services.client;
        }

        const dsn = 'mongodb://root:root@localhost?retryWrites=true&writeConcern=majority'
        const client = new MongoClient(dsn);

        return this.services.client = client;
    }

    async getUserRepository() {
        if (this.services.userRepository !== undefined) {
            return this.services.userRepository;
        }

        const client = this.getClient();

        await client.connect();
        const collection = client.db('app_db').collection('users');

        return this.services.userRepository = new UserRepository(collection);
    }
}

module.exports = Container;
