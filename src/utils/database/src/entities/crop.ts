import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
  } from 'typeorm';
  
  import { User } from './user';
  
  @Entity('crop')
  export class Crop {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    userId: number;
  
    @Column()
    cropTypeId: string;
  
    @Column()
    soilTypeId: string;
  
    @Column()
    cicle: string;
  
    @Column('double')
    saturationPoint: number;
  
    @Column('double')
    tempIrrigationControl: number;
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updatedAt: Date;
  
    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt?: Date;
  
    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;
}
  