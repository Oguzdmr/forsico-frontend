const config = require("../../config");

class Support {
  async createContactTicket(content, fullname, email) {
    return this.createTicket({
      title: "Contact Us",
      content: content,
      language: "en",
      departmentId: 1,
      name: fullname,
      email: email,
    });
  }

  async createTicket(ticketInformation) {
    const myHeaders = new Headers();

    const formData = new FormData();
    formData.append("title", ticketInformation.title || "");
    formData.append("content", `<p>${ticketInformation.content}</p>`);
    formData.append("departmentId", ticketInformation.departmentId || 1);
    formData.append("language", ticketInformation.language || "en");
    formData.append("name", ticketInformation.name || "");
    formData.append("email", ticketInformation.email || "");
    formData.append("images", ticketInformation.images || 0);
    formData.append("apiKey", config.supportApiKey || "");
    formData.append("file", null);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${config.supportApiUrl}/api/ticket/create`,
        requestOptions
      );
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error creating ticket:", error);
      throw error;
    }
  }
}

export default Support;