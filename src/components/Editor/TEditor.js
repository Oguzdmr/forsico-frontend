import React, { useRef, useState, useEffect, useMemo } from "react";
import JoditEditor from "jodit-react";
import "./EditorStyles.css";
const appConfig = require("../../config");

const TEditor = ({
  minHeight,
  Outsidevalue,
  setValue,
  saveCallback,
  cancelCallback,
  setEditingMode,
}) => {
  const editor = useRef(null);
  const [content, setContent] = useState(Outsidevalue ?? "");
  const [initialContent, setInitialContent] = useState(Outsidevalue ?? "");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [savedSelection, setSavedSelection] = useState(null);
  useEffect(() => {
    if (content) {
      setValue(content);
    }
  }, [content]);

  useEffect(() => {
    setContent(initialContent);

    const handleContextMenu = (event) => {
      event.preventDefault();

      const selection = window.getSelection();

      setSavedSelection(selection.focusNode.parentNode);
      if (
        selection &&
        selection.rangeCount > 0 &&
        selection.toString().trim()
      ) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        setDropdownPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
        });
        setIsDropdownOpen(true);
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  const handleSave = () => {
    setInitialContent(content);
    saveCallback(content);
  };

  const handleCancel = () => {
    setContent(initialContent);
    cancelCallback();
  };

  const handleAIEnhance = async (action) => {
    try {
      const promptMap = {
        shorten: "Make the following text shorter:",
        simplify: "Simplify the language of the following text:",
        summarize: "Summarize the following text:",
        professional: "Change the tone of the following text to professional:",
      };

      const selectedText = savedSelection?.textContent;
      if (!selectedText) {
        console.log("No text selected");
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
          prompt: `${promptMap[action]}\n\n${selectedText}`,
          max_tokens: 100,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const aiResult = (data.choices || [])[0]?.text?.trim();

      if (aiResult) {
        const updatedContent = content.replace(selectedText, aiResult);
        setContent(updatedContent);
        setIsDropdownOpen(false);
      }
    } catch (error) {
      setIsDropdownOpen(false);
      console.error("AI işlem hatası:", error);
    }
  };

  const config = useMemo(
    () => ({
      buttons: [
        "paragraph",
        "font",
        "fontsize",
        "brush",
        "|",
        "bold",
        "italic",
        "underline",
        "|",
        "ul",
        "ol",
        "|",
        "link",
        "image",
        "table",
        "|",
        "align",
        "undo",
        "redo",
        "|",
        "hr",
      ],
      readonly: false,
      toolbar: true,
      height: minHeight,
      addNewLine: false,
      toolbarAdaptive: false,
      uploader: {
        insertImageAsBase64URI: true,
      },
      font: {
        options: [
          "Arial",
          "Georgia",
          "Impact",
          "Tahoma",
          "Times New Roman",
          "Verdana",
        ],
        default: "Arial",
      },
      fontsize: {
        options: ["8", "10", "12", "14", "16", "18", "24", "30", "36", "48"],
        default: "14",
      },
      theme: "forsico",
      spellcheck: true,
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
      placeholder: "Type here...",
    }),
    []
  );

  return (
    <div className="editor-container">
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        onBlur={(newContent) => {
          setContent(newContent);
          setTimeout(() => {
            setEditingMode(false);
          }, 400);
        }}
      />
      {isDropdownOpen && (
        <div
          className="ai-dropdown-toolbar"
          style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
        >
          <button onClick={() => handleAIEnhance("shorten")}>
            Making Text Shorter
          </button>
          <button onClick={() => handleAIEnhance("simplify")}>
            Simplifying Language
          </button>
          <button onClick={() => handleAIEnhance("summarize")}>
            Summarizing Text
          </button>
          <button onClick={() => handleAIEnhance("professional")}>
            Changing Tone to Professional
          </button>
        </div>
      )}
      <div className="editor-footer">
        <button className="cancel-btn" onClick={handleCancel}>
          Cancel
        </button>
        <button className="save-btn" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default TEditor;
