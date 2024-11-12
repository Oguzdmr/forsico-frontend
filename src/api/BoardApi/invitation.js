const config = require("../../config");

class Invitation {
  async sendInvitation(token, workspaceId, boardId, userId, emails) {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${token}`);
    headers.append("x-workspace-id", workspaceId);
    headers.append("Content-Type", "application/json");

    const payload = {
      inviterId: userId,
      inviteeEmails: emails,
      boardId,
    };

    const requestOptions = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    };

    try {
      const response = await fetch(
        `${config.boardApiBaseUrl}/invitation/invite`,
        requestOptions
      );
      const result = await response.json();

      return result;
    } catch (error) {
      console.error("Error sending invitations:", error);
      throw error;
    }
  }
}

export default Invitation;
