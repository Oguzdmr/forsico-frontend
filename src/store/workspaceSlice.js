import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Workspace from "../api/BoardApi/workspace";

export const fetchWorkspaces = createAsyncThunk(
  "workspaces/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth?.token?.token;
    const workspace = new Workspace();

    try {
  
      const response = await workspace.getWorkspacesOfUser(token);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

const workspacesSlice = createSlice({
  name: "workspaces",
  initialState: {
    entities: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspaces.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWorkspaces.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.entities = action.payload;
      })
      .addCase(fetchWorkspaces.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default workspacesSlice.reducer;
