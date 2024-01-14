import { DataSource } from 'typeorm';
import { User } from '../entities/user';

export const AppDataSource = new DataSource({
    type: 'mysql', 
    port: 3306,
    username: 'root',
    password: '',
    database: 'tfm_iot',
    entities: [User],
    migrations: ['src/utils/database/src/migration/**/*.ts'],
});

AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
    })
    .catch((err) => {
        console.error('Error during Data Source initialization:', err);
    });
