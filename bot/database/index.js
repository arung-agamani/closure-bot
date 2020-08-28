const { Sequelize } = require('sequelize');
const { v1: uuid } = require('uuid');
const GuildBotReactionsSchema = require('./models/guildBotReactions');

class WarfarinDatabase {
    constructor() {
        this.sequelize = null;
        this.isConnected = false;
        this.isModelsInitialized = false;
        this.tables = {};
        this.reconnectAttempt = 0;
        this.init();
        
    }

    init() {
        return new Promise((resolve, reject) => {
            if (process.env.MYSQL_USERNAME === undefined ||
                process.env.MYSQL_PASSWORD === undefined ||
                process.env.MYSQL_HOSTNAME === undefined) {
                    reject(new Error('WarfarinDatabase: MYSQL Environment variable is not initialized'));
            } else {
                this.sequelize = new Sequelize(`mysql://${process.env.MYSQL_USERNAME}:${process.env.MYSQL_PASSWORD}@${process.env.MYSQL_HOSTNAME}/${process.env.MYSQL_DBNAME}`);
                
                this.sequelize.authenticate({ logging: () => { 
                    console.log('WarfarinDatabase: Attempting to establish connection.')}
                }).then(() => {
                    console.log('WarfarinDatabase: Connected!');
                    this.isConnected = true;
                    !this.isModelsInitialized && this.initModels();
                    resolve();
                }).catch(err => {
                    console.error('WarfarinDatabase: Error object:', err);
                    reject(new Error('WarfarinDatabase: Error on authenticating.'));
                });
                    
            }
        })
        
    }

    initModels() {
        this.sequelize.define(GuildBotReactionsSchema.modelName, GuildBotReactionsSchema.attributes, GuildBotReactionsSchema.options);
        this.sequelize.sync({ logging: (sql) => {
            console.log('WarfarinDatabase: Syncing models with query ', sql);
        }})
        .then(() => {
            console.log('WarfarinDatabase: Models initialized');
            this.isModelsInitialized = true;
        })
        .catch(err => {
            console.log('WarfarinDatabase: Error on syncing schemas');
        })
        
        // this.tables[GuildBotReactionsSchema.modelName] = this.sequelize.model(GuildBotReactionsSchema.modelName);
        
    }

    BotReaction_insert(guild_id, tagName, content, registrar) {
        if (!this.isConnected) {
            this.reconnectAttempt++;
            if (this.reconnectAttempt > 5) {
                console.error('WarfarinDatabase: Too many attempts on reconnecting...');
                return new Error('WarfarinDatabase: Too many reconnect attempt.');
            } else {
                setTimeout(() => {
                    this.init().then(() => {
                        this.BotReaction_insert(guild_id, content, registrar);
                    }); 
                }, 1000);                               
            }
        } else {
            this.sequelize.model('GuildBotReaction').create({guild_id, tagName, content, registrar})
            .then(() => {
                console.log('WarfarinDatabase: New instance added to GuildBotReaction');
            })
            .catch(err => {
                console.log('WarfarinDatabase: Error on inserting new instance. There might be duplicates');
            })
        }
    }

}

module.exports = WarfarinDatabase;