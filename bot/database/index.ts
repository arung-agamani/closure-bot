/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Connection, createConnection } from 'typeorm';
import 'reflect-metadata';
import { Playlist } from './models/playlist';
import { PlaylistItem } from './models/playlistItem';

export const typeormConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'howlingmoon.dev',
  port: 5432,
  username: process.env.POSTGRES_USERNAME || 'warfarin',
  password: process.env.POSTGRES_PASSWORD || 'l4mbdA_func7ion',
  database: 'closure',
  logging: true,
  entities: [PlaylistItem, Playlist],
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
}

export default Warfarin;
