const config = require("../../config");

class Workspace {
  async getWorkspace(token, workspaceId = null) {
    const myHeaders = new Headers();
    if (workspaceId) {
      myHeaders.append("x-workspace-id", workspaceId);
    }
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${config.boardApiBaseUrl}/workspace`,
        requestOptions
      );
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching workspace:", error);
      throw error;
    }
  }

  async getAllWorkspaces(token) {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${config.boardApiBaseUrl}/workspace`,
        requestOptions
      );
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  async deleteWorkspace(token, workspaceId) {
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
        `${config.boardApiBaseUrl}/workspace`,
        requestOptions
      );
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error deleting workspace:", error);
      throw error;
    }
  }

  async createWorkspace(token, name, description) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify({
      name: name,
      description: description,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${config.boardApiBaseUrl}/workspace`,
        requestOptions
      );
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error creating workspace:", error);
      throw error;
    }
  }

  async updateWorkspace(token, workspaceId, name) {
    const myHeaders = new Headers();
    myHeaders.append("x-workspace-id", workspaceId);
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify({
      name: name,
    });

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${config.boardApiBaseUrl}/workspace`,
        requestOptions
      );
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error updating workspace:", error);
      throw error;
    }
  }

  async getWorkspacesOfUser(token) {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${config.boardApiBaseUrl}/workspace/getworkspacesofuser`,
        requestOptions
      );
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching user workspaces:", error);
      throw error;
    }
  }
}

export default Workspace;
