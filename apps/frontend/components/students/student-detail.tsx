'use client';

import { useQuery } from '@tanstack/react-query';
import { studentsAPI } from '@/lib/api-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Phone, Mail, MapPin, Edit, Calendar, BookOpen, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface StudentDetailProps {
  studentId: string;
  onBack: () => void;
}

export default function StudentDetail({ studentId, onBack }: StudentDetailProps) {
  const { data: student, isLoading } = useQuery({
    queryKey: ['student', studentId],
    queryFn: () => studentsAPI.getById(studentId),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-8">
        <p>Không tìm thấy học sinh</p>
        <Button onClick={onBack} className="mt-4">
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{student.fullName}</h1>
            <p className="text-gray-600">Mã học sinh: {student.code}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Sửa
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Student Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Tên thánh</p>
                  <p className="font-medium">{student.saintName || 'Không có'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Họ và tên</p>
                  <p className="font-medium">{student.fullName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Giới tính</p>
                  <Badge variant={student.gender === 'MALE' ? 'default' : 'secondary'}>
                    {student.gender === 'MALE' ? 'Nam' : 'Nữ'}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Ngày sinh</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p className="font-medium">{formatDate(student.dateOfBirth)}</p>
                  </div>
                </div>
                {student.dateOfBaptism && (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Ngày rửa tội</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <p className="font-medium">{formatDate(student.dateOfBaptism)}</p>
                    </div>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Trạng thái</p>
                  <Badge variant={student.isActive ? 'default' : 'destructive'}>
                    {student.isActive ? 'Đang học' : 'Đã nghỉ'}
                  </Badge>
                </div>
              </div>
              
              {student.address && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Địa chỉ</p>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <p className="font-medium">{student.address}</p>
                    </div>
                  </div>
                </>
              )}

              {student.note && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Ghi chú</p>
                    <p className="text-gray-700">{student.note}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Guardians Card */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin phụ huynh</CardTitle>
              <CardDescription>
                {student.guardians.length} phụ huynh
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {student.guardians.map((guardian: any) => (
                  <div key={guardian.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{guardian.name}</p>
                          {guardian.isPrimary && (
                            <Badge variant="default">Liên hệ chính</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {guardian.relationship}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <p className="text-sm">{guardian.phone}</p>
                      </div>
                      {guardian.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <p className="text-sm">{guardian.email}</p>
                        </div>
                      )}
                      {guardian.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <p className="text-sm">{guardian.address}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Class Info & Actions */}
        <div className="space-y-6">
          {/* Class Info */}
          <Card>
            <CardHeader>
              <CardTitle>Lớp học</CardTitle>
            </CardHeader>
            <CardContent>
              {student.classEnrollments?.length > 0 ? (
                <div className="space-y-3">
                  {student.classEnrollments
                    .filter((enrollment: any) => !enrollment.leftAt)
                    .map((enrollment: any) => (
                      <div key={enrollment.id} className="p-3 border rounded-lg">
                        <p className="font-medium">{enrollment.class.name}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {enrollment.class.gradeLevel} • {enrollment.class.academicYear}
                        </p>
                        {enrollment.class.room && (
                          <p className="text-sm text-gray-600">Phòng: {enrollment.class.room}</p>
                        )}
                        {enrollment.class.teacher && (
                          <div className="mt-2 pt-2 border-t">
                            <p className="text-sm font-medium">Giáo lý viên:</p>
                            <p className="text-sm">{enrollment.class.teacher.fullName}</p>
                            {enrollment.class.teacher.phone && (
                              <p className="text-sm text-gray-600">
                                {enrollment.class.teacher.phone}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-500">Chưa có lớp học</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Thao tác nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Phone className="h-4 w-4 mr-2" />
                Gọi cho phụ huynh
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Gửi email
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Xem điểm danh
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                Xem điểm số
              </Button>
            </CardContent>
          </Card>

          {/* Parish Info */}
          {student.parish && (
            <Card>
              <CardHeader>
                <CardTitle>Giáo xứ/giáo họ</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{student.parish.name}</p>
                {student.parish.description && (
                  <p className="text-sm text-gray-600 mt-1">{student.parish.description}</p>
                )}
                {student.parish.address && (
                  <div className="flex items-start gap-2 mt-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <p className="text-sm">{student.parish.address}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}