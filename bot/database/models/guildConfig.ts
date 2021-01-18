import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class GuildConfig {
  @PrimaryGeneratedColumn()
  id!: number;

  @PrimaryGeneratedColumn()
  guildId!: string;

  @Column()
  greetingChannel!: string;

  @Column()
  prefix!: string;
}

export default null;
