import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from "sequelize";
import sequelize from "../db";

class Game extends Model<InferAttributes<Game>, InferCreationAttributes<Game>> {
    declare id: CreationOptional<number>;
    declare board: string;
    declare currentPlayer: number;
    declare winner: CreationOptional<number>;
    declare winningPositions: CreationOptional<string>;
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
            },
        },
        currentPlayer: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        winner: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        winningPositions: {
            type: DataTypes.TEXT,
            allowNull: true,
            get() {
                return JSON.parse(this.getDataValue("winningPositions"));
            },
            set(val) {
                this.setDataValue("winningPositions", JSON.stringify(val));
            },
        },
    },
    {
        sequelize,
    }
);

export default Game;
