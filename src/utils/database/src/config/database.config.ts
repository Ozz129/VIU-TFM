import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Crop } from '../entities/crop';
import { User } from '../entities/user';
import { Irrigation } from '../entities/irrigation';

export default async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
    return { 
        type: 'mysql' as 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: +configService.get<string>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [Crop, User, Irrigation],
        autoLoadEntities: true,
        synchronize: false
    }
    
}
