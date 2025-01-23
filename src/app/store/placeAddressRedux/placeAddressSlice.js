import { createSlice } from '@reduxjs/toolkit';

const initialSelectedAddress = {
  holdAddressData:[],
};

const holdSelectedAddressSlice = createSlice({
  name: 'holdSelectedAddress',
  initialState: initialSelectedAddress,
  reducers: { 
    holdAddressDetails: (state, action) => {
      state.holdAddressData = action.payload
    },
  },
});

export const { holdAddressDetails } =holdSelectedAddressSlice.actions;
export default holdSelectedAddressSlice.reducer;
