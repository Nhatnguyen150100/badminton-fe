import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { IGeneral } from '../../types/general.types';

export interface CounterState {
  modalActive: IGeneral
}

const initialState: CounterState = {
  modalActive: null
};

export const generalSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    setModalActive: (state, action: PayloadAction<IGeneral>) => {
      state.modalActive = action.payload;
    },
  },
});

export const { setModalActive } = generalSlice.actions;

const generalReducer = generalSlice.reducer;

export default generalReducer;
