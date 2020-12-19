/* eslint-disable import/no-cycle */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Playlist } from './playlist';

@Entity()
export class PlaylistItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Playlist, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  playlist!: Playlist;

  @Column()
  order!: number;

  @Column()
  link!: string;
}

export default null;
