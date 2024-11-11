import React, { useState } from "react";
import CrossIcon from "../../assets/cross-icon.svg";
import TEditor from "../../components/Editor/TEditor";



const Blank = () => {

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
  
  return (
    <>
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
              </button>
            </div>
           
    </>
  )
}

export default Blank
