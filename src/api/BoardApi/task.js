const config = require("../../config");

class Task {
  async getTask(token, workspaceId, taskId) {
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
        `${config.boardApiBaseUrl}/task/${taskId}`,
        requestOptions
      );
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching list:", error);
      throw error;
    }
  }

  async getUserTasks(token, workspaceId) {
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
        `${config.boardApiBaseUrl}/task/getUserTasks`,
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
      const response = await fetch(
        `${config.boardApiBaseUrl}/task`,
        requestOptions
      );
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

  async getTaskStatus(token, workspaceId, boardId) {
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
        `${config.boardApiBaseUrl}/taskstatus/board/${boardId}`,
        requestOptions
      );
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching task status:", error);
      throw error;
    }
  }

  async getTaskComments(token, workspaceId, taskId) {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("x-workspace-id", workspaceId);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${config.boardApiBaseUrl}/comment/task/${taskId}/comments`,
        requestOptions
      );
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching task comments:", error);
      throw error;
    }
  }

  async postTaskComment(token, workspaceId, taskId, content, fileUrls = []) {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("x-workspace-id", workspaceId);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      content: content,
      fileUrls: fileUrls,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${config.boardApiBaseUrl}/comment/task/${taskId}/comment`,
        requestOptions
      );
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error posting task comment:", error);
      throw error;
    }
  }

  async changeAssignee(token, workspaceId, taskId, newAssigneeId) {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("x-workspace-id", workspaceId);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      newAssigneeId: newAssigneeId,
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${config.boardApiBaseUrl}/task/changeAssignee/${taskId}`,
        requestOptions
      );
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error changing task assignee:", error);
      throw error;
    }
  }

  async changeTaskBoard(token, workspaceId, taskId, newData) {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("x-workspace-id", workspaceId);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      newBoardId: newData.boardId,
      newListId: newData.listId,
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${config.boardApiBaseUrl}/task/changeBoard/${taskId}`,
        requestOptions
      );
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error changing task board:", error);
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
