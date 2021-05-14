import { createAction, createAsyncThunk, createReducer, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AssetClass } from "../models/assetClass";
import axios from 'axios'
import { PortfolioAccount } from '../models/portfolioAccount';
import { stat } from 'fs';

export const fetchClasses = createAsyncThunk('/api/assets', async () => {
    const response = await axios.get('/api/assets')
    return response.data
})

export const addClass = createAsyncThunk('/api/assets', async (body: AssetClass) => {
    const response = await axios.post("/api/assets", body);
    return response.data;
})

export const deleteClass = createAsyncThunk('/api/assets', async (assetId: string) => {
  const response = await axios.delete(`/api/assets/${assetId}`);
  return response.data;
})

export const addAccount = createAsyncThunk('/api/assets', async (body: PortfolioAccount) => {
  const response = await axios.post(`/api/account/create`, body);
  return response.data;
})

export const deleteAccount = createAsyncThunk('/api/assets', async (body: any) => {
  const response = await axios.delete(`/api/account/${body.accountId}/${body.assetId}`);
  return response.data;
})

export const updateAccount = createAsyncThunk('/api/assets', async (body: any) => {
  const response = await axios.get(`/api/account/update/${body.accountId}/${body.assetId}`);
  return response.data;
}) 

export interface ClassState {
  assetClasses: AssetClass[];
  loadingAccountId: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: any;
}

const initialState = {
  assetClasses: [],
  loadingAccountId: "",
  status: 'idle',
  error: null
} as ClassState

export const classSlice = createSlice({
  name: 'class',
  initialState,
  reducers: {
    
  },
  extraReducers: builder => {
    builder.addCase(fetchClasses.pending || addClass.pending || deleteClass.pending || addAccount.pending || deleteAccount.pending || updateAccount.pending, (state, action) => {
      state.status = 'loading'
    })
    builder.addCase(fetchClasses.fulfilled  || addClass.fulfilled || deleteClass.fulfilled || addAccount.fulfilled || deleteAccount.fulfilled || updateAccount.fulfilled, (state, action) => {
      console.log(action.payload)
      state.status = 'succeeded'
      state.assetClasses = action.payload;
    })
    builder.addCase(fetchClasses.rejected || addClass.rejected || deleteClass.rejected || addAccount.rejected || updateAccount.rejected || deleteAccount.rejected, (state, action) => {
      state.status = 'failed'
      state.error = action.error.message;
    })
  }
})

export default classSlice.reducer