import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
  } from 'typeorm';
  
  @Entity()
  export class HeartRateRecord {
  
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    user_id: string;
  
    @Column()
    bpm: number;
  
    @CreateDateColumn()
    created_at: Date;
  }