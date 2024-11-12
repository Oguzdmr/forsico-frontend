import React, { useState, useEffect } from "react";
import "../styles/mydocs.css";
import Titleicon from "../assets/mydocs-title-icon.svg";
import CardTitleIcon from "../assets/mydocs-card-title-icon.svg";
import AddButtonIcon from "../assets/mydocs-add-button-icon.svg";
import DocsPopupMenu from "../components/Docs/DocsPopupMenu";
import CrossIcon from "../assets/cross-icon.svg";
import LeftArrow from "../assets/left-arrow-icon.svg";
import BlankPage from "../components/Docs/Blank";
import WriteWithAi from "../components/Docs/WriteWithAi";
import BlogPost from "../components/Docs/BlogPost";
import CampaignIdeas from "../components/Docs/CampignIdeas";
import SeoArticleBrief from "../components/Docs/SeoArticleBrief";
import GenerateFAQs from "../components/Docs/GenerateFAQs";

const MyDocs = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("DocsPopupMenu");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [savedDocs, setSavedDocs] = useState([]);

  useEffect(() => {
    const docs = JSON.parse(localStorage.getItem("savedDocs")) || [];
    setSavedDocs(docs);
  }, []);

  const handleComponentSelect = (componentName) => {
    setSelectedComponent(componentName);
  };

  const refreshDocs = () => {
    const docs = JSON.parse(localStorage.getItem("savedDocs")) || [];
    setSavedDocs(docs);
  };

  const handleClosePopup = () => {
    refreshDocs();
    setTimeout(() => {
      setIsPopupOpen(false);
    }, 400);
  };

  const handleOpenPopup = (doc) => {
    setSelectedDoc(doc);
    setIsPopupOpen(true);
  };

  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case "BlankPage":
        return <BlankPage closePopUp={handleClosePopup} />;
      case "WriteWithAi":
        return <WriteWithAi closePopUp={handleClosePopup} />;
      case "BlogPost":
        return <BlogPost closePopUp={handleClosePopup} />;
      case "CampaignIdeas":
        return <CampaignIdeas closePopUp={handleClosePopup} />;
      case "SeoArticleBrief":
        return <SeoArticleBrief closePopUp={handleClosePopup} />;
      case "GenerateFAQs":
        return <GenerateFAQs closePopUp={handleClosePopup} />;
      default:
        return <DocsPopupMenu onSelect={handleComponentSelect} />;
    }
  };

  return (
    <>
      <div className="mydocs-main-container">
        <div className="mydocs-upper-area">
          <div className="mydocs-upper-title-area">
            <div className="mydocs-title">My Docs</div>
            <div className="mydocs-title-icon">
              <img src={Titleicon} alt="title-icon" />
            </div>
          </div>
        </div>
        <div className="mydocs-line"></div>

        <div className="mydocs-lower-area-wrapper">
          {savedDocs.length === 0 ? (
            <div className="no-docs-message">No documents available</div>
          ) : (
            <div className="mydocs-lower-area">
              {savedDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="mydocs-card"
                  onClick={() => handleOpenPopup(doc)}
                >
                  <div className="mydocs-card-title-area">
                    <div className="mydocs-card-title">
                      <span className="mydocs-card-title-text">
                        {doc.title}
                      </span>
                    </div>
                    <div className="mydocs-card-title-icon">
                      <img src={CardTitleIcon} alt="card-icon" />
                    </div>
                  </div>
                  <div className="mydocs-line"></div>
                  <div className="mydocs-last-update">
                    <span className="mydocs-last-update-text">
                      {doc.lastUpdate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="add-docs-button-area">
          <button
            className="add-docs-button"
            onClick={() => {
              setSelectedDoc(null);
              setIsPopupOpen(true);
              setSelectedComponent(null);
            }}
          >
            Add Docs <img src={AddButtonIcon} alt="plus" />
          </button>
        </div>
      </div>

      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="mydocs-popup-cross-icon">
              <img
                className="left-arrow-icon"
                onClick={() => setIsPopupOpen(false)}
                src={LeftArrow}
                alt="left-arrow"
              />
              <img
                className="popup-cross-icon"
                onClick={() => setIsPopupOpen(false)}
                src={CrossIcon}
                alt="cross"
              />
            </div>
            {selectedDoc ? (
              <div>
                <h2>{selectedDoc.title}</h2>
                <div
                  dangerouslySetInnerHTML={{ __html: selectedDoc.content }}
                />
              </div>
            ) : (
              <div>{renderSelectedComponent()}</div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MyDocs;
