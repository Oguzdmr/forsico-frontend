const config = require("../../config");

class Task {
  async geTask(token, workspaceId, taskId) {
    const myHeaders = new Headers();
    myHeaders.append("x-workspace-id", workspaceId);
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${config.boardApiBaseUrl}/task/${listId}`,
        requestOptions
      );
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching list:", error);
      throw error;
    }
  }

  async deleteTask(token, workspaceId, taskId) {
    const myHeaders = new Headers();
    myHeaders.append("x-workspace-id", workspaceId);
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${config.boardApiBaseUrl}/list/${taskId}`,
        requestOptions
      );
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error deleting list:", error);
      throw error;
    }
  }

  async createTask(token, workspaceId, taskData) {
    const myHeaders = new Headers();
    myHeaders.append("x-workspace-id", workspaceId);
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify(taskData);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(`${config.boardApiBaseUrl}/task`, requestOptions);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error creating list:", error);
      throw error;
    }
  }

  async updateTask(token, workspaceId, taskId, taskData) {
    const myHeaders = new Headers();
    myHeaders.append("x-workspace-id", workspaceId);
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify(taskData);

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${config.boardApiBaseUrl}/task/${taskId}`,
        requestOptions
      );
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error updating list:", error);
      throw error;
    }
  }

  async getTaskOfBoard(token, workspaceId, boardId) {
    const myHeaders = new Headers();
    myHeaders.append("x-workspace-id", workspaceId);
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${config.boardApiBaseUrl}/list/gettasksofboard/${boardId}`,
        requestOptions
      );
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching lists of board:", error);
      throw error;
    }
  }

  async updateTaskStatus(token, workspaceId, taskId, newStatusId) {
    const myHeaders = new Headers();
    myHeaders.append("x-workspace-id", workspaceId);
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      statusId: newStatusId,
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${config.boardApiBaseUrl}/task/updatestatus/${taskId}`,
        requestOptions
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Failed to update task status:", errorResponse);
        throw new Error("Failed to update task status");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error updating task status:", error);
      throw error;
    }
  }

  async searchTasks(token, workspaceIds, query, page = 1, limit = 10) {
    const myHeaders = new Headers();
    myHeaders.append("x-workspace-id", workspaceIds[0]);
    myHeaders.append("Authorization", `Bearer ${token}`);

    const url = new URL(`${config.boardApiBaseUrl}/task/search`);
    url.searchParams.append("query", query);
    url.searchParams.append("page", page);
    url.searchParams.append("limit", limit);
    url.searchParams.append("workspaceIds", JSON.stringify(workspaceIds));

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Failed to search tasks:", errorResponse);
        throw new Error("Failed to search tasks");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error searching tasks:", error);
      throw error;
    }
  }
}

export default Task;
