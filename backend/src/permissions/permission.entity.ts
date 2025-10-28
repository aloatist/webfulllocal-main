import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoleEntity } from '../roles/role.entity';
import { TimestampEntity } from '../common/entities/base.entity';

@Entity('permissions')
export class PermissionEntity extends TimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  code!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @ManyToMany(() => RoleEntity, (role) => role.permissions)
  roles?: RoleEntity[];
}
