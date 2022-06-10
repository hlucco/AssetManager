import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const requestLink = createAsyncThunk(
  "/api/coinbase",
  async (body: any) => {
    const response = await axios.post("/api/coinbase/request", body);
    return response.data;
  }
);

export const exchangeToken = createAsyncThunk(
  "/api/coinbase",
  async (body: any) => {
    const response = await axios.post("/api/coinbase/exchange", body);
    return response.data;
  }
);

export interface CoinbaseState {
  coinbaseInfo: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: any;
}

const initialState = {
  coinbaseInfo: "",
  status: "idle",
  error: null,
} as CoinbaseState;

export const coinbaseSlice = createSlice({
  name: "class",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(requestLink.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(requestLink.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.coinbaseInfo = action.payload;
    });
    builder.addCase(requestLink.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
  },
});

export default coinbaseSlice.reducer;
