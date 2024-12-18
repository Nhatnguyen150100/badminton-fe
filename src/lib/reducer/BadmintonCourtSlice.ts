import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { IBadmintonCourt } from '../../types/badmintonCourt.types';

export interface BadmintonCourtState {
  badmintonCourtDetail: IBadmintonCourt;
}

const initialState: BadmintonCourtState = {
  badmintonCourtDetail: {} as IBadmintonCourt,
};

export const BadmintonCourtSlice = createSlice({
  name: 'badmintonCourt',
  initialState,
  reducers: {
    setBadmintonCourtDetail: (
      state,
      action: PayloadAction<IBadmintonCourt>,
    ) => {
      state.badmintonCourtDetail = action.payload;
    },
  },
});

export const { setBadmintonCourtDetail } = BadmintonCourtSlice.actions;

const badmintonCourtReducer = BadmintonCourtSlice.reducer;

export default badmintonCourtReducer;
