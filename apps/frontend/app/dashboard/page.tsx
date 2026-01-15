
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard QLGL</h1>
          <p className="text-gray-600">Trung tâm điều khiển hệ thống quản lý giáo lý</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stats Cards */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tổng học sinh</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">👥</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Lớp học</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">🏫</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">GLV đang hoạt động</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">👨‍🏫</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Buổi học hôm nay</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 text-xl">📅</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Thao tác nhanh</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="bg-blue-50 text-blue-700 p-4 rounded-lg hover:bg-blue-100 text-center">
              <div className="text-2xl mb-2">➕</div>
              <div className="font-medium">Thêm học sinh</div>
            </button>
            
            <button className="bg-green-50 text-green-700 p-4 rounded-lg hover:bg-green-100 text-center">
              <div className="text-2xl mb-2">📝</div>
              <div className="font-medium">Điểm danh</div>
            </button>
            
            <button className="bg-purple-50 text-purple-700 p-4 rounded-lg hover:bg-purple-100 text-center">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-medium">Nhập điểm</div>
            </button>
            
            <button className="bg-orange-50 text-orange-700 p-4 rounded-lg hover:bg-orange-100 text-center">
              <div className="text-2xl mb-2">📋</div>
              <div className="font-medium">Báo cáo</div>
            </button>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Hoạt động gần đây</h2>
          <div className="text-gray-500 text-center py-8">
            <p className="text-lg">Chưa có hoạt động nào</p>
            <p className="text-sm mt-2">Hãy bắt đầu bằng cách thêm học sinh hoặc tạo lớp học</p>
          </div>
        </div>
      </div>
    </div>
  );
}
