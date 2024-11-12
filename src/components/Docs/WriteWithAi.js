import React, { useState } from "react";
import AiIcon from "../../assets/ai-icon.svg";
import "../../styles/docsCSS/writeWithAi.css";
import TEditor from "../Editor/TEditor";
const appConfig = require("../../config");

const WriteWithAi = ({closePopUp}) => {
  const [textareaValue, setTextareaValue] = useState("");
  const [content, setContent] = useState("");
  const saveToLocalStorage = (title, content) => {
    const savedDocs = JSON.parse(localStorage.getItem("savedDocs")) || [];
    const newDoc = {
      id: Date.now(),
      title,
      content,
      lastUpdate: new Date().toLocaleString(),
    };
    localStorage.setItem("savedDocs", JSON.stringify([...savedDocs, newDoc]));
  };

  const handleAIEnhance = async () => {
    try {
      const selectedText = textareaValue;
      if (!selectedText) {
        console.log("No text in textarea");
        return;
      }

      const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${appConfig.openAiToken}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo-instruct",
          prompt: `Write about: ${selectedText}. Please format the response as HTML, with headings, bullet points, and paragraphs as appropriate.`,
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const aiResult = (data.choices || [])[0]?.text?.trim();

      if (aiResult) {
        setContent(aiResult);
      }
    } catch (error) {
      console.error("AI processing error:", error);
    }
  };

  return (
    <div className="writewithai-main-container">
      <div className="writewithai-main">
        <div className="writewithai-title-area">
          <div className="ai-icon">
            <img src={AiIcon} alt="ai-icon" />
          </div>
          <div className="writewithai-title">
            <span className="writewithai-title-text">Write With AI</span>
          </div>
        </div>
      </div>
      <div className="writewithai-desc-area">
        <span className="writewithai-desc">
          What would you like AI to write about?
        </span>
      </div>
      <div className="writewithai-text-area">
        <textarea
          className="writewithai-textarea"
          cols="30"
          rows="15"
          value={textareaValue}
          onChange={(e) => setTextareaValue(e.target.value)}
        ></textarea>
      </div>
      <div className="writewithai-generate-button-area">
        <button
          className="writewithai-generate-button"
          onClick={handleAIEnhance}
        >
          Generate
        </button>
      </div>
      <div>
        {content ? (
          <>
            <TEditor
              minHeight="20vh"
              Outsidevalue={content}
              setEditingMode={() => {}}
              saveCallback={(content) => {
                saveToLocalStorage(selectedText, content);
                closePopUp();
              }}
              cancelCallback={() => {}}
              setValue={setContent}
            />
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default WriteWithAi;
