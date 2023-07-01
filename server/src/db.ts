import { Sequelize } from 'sequelize';
import 'dotenv/config'

const sequelize = new Sequelize(process.env.DB, process.env.DB_USER || 'me', process.env.DB_PASSWORD || '', {
  host: 'localhost',
  dialect: 'postgres',
});

export default sequelize;
