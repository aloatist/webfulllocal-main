import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimestampEntity } from '../common/entities/base.entity';
import { UserStatus } from '../common/enums/user-status.enum';
import { RoleEntity } from '../roles/role.entity';

@Entity('users')
export class UserEntity extends TimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash!: string;

  @Column({ name: 'full_name', type: 'varchar', length: 255 })
  fullName!: string;

  @Column({ name: 'avatar_id', type: 'uuid', nullable: true })
  avatarId?: string | null;

  @Column({
    type: 'varchar',
    default: UserStatus.PENDING,
  })
  status!: UserStatus;

  @Column({ name: 'last_login_at', type: 'datetime', nullable: true })
  lastLoginAt?: Date | null;

  @Column({ type: 'simple-json', nullable: true })
  metadata?: Record<string, any> | null;

  @ManyToMany(() => RoleEntity, (role) => role.users, { cascade: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles?: RoleEntity[];
}
