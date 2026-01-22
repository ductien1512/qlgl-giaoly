'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, User, Bell, Shield } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Cài đặt hệ thống</h1>
        <p className="text-gray-600">Cấu hình và tùy chỉnh hệ thống</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Thông tin tài khoản
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="fullName">Họ và tên</Label>
                <Input id="fullName" defaultValue="Nguyễn Văn Admin" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="admin@qlgl.com" />
              </div>
              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input id="phone" defaultValue="0987654321" />
              </div>
              <div>
                <Label htmlFor="role">Vai trò</Label>
                <Input id="role" defaultValue="Super Admin" disabled />
              </div>
            </div>
            <Button>Lưu thay đổi</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Thông báo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Thông báo email</div>
                <div className="text-sm text-gray-500">Nhận thông báo qua email</div>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input type="checkbox" id="email-notifications" className="sr-only" defaultChecked />
                <label htmlFor="email-notifications" className="block h-6 overflow-hidden bg-gray-300 rounded-full cursor-pointer">
                  <span className="block h-6 w-6 bg-white rounded-full shadow transform transition-transform duration-300 ease-in-out translate-x-6"></span>
                </label>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Thông báo hệ thống</div>
                <div className="text-sm text-gray-500">Hiển thị thông báo trên website</div>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input type="checkbox" id="system-notifications" className="sr-only" defaultChecked />
                <label htmlFor="system-notifications" className="block h-6 overflow-hidden bg-gray-300 rounded-full cursor-pointer">
                  <span className="block h-6 w-6 bg-white rounded-full shadow transform transition-transform duration-300 ease-in-out translate-x-6"></span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Bảo mật
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
              <Input id="currentPassword" type="password" />
            </div>
            <div>
              <Label htmlFor="newPassword">Mật khẩu mới</Label>
              <Input id="newPassword" type="password" />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
              <Input id="confirmPassword" type="password" />
            </div>
            <Button variant="destructive">Đổi mật khẩu</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}