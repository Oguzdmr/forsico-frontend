import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import NotificationService from "../api/BoardApi/notification";
import { fetchBoard } from "./boardSlice";
import { debounce } from "lodash";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (
    { workspaceIds, boardIds, page = 1 },
    { getState, rejectWithValue }
  ) => {
    const token = getState().auth?.token?.token;
    const notificationService = new NotificationService();
    try {
      const response = await notificationService.getNotifications(
        token,
        workspaceIds,
        boardIds,
        page
      );
      return {
        data: response.data,
        page: page,
      };
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

const debouncedFetchBoard = debounce((dispatch, workspaceId, boardId) => {
  dispatch(
    fetchBoard({
      workspaceId,
      boardId,
    })
  );
}, 500);

export const handleNotification = (notification) => async (dispatch, getState) => {
  dispatch(addNotification(notification));
  const userId = getState().auth?.user?.id;

  if(notification.user?.id === userId) return;

  switch (notification.action) {
    case "newTask":
    case "statusChange":
    case "updateTask":
      if (
        window.location.pathname.indexOf(
        `/workspaces/board/${notification.workspaceId}/${notification.boardId}`) === 0
      ) {
        console.log("called debounced fetch board");
        debouncedFetchBoard(
          dispatch,
          notification.workspaceId,
          notification.boardId
        );
      }
      break;
    case "newComment":
    case "updateComment":
      if(window.location.search.split('selectedTask=').slice(-1)[0].split('&')[0] === notification.taskId){
        //TODO fetchTask
      }
      break;
    default:
      break;
  }
};

const uniqueById = (array) => {
  const seen = new Set();
  return array.filter((item) => {
    const isDuplicate = seen.has(item._id);
    seen.add(item._id);
    return !isDuplicate;
  });
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    entities: [],
    pagedEntities: [],
    status: "idle",
    error: null,
  },
  reducers: {
    addNotification: (state, action) => {
      state.pagedEntities.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.entities = action.payload?.data?.notifications || [];
        state.page = action.payload.page || 1;

        state.pagedEntities.push(...(action.payload.data?.notifications || []));

        state.pagedEntities = uniqueById(state.pagedEntities || []);
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(readNotification.fulfilled, (state, action) => {
        const updatedEntities = state.pagedEntities.map((entity) =>
          entity._id === action.payload._id
            ? { ...entity, readBy: action.payload.readBy }
            : entity
        );
        state.pagedEntities = updatedEntities;
      })
      .addCase(bulkReadNotifications.fulfilled, (state, action) => {
        const updatedEntities = state.pagedEntities.map((entity) => {
          const matchedEntity = action.payload.find(
            (payloadEntity) => payloadEntity._id === entity._id
          );

          return matchedEntity
            ? { ...entity, readBy: matchedEntity.readBy }
            : entity;
        });

        state.pagedEntities = updatedEntities;
      });
  },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
