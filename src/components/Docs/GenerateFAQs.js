import React, { useState } from "react";
import "../../styles/docsCSS/generateFAQs.css";
import PenIcon from "../../assets/board-pen-icon.svg";
import TEditor from "../../components/Editor/TEditor";
const appConfig = require("../../config");

const GenerateFAQs = ({ closePopUp }) => {
  const [targetAudience, setTargetAudience] = useState("");
  const [topic, setTopic] = useState("");
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

  const handleGenerateFAQs = async () => {
    if (!topic || !targetAudience) {
      console.log("Both Topic and Target Audience are required.");
      return;
    }

    const prompt = `Generate some frequently asked questions about the topic ${topic}. The target audience of these FAQs is ${targetAudience}. Please format the response as HTML, using headings and bullet points as appropriate.`;

    try {
      const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${appConfig.openAiToken}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo-instruct",
          prompt: prompt,
          max_tokens: 1500,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const aiResult = (data.choices || [])[0]?.text?.trim();

      if (aiResult) {
        setContent(aiResult);
      }
    } catch (error) {
      console.error("AI generation error:", error);
    }
  };

  return (
    <div className="generatefaqs-main-container">
      <div className="generatefaqs-main">
        <div className="generatefaqs-title-area">
          <div>
            <img src={PenIcon} alt="pen" />
          </div>
          <div className="generatefaqs-title">
            <span className="generatefaqs-title-text">Generate FAQs</span>
          </div>
        </div>
      </div>
      <div className="generatefaqs-target-area">
        <span className="generatefaqs-desc">Target audience</span>
        <textarea
          className="generatefaqs-textarea"
          cols="30"
          rows="3"
          placeholder="e.g., Project managers for remote tech teams"
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
        ></textarea>
      </div>
      <div className="generatefaqs-topic-area">
        <span className="generatefaqs-desc">Topic</span>
        <textarea
          className="generatefaqs-textarea"
          cols="30"
          rows="3"
          placeholder="e.g., Effective project management tools"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        ></textarea>
      </div>
      <div className="generatefaqs-generate-button-area">
        <button
          className="generatefaqs-generate-button"
          onClick={handleGenerateFAQs}
        >
          Generate
        </button>
      </div>
      <div>
        {content ? (
          <TEditor
            minHeight="20vh"
            Outsidevalue={content}
            setEditingMode={() => {}}
            saveCallback={(content) => {
              saveToLocalStorage(topic, content);
              closePopUp();
            }}
            cancelCallback={() => {}}
            setValue={setContent}
          />
        ) : null}
      </div>
    </div>
  );
};

export default GenerateFAQs;
