'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users } from 'lucide-react';

export default function ClassesPage() {
  const classes = [
    { id: 1, name: 'Lớp Chiên Ngoan 1', gradeLevel: 'Thiếu Nhi', students: 8, teacher: 'Nguyễn Thị Mai Linh' },
    { id: 2, name: 'Lớp Ánh Sáng 2', gradeLevel: 'Kinh Thánh', students: 7, teacher: 'Trần Văn Tiến' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Lớp học</h1>
          <p className="text-gray-600">Quản lý các lớp học giáo lý</p>
        </div>
        <Button>
          <BookOpen className="mr-2 h-4 w-4" />
          Tạo lớp mới
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {classes.map((cls) => (
          <Card key={cls.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{cls.name}</span>
                <span className="text-sm font-normal bg-primary/10 text-primary px-2 py-1 rounded">
                  {cls.gradeLevel}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Users className="mr-2 h-4 w-4 text-gray-400" />
                  <span>Sĩ số: <strong>{cls.students}</strong> học sinh</span>
                </div>
                <div className="flex items-center text-sm">
                  <BookOpen className="mr-2 h-4 w-4 text-gray-400" />
                  <span>Giáo lý viên: <strong>{cls.teacher}</strong></span>
                </div>
                <div className="pt-4 flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Xem chi tiết
                  </Button>
                  <Button size="sm" className="flex-1">
                    Quản lý
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}