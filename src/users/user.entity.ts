import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
  } from 'typeorm';
  
  @Entity('users')
  export class User {
    @PrimaryGeneratedColumn('uuid')
    user_id: string;
  
    @Column({ length: 100, unique: true })
    email: string;
  
    @Column({ length: 255 })
    password: string;
  
    @Column({ length: 50 })
    name: string;
  
    @Column({ type: 'int', nullable: true })
    age: number;
  
    @CreateDateColumn()
    created_at: Date;
  }
  