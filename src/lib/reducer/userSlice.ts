import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../../types/user.types';

const initialState: IUser = {
  id: '',
  fullName: null,
  gender: null,
  phoneNumber: null,
  accountBalance: 0,
  email: '',
  role: 'USER',
  createdAt: '',
  updatedAt: '',
  avatar: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state = { ...action.payload };
      return state;
    },
  },
});

export const { setUser } = userSlice.actions;

const userReducer = userSlice.reducer;

export default userReducer;
