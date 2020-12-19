/* eslint-disable import/no-cycle */
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PlaylistItem } from './playlistItem';

@Entity()
export class Playlist {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: string;

  @Column()
  name!: string;

  @OneToMany(() => PlaylistItem, (item) => item.playlist, {
    cascade: true,
  })
  items!: PlaylistItem[];
}

export default null;
