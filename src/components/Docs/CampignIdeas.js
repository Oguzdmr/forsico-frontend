import React, { useState } from "react";
import "../../styles/docsCSS/campaign.css";
import TEditor from "../Editor/TEditor";
import PenIcon from "../../assets/board-pen-icon.svg";
const appConfig = require("../../config");

const CampaignIdeas = ({closePopUp}) => {
  const [targetAudience, setTargetAudience] = useState("");
  const [productService, setProductService] = useState("");
  const [campaignObjectives, setCampaignObjectives] = useState("");
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

  const handleGenerateCampaignIdeas = async () => {
    if (!targetAudience || !productService || !campaignObjectives) {
      console.log("All fields are required.");
      return;
    }

    const prompt = `Create some creative campaign ideas for a product/service called ${productService}. The target audience is ${targetAudience}. The campaign objectives are ${campaignObjectives}. Please format the response as HTML, with headings, bullet points, and paragraphs as appropriate.`;

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
    <div className="campaign-main-container">
      <div className="campaign-main">
        <div className="campaign-title-area">
          <div>
            <img src={PenIcon} alt="pen" />
          </div>
          <div className="campaign-title">
            <span className="campaign-title-text">Campaign Ideas</span>
          </div>
        </div>
      </div>
      <div className="campaign-target-area">
        <span className="campaign-desc">Target audience</span>
        <textarea
          className="campaign-textarea"
          cols="30"
          rows="3"
          placeholder="e.g. Project managers for remote tech teams"
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
        ></textarea>
      </div>
      <div className="campaign-topic-area">
        <span className="campaign-desc">Product/Service</span>
        <textarea
          className="campaign-textarea"
          cols="30"
          rows="3"
          placeholder="e.g. Cloud storage service"
          value={productService}
          onChange={(e) => setProductService(e.target.value)}
        ></textarea>
      </div>
      <div className="campaign-target-area">
        <span className="campaign-desc">Campaign Objectives</span>
        <textarea
          className="campaign-textarea"
          cols="30"
          rows="3"
          placeholder="e.g. Increase brand awareness and customer engagement"
          value={campaignObjectives}
          onChange={(e) => setCampaignObjectives(e.target.value)}
        ></textarea>
      </div>
      <div className="campaign-generate-button-area">
        <button
          className="campaign-generate-button"
          onClick={handleGenerateCampaignIdeas}
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
                saveToLocalStorage(productService, content);
                closePopUp()
              }}
              cancelCallback={() => {}}
              setValue={setContent}
            />
          </>
        ) : null}
      </div>
    </div>
  );
};

export default CampaignIdeas;
