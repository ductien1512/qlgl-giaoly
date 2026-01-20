import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  Query, UseGuards, ParseUUIDPipe 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto, CreateGuardianDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentFilterDto } from './dto/student-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Students')
@Controller('students')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.GIAO_XU_ADMIN)
  @ApiOperation({ summary: 'Create a new student' })
  @ApiResponse({ status: 201, description: 'Student created successfully' })
  @ApiResponse({ status: 409, description: 'Student code already exists' })
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all students with filtering' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'gender', required: false, enum: ['MALE', 'FEMALE', 'OTHER'] })
  @ApiQuery({ name: 'parishId', required: false })
  @ApiQuery({ name: 'classId', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of students' })
  findAll(@Query() filters: StudentFilterDto) {
    return this.studentsService.findAll(filters);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get student statistics' })
  @ApiResponse({ status: 200, description: 'Student statistics' })
  getStats() {
    return this.studentsService.getStudentStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get student by ID' })
  @ApiResponse({ status: 200, description: 'Student details' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.studentsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.GIAO_XU_ADMIN)
  @ApiOperation({ summary: 'Update student' })
  @ApiResponse({ status: 200, description: 'Student updated' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.GIAO_XU_ADMIN)
  @ApiOperation({ summary: 'Delete student (soft delete)' })
  @ApiResponse({ status: 200, description: 'Student deleted' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.studentsService.remove(id);
  }

  // Guardian routes
  @Post(':id/guardians')
  @ApiOperation({ summary: 'Add guardian to student' })
  @ApiResponse({ status: 201, description: 'Guardian added' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  addGuardian(
    @Param('id', ParseUUIDPipe) studentId: string,
    @Body() createGuardianDto: CreateGuardianDto,
  ) {
    return this.studentsService.addGuardian(studentId, createGuardianDto);
  }

  @Patch(':studentId/guardians/:guardianId')
  @ApiOperation({ summary: 'Update guardian' })
  @ApiResponse({ status: 200, description: 'Guardian updated' })
  updateGuardian(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Param('guardianId', ParseUUIDPipe) guardianId: string,
    @Body() updateData: any,
  ) {
    return this.studentsService.updateGuardian(studentId, guardianId, updateData);
  }

  @Delete(':studentId/guardians/:guardianId')
  @ApiOperation({ summary: 'Remove guardian from student' })
  @ApiResponse({ status: 200, description: 'Guardian removed' })
  @ApiResponse({ status: 400, description: 'Cannot remove last guardian' })
  removeGuardian(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Param('guardianId', ParseUUIDPipe) guardianId: string,
  ) {
    return this.studentsService.removeGuardian(studentId, guardianId);
  }
}