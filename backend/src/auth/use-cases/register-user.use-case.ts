import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { RegisterDto } from '../dto/register.dto';
import { JwtService } from '@nestjs/jwt';

export interface RegisterResult {
  user: {
    id: string;
    username: string;
    email: string;
    xp: number;
    level: number;
    createdAt: Date;
  };
  token: string;
}

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: RegisterDto): Promise<RegisterResult> {
    const { username, email, password } = dto;

    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      throw new BadRequestException(
        'El email o nombre de usuario ya está registrado',
      );
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      xp: 0,
      level: 1,
    });

    await this.userRepository.save(user);

    // Generar token
    const token = this.jwtService.sign({ userId: user.id });

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        xp: user.xp,
        level: user.level,
        createdAt: user.createdAt,
      },
      token,
    };
  }
}
