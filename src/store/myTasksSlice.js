import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import TaskService from "../api/BoardApi/task";

export const fetchMyTasks = createAsyncThunk(
  "myTasks/fetchMyTasks",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth?.token?.token;
    const taskService = new TaskService();

    try {
      const response = await taskService.getUserTasks(token, _.workspaceId);
      const colors = ["#1C3C84", "#36C5F0", "#ED1E5A", "#A1F679"];

      const manipulatedResponse = response.data.map((workspace, index) => {
        workspace.color = colors[index % 4];
        return workspace;
      });

      return manipulatedResponse;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

const myTasksSlice = createSlice({
  name: "myTasks",
  initialState: {
    entities: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMyTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.entities = action.payload;
      })
      .addCase(fetchMyTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default myTasksSlice.reducer;
