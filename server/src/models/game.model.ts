import DataTypes from 'sequelize';
import sequelize from '../db';

const Game = sequelize.define('Game', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
    board: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
        return JSON.parse((this as any).getDataValue('board'));
      },
      set(val) {
        (this as any).setDataValue('board', JSON.stringify(val));
      }
  },
  current_player: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  winner: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {});

export default Game
