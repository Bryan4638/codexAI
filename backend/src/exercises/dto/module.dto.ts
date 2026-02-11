import { IsString, IsInt, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreateModuleDto {
  @IsInt()
  @Min(1)
  moduleNumber: number;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  order?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateModuleDto {
  @IsInt()
  @IsOptional()
  @Min(1)
  moduleNumber?: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  order?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
