import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Crop } from './crop';

@Entity('irrigation')
export class Irrigation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cropId: number;

    @Column('time')
    executionHour: string;

    @Column()
    status: boolean;

    @ManyToOne(() => Crop, crop => crop.irrigations)
    crop: Crop;
}
