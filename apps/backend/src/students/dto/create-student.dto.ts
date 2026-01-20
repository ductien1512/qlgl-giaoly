import { 
  IsString, IsNotEmpty, IsEnum, IsOptional, 
  IsDateString, IsPhoneNumber, IsEmail, MaxLength 
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';

export class CreateStudentDto {
  @ApiProperty({ example: 'HS001' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ example: 'Maria' })
  @IsOptional()
  @IsString()
  saintName?: string;

  @ApiProperty({ example: 'An' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Nguyễn' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ enum: Gender, example: Gender.FEMALE })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ example: '2010-05-15' })
  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({ example: '2011-06-20', required: false })
  @IsOptional()
  @IsDateString()
  dateOfBaptism?: string;

  @ApiProperty({ example: '123 Đường ABC, Quận 1', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string;

  @ApiProperty({ example: 'Ghi chú đặc biệt', required: false })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ example: 'clm8z1q9a0000xxxxxxx', required: false })
  @IsOptional()
  @IsString()
  parishId?: string;
}

export class CreateGuardianDto {
  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Bố' })
  @IsNotEmpty()
  @IsString()
  relationship: string;

  @ApiProperty({ example: '0987654321' })
  @IsNotEmpty()
  @IsPhoneNumber('VN')
  phone: string;

  @ApiProperty({ example: 'parent@email.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '123 Đường ABC', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: true })
  @IsOptional()
  isPrimary?: boolean;

  @ApiProperty({ example: 'Ghi chú', required: false })
  @IsOptional()
  @IsString()
  note?: string;
}