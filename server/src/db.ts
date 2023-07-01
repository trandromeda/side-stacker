import { Sequelize } from 'sequelize';
import 'dotenv/config'

const sequelize = new Sequelize(process.env.DB || 'side_stacker', process.env.DB_USER || 'me', process.env.DB_PASSWORD || '12345', {
  host: process.env.PSQL_HOST || "localhost",
  dialect: 'postgres',
});

export default sequelize;
