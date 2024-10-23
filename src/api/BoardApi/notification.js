const config = require("../../config");

class Notification {
  async getNotifications(token, workspaceIds = [], boardIds = []) {
    const myHeaders = new Headers();

    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    const raw = {
      workspaceIds: workspaceIds,
      boardIds: boardIds,
    };

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(raw),
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${config.boardApiBaseUrl}/notification`,
        requestOptions
      );
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching workspace:", error);
      throw error;
    }
  }

  async readNotification(token, workspaceId, notificationId) {
    const myHeaders = new Headers();
    myHeaders.append("x-workspace-id", workspaceId);
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      redirect: "follow",
    };

    const response = await fetch(
      `${config.boardApiBaseUrl}/notification/${notificationId}/read`,
      requestOptions
    );
    const result = await response.json();
    return result;
  }

  async bulkReadNotifications(token, workspaceId, notificationIds) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-workspace-id", workspaceId);
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = {
      notificationIds: notificationIds,
    };

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: JSON.stringify(raw),
      redirect: "follow",
    };

    const response = await fetch(`${config.boardApiBaseUrl}/notification/bulkRead`, requestOptions)
    const result = await response.json();
    return result;
  }
}

export default Notification;