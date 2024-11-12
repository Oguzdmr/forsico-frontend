import React, { useState } from "react";
import "../../styles/docsCSS/seoArticleBrief.css";
import PenIcon from "../../assets/board-pen-icon.svg";
import TEditor from "../../components/Editor/TEditor";
const appConfig = require("../../config");

const SeoArticleBrief = ({ closePopUp }) => {
  const [contentGoal, setContentGoal] = useState("");
  const [primaryKeyword, setPrimaryKeyword] = useState("");
  const [secondaryKeywords, setSecondaryKeywords] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
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

  const handleGenerateSeoBrief = async () => {
    if (
      !contentGoal ||
      !primaryKeyword ||
      !secondaryKeywords ||
      !targetAudience
    ) {
      console.log("All fields are required.");
      return;
    }

    const prompt = `Write an SEO article brief to ${contentGoal}. The primary keyword you should use is ${primaryKeyword}, and some secondary keywords are ${secondaryKeywords}. The target audience of this article is ${targetAudience}. Please format the response as HTML, using headings, bullet points, and paragraphs as appropriate.`;

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
      console.error("AI generation error:", error);
    }
  };

  return (
    <div className="seoarticlebrief-main-container">
      <div className="seoarticlebrief-main">
        <div className="seoarticlebrief-title-area">
          <div>
            <img src={PenIcon} alt="pen" />
          </div>
          <div className="seoarticlebrief-title">
            <span className="seoarticlebrief-title-text">
              SEO Article Brief
            </span>
          </div>
        </div>
      </div>
      <div className="seoarticlebrief-target-area">
        <span className="seoarticlebrief-desc">Content goal</span>
        <textarea
          className="seoarticlebrief-textarea"
          cols="30"
          rows="3"
          placeholder="e.g., Improve brand awareness"
          value={contentGoal}
          onChange={(e) => setContentGoal(e.target.value)}
        ></textarea>
      </div>
      <div className="seoarticlebrief-topic-area">
        <span className="seoarticlebrief-desc">Primary keyword</span>
        <textarea
          className="seoarticlebrief-textarea"
          cols="30"
          rows="3"
          placeholder="e.g., Project management software"
          value={primaryKeyword}
          onChange={(e) => setPrimaryKeyword(e.target.value)}
        ></textarea>
      </div>
      <div className="seoarticlebrief-target-area">
        <span className="seoarticlebrief-desc">Secondary keywords</span>
        <textarea
          className="seoarticlebrief-textarea"
          cols="30"
          rows="3"
          placeholder="e.g., team collaboration tools, productivity apps"
          value={secondaryKeywords}
          onChange={(e) => setSecondaryKeywords(e.target.value)}
        ></textarea>
      </div>
      <div className="seoarticlebrief-target-area">
        <span className="seoarticlebrief-desc">Target audience</span>
        <textarea
          className="seoarticlebrief-textarea"
          cols="30"
          rows="3"
          placeholder="e.g., Marketing managers and team leads"
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
        ></textarea>
      </div>
      <div className="seoarticlebrief-generate-button-area">
        <button
          className="seoarticlebrief-generate-button"
          onClick={handleGenerateSeoBrief}
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
            saveCallback={() => {
              saveToLocalStorage(contentGoal, content);
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

export default SeoArticleBrief;
