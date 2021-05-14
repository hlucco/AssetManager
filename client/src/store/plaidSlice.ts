import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const createLinkToken = createAsyncThunk('/api/plaid', async () => {
    const response = await axios.post('/api/plaid/create_link_token')
    return response.data
})

export const setAccessLink = createAsyncThunk('/api/plaid', async (token: any) => {
    const body = {
        public_token: token
    }
    const response = await axios.post('/api/plaid/set_access_token', body)
    return response.data;
});

export interface PlaidState {
  plaidInfo: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: any;
}

const initialState = {
  plaidInfo: "",
  status: 'idle',
  error: null
} as PlaidState

export const plaidSlice = createSlice({
  name: 'class',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createLinkToken.pending, (state, action) => {
      state.status = 'loading'
    })
    builder.addCase(createLinkToken.fulfilled || setAccessLink.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.plaidInfo = action.payload;
    })
    builder.addCase(createLinkToken.rejected, (state, action) => {
      state.status = 'failed'
      state.error = action.error.message;
    })
  }
})

export default plaidSlice.reducer