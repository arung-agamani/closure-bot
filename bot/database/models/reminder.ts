import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Reminder {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: string;

  @Column()
  cronTime!: string;

  @Column()
  content!: string;

  @Column()
  uniqueHash!: string;
}

export default null;
