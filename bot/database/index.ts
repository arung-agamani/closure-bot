/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Connection, createConnection } from 'typeorm';
import 'reflect-metadata';
import dotenv from 'dotenv';
import path from 'path';
import { Playlist } from './models/playlist';
import { PlaylistItem } from './models/playlistItem';
import { Reminder } from './models/reminder';

dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });
export const typeormConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'howlingmoon.dev',
  port: 5432,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: 'closure',
  logging: false,
  entities: [PlaylistItem, Playlist, Reminder],
  synchronize: true,
};

class Warfarin {
  public conn: Connection;

  constructor() {
    createConnection(typeormConfig).then(async (connection) => {
      console.log('Connection to WarfarinPsql created!');
      this.conn = connection;
    });
  }

  public async addPlaylist(
    userId: string,
    name: string,
    items: string[]
  ): Promise<string> {
    try {
      const playlist = new Playlist();
      playlist.userId = userId;
      playlist.name = name;
      await this.conn.manager.save(playlist);
      for (let i = 0; i < items.length; i += 1) {
        const plItem = new PlaylistItem();
        plItem.link = items[i];
        plItem.order = i;
        plItem.playlist = playlist;
        await this.conn.manager.save(plItem);
      }
      return 'Success saving playlist!';
    } catch (err) {
      console.error(err);
      throw new Error(`Error when trying to save playlist: ${err}`);
    }
  }

  public async getPlaylist(userId: string): Promise<string> {
    try {
      const userPlaylist = this.conn.getRepository(Playlist);
      const playlist = await userPlaylist
        .createQueryBuilder('playlist')
        // .leftJoinAndSelect('playlist.items', 'playlist_item')
        .where('playlist.userId = :userId', { userId })
        .getMany();
      let names = '';
      // eslint-disable-next-line no-restricted-syntax
      for (const item of playlist) {
        names += `- "${item.name}"\n`;
      }
      return `Get playlist done, found playlist names: \n${names}`;
    } catch (err) {
      throw new Error(`Error on fetching playlist: ${err}`);
    }
  }

  public async getPlaylistAsArray(userId: string): Promise<Playlist[]> {
    try {
      const userPlaylist = this.conn.getRepository(Playlist);
      const playlist = await userPlaylist
        .createQueryBuilder('playlist')
        // .leftJoinAndSelect('playlist.items', 'playlist_item')
        .where('playlist.userId = :userId', { userId })
        .getMany();
      return playlist;
    } catch (err) {
      throw new Error(`Error on fetching playlist: ${err}`);
    }
  }

  public async getPlaylistItems(
    userId: string,
    name: string
  ): Promise<PlaylistItem[]> {
    try {
      const userPlaylist = this.conn.getRepository(Playlist);
      const playlist = await userPlaylist
        .createQueryBuilder('playlist')
        .leftJoinAndSelect('playlist.items', 'playlist_item')
        .where('playlist.userId = :userId', { userId })
        .andWhere('playlist.name = :name', { name })
        .getOne();
      return playlist.items;
    } catch (err) {
      throw new Error(`Error on getting playlist items: ${err}`);
    }
  }

  public async deletePlaylist(userId: string, name: string): Promise<string> {
    try {
      const userPlaylist = this.conn.getRepository(Playlist);
      const deleteResponse = await userPlaylist
        .createQueryBuilder()
        .delete()
        .where('userId = :userId', { userId })
        .andWhere('name = :name', { name })
        .execute();
      if (deleteResponse.affected === 1) {
        return `Successfully deleted one playlist with name "${name}" from user`;
      }
      return `Nothing deleted. Playlist not found on user`;
    } catch (err) {
      throw new Error(`Error on deleting playlist: ${err}`);
    }
  }

  public async updatePlaylist(
    userId: string,
    name: string,
    items: string[]
  ): Promise<string> {
    try {
      const playlist = this.conn.getRepository(Playlist);
      const targetPlaylist = await playlist
        .createQueryBuilder('playlist')
        .leftJoinAndSelect('playlist.items', 'playlist_item')
        .where('playlist.userId = :userId', { userId })
        .andWhere('playlist.name = :name', { name })
        .getOne();
      targetPlaylist.items.length = 0;
      for (let i = 0; i < items.length; i += 1) {
        const plItem = new PlaylistItem();
        plItem.link = items[i];
        plItem.order = i;
        plItem.playlist = targetPlaylist;
        targetPlaylist.items.push(plItem);
      }
      await playlist.save(targetPlaylist);
      await this.conn
        .getRepository(PlaylistItem)
        .createQueryBuilder()
        .delete()
        .where('playlistId IS NULL')
        .execute();
      return 'Success updating playlist!';
    } catch (err) {
      console.error(err);
      throw new Error(`Error when trying to update playlist: ${err}`);
    }
  }

  public async createReminder(
    userId: string,
    cronTime: string,
    content: string,
    uniqueHash: string
  ): Promise<string> {
    try {
      const reminder = new Reminder();
      reminder.userId = userId;
      reminder.cronTime = cronTime;
      reminder.content = content;
      reminder.uniqueHash = uniqueHash;
      await this.conn.manager.save(reminder);
      return 'Successfully saving new reminder';
    } catch (error) {
      throw new Error(`Error when adding new reminder: ${error}`);
    }
  }

  public async readReminder(
    userId: string,
    uniqueHash: string
  ): Promise<Reminder> {
    try {
      const reminder = this.conn.getRepository(Reminder);
      const target = await reminder.findOne({ userId, uniqueHash });
      return target;
    } catch (error) {
      throw new Error(`Error when reading reminder: ${error}`);
    }
  }

  public async updateReminder(
    userId: string,
    cronTime: string,
    content: string,
    uniqueHash: string
  ): Promise<string> {
    try {
      const reminder = this.conn.getRepository(Reminder);
      const target = await reminder.findOne({ userId, uniqueHash });
      target.cronTime = cronTime;
      target.content = content;
      await reminder.save(target);
      return `Successfully updating your reminder with hash id ${uniqueHash}`;
    } catch (error) {
      throw new Error(`Error when updating reminder: ${error}`);
    }
  }

  public async deleteReminder(
    userId: string,
    uniqueHash: string
  ): Promise<string> {
    try {
      const reminder = this.conn.getRepository(Reminder);
      await reminder.delete({ userId, uniqueHash });
      return `Successfully deleting your reminder with has id ${uniqueHash}`;
    } catch (error) {
      throw new Error(`Error when deleting reminder: ${error}`);
    }
  }
}

export default Warfarin;
