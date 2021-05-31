import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { clearSession, getToken } from "../utils";

export const login = createAsyncThunk("/api/user/login", async (body: any) => {
  const response = await axios.post("/api/user/login", body);
  return response.data;
});

export const register = createAsyncThunk("/api/user", async (body: any) => {
  const response = await axios.post("/api/user/register", body);
  return response.data;
});

export const logout = createAsyncThunk("/api/user/logout", async () => {
  clearSession();
  return;
});

export const loggedIn = createAsyncThunk("/api/user/loggedIn", async () => {
  const token = getToken();
  return token;
});

export const getUserInfo = createAsyncThunk(
  "/api/user/getUserInfo",
  async () => {
    const response = await axios.get("/api/user");
    return response.data;
  }
);

export const updateUserSync = createAsyncThunk(
  "/api/user/getUserInfo",
  async () => {
    const response = await axios.put("/api/user/sync");
    return response.data;
  }
);

export interface UserState {
  userInfo: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: any;
  loggedIn: boolean;
}

const initialState = {
  userInfo: "",
  status: "idle",
  error: null,
  loggedIn: false,
} as UserState;

export const userSlice = createSlice({
  name: "class",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.pending || getUserInfo.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(
      getUserInfo.fulfilled || updateUserSync.fulfilled,
      (state, action) => {
        state.status = "succeeded";
        state.userInfo = action.payload;
        state.loggedIn = true;
      }
    );
    builder.addCase(login.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.userInfo = action.payload;
      state.loggedIn = true;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.loggedIn = false;
    });
    builder.addCase(loggedIn.fulfilled, (state, action) => {
      state.status = "succeeded";
      if (action.payload === null || action.payload === undefined) {
        state.loggedIn = false;
      } else {
        state.loggedIn = true;
      }
    });
    builder.addCase(login.rejected || getUserInfo.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
  },
});

export default userSlice.reducer;
