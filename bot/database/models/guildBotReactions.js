const { Sequelize, Model, DataTypes } = require('sequelize');

const GuildBotReactionSchema = {
    modelName: 'GuildBotReaction',
    attributes: {
        // id: {
        //     type: DataTypes.STRING,
        //     allowNull: false,
        //     primaryKey: true
        // },
        guild_id: {
            type: DataTypes.STRING(24),
            allowNull: false,
            primaryKey: true,
        },
        tagName: {
            type: DataTypes.STRING(32),
            allowNull: false,
            primaryKey: true,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        registrar: {
            type: DataTypes.STRING(24),
            allowNull: true
        }
    },
    options: {
        tableName: 'GuildBotReaction'
    }
}

module.exports = GuildBotReactionSchema;