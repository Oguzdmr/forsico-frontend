import React, { useState } from "react";
import AiIcon from "../../assets/ai-icon.svg";
import "../../styles/docsCSS/blogPost.css";
import TEditor from "../Editor/TEditor";
import PenIcon from "../../assets/board-pen-icon.svg";
const appConfig = require("../../config");

const BlogPost = ({closePopUp}) => {
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

  const handleGenerateBlogPost = async () => {
    if (!topic || !targetAudience) {
      console.log("Topic and Target Audience are required.");
      return;
    }

    const prompt = `Write a blog post about ${topic}. Your target audience is ${targetAudience}. Please format the response as HTML, with headings, bullet points, and paragraphs as appropriate.`;

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
          max_tokens: 4000,
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
    <div className="blogpost-main-container">
      <div className="blogpost-main">
        <div className="blogpost-title-area">
          <div>
            <img src={PenIcon} alt="pen" />
          </div>
          <div className="blogpost-title">
            <span className="blogpost-title-text">Blog Post</span>
          </div>
        </div>
      </div>
      <div className="blogpost-target-area">
        <span className="blogpost-desc">Target audience</span>
        <textarea
          className="blogpost-textarea"
          cols="30"
          rows="3"
          placeholder="e.g. Project managers for remote tech teams"
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
        ></textarea>
      </div>
      <div className="blogpost-topic-area">
        <span className="blogpost-desc">Topic</span>
        <textarea
          className="blogpost-textarea"
          cols="30"
          rows="3"
          placeholder="e.g. 5 ways to improve communication with remote teams"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        ></textarea>
      </div>
      <div className="blogpost-generate-button-area">
        <button
          className="blogpost-generate-button"
          onClick={handleGenerateBlogPost}
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
                saveToLocalStorage(topic, content);
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

export default BlogPost;
