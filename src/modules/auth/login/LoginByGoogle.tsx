import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { setUser } from '../../../lib/reducer/userSlice';
import { IRole } from '../../../types/user.types';
import { DEFINE_ROUTERS_USER } from '../../../constants/routers-mapper';
import { setModalActive } from '../../../lib/reducer/generalSlice';
import cookiesStore from '../../../plugins/cookiesStore';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export default function LoginByGoogle() {
  const query = useQuery();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isSuccess = query.get('status');
  const id = query.get('id');
  const fullName = query.get('fullName');
  const gender = query.get('gender');
  const avatar = query.get('avatar');
  const phoneNumber = query.get('phoneNumber');
  const accountBalance = query.get('accountBalance');
  const email = query.get('email');
  const role = query.get('role');
  const createdAt = query.get('createdAt');
  const updatedAt = query.get('updatedAt');
  const accessToken = query.get('accessToken');

  useEffect(() => {
    if (isSuccess === 'success' && id && email && accessToken) {
      dispatch(
        setUser({
          id,
          fullName,
          gender,
          accountBalance: Number(accountBalance) ?? 0,
          avatar,
          phoneNumber: Number(phoneNumber),
          email,
          role: (role as IRole) ?? 'USER',
          createdAt: createdAt ?? '',
          updatedAt: updatedAt ?? '',
        }),
      );
      dispatch(setModalActive(null));
      navigate(DEFINE_ROUTERS_USER.home);
      cookiesStore.set('access_token', accessToken);
    }
  }, [
    isSuccess,
    id,
    fullName,
    gender,
    avatar,
    phoneNumber,
    accountBalance,
    email,
    role,
    createdAt,
    updatedAt,
    accessToken,
  ]);

  return (
    <div>
      {isSuccess === 'success' && id && email ? (
        <div>Login successful!</div>
      ) : (
        <div>Failed to login.</div>
      )}
    </div>
  );
}
