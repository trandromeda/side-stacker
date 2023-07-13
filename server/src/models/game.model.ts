import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from "sequelize";
import sequelize from "../db.js";

class Game extends Model<InferAttributes<Game>, InferCreationAttributes<Game>> {
    declare id: CreationOptional<number>;
    declare currentPlayer: number;
    declare players: CreationOptional<number[]>;
    declare winner: CreationOptional<number>;
    declare winningPositions: CreationOptional<string>;
    declare moves: CreationOptional<{ 
        player: number,
        move: [number, number]
    }[]>
}

Game.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        moves: {
            type: DataTypes.ARRAY(DataTypes.JSON),
            allowNull: true,
        },
        currentPlayer: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        players: {
            type: DataTypes.ARRAY(DataTypes.INTEGER)
        },
        winner: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        winningPositions: {
            type: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.INTEGER)),
            allowNull: true,
        },
    },
    {
        sequelize,
    }
);

export default Game;
