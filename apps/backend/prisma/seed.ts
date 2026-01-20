import { PrismaClient, UserRole, Gender, AttendanceStatus, GradeColumnType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting seed...');

  // 1. Xóa dữ liệu cũ (cẩn thận với production!)
  await prisma.grade.deleteMany();
  await prisma.gradeColumn.deleteMany();
  await prisma.soDauBai.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.session.deleteMany();
  await prisma.classStudent.deleteMany();
  await prisma.teachingSchedule.deleteMany();
  await prisma.guardian.deleteMany();
  await prisma.student.deleteMany();
  await prisma.class.deleteMany();
  await prisma.parish.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleared existing data');

  // 2. Tạo giáo xứ
  const parish = await prisma.parish.create({
    data: {
      name: 'Giáo Xứ Thánh Giuse',
      description: 'Giáo xứ chính',
      address: '123 Đường ABC, Quận XYZ',
    },
  });
  console.log(`✅ Created parish: ${parish.name}`);

  // 3. Tạo Super Admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@qlgl.com',
      username: 'admin',
      password: adminPassword,
      fullName: 'Nguyễn Văn Admin',
      role: UserRole.SUPER_ADMIN,
      phone: '0987654321',
    },
  });
  console.log(`✅ Created admin: ${admin.username}`);

  // 4. Tạo Giáo lý viên
  const glvPassword = await bcrypt.hash('glv123', 10);
  const glv1 = await prisma.user.create({
    data: {
      email: 'mai.linh@qlgl.com',
      username: 'mailinh',
      password: glvPassword,
      fullName: 'Nguyễn Thị Mai Linh',
      role: UserRole.GIAO_LY_VIEN,
      phone: '0912345678',
    },
  });

  const glv2 = await prisma.user.create({
    data: {
      email: 'van.tien@qlgl.com',
      username: 'vantien',
      password: glvPassword,
      fullName: 'Trần Văn Tiến',
      role: UserRole.GIAO_LY_VIEN,
      phone: '0923456789',
    },
  });
  console.log(`✅ Created 2 GLVs`);

  // 5. Tạo lớp học
  const class1 = await prisma.class.create({
    data: {
      name: 'Lớp Chiên Ngoan 1',
      gradeLevel: 'Thiếu Nhi',
      academicYear: '2024-2025',
      description: 'Lớp dành cho thiếu nhi từ 7-10 tuổi',
      room: 'Phòng 101',
      teacherId: glv1.id,
    },
  });

  const class2 = await prisma.class.create({
    data: {
      name: 'Lớp Ánh Sáng 2',
      gradeLevel: 'Kinh Thánh',
      academicYear: '2024-2025',
      description: 'Lớp Kinh Thánh cho thiếu niên',
      room: 'Phòng 102',
      teacherId: glv2.id,
    },
  });
  console.log(`✅ Created 2 classes`);

  // 6. Tạo cột điểm cho lớp 1
  const gradeColumns = [
    { name: 'Điểm miệng', type: GradeColumnType.ORAL, weight: 1, order: 1 },
    { name: 'Điểm 15 phút', type: GradeColumnType.FIFTEEN_MIN, weight: 1, order: 2 },
    { name: 'Điểm 1 tiết', type: GradeColumnType.ONE_PERIOD, weight: 2, order: 3 },
    { name: 'Điểm học kỳ', type: GradeColumnType.FINAL, weight: 3, order: 4 },
  ];

  for (const column of gradeColumns) {
    await prisma.gradeColumn.create({
      data: {
        ...column,
        classId: class1.id,
        maxScore: 10,
        isPublished: true,
      },
    });
  }
  console.log(`✅ Created grade columns for class 1`);

  // 7. Tạo học sinh
  const students = [];
  const firstNames = ['An', 'Bình', 'Chi', 'Dũng', 'Hạnh', 'Hoàng', 'Huy', 'Khánh', 'Lan', 'Long'];
  const lastNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Phan', 'Vũ', 'Đặng', 'Bùi', 'Đỗ'];
  const saintNames = ['Maria', 'Giuse', 'Phaolô', 'Phêrô', 'Têrêsa', 'Antôn', 'Gioan', 'Luca', 'Mátthêu', 'Máccô'];

  for (let i = 1; i <= 15; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const saintName = saintNames[Math.floor(Math.random() * saintNames.length)];
    const gender = i % 2 === 0 ? Gender.MALE : Gender.FEMALE;
    
    // Tạo ngày sinh ngẫu nhiên (từ 2010-2015)
    const birthYear = 2010 + Math.floor(Math.random() * 6);
    const birthMonth = Math.floor(Math.random() * 12) + 1;
    const birthDay = Math.floor(Math.random() * 28) + 1;
    
    const student = await prisma.student.create({
      data: {
        code: `HS${String(i).padStart(3, '0')}`,
        saintName: saintName,
        firstName: firstName,
        lastName: lastName,
        fullName: `${lastName} ${firstName}`,
        gender: gender,
        dateOfBirth: new Date(birthYear, birthMonth - 1, birthDay),
        dateOfBaptism: new Date(birthYear + 1, birthMonth - 1, birthDay),
        address: `Địa chỉ ${i}, Quận XYZ`,
        note: i % 3 === 0 ? 'Cần chú ý đặc biệt' : null,
        parishId: parish.id,
      },
    });
    students.push(student);

    // Tạo phụ huynh
    await prisma.guardian.create({
      data: {
        name: `Phụ huynh của ${student.fullName}`,
        relationship: i % 2 === 0 ? 'Bố' : 'Mẹ',
        phone: `09${Math.floor(Math.random() * 90000000 + 10000000)}`,
        email: `parent${i}@email.com`,
        address: student.address,
        isPrimary: true,
        studentId: student.id,
      },
    });
  }
  console.log(`✅ Created ${students.length} students with guardians`);

  // 8. Gán học sinh vào lớp (mỗi lớp 7-8 học sinh)
  for (let i = 0; i < 8; i++) {
    await prisma.classStudent.create({
      data: {
        classId: class1.id,
        studentId: students[i].id,
        note: i === 0 ? 'Học sinh mới' : null,
      },
    });
  }

  for (let i = 8; i < 15; i++) {
    await prisma.classStudent.create({
      data: {
        classId: class2.id,
        studentId: students[i].id,
      },
    });
  }
  console.log(`✅ Assigned students to classes`);

  // 9. Tạo buổi học và điểm danh
  const today = new Date();
  for (let i = 1; i <= 4; i++) {
    const sessionDate = new Date(today);
    sessionDate.setDate(today.getDate() - i * 7); // Mỗi buổi cách nhau 7 ngày

    const session = await prisma.session.create({
      data: {
        date: sessionDate,
        classId: class1.id,
        title: `Bài ${i}: Thiên Chúa là Tình Yêu`,
        description: `Buổi học thứ ${i} về tình yêu Thiên Chúa`,
      },
    });

    // Tạo điểm danh cho từng học sinh trong lớp
    const classStudents = await prisma.classStudent.findMany({
      where: { classId: class1.id },
      include: { student: true },
    });

    for (const cs of classStudents) {
      // Random trạng thái điểm danh
      const statuses = [
        AttendanceStatus.PRESENT,
        AttendanceStatus.PRESENT,
        AttendanceStatus.PRESENT, // 60% có mặt
        AttendanceStatus.LATE, // 20% muộn
        AttendanceStatus.ABSENT_EXCUSED, // 20% vắng có phép
      ];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      await prisma.attendance.create({
        data: {
          sessionId: session.id,
          studentId: cs.student.id,
          status: status,
          note: status === AttendanceStatus.ABSENT_EXCUSED ? 'Xin phép nghỉ ốm' : null,
        },
      });
    }

    // Tạo sổ đầu bài
    const attendances = await prisma.attendance.findMany({
      where: { sessionId: session.id },
    });

    const presentCount = attendances.filter(a => a.status === AttendanceStatus.PRESENT).length;
    const lateCount = attendances.filter(a => a.status === AttendanceStatus.LATE).length;
    const absentExcused = attendances.filter(a => a.status === AttendanceStatus.ABSENT_EXCUSED).length;
    const absentUnexcused = attendances.filter(a => a.status === AttendanceStatus.ABSENT_UNEXCUSED).length;

    await prisma.soDauBai.create({
      data: {
        sessionId: session.id,
        totalStudents: classStudents.length,
        presentCount,
        lateCount,
        absentExcused,
        absentUnexcused,
        lessonContent: `Giảng về tình yêu Thiên Chúa qua dụ ngôn ${i}`,
        homework: 'Đọc Tin Mừng Matthêu chương 5',
        rating: Math.floor(Math.random() * 3) + 3, // 3-5 sao
        teacherNote: 'Lớp học sôi nổi, các em tích cực phát biểu',
        confirmedBy: glv1.id,
        confirmedAt: new Date(),
      },
    });
  }
  console.log(`✅ Created 4 sessions with attendances and soDauBai`);

  // 10. Tạo điểm cho học sinh
  const gradeColumnsList = await prisma.gradeColumn.findMany({
    where: { classId: class1.id },
  });

  for (const student of students.slice(0, 8)) {
    for (const column of gradeColumnsList) {
      // Tạo điểm ngẫu nhiên từ 5-10
      const score = Math.floor(Math.random() * 51) / 10 + 5; // 5.0 - 10.0
      
      await prisma.grade.create({
        data: {
          studentId: student.id,
          gradeColumnId: column.id,
          classId: class1.id,
          score: parseFloat(score.toFixed(1)),
          recordedBy: glv1.id,
          note: score < 6.5 ? 'Cần cải thiện' : null,
        },
      });
    }
  }
  console.log(`✅ Created grades for students`);

  // 11. Tạo lịch giảng dạy
  for (let i = 0; i < 6; i++) {
    const scheduleDate = new Date(today);
    scheduleDate.setDate(today.getDate() + i * 7);

    await prisma.teachingSchedule.create({
      data: {
        teacherId: glv1.id,
        classId: class1.id,
        scheduleDate,
        lessonTitle: `Bài ${i + 5}: Đức Tin và Đức Cậy`,
        lessonContent: `Giảng về đức tin và đức cậy trong đời sống Kitô hữu`,
        materials: 'Sách Giáo lý, máy chiếu',
        note: i === 0 ? 'Chuẩn bị bài tập nhóm' : null,
      },
    });
  }
  console.log(`✅ Created teaching schedules`);

  console.log('🎉 Seed completed successfully!');
  console.log('==========================================');
  console.log('👤 Admin account:');
  console.log('   Username: admin');
  console.log('   Password: admin123');
  console.log('   Email: admin@qlgl.com');
  console.log('');
  console.log('👨‍🏫 GLV accounts:');
  console.log('   Username: mailinh / Password: glv123');
  console.log('   Username: vantien / Password: glv123');
  console.log('');
  console.log('📊 Stats:');
  console.log(`   - Users: 3`);
  console.log(`   - Students: 15`);
  console.log(`   - Classes: 2`);
  console.log(`   - Sessions: 4`);
  console.log(`   - Attendances: ~32`);
  console.log(`   - Grades: ~32`);
  console.log('==========================================');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });