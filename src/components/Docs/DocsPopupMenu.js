import React from "react";
import "../../styles/docsCSS/docsPopupMenu.css"


const DocsPopupMenu = ({ onSelect }) => {
  return (
    <div className="docs-popup-menu">
      <div className="docs-menu-div"><button className="docs-popup-menu-button docs-popup-menu-blank" onClick={() => onSelect("BlankPage")}><span>Blank Page</span></button></div>
      <div className="docs-menu-div">
        <button className="docs-popup-menu-button docs-popup-menu-ai " onClick={() => onSelect("WriteWithAi")}>
        <span className="popup-menu-span">Write with AI</span>
        </button>
        </div>
      <div className="docs-menu-div"><button className="docs-popup-menu-button docs-popup-menu-blogpost" onClick={() => onSelect("BlogPost")}>Blog Post</button></div>
      <div className="docs-menu-div"><button className="docs-popup-menu-button docs-popup-menu-campaign" onClick={() => onSelect("CampaignIdeas")}>Campaign Ideas</button></div>
      <div className="docs-menu-div"><button className="docs-popup-menu-button docs-popup-menu-seo" onClick={() => onSelect("SeoArticleBrief")}>SEO Article Brief</button></div>
      <div className="docs-menu-div"><button className="docs-popup-menu-button docs-popup-menu-faqs" onClick={() => onSelect("GenerateFAQs")}>Generate FAQs</button></div>
    </div>
  );
};

export default DocsPopupMenu;