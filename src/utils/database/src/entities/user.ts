import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'full_name'})
    fullName: string;

    @Column()
    rol: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column({name: 'telegram_id', default:''})
    telegramId: string;

    @Column({name: 'api_key', default:''})
    apiKey: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)', name: 'updated_at'  })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true, name: 'deleted_at'  })
    deletedAt?: Date;
}