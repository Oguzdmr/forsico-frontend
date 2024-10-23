import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import NotificationService from "../api/BoardApi/notification";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async ({ workspaceIds, boardIds }, { getState, rejectWithValue }) => {
    const token = getState().auth?.token?.token;
    const notificationService = new NotificationService();
    try {
      const response = await notificationService.getNotifications(
        token,
        workspaceIds,
        boardIds
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const readNotification = createAsyncThunk(
  "notifications/readNotification",
  async ({ workspaceId, notificationId }, { getState, rejectWithValue }) => {
    const token = getState().auth?.token?.token;
    const notificationService = new NotificationService();
    try {
      const response = await notificationService.readNotification(
        token,
        workspaceId,
        notificationId
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const bulkReadNotifications = createAsyncThunk(
  "notifications/bulkReadNotifications",
  async ({ workspaceId, notificationIds }, { getState, rejectWithValue }) => {
    console.log(notificationIds);
    const token = getState().auth?.token?.token;
    const notificationService = new NotificationService();
    try {
      const response = await notificationService.bulkReadNotifications(
        token,
        workspaceId,
        notificationIds
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return rejectWithValue(error.message);
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    entities: [],
    status: "idle",
    error: null,
  },
  reducers: {
    addNotification: (state, action) => {
      console.log("NEW NOTIFICATION::", action.payload);
      state.entities.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.entities = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(readNotification.fulfilled, (state, action) => {
        const updatedEntities = state.entities.map((entity) =>
          entity._id === action.payload._id
            ? { ...entity, readBy: action.payload.readBy }
            : entity
        );
        state.entities = updatedEntities;
      })
      .addCase(bulkReadNotifications.fulfilled, (state, action) => {
        const updatedEntities = state.entities.map((entity) => {
          const matchedEntity = action.payload.find(
            (payloadEntity) => payloadEntity._id === entity._id
          );
      
          return matchedEntity ? { ...entity, readBy: matchedEntity.readBy } : entity;
        });
        
        state.entities = updatedEntities;
      });
  },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
