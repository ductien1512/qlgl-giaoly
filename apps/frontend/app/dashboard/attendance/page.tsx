'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle } from 'lucide-react';

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Điểm danh</h1>
          <p className="text-gray-600">Quản lý điểm danh học sinh</p>
        </div>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          Điểm danh hôm nay
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Lịch điểm danh
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">Hôm nay</div>
                <div className="text-sm text-gray-500">Chưa điểm danh</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="font-medium">Thứ 3, 10/12/2024</div>
                <div className="text-sm text-green-600">Đã điểm danh: 15/15 học sinh</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="font-medium">Chủ nhật, 07/12/2024</div>
                <div className="text-sm text-green-600">Đã điểm danh: 14/15 học sinh</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5" />
              Thống kê chuyên cần
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Có mặt đầy đủ</span>
                <span className="font-bold">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Vắng có phép</span>
                <span className="font-bold">10%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '10%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Vắng không phép</span>
                <span className="font-bold">5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full" style={{ width: '5%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}