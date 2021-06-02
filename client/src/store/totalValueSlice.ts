import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import BalanceHistory from "../models/balanceHistory";

export const getHistory = createAsyncThunk("/api/totalValue/get", async () => {
  const response = await axios.get("/api/total");
  return response.data;
});

export interface TotalValueState {
  totalValueInfo: BalanceHistory[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: any;
}

const initialState = {
  totalValueInfo: [],
  status: "idle",
  error: null,
} as TotalValueState;

export const totalValueSlice = createSlice({
  name: "class",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getHistory.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(getHistory.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.totalValueInfo = action.payload;
    });
    builder.addCase(getHistory.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
  },
});

export default totalValueSlice.reducer;
