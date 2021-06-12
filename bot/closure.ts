/* eslint-disable */
/* eslint-disable no-restricted-syntax */
import * as Discord from 'discord.js';
import * as fs from 'fs';
import * as sqlite from 'sqlite3';
import axios from 'axios';
import * as ts from 'typescript';
import { CronJob } from 'cron';
import { google } from 'googleapis';
import { addDays } from 'date-fns';

import WarfarinDb from './database';
import logger from '../utils/winston';
import prisma, { getServerPrefix } from './database/prisma';

const path = require('path');

const closureConfig = {
  basePath: path.resolve(__dirname),
};

export interface ClosureJSONRes {
  status?: number;
  error?: Error;
  tags?: Array<string>;
}

export interface ClosureGuildRes {
  status?: number;
  name?: string;
  icon?: string | null;
  message?: string;
  tags?: any;
}

const oauthClient = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
)

const calendarScopes = process.env.CALENDAR_SCOPES.split(',')
const calendarRegexString = `^[${calendarScopes.join('|')}]`
const calendarRegex = new RegExp(calendarRegexString, 'ig')

class Closure {
  public client: Discord.Client;

  public commands: Discord.Collection<any, any>;

  public commandFiles: any;

  public commandFilesTs: string[];

  public isDatabaseReady: boolean;

  public musicQueue: Map<any, any>;

  public db: sqlite.Database;

  public remoteDb: WarfarinDb;

  public isDev: boolean;

  public basePath: any;

  public ytdlMp3Map: Map<any, any>;

  public constructor() {
    this.client = new Discord.Client();
    this.commands = new Discord.Collection();
    this.commandFiles = fs
      .readdirSync('./bot/commands')
      .filter((file) => file.endsWith('.js'));
    this.commandFilesTs = fs
      .readdirSync('./bot/commands')
      .filter((file) => file.endsWith('.ts'));
    this.isDatabaseReady = false;
    this.musicQueue = new Map();
    this.db = new sqlite.Database(
      path.resolve(__dirname, 'database', 'warfarin.db'),
      (err): any => {
        if (err) {
          return console.error(err.message);
        }
        // console.log('Bot connected to database!');
        logger.info('Bot connected to database!');
        this.isDatabaseReady = true;
      }
    );
    this.remoteDb = new WarfarinDb();
    this.isDev = process.env.NODE_ENV === 'dev';
    this.basePath = closureConfig.basePath;
    this.ytdlMp3Map = new Map();

    
  }

  start(token: string) {
    this.client.on('ready', async () => {
      // console.log(`Logged in as ${this.client.user?.tag}!`);
      logger.info(`Logged in as ${this.client.user?.tag}!`);
      this.client.user?.setPresence({
        activity: {
          name: `${this.client.guilds.cache.size} insane doctors.`,
          type: 'WATCHING',
        },
        status: 'online',
      });
    });
    for (const file of this.commandFiles) {
      const command = require(`./commands/${file}`);
      this.commands.set(command.name, command);
    }
    for (const file of this.commandFilesTs) {
      const command = import(`./commands/${file}`)
        .then((fileCmd) => {
          console.log(`Loaded file with info : ${fileCmd.name}`);
          this.commands.set(fileCmd.name, fileCmd);
        })
        .catch((err) => {
          console.error(`Error loading file with name : ${file}\n${err}`);
        });
    }
    this.client.on('message', (msg) => {
      const prefix = this.isDev ? '%!' : '%^'; // add prefix lookup later
      if (!msg.content.startsWith(prefix) || msg.author.bot) return;

      const args = msg.content.slice(2).split(/ +/);
      const command = args.shift()?.toLowerCase();
      if (!this.commands.has(command)) return;

      try {
        this.commands.get(command).execute(msg, args, this);
      } catch (error) {
        console.error(`Error in executing "${command}" command!`);
        console.error(error.message);
        msg.reply(
          `There is an error on that command, Doctor!\nCheck your server log.`
        );
      }
    });

    /* this.client.once('reconnecting' , () => {
            console.log('Reconnecting');
        }); */

    this.client.login(token);
    this.cronReminder();
  }

  public reload_REQUIRE(): Promise<any> {
    this.commandFilesTs = fs
      .readdirSync('./bot/commands')
      .filter((file) => file.endsWith('.ts'));
    return new Promise((res, rej) => {
      for (const file of this.commandFilesTs) {
        try {
          const command = require(`./commands/${file}`);
          const code = fs
            .readFileSync(path.resolve(__dirname, 'commands', file))
            .toString();
          const result: any = eval(ts.transpile(code));
          const objCode: any = {
            execute: result,
          };
          this.commands.set(command.name, objCode);
        } catch (err) {
          console.error(err);
          rej();
          break;
        }
      }
      res(true);
    });
  }

  public reload(): Promise<any> {
    return new Promise((res, rej) => {
      const promises_array: Array<Promise<any>> = [];
      for (const file of this.commandFilesTs) {
        const command = import(`./commands/${file}`);
        promises_array.push(command);
      }
      Promise.all(promises_array)
        .then((values) => {
          for (const cmd of values) {
            console.log(`Loaded file with info: ${cmd.name}`);
            console.log(`Function: ${cmd.execute.toString()}`);
            this.commands.delete(cmd.name);
            this.commands.set(cmd.name, cmd);
          }
          res(true);
        })
        .catch((err) => {
          console.error(`Error loading file...`);
          rej();
        });
    });
  }

  log(text: string): void {
    console.log(text);
  }

  getGuildTags(
    guild_id: string,
    callback: {
      (resp: any): void;
      (retval: any): void;
      (arg0: ClosureJSONRes): void;
    }
  ) {
    if (guild_id.match(/^\d*$/)) {
      const sqlQuery = `SELECT c.tags FROM Guild_Channel as g, Channel_Tags as c WHERE g.guild_id="${guild_id}" 
            AND g.channel_id=c.channel_id`;
      const jsonResponse: ClosureJSONRes = {};
      this.db.all(sqlQuery, (err, rows) => {
        if (err) {
          console.error(err.message);
          jsonResponse.status = 500;
          jsonResponse.error = err;
          return jsonResponse;
        }
        jsonResponse.status = 200;
        const tags = [];
        const tagsSet = new Set<string>();
        for (const row of rows) {
          // if (!tags.some(x => x.tags === row.tags)){
          //     tags.push(row);
          // }
          tagsSet.add(row.tags);
        }
        jsonResponse.tags = Array.from(tagsSet);
        callback(jsonResponse);
      });
    } else {
      callback({
        status: 400,
        message: 'Bad guild_id request',
      });
    }
  }

  getGuildInfo(
    guild_id: string,
    callback: { (retval: any): void; (arg0: ClosureGuildRes): void }
  ) {
    if (guild_id.match(/^\d*$/)) {
      const jsonResponse: ClosureGuildRes = {};
      if (this.client.guilds.cache.has(guild_id)) {
        const targetGuild = this.client.guilds.cache.get(guild_id);
        jsonResponse.status = 200;
        jsonResponse.name = targetGuild?.name;
        jsonResponse.icon = targetGuild?.iconURL();
        this.getGuildTags(guild_id, (resp) => {
          if (resp.status === 200) {
            jsonResponse.tags = resp.tags;
          }
          callback(jsonResponse);
        });
      } else {
        jsonResponse.status = 404;
        jsonResponse.message =
          'Guild not found or Closure is not in the guild, yet';
        callback(jsonResponse);
      }
    } else {
      callback({
        status: 400,
        message: 'Bad guild_id request',
      });
    }
  }

  warfarinExtensionHandler(jsonData: any) {
    // check database for channel mapping.
  }

  registerChannel(
    guild_id: string,
    channel_id: string,
    registrar: string,
    tags: string,
    callback
  ) {
    // check if guild__id and channel_id exists in Guild_Channel table
    if (tags == '' || tags === undefined) {
      callback({
        status: 0,
        message: 'Provide a tag',
      });
      return;
    }
    console.log('Searching for guild_id and channel_id in database...');
    this.db.get(
      `SELECT * FROM Guild_Channel WHERE
        guild_id="${guild_id}" AND 
        channel_id="${channel_id}";`,
      (err, row) => {
        if (err) {
          console.error(err.message);
          callback({
            status: 0,
            message: err.message,
          });
        } else {
          let values = '';
          for (let i = 0; i < tags.length; i++) {
            if (tags[i].match(/^[\w|-]{1,24}$/)) {
              if (i != tags.length - 1) {
                values += `("${channel_id}", "${tags[i]}", "${registrar}"),`;
              } else {
                values += `("${channel_id}", "${tags[i]}", "${registrar}");`;
              }
            } else {
              callback({
                status: 0,
                message:
                  "Bad tag format. Please only use alphanumeric and '-' character with length between 1 and 24.",
              });
              return;
            }
          }
          if (row) {
            console.log(row);
            console.log(
              'guild_id and channel_id exists!\nProceeding to add channel and tags to Channel_Tags'
            );
            this.db.run(
              `INSERT INTO Channel_Tags 
                            VALUES${values};`,
              (err3) => {
                if (err3) {
                  console.error(err3.message);
                  callback({
                    status: 0,
                    message: err3.message,
                  });
                } else {
                  console.log(`${guild_id}:${channel_id}:${tags} added.`);
                  callback({
                    status: 1,
                    message:
                      'Successfully registering this tag to this channel',
                  });
                }
              }
            );
          } else {
            console.log(
              'guild_id and channel_id not found. Adding new record to Guild_Channel'
            );

            this.db.run(
              `INSERT INTO Guild_Channel 
                    VALUES("${guild_id}", "${channel_id}", "${registrar}");`,
              (err2) => {
                if (err2) {
                  console.error(err2.message);
                  callback({
                    status: 0,
                    message: err2.message,
                  });
                } else {
                  console.log(
                    'guild_id and channel_id added!\nProceeding to add channel and tags to Channel_Tags'
                  );
                  this.db.run(
                    `INSERT INTO Channel_Tags 
                            VALUES${values};`,
                    (err3) => {
                      if (err3) {
                        console.error(err3.message);
                        callback({
                          status: 0,
                          message: err3.message,
                        });
                      } else {
                        console.log(`${guild_id}:${channel_id}:${tags} added.`);
                        callback({
                          status: 1,
                          message:
                            'Successfully registering this tag to this channel',
                        });
                      }
                    }
                  );
                }
              }
            );
          }
        }
      }
    );
  }

  deleteTag(guild_id: string, channel_id: string, tags: string, callback) {
    this.db.run(
      `DELETE FROM Channel_Tags WHERE channel_id="${channel_id}" 
        AND tags="${tags}";`,
      (err) => {
        if (err) {
          console.error(err.message);
          callback({
            status: 0,
            message: err.message,
          });
        } else {
          console.log(`Successfully delete tag ${tags} from ${channel_id}`);
          callback({
            status: 1,
            message: `Successfully deleted tag ${tags} from ${channel_id}`,
          });
        }
      }
    );
  }

  async getServerPrefix(guildId: string, msg: Discord.Message) {
    try {
      const prefix = await getServerPrefix(guildId);
      if (prefix) {
        msg.reply('Server prefix is ' + prefix.prefix)
      } else {
        msg.reply('No server prefix')
      }
    } catch (error) {
      msg.reply('Error raised!');
      logger.error(error);
    }
  }

  checkChannelTags(guild_id: string, channel_id: string, callback) {
    this.db.all(
      `SELECT g.guild_id, c.channel_id, c.tags FROM Guild_Channel as g, Channel_Tags as c WHERE 
        g.guild_id="${guild_id}" AND g.channel_id="${channel_id}" 
        AND g.channel_id=c.channel_id;`,
      (err, rows) => {
        if (err) {
          console.error(err.message);
          callback({
            status: 0,
            message: err.message,
          });
        } else {
          console.log(`Fetched all the tags for channel : ${channel_id}`);
          callback({
            status: 1,
            message: 'Fetching successful.',
            values: rows,
          });
        }
      }
    );
  }

  publishEvent(guild_id: string, tag: string) {
    this.db.all(
      `SELECT g.channel_id FROM Guild_Channel as g, Channel_Tags as c 
        WHERE g.guild_id="${guild_id}" AND g.channel_id=c.channel_id AND c.tags="${tag}";`,
      (err, rows) => {
        for (const row of rows) {
          const txt = this.client.guilds.cache
            .get(guild_id)
            ?.channels.cache.get(row.channel_id) as Discord.TextChannel;
          txt.send(`Event broadcasted to this channel because of tag ${tag}`);
        }
      }
    );
  }

  publishLink(
    guild_id: string,
    tag: string,
    link: string,
    pixivTarget?: string
  ) {
    this.db.all(
      `SELECT g.channel_id FROM Guild_Channel as g, Channel_Tags as c 
        WHERE g.guild_id="${guild_id}" AND g.channel_id=c.channel_id AND c.tags="${tag}";`,
      (err, rows) => {
        const doStuff = async () => {
          const fileName = new Date().getTime().toString();
          let isFileWritten = false;
          let imageExt = '';
          if (pixivTarget) {
            imageExt = pixivTarget.split('.').reverse()[0];
            const image = await axios({
              method: 'get',
              url: pixivTarget,
              headers: {
                referer: link,
              },
              responseType: 'stream',
            });
            if (image.status === 200) {
              const writer = fs.createWriteStream(
                path.resolve(__dirname, `./tmp/${fileName}.${imageExt}`)
              );
              try {
                await fileWriter(writer, image.data);
                isFileWritten = true;
              } catch (err) {
                console.log('Error on writing file stream or in promise', err);
              }
            }
          }
          for (const row of rows) {
            if (isFileWritten) {
              console.log('File written');
              const txt = this.client.guilds.cache
                .get(guild_id)
                ?.channels.cache.get(row.channel_id) as Discord.TextChannel;
              txt.send(link, {
                files: [
                  path.resolve(__dirname, `./tmp/${fileName}.${imageExt}`),
                ],
              });
            } else {
              console.log('No file written');
              const txt = this.client.guilds.cache
                .get(guild_id)
                ?.channels.cache.get(row.channel_id) as Discord.TextChannel;
              txt.send(link);
            }
          }
        };
        doStuff();
      }
    );
  }

  cronReminder() {
    const dailyHobby = new CronJob('0 0 7,14,21 * * *', async () => {
      const me = await this.client.users.fetch('145558597424644097')
      if (me) {
        oauthClient.setCredentials({
          refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN
        })
        const calendar = google.calendar({
          version: 'v3',
          auth: oauthClient
        })
        const embed = new Discord.MessageEmbed()
        try {
          const res = await calendar.calendarList.list({})
          const items = []
          for (const item of res.data.items) {
            if (item.id.match(calendarRegex)) {
              try {
                const events = await calendar.events.list({
                  calendarId: item.id,
                  timeMin: new Date().toISOString(),
                  timeMax: addDays(new Date(), 30).toISOString()
                })
                for (const event of events.data.items) {
                  items.push([event.summary, event.start.dateTime ? new Date(event.start.dateTime).toLocaleString() : event.start.date])
                }
              } catch (err) {
                console.log('Error on fetching calendar:', err)
                me.send(`Error on fetching calendar: ${err}`)
              }
            }
          }
          embed.addField('Kuliah stuffs', 'Jangan lupa presensi ama catat apa yang mau dilakuin besok.\nIngat PR dan hal hal lainnya');
          embed.addField('Hobby stuffs', '1. Hobi yang membuatmu sehat: null :(\n2. Hobi yang membuatmu belajar: Ngoding gans, 2 jam aja.\n3. Hobi yang membuatmu produktif: Go nggambar atau ngedit hari ini atau bikin game sono.\n4. Hobi yang membuatmu senang: main genshin sana atau apalah. Kalau gacha jangan lupa multitasking. 1 jam cukup.')
          embed.addField('Tanoto stuffs', 'Ingat proyekan, status proyekan. Ingat ngomong ke anak-anaknya. Jangan denial awas kau.')
          items.forEach((event, index) => {
            embed.addField(`${index+1}. ${event[0]}`, event[1])
          })
          me.send(embed)
        } catch (err) {
          console.log('Error on fetching calendar:', err)
          me.send(`Error on fetching calendar: ${err}`)
        }
        
      }
    }, null, false, 'Asia/Makassar');
    const weeklyAgateReminder = new CronJob('0 0 12 * * 0-2', async () => {
      const me = await this.client.users.fetch('145558597424644097')
      if (me) {
        const embed = new Discord.MessageEmbed()
        embed.addField('Agate MKBM', 'Jangan lupa presensi.');
        me.send(embed)
      }
    }, null, false, 'Asia/Makassar')
    dailyHobby.start()
    weeklyAgateReminder.start()
  }
}

const fileWriter = (writer: fs.WriteStream, stream) => {
  return new Promise((resolve, reject) => {
    stream.pipe(writer);
    let error: Error;
    writer.on('error', (err) => {
      error = err;
      writer.close();
      reject(err);
    });
    writer.on('close', () => {
      if (!error) {
        resolve(true);
      }
    });
  });
};

export default Closure;
