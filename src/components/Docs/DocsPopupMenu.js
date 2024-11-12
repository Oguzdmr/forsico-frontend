import React from "react";
import "../../styles/docsCSS/docsPopupMenu.css";
import AiIcon from "../../assets/ai-icon.svg";
import BlankIcon from "../../assets/mydocs-popup-blank-icon.svg";
import BlogPostIcon from "../../assets/mydocs-popup-blogpost-icon.svg";
import CampaignIcon from "../../assets/campaign-icon.svg";
import SeoIcon from "../../assets/seo-icon.svg";
import FAQsIcon from "../../assets/faqs-icon.svg";


const DocsPopupMenu = ({ onSelect }) => {
  return (
    <div className="docs-popup-menu">
      <div className="docs-menu-div">
        <button
          className="docs-popup-menu-button docs-popup-menu-blank"
          onClick={() => onSelect("BlankPage")}
        >
          <img className="docs-popup-menu-icon" src={BlankIcon} alt="" />
          <span>Blank Page</span>
        </button>
      </div>
      <div className="docs-menu-div">
        <button
          className="docs-popup-menu-button docs-popup-menu-ai "
          onClick={() => onSelect("WriteWithAi")}
        >
          <img className="docs-popup-menu-icon" src={AiIcon} alt="" />
          <span className="popup-menu-span">Write with AI</span>
        </button>
      </div>
      <div className="docs-menu-div">
        <button
          className="docs-popup-menu-button docs-popup-menu-blogpost"
          onClick={() => onSelect("BlogPost")}
        >
          <img className="docs-popup-menu-icon" src={BlogPostIcon} alt="" />
          <span>Blog Post</span>
        </button>
      </div>
      <div className="docs-menu-div">
        <button
          className="docs-popup-menu-button docs-popup-menu-campaign"
          onClick={() => onSelect("CampaignIdeas")}
        >
          <img className="docs-popup-menu-icon" src={CampaignIcon} alt="" />
          <span>Campaign Ideas</span>
        </button>
      </div>
      <div className="docs-menu-div">
        <button
          className="docs-popup-menu-button docs-popup-menu-seo"
          onClick={() => onSelect("SeoArticleBrief")}
        >
          <img className="docs-popup-menu-icon" src={SeoIcon} alt="" />
          <span>SEO Article Brief</span>
        </button>
      </div>
      <div className="docs-menu-div">
        <button
          className="docs-popup-menu-button docs-popup-menu-faqs"
          onClick={() => onSelect("GenerateFAQs")}
        >
          <img className="docs-popup-menu-icon" src={FAQsIcon} alt="" />
          <span>Generate FAQs</span>
        </button>
      </div>
      <div>

        {/* <button className="create-docs-button">Create Document</button> */}
      </div>
    </div>
  );
};

export default DocsPopupMenu;
