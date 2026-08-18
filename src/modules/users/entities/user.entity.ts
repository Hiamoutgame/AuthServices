import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../core/entities/base.entity';
import { IUser } from '../../../core/interfaces/user.interface';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User extends BaseEntity implements IUser {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  @Exclude()
  // Khúc này nullable là để hỗ trợ cho Oauth2 => Google vs Facebook bla bla không có mk dc lưu vào db
  password?: string;
}
// Lý thuyết
/*
  - ClassSerializerInterceptor :  Đánh dấu cột cần giấu.
  - Gắn Interceptor chặn response.
*/
