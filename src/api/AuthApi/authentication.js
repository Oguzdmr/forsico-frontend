const config = require("../../config")

class Authentication {
  login = async (email, password) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        email: email,
        password: password
      });

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      const response = await fetch(`${config.baseUrl}/api/Auth/login`, requestOptions);
      const result = await response.json();

      if (result.status === true) {
        return {
          success: true,
          data: result.data
        };
      } else {
        return {
          success: false,
          errors: result.errors
        };
      }
    } catch (error) {
      console.error("Request failed", error);
      return {
        success: false,
        errors: [{
          errorMessage: "An unexpected error occurred.",
          shouldShowErrorMessage: true
        }]
      };
    }
  };

  register = async (username, email, password, firstname, lastname) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      username: username,
      email: email,
      password: password,
      firstName: firstname,
      lastName: lastname
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    try {
      const response = await fetch(`${config.baseUrl}/api/Auth/register`, requestOptions);
      const result = await response.json();

      return result;
    } catch (error) {
      console.error("Register request failed:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }

  forgotPassword = async (email) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      email: email
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    try {
      const response = await fetch(`${config.baseUrl}/api/Auth/forgotpassword`, requestOptions);
      const result = await response.json();

      return result;
    } catch (error) {
      console.error("Forgot Password request failed:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }

  async resetPassword(email, token, newPassword) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      email: email,
      token: token,
      newPassword: newPassword
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    try {
      const response = await fetch(`${config.baseUrl}/api/Auth/resetpassword`, requestOptions);
      const result = await response.json();

      return result;
    } catch (error) {
      console.error("Reset Password request failed:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }

  async confirmEmail(token, email) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      token: token,
      email: email
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    try {
      const response = await fetch(`${config.baseUrl}/api/Auth/confirmemail`, requestOptions);
      const result = await response.json();

      return result;
    } catch (error) {
      console.error("Confirm Email request failed:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }

  async updateProfile(email, username, firstname, lastname, dateofbirth, token) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
    const raw = JSON.stringify({
      email: email,
      username: username,
      firstname: firstname,
      lastname: lastname,
      dateofbirth: dateofbirth
    });

    const requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    try {
      const response = await fetch(`${config.baseUrl}/api/Auth/updateprofile`, requestOptions);
      const result = await response.json();

      return result;
    } catch (error) {
      console.error("Update Profile request failed:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }

  async updatePassword(email, currentPassword, newPassword, token) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify({
      email: email,
      currentPassword: currentPassword,
      newPassword: newPassword
    });

    const requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    try {
      const response = await fetch(`${config.baseUrl}/api/Auth/updatepassword`, requestOptions);
      const result = await response.json();

      return result;
    } catch (error) {
      console.error("Update Password request failed:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }

  async initiateEmailUpdate(currentEmail, newEmail, token) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify({
      currentEmail: currentEmail,
      newEmail: newEmail
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    try {
      const response = await fetch(`${config.baseUrl}/api/Auth/initiateemailupdate`, requestOptions);
      const result = await response.json();

      return result;
    } catch (error) {
      console.error("Email update initiation failed:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }

  async confirmEmailUpdate(token, currentEmail, newEmail) {
    const myHeaders = new Headers();
    myHeaders.append("Accept-Language", "tr");
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      token: token,
      currentEmail: currentEmail,
      newEmail: newEmail
    });

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    try {
      const response = await fetch(`${config.baseUrl}/api/Auth/confirmemailupdate`, requestOptions);
      const result = await response.json();

      return result;
    } catch (error) {
      console.error("Email update confirmation failed:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }

  resendConfirmationMail = async (email) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      email: email
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    try {
      const response = await fetch(`${config.baseUrl}/api/Auth/resendconfirmationmail`, requestOptions);
      const result = await response.json();

      return result;
    } catch (error) {
      console.error("Resend Confirm Email request failed:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
}
export default Authentication;