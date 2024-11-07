import React, { useRef, useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import "./EditorStyles.css";

const TEditor = ({minHeight, saveCallback, cancelCallback}) => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [initialContent, setInitialContent] = useState("");

  useEffect(() => {
    setInitialContent(content);
  }, []);

  const handleSave = () => {
    setInitialContent(content);
    setIsPreview(true);
    saveCallback();
  };

  const handleCancel = () => {
    setContent(initialContent);
    cancelCallback();
  };

  const config = {
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
      "eraser",
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
  };

  return (
    <div className="editor-container">
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        onBlur={(newContent) => setContent(newContent)}
      />
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
