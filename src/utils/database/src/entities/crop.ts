import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
  } from 'typeorm';
  
  import { User } from './user';
  import { Irrigation } from './irrigation';

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
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', name:'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)', name: "updated_at" })
    updatedAt: Date;
  
    @DeleteDateColumn({ type: 'timestamp', nullable: true, name: "deleted_at" })
    deletedAt?: Date;
  
    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @OneToMany(() => Irrigation, (irrigation) => irrigation.crop)
    irrigations: Irrigation[];
}
  