'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { studentsAPI } from '@/lib/api-client';
import { Loader2, Plus, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

const guardianSchema = z.object({
  name: z.string().min(2, 'Tên phụ huynh phải có ít nhất 2 ký tự'),
  relationship: z.string().min(1, 'Vui lòng chọn mối quan hệ'),
  phone: z.string().regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  address: z.string().optional(),
  isPrimary: z.boolean().default(false),
});

const studentSchema = z.object({
  code: z.string().min(1, 'Mã học sinh là bắt buộc'),
  saintName: z.string().optional(),
  firstName: z.string().min(1, 'Tên là bắt buộc'),
  lastName: z.string().min(1, 'Họ là bắt buộc'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  dateOfBirth: z.string().min(1, 'Ngày sinh là bắt buộc'),
  dateOfBaptism: z.string().optional(),
  address: z.string().optional(),
  note: z.string().optional(),
  parishId: z.string().optional(),
  guardians: z.array(guardianSchema).min(1, 'Cần ít nhất một phụ huynh'),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface StudentFormProps {
  student?: any;
  onSuccess: () => void;
}

export default function StudentForm({ student, onSuccess }: StudentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: student || {
      code: '',
      saintName: '',
      firstName: '',
      lastName: '',
      gender: 'MALE',
      dateOfBirth: '',
      dateOfBaptism: '',
      address: '',
      note: '',
      parishId: '',
      guardians: [
        {
          name: '',
          relationship: 'Bố',
          phone: '',
          email: '',
          address: '',
          isPrimary: true,
        },
      ],
    },
  });

  const guardians = form.watch('guardians');

  const onSubmit = async (data: StudentFormData) => {
    setIsSubmitting(true);
    try {
      if (student) {
        await studentsAPI.update(student.id, data);
        toast.success('Cập nhật học sinh thành công');
      } else {
        await studentsAPI.create(data);
        toast.success('Thêm học sinh thành công');
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Đã xảy ra lỗi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addGuardian = () => {
    const currentGuardians = form.getValues('guardians');
    form.setValue('guardians', [
      ...currentGuardians,
      {
        name: '',
        relationship: 'Mẹ',
        phone: '',
        email: '',
        address: '',
        isPrimary: false,
      },
    ]);
  };

  const removeGuardian = (index: number) => {
    const currentGuardians = form.getValues('guardians');
    if (currentGuardians.length > 1) {
      const newGuardians = currentGuardians.filter((_, i) => i !== index);
      form.setValue('guardians', newGuardians);
      
      // Nếu xóa guardian primary, set guardian đầu tiên làm primary
      if (currentGuardians[index].isPrimary && newGuardians.length > 0) {
        form.setValue('guardians.0.isPrimary', true);
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>
            
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã học sinh *</FormLabel>
                  <FormControl>
                    <Input placeholder="HS001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="saintName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên thánh</FormLabel>
                  <FormControl>
                    <Input placeholder="Maria" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nguyễn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên *</FormLabel>
                    <FormControl>
                      <Input placeholder="Văn A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giới tính *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MALE">Nam</SelectItem>
                      <SelectItem value="FEMALE">Nữ</SelectItem>
                      <SelectItem value="OTHER">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày sinh *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBaptism"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày rửa tội</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Guardians */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Thông tin phụ huynh</h3>
              <Button type="button" variant="outline" size="sm" onClick={addGuardian}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm phụ huynh
              </Button>
            </div>

            {guardians.map((guardian, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {guardian.isPrimary && (
                      <Badge variant="default">Liên hệ chính</Badge>
                    )}
                    <h4 className="font-medium">Phụ huynh {index + 1}</h4>
                  </div>
                  {guardians.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeGuardian(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name={`guardians.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ tên *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nguyễn Văn A" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`guardians.${index}.relationship`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mối quan hệ *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn mối quan hệ" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Bố">Bố</SelectItem>
                          <SelectItem value="Mẹ">Mẹ</SelectItem>
                          <SelectItem value="Ông">Ông</SelectItem>
                          <SelectItem value="Bà">Bà</SelectItem>
                          <SelectItem value="Anh">Anh</SelectItem>
                          <SelectItem value="Chị">Chị</SelectItem>
                          <SelectItem value="Khác">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`guardians.${index}.phone`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại *</FormLabel>
                      <FormControl>
                        <Input placeholder="0987654321" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`guardians.${index}.email`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`guardians.${index}.isPrimary`}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => {
                            // If checking this one, uncheck others
                            if (e.target.checked) {
                              guardians.forEach((_, i) => {
                                if (i !== index) {
                                  form.setValue(`guardians.${i}.isPrimary`, false);
                                }
                              });
                            }
                            field.onChange(e.target.checked);
                          }}
                          className="h-4 w-4"
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Đặt làm liên hệ chính</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Thông tin bổ sung</h3>
          
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Địa chỉ</FormLabel>
                <FormControl>
                  <Textarea placeholder="Địa chỉ chi tiết..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ghi chú</FormLabel>
                <FormControl>
                  <Textarea placeholder="Ghi chú đặc biệt..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Hủy
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : student ? (
              'Cập nhật học sinh'
            ) : (
              'Thêm học sinh'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}