import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LoginOutlined, PieChartOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../lib/reducer/userSlice';
import isChildUrl from '../../../utils/functions/check-active-router';
import { DEFINE_ROUTERS_ADMIN } from '../../../constants/routers-mapper';
import cookiesStore from '../../../plugins/cookiesStore';

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menuItems = [
    {
      path: DEFINE_ROUTERS_ADMIN.home,
      label: 'Quản lý sân',
      icon: <PieChartOutlined />,
    },
    {
      path: DEFINE_ROUTERS_ADMIN.accountBalance,
      label: 'Số dư tài khoản chiết khấu',
      icon: <PieChartOutlined />,
    },
  ];

  const handleLogOut = () => {
    dispatch(
      setUser({
        id: '',
        fullName: null,
        gender: null,
        phoneNumber: null,
        accountBalance: 0,
        email: '',
        role: 'ADMIN',
        createdAt: '',
        updatedAt: '',
        avatar: null
      }),
    );
    cookiesStore.remove('access_token');
    navigate(DEFINE_ROUTERS_ADMIN.loginAdmin);
  };

  return (
    <div className="flex flex-col w-80 h-screen bg-black text-white">
      <div className="flex items-center justify-center h-16">
        <h1 className="text-2xl font-bold">Admin</h1>
      </div>
      <div className="flex flex-col mt-4 px-3">
        {menuItems.map((item) => {
          const isActive = item.path === location.pathname;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center py-3 px-4 rounded-lg transition-colors duration-300 ${
                isActive ? 'bg-white text-black' : 'text-white'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
        <div
          className="flex items-center py-3 px-4 rounded-lg text-white cursor-pointer transition-colors duration-300"
          onClick={handleLogOut}
        >
          <span className="mr-2">{<LoginOutlined />}</span>
          Đăng xuất
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
