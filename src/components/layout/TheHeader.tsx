import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../lib/store';
import { Avatar, Button, Divider, Popover } from 'antd';
import {
  InfoCircleOutlined,
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { setUser } from '../../lib/reducer/userSlice';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DEFINE_ROUTERS_USER } from '../../constants/routers-mapper';
import Visibility from '../base/visibility';
import ModalLogin from '../../modules/auth/login/ModalLogin';
import ModalRegister from '../../modules/auth/register/ModalRegister';
import { setModalActive } from '../../lib/reducer/generalSlice';
import DEFINE_MODAL_NAME from '../../constants/modal-name';
import { IGeneral } from '../../types/general.types';

export default function TheHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: IRootState) => state.user);

  const isLoggedIn = useMemo(() => user.id, [user]);

  const location = useLocation();

  const handleLogout = () => {
    dispatch(
      setUser({
        id: '',
        fullName: null,
        gender: null,
        avatar: null,
        phoneNumber: null,
        email: '',
        role: 'USER',
        createdAt: '',
        updatedAt: '',
      }),
    );
    navigate(DEFINE_ROUTERS_USER.home);
    dispatch(setModalActive(DEFINE_MODAL_NAME.LOGIN_MODAL as IGeneral));
  };

  const handleNavigateBadmintonCourt = () => {
    navigate(DEFINE_ROUTERS_USER.badmintonCourtManager);
  };

  const handleNavigateBadmintonGather = () => {
    navigate(DEFINE_ROUTERS_USER.badmintonGatherManager);
  };

  const handleNavigateUserBooking = () => {
    navigate(DEFINE_ROUTERS_USER.userBooking);
  };

  const handleNavigateGatherBooking = () => {
    navigate(DEFINE_ROUTERS_USER.gatherBooking);
  };

  const contentPopover = useMemo((): React.ReactNode => {
    return (
      <>
        <div className="flex flex-col justify-start items-center min-w-[160px]">
          <Button
            variant="text"
            color="default"
            className="text-md text-gray-800 w-full flex justify-start font-medium border-none"
            onClick={() => {
              navigate(DEFINE_ROUTERS_USER.profile);
            }}
          >
            <ProfileOutlined /> Thông tin người dùng
          </Button>
          <Divider variant="solid" className="my-2" />
          <Button
            variant="text"
            color="default"
            className="text-md text-gray-800 w-full flex justify-start font-medium border-none"
            onClick={handleNavigateBadmintonCourt}
          >
            <InfoCircleOutlined /> Đăng tin thuê sân
          </Button>
          <Divider variant="solid" className="my-2" />
          <Button
            variant="text"
            color="default"
            className="text-md text-gray-800 w-full flex justify-start font-medium border-none"
            onClick={handleNavigateBadmintonGather}
          >
            <InfoCircleOutlined /> Đăng tin giao lưu
          </Button>
          <Divider variant="solid" className="my-2" />
          <Button
            variant="text"
            color="default"
            className="text-md text-gray-800 w-full flex justify-start font-medium border-none"
            onClick={handleNavigateUserBooking}
          >
            <InfoCircleOutlined /> Sân đã thuê
          </Button>
          <Divider variant="solid" className="my-2" />
          <Button
            variant="text"
            color="default"
            className="text-md text-gray-800 w-full flex justify-start font-medium border-none"
            onClick={handleNavigateGatherBooking}
          >
            <InfoCircleOutlined /> Lịch giao lưu đã đăng kí
          </Button>
          <Divider variant="solid" className="my-2" />
          <Button
            variant="text"
            color="default"
            className="text-md text-gray-800 w-full flex justify-start font-medium border-none"
            onClick={handleLogout}
          >
            <LogoutOutlined />
            Đăng xuất
          </Button>
        </div>
      </>
    );
  }, []);

  return (
    <header>
      <ModalLogin />
      <ModalRegister />
      <nav className="border-gray-200 px-4 lg:px-6 py-4 bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <a href={DEFINE_ROUTERS_USER.home} className="flex items-center">
            <img src="/logo.png" className="mr-3 h-6 sm:h-9" alt="Logo" />
            <span className="self-center text-xl font-semibold whitespace-nowrap text-white">
              Web cầu lông
            </span>
          </a>
          <div className="flex items-center lg:order-2">
            <Visibility
              visibility={Boolean(isLoggedIn)}
              suspenseComponent={
                <div className="!text-white flex flex-row justify-start items-center">
                  <UserOutlined />
                  <Button
                    variant="text"
                    color="default"
                    onClick={() => {
                      dispatch(
                        setModalActive(
                          DEFINE_MODAL_NAME.LOGIN_MODAL as IGeneral,
                        ),
                      );
                    }}
                    className="hover:cursor-pointer !text-white font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5"
                  >
                    Đăng nhập
                  </Button>
                  <Button
                    variant="text"
                    color="default"
                    onClick={() => {
                      dispatch(
                        setModalActive(
                          DEFINE_MODAL_NAME.REGISTER_MODAL as IGeneral,
                        ),
                      );
                    }}
                    className="hover:cursor-pointer !text-white font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5"
                  >
                    Đăng kí
                  </Button>
                </div>
              }
            >
              <Popover content={contentPopover} trigger="click">
                <a className="hover:cursor-pointer text-white focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-1 mr-2 hover:bg-gray-700 focus:outline-none">
                  <Avatar
                    size={50}
                    crossOrigin="anonymous"
                    className="me-3"
                    src={user.avatar}
                    style={{
                      backgroundColor: `${user.avatar ? 'none' : '#00aaff'}`,
                    }}
                    icon={<UserOutlined />}
                  />
                  {user.fullName ?? user.email}
                </a>
              </Popover>
            </Visibility>
            <button
              data-collapse-toggle="mobile-menu-2"
              type="button"
              className="inline-flex items-center p-2 ml-1 text-sm rounded-lg lg:hidden focus:outline-none focus:ring-2 text-gray-400 hover:bg-gray-700 focus:ring-gray-600"
              aria-controls="mobile-menu-2"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <svg
                className="hidden w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                >
                  {' '}
                </path>
              </svg>
            </button>
          </div>
          <div
            className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <Link
                  to={DEFINE_ROUTERS_USER.home}
                  className={`block py-2 px-4 mx-8 text-base font-medium text-gray-500 border-b border-gray-100 hover:bg-gray-50 ${
                    DEFINE_ROUTERS_USER.home === location.pathname
                      ? '!text-white font-bold'
                      : ''
                  }lg:border-0 lg:hover:text-primary-700 lg:p-0 text-gray-400 lg:hover:text-white hover:bg-gray-700 hover:text-white lg:hover:bg-transparent border-gray-700`}
                >
                  Tìm sân đấu
                </Link>
              </li>
              <li>
                <Link
                  to={DEFINE_ROUTERS_USER.listGatherPost}
                  className={`block py-2 px-4 mx-8 text-base font-medium text-gray-500 border-b border-gray-100 hover:bg-gray-50 ${
                    DEFINE_ROUTERS_USER.listGatherPost === location.pathname
                      ? '!text-white font-bold'
                      : ''
                  }lg:border-0 lg:hover:text-primary-700 lg:p-0 text-gray-400 lg:hover:text-white hover:bg-gray-700 hover:text-white lg:hover:bg-transparent border-gray-700`}
                >
                  Tìm giao lưu
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
