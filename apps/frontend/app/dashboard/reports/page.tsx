'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Download, FileText, PieChart } from 'lucide-react';

export default function ReportsPage() {
  const reports = [
    { id: 1, title: 'Báo cáo học sinh', description: 'Danh sách học sinh theo lớp', icon: FileText },
    { id: 2, title: 'Thống kê điểm danh', description: 'Tỷ lệ chuyên cần tháng', icon: PieChart },
    { id: 3, title: 'Báo cáo điểm số', description: 'Điểm tổng kết học kỳ', icon: BarChart3 },
    { id: 4, title: 'Danh sách phụ huynh', description: 'Thông tin liên hệ phụ huynh', icon: FileText },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Báo cáo & Thống kê</h1>
        <p className="text-gray-600">Xuất báo cáo và xem thống kê hệ thống</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.id}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon className="mr-2 h-5 w-5" />
                  {report.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{report.description}</p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Xem trước
                  </Button>
                  <Button size="sm" className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Xuất Excel
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Báo cáo nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold">15</div>
                <div className="text-sm text-gray-600">Tổng học sinh</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold">2</div>
                <div className="text-sm text-gray-600">Lớp học</div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-gray-600">Giáo lý viên</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold">85%</div>
                <div className="text-sm text-gray-600">Chuyên cần</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}