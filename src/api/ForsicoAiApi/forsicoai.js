const config = require("../../config")

class Forsicoai {
  generateAIContentOpenAi = async (userContent, lang = "English") => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        user_content: userContent,
        lang: lang
      });

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      const response = await fetch(
        "https://ai-communication-service-emedfjbzhedkgfgm.eastus-01.azurewebsites.net/api/ai/openai-generate",
        requestOptions
      );

      const result = await response.json();

      if (response.ok && result.result) {
        return {
          success: true,
          data: result.result
        };
      } else {
        return {
          success: false,
          errors: result.errors || [{
            errorMessage: "Unexpected response format."
          }]
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

  generateAzureAIContent = async (userContent, lang = "English") => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        user_content: userContent,
        lang: lang
      });

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      const response = await fetch(
        "https://ai-communication-service-emedfjbzhedkgfgm.eastus-01.azurewebsites.net/api/ai/azure-generate",
        requestOptions
      );

      const result = await response.json();

      if (response.ok && result) {
        return {
          success: true,
          data: result
        };
      } else {
        return {
          success: false,
          errors: result.errors || [{
            errorMessage: "Unexpected response format or failed request."
          }]
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

}
export default Forsicoai;