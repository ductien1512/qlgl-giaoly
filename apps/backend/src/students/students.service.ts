import { 
  Injectable, NotFoundException, ConflictException, 
  BadRequestException 
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto, CreateGuardianDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentFilterDto } from './dto/student-filter.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(createStudentDto: CreateStudentDto) {
    // Kiểm tra mã học sinh đã tồn tại
    const existingStudent = await this.prisma.student.findUnique({
      where: { code: createStudentDto.code },
    });

    if (existingStudent) {
      throw new ConflictException(`Student with code ${createStudentDto.code} already exists`);
    }

    // Tạo fullName từ firstName và lastName
    const fullName = `${createStudentDto.lastName} ${createStudentDto.firstName}`.trim();

    return this.prisma.student.create({
      data: {
        ...createStudentDto,
        fullName,
        dateOfBirth: new Date(createStudentDto.dateOfBirth),
        dateOfBaptism: createStudentDto.dateOfBaptism 
          ? new Date(createStudentDto.dateOfBaptism) 
          : null,
      },
      include: {
        parish: true,
        guardians: true,
      },
    });
  }

  async findAll(filters: StudentFilterDto) {
    const { 
      search, gender, parishId, classId, 
      page, limit, sortBy, sortOrder 
    } = filters;

    const where: any = {
      isActive: true,
    };

    // Tìm kiếm theo tên, mã, hoặc tên thánh
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { saintName: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (gender) {
      where.gender = gender;
    }

    if (parishId) {
      where.parishId = parishId;
    }

    // Lọc theo lớp
    if (classId) {
      where.classEnrollments = {
        some: {
          classId,
          leftAt: null,
        },
      };
    }

    // Tính tổng số bản ghi
    const total = await this.prisma.student.count({ where });

    // Lấy dữ liệu với phân trang
    const students = await this.prisma.student.findMany({
      where,
      include: {
        parish: true,
        guardians: {
          where: { isPrimary: true },
          take: 1,
        },
        classEnrollments: {
          where: { leftAt: null },
          include: {
            class: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: students,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        parish: true,
        guardians: true,
        classEnrollments: {
          include: {
            class: {
              include: {
                teacher: {
                  select: {
                    id: true,
                    fullName: true,
                    phone: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    // Kiểm tra học sinh tồn tại
    await this.findOne(id);

    // Cập nhật fullName nếu firstName hoặc lastName thay đổi
    const updateData: any = { ...updateStudentDto };
    
    if (updateStudentDto.firstName || updateStudentDto.lastName) {
      const student = await this.prisma.student.findUnique({
        where: { id },
        select: { firstName: true, lastName: true },
      });

      const firstName = updateStudentDto.firstName || student.firstName;
      const lastName = updateStudentDto.lastName || student.lastName;
      updateData.fullName = `${lastName} ${firstName}`.trim();
    }

    // Chuyển đổi ngày tháng nếu có
    if (updateStudentDto.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateStudentDto.dateOfBirth);
    }
    if (updateStudentDto.dateOfBaptism) {
      updateData.dateOfBaptism = new Date(updateStudentDto.dateOfBaptism);
    }

    return this.prisma.student.update({
      where: { id },
      data: updateData,
      include: {
        parish: true,
        guardians: true,
      },
    });
  }

  async remove(id: string) {
    // Soft delete: chỉ đánh dấu isActive = false
    await this.findOne(id);

    return this.prisma.student.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async addGuardian(studentId: string, createGuardianDto: CreateGuardianDto) {
    // Kiểm tra học sinh tồn tại
    await this.findOne(studentId);

    // Nếu đánh dấu là primary, bỏ primary của các guardian khác
    if (createGuardianDto.isPrimary) {
      await this.prisma.guardian.updateMany({
        where: { 
          studentId,
          isPrimary: true,
        },
        data: { isPrimary: false },
      });
    }

    return this.prisma.guardian.create({
      data: {
        ...createGuardianDto,
        studentId,
      },
    });
  }

  async updateGuardian(studentId: string, guardianId: string, updateData: any) {
    // Kiểm học sinh và phụ huynh tồn tại
    const guardian = await this.prisma.guardian.findFirst({
      where: {
        id: guardianId,
        studentId,
      },
    });

    if (!guardian) {
      throw new NotFoundException(`Guardian with ID ${guardianId} not found for student ${studentId}`);
    }

    // Nếu đánh dấu là primary, bỏ primary của các guardian khác
    if (updateData.isPrimary === true) {
      await this.prisma.guardian.updateMany({
        where: { 
          studentId,
          isPrimary: true,
          id: { not: guardianId },
        },
        data: { isPrimary: false },
      });
    }

    return this.prisma.guardian.update({
      where: { id: guardianId },
      data: updateData,
    });
  }

  async removeGuardian(studentId: string, guardianId: string) {
    // Kiểm tra xem đây có phải guardian cuối cùng không
    const guardians = await this.prisma.guardian.count({
      where: { studentId },
    });

    if (guardians <= 1) {
      throw new BadRequestException('Student must have at least one guardian');
    }

    const guardian = await this.prisma.guardian.findFirst({
      where: {
        id: guardianId,
        studentId,
      },
    });

    if (!guardian) {
      throw new NotFoundException(`Guardian with ID ${guardianId} not found`);
    }

    await this.prisma.guardian.delete({
      where: { id: guardianId },
    });

    // Nếu guardian bị xóa là primary, đặt một guardian khác làm primary
    if (guardian.isPrimary) {
      const anotherGuardian = await this.prisma.guardian.findFirst({
        where: { studentId },
      });
      
      if (anotherGuardian) {
        await this.prisma.guardian.update({
          where: { id: anotherGuardian.id },
          data: { isPrimary: true },
        });
      }
    }
  }

  async getStudentStats() {
    const total = await this.prisma.student.count({ where: { isActive: true } });
    const byGender = await this.prisma.student.groupBy({
      by: ['gender'],
      where: { isActive: true },
      _count: true,
    });
    const byParish = await this.prisma.student.groupBy({
      by: ['parishId'],
      where: { isActive: true },
      _count: true,
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    });

    // Lấy tên giáo xứ
    const parishes = await this.prisma.parish.findMany({
      where: { id: { in: byParish.map(p => p.parishId).filter(Boolean) } },
    });

    const parishStats = byParish.map(stat => ({
      parish: parishes.find(p => p.id === stat.parishId)?.name || 'Không xác định',
      count: stat._count,
    }));

    return {
      total,
      byGender: byGender.reduce((acc, curr) => {
        acc[curr.gender] = curr._count;
        return acc;
      }, {}),
      byParish: parishStats,
    };
  }
}