'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, Calendar, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { studentsAPI } from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => studentsAPI.getStats(),
  });

  const dashboardCards = [
    {
      title: 'Tổng học sinh',
      value: stats?.total || 0,
      icon: Users,
      color: 'bg-blue-500',
      description: 'Học sinh đang theo học',
    },
    {
      title: 'Học sinh nam',
      value: stats?.byGender?.MALE || 0,
      icon: Users,
      color: 'bg-blue-500',
      description: 'Số lượng học sinh nam',
    },
    {
      title: 'Học sinh nữ',
      value: stats?.byGender?.FEMALE || 0,
      icon: Users,
      color: 'bg-pink-500',
      description: 'Số lượng học sinh nữ',
    },
    {
      title: 'Lớp học',
      value: '2',
      icon: BookOpen,
      color: 'bg-green-500',
      description: 'Tổng số lớp học',
    },
  ];

  const recentActivities = [
    { id: 1, action: 'Đăng nhập hệ thống', user: user?.fullName, time: 'Vừa xong' },
    { id: 2, action: 'Cập nhật thông tin học sinh', user: 'Nguyễn Văn A', time: '10 phút trước' },
    { id: 3, action: 'Điểm danh buổi sáng', user: 'Trần Thị B', time: '1 giờ trước' },
    { id: 4, action: 'Nhập điểm học kỳ', user: 'Phạm Văn C', time: '2 giờ trước' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">Xin chào, {user?.fullName}!</h1>
        <p className="text-gray-600 mt-2">
          Chào mừng bạn đến với Hệ thống Quản lý Giáo lý
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${card.color} text-white`}>
                <card.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-gray-500">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activities and Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>Các hoạt động mới nhất trong hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.action}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{activity.user}</span>
                      <span className="mx-2">•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Thao tác nhanh</CardTitle>
            <CardDescription>Truy cập nhanh các chức năng chính</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-auto py-4 flex flex-col">
                <Users className="h-6 w-6 mb-2" />
                <span>Thêm học sinh</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col">
                <Calendar className="h-6 w-6 mb-2" />
                <span>Điểm danh</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col">
                <BookOpen className="h-6 w-6 mb-2" />
                <span>Tạo lớp học</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col">
                <TrendingUp className="h-6 w-6 mb-2" />
                <span>Xem báo cáo</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}