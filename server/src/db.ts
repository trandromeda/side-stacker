import { Sequelize } from 'sequelize';
import 'dotenv/config'

const sequelize = new Sequelize('side_stacker', 'me', process.env.DB_PASSWORD || '', {
  host: 'localhost',
  dialect: 'postgres',
});

export default sequelize;
