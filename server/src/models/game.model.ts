import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional  } from "sequelize";
import sequelize from "../db";

class Game extends Model<InferAttributes<Game>, InferCreationAttributes<Game>> {
    declare id: CreationOptional<number>;
    declare board: string;
    declare currentPlayer: number;
    declare winner: CreationOptional<number>;
}

Game.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        board: {
            type: DataTypes.TEXT,
            allowNull: false,
            get() {
                return JSON.parse(this.getDataValue("board"));
            },
            set(val) {
                this.setDataValue("board", JSON.stringify(val));
            }   
        },
        currentPlayer: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        winner: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    },
    {
        sequelize,
      }
)

export default Game;
