import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import TaskApi from "../api/BoardApi/task";

export const fetchTask = createAsyncThunk(
  "task/fetchTask",
  async ({ token, workspaceId, taskId }, { rejectWithValue }) => {
    const taskApi = new TaskApi();

    try {
      const response = await taskApi.getTask(token, workspaceId, taskId);
      return response.data;
    } catch (error) {
      console.error("Error fetching task:", error);
      return rejectWithValue(error.message);
    }
  }
);

const taskSlice = createSlice({
  name: "task",
  initialState: {
    entities: { selectedtask: {} },
    status: "idle",
    error: null,
  },
  reducers: {
    updateTaskStatus: (state, action) => {
      state.status = action.payload.status;
    },
    addSubtask: (state, action) => {
      const { taskId, subtask } = action.payload;
      state.entities[taskId]?.subtasks.push(subtask);
    },
    updateTaskDetails: (state, action) => {
      const { taskId, details } = action.payload;
      if (state.entities[taskId]) {
        state.entities[taskId] = { ...state.entities[taskId], ...details };
      }
    },
    deleteSubtask: (state, action) => {
      const { taskId, subtaskId } = action.payload;
      const task = state.entities[taskId];
      if (task) {
        task.subtasks = task.subtasks.filter(
          (subtask) => subtask._id !== subtaskId
        );
      }
    },
    reset: (state, action) => {
      state = { entities: { selectedtask: {} }, status: "idle", error: null };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.entities.selectedtask = action.payload;
      })
      .addCase(fetchTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  updateTaskStatus,
  addSubtask,
  updateTaskDetails,
  deleteSubtask,
  reset
} = taskSlice.actions;
export default taskSlice.reducer;
