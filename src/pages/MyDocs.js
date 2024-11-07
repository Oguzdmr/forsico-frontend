import React, { useState } from "react";
import "../styles/mydocs.css";
import TEditor from "../components/Editor/TEditor";
import BoardIcon from "../assets/mydocs-board-icon.svg";
import ListIcon from "../assets/mydocs-list-icon.svg";
import Titleicon from "../assets/mydocs-title-icon.svg";
import CardTitleIcon from "../assets/mydocs-card-title-icon.svg";
import CardCommentIcon from "../assets/mydocs-card-comment-icon.svg";
import AddButtonIcon from "../assets/mydocs-add-button-icon.svg";
import CrossIcon from "../assets/cross-icon.svg";
import FilterIcon from "../assets/mydocs-filter-icon.svg";

const MyDocs = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [titleSaved, setTitleSaved] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cards, setCards] = useState(Array.from({ length: 30 }, (_, i) => ({
    title: `Card Title ${i + 1}`,
    lastUpdate: `Today at 10:03 pm`,
    comments: Math.floor(Math.random() * 10),
    tags: ["ui design", "marketing", `tag${(i % 5) + 1}`],
  })));

  const tagColors = {
    "ui design": "rgba(226, 232, 240, 1)", 
    "marketing": "rgba(54, 197, 240, 1)", 
    "tag1": "rgba(237, 30, 90, 1)", 
    "tag2": "rgba(148, 180, 252, 1)", 
    "tag3": "rgba(255, 99, 132, 1)", 
    "tag4": "rgba(75, 192, 192, 1)", 
    "tag5": "rgba(255, 206, 86, 1)"
  };

  const uniqueTags = ["All Tags", ...new Set(cards.flatMap(card => card.tags))];

  const handleSaveTitle = () => {
    setTitleSaved(true);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setTitleSaved(false);
  };

  const handleSaveTags = () => {
    const newTags = tagInput.split(",").map(tag => tag.trim()).filter(tag => tag);
    setTags([...tags, ...newTags]);
    setTagInput("");
  };

  const handleTagInput = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagSelect = (tag) => {
    setFilterTag(tag === "All Tags" ? "" : tag);
    setDropdownOpen(false);
  };

  const handleCreateDocument = () => {
    const newCard = {
      title,
      lastUpdate: new Date().toLocaleString(),
      comments: 0,
      tags
    };

    setCards([...cards, newCard]);
    setTitle("");
    setTags([]);
    setTitleSaved(false);
    setIsPopupOpen(false);
  };

  const filteredCards = filterTag
    ? cards.filter(card => card.tags.includes(filterTag))
    : cards;

  return (
    <>
      <div className="mydocs-main-container">
        <div className="mydocs-upper-area">
          <div className="mydocs-upper-title-area">
            <div className="mydocs-title">My Docs</div>
            <div className="mydocs-title-icon"><img src={Titleicon} alt="title-icon" /></div>
          </div>
          <div className="mydocs-upper-buttons">
            <div className="mydocs-board-btn">
              <div className="mydocs-board-button-area">
                <a className="mydocs-board-button" href="">
                  <img className="mydocs-board-icon" src={BoardIcon} alt="board-icon" />
                  <span className="td-none mydocs-board-button-text">Board</span>
                </a>
              </div>
            </div>
            <div className="mydocs-list-btn">
              <div className="mydocs-list-button-area">
                <a className="mydocs-list-button" href="">
                  <img src={ListIcon} alt="list-icon" />
                  <span className="td-none mydocs-board-button-text">List</span>
                </a>
              </div>
            </div>
            <div className="tag-filter-dropdown" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <p className="tag-filter-selected">
                {filterTag || "All Tags"} <img src={FilterIcon} alt="dropdown-icon" />
              </p>
              {dropdownOpen && (
                <div className="tag-filter-dropdown-menu">
                  {uniqueTags.map((tag, index) => (
                    <div
                      key={index}
                      className="tag-filter-dropdown-item"
                      onClick={() => handleTagSelect(tag)}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mydocs-line"></div>

        <div className="mydocs-lower-area-wrapper">
          <div className="mydocs-lower-area">
            {Array.from({ length: Math.ceil(filteredCards.length / 3) }).map((_, colIndex) => (
              <div className="mydocs-card-column" key={colIndex}>
                {filteredCards.slice(colIndex * 3, colIndex * 3 + 3).map((card, index) => (
                  <div key={index} className="mydocs-card">
                    <div className="mydocs-card-title-area">
                      <div className="mydocs-card-title">
                        <span className="mydocs-card-title-text">{card.title}</span>
                      </div>
                      <div className="mydocs-card-title-icon">
                        <img src={CardTitleIcon} alt="card-icon" />
                      </div>
                    </div>
                    <div className="mydocs-line"></div>
                    <div className="mydocs-last-update">
                      <span className="mydocs-last-update-text">{card.lastUpdate}</span>
                    </div>
                    <div className="mydocs-comments">
                      <img src={CardCommentIcon} alt="card-comment" />
                      <span>{card.comments}</span>
                    </div>
                    <div className="mydocs-card-tags">
                      {card.tags.map((tag, tagIndex) => (
                        <div
                          key={tagIndex}
                          className="mydocs-card-tag"
                          style={{
                            backgroundColor: tagColors[tag] || "rgba(200, 200, 200, 1)"
                          }}
                        >
                          <span>{tag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="add-docs-button-area">
          <button className="add-docs-button" onClick={() => setIsPopupOpen(true)}>
            Add Docs <img src={AddButtonIcon} alt="plus" />
          </button>
        </div>
      </div>

      {isPopupOpen && (
        <div className="popup-overlay" onClick={() => setIsPopupOpen(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
          <div className="close-button">
              {/* Display Saved Tags */}
              <div className="popup-doc-task-area">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="mydocs-card-tag"
                    style={{
                      backgroundColor: tagColors[tag] || "rgba(200, 200, 200, 1)"
                    }}
                  >
                    {tag}
                  </div>
                ))}
              </div>
              <div>
                <button className="close-button" onClick={() => setIsPopupOpen(false)}>
                  <img src={CrossIcon} alt="cross" />
                </button>
              </div>
            </div>
            <div className="popup-header">
              <input
                type="text"
                placeholder="Enter document title"
                value={title}
                onChange={handleTitleChange}
                className="popup-title-input"
              />
              <button
                className="mydocs-title-save-button"
                onClick={handleSaveTitle}
                disabled={!title || titleSaved}
              >
                Save
              </button>
            </div>
            <div className="popup-tags">
              <input
                type="text"
                placeholder="Add tags (separate by commas)"
                value={tagInput}
                onChange={handleTagInput}
                className="popup-tags-input"
              />
              <button
                className="mydocs-tags-save-button"
                onClick={handleSaveTags}
                disabled={!tagInput}
              >
                Save
              </button>
            </div>
            <div className="editor-area"><TEditor minHeight={"35vh"} /></div>
            <div>
              <button className="create-docs-button" onClick={handleCreateDocument}>
              Create Document
            </button></div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyDocs;