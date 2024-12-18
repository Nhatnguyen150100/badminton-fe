import { Input } from 'antd';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { authService } from '../../../services';
import cookiesStore from '../../../plugins/cookiesStore';
import { setUser } from '../../../lib/reducer/userSlice';
import DEFINE_MODAL_NAME from '../../../constants/modal-name';
import { setModalActive } from '../../../lib/reducer/generalSlice';
import { IGeneral } from '../../../types/general.types';
import BaseModal from '../../../components/base/BaseModal';
import GeneralLoading from '../../../components/base/GeneralLoading';

export default function ModalLogin() {
  const dispatch = useDispatch();
  const [form, setForm] = React.useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = React.useState(false);

  const onHandleSubmit = async () => {
    if (!(form.email && form.password)) {
      toast.error('Please enter email and password');
      return;
    }
    try {
      setLoading(true);
      const rs = await authService.login({
        email: form.email,
        password: form.password,
      });
      cookiesStore.set('access_token', rs.data.accessToken);
      dispatch(setUser(rs.data));
      toast.success(rs.message);
      dispatch(setModalActive(null));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({
      email: '',
      password: '',
    });
  };

  const handleRegister = () => {
    dispatch(setModalActive(DEFINE_MODAL_NAME.REGISTER_MODAL));
  };

  return (
    <>
      <BaseModal
        className="!p-0 auth-modal"
        nameModal={DEFINE_MODAL_NAME.LOGIN_MODAL}
        handleClose={handleClose}
        footer={null}
      >
        <div className="text-center space-y-3 mb-4">
          <img className="mx-auto w-40" src="/logo.png" alt="logo" />
          <h4 className="mb-5 mt-1 pb-1 text-xl font-semibold">Web cầu lông</h4>
        </div>

        <form>
          <p className="mb-4">Đăng nhập tài khoản</p>
          <Input
            type="text"
            placeholder="Email"
            className="mb-4"
            value={form.email}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onHandleSubmit();
              }
            }}
            onChange={(e) => {
              setForm((pre) => ({
                ...pre,
                email: e.target.value,
              }));
            }}
          ></Input>
          <Input.Password
            type="password"
            placeholder="Password"
            className="mb-4"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onHandleSubmit();
              }
            }}
            value={form.password}
            onChange={(e) => {
              setForm((pre) => ({
                ...pre,
                password: e.target.value,
              }));
            }}
          ></Input.Password>
          <div className="mb-5 pb-1 pt-1 text-center">
            <button
              disabled={loading}
              className="mb-3 bg-blue-700 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-0px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]"
              type="button"
              onClick={() => onHandleSubmit()}
            >
              Đăng nhập
            </button>
            <button
              disabled={loading}
              className="mb-3 bg-white inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal shadow-[0_4px_9px_-0px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]"
              type="button"
              onClick={() => {
                console.log("🚀 ~ ModalLogin ~ onClick:", `${import.meta.env.VITE_BASE_URL}/v1/auth/google`)
                window.open(`${import.meta.env.VITE_BASE_URL}/v1/auth/google`, '_self');
              }}
            >
              <div className="flex flex-row justify-center items-center space-x-5">
                <img className="h-5 w-5" src="/icons/google.png" alt="google" />
                <span className="text-black ">Đăng nhập bằng google</span>
              </div>
            </button>
          </div>
          <div className="flex items-center justify-between pb-6">
            <p className="mb-0 mr-2">Chưa có tài khoản?</p>
            <button
              type="button"
              onClick={handleRegister}
              className="inline-block rounded border-2 border-danger px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-danger transition duration-150 ease-in-out hover:border-danger-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-danger-600 focus:border-danger-600 focus:text-danger-600 focus:outline-none focus:ring-0 active:border-danger-700 active:text-danger-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
            >
              Đăng kí
            </button>
          </div>
        </form>
      </BaseModal>
      <GeneralLoading isLoading={loading} />
    </>
  );
}
