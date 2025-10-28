import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';
import { AmenitiesModule } from './amenities/amenities.module';
import { SeedModule } from './database/seeds/seed.module';
import { LocationsModule } from './locations/locations.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { TagsModule } from './tags/tags.module';
import { TokensModule } from './tokens/tokens.module';
import { UsersModule } from './users/users.module';
import { CustomersModule } from './customers/customers.module';
import { LeadsModule } from './leads/leads.module';
import { ParticipantsModule } from './participants/participants.module';
import { CheckinsModule } from './checkins/checkins.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DestinationsModule } from './destinations/destinations.module';
import { PropertiesModule } from './properties/properties.module';
import { RoomsModule } from './rooms/rooms.module';
import { ExperiencesModule } from './experiences/experiences.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { PromotionsModule } from './promotions/promotions.module';
import { ReviewsModule } from './reviews/reviews.module';
import { BookingsModule } from './bookings/bookings.module';
import { PostsModule } from './posts/posts.module';
import { ProductsModule } from './products/products.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { promises as fs } from 'fs';
import { resolveServeRoot, resolveUploadsDir } from './uploads/uploads.config';
import { UploadsModule } from './uploads/uploads.module';
import { PaymentsModule } from './payments/payments.module';
import { HomepageModule } from './homepage/homepage.module';
import { HomestaysModule } from './homestays/homestays.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV ?? 'local'}`,
        '.env.local',
        '.env',
      ],
    }),
    ServeStaticModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const rootPath = resolveUploadsDir(config);
        await fs.mkdir(rootPath, { recursive: true });

        return [
          {
            rootPath,
            serveRoot: resolveServeRoot(config),
          },
        ];
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isPostgres = config.get('DATABASE_URL') || config.get('DB_HOST');
        const synchronize = config.get('TYPEORM_SYNC', 'true') !== 'false';

        if (isPostgres) {
          return {
            type: 'postgres',
            url: config.get('DATABASE_URL'),
            host: config.get('DB_HOST'),
            port: config.get('DB_PORT')
              ? Number(config.get('DB_PORT'))
              : undefined,
            username: config.get('DB_USER'),
            password: config.get('DB_PASSWORD'),
            database: config.get('DB_NAME'),
            ssl:
              config.get('DB_SSL') === 'true'
                ? {
                    rejectUnauthorized:
                      config.get('DB_REJECT_UNAUTHORIZED') !== 'false',
                  }
                : undefined,
            autoLoadEntities: true,
            synchronize,
          } as const;
        }

        return {
          type: 'sqlite',
          database: config.get('SQLITE_DB_PATH', 'data/app.sqlite'),
          autoLoadEntities: true,
          synchronize,
        } as const;
      },
    }),
    ContentModule,
    PermissionsModule,
    RolesModule,
    UsersModule,
    TagsModule,
    LocationsModule,
    AmenitiesModule,
    CustomersModule,
    LeadsModule,
    TokensModule,
    AuthModule,
    SeedModule,
    ParticipantsModule,
    CheckinsModule,
    DashboardModule,
    DestinationsModule,
    PropertiesModule,
    RoomsModule,
    ExperiencesModule,
    RestaurantsModule,
    PromotionsModule,
    ReviewsModule,
    BookingsModule,
    PostsModule,
    ProductsModule,
    UploadsModule,
    PaymentsModule,
    HomepageModule,
    HomestaysModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
