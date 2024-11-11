import React, { useRef, useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import "./EditorStyles.css";
const appConfig = require("../../config");

const TEditor = ({ minHeight, saveCallback, cancelCallback }) => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [initialContent, setInitialContent] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [savedSelection, setSavedSelection] = useState(null);

  useEffect(() => {
    setInitialContent(content);

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

  const aiTools = [
    {
      Title: "Blog Post",
      Heroicon: "pencil",
      Prompt: "Write a blog post about {{Topic}} for a {{Audience}} audience.",
      fields: ["Topic", "Audience"],
    },
    {
      Title: "Campaign Ideas",
      Heroicon: "light-bulb",
      Prompt: "Generate campaign ideas for {{Product}} targeting {{Audience}}.",
      fields: ["Product", "Audience"],
    },
    {
      Title: "Product Description",
      Heroicon: "tag",
      Prompt:
        "Create a product description for {{Product}}, focusing on {{Features}}.",
      fields: ["Product", "Features"],
    },
    {
      Title: "Email Template",
      Heroicon: "envelope",
      Prompt: "Write an email template for {{Purpose}} targeting {{Audience}}.",
      fields: ["Purpose", "Audience"],
    },
  ];

  const openModalForPrompt = (tool) => {
    setCurrentPrompt(tool);
    setPromptData({});
    setIsModalOpen(true);
  };

  const handlePromptDataChange = (field, value) => {
    setPromptData((prevData) => ({ ...prevData, [field]: value }));
  };

  const generatePrompt = (template) => {
    let generatedPrompt = template;
    for (const key in promptData) {
      generatedPrompt = generatedPrompt?.replace(
        `{{${key}}}`,
        promptData[key] || ""
      );
    }
    return generatedPrompt;
  };

  const handleSave = () => {
    setInitialContent(content);
    setIsPreview(true);
    saveCallback();
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

  const addCustomButton = (editorInstance, tool) => {
    editorInstance.registerButton({
      name: tool.title,
      icon: `https://example.com/${tool.icon}-icon.png`,
      exec: () => {
        setCurrentTool(tool);
        const inputElement = document.createElement("input");
        inputElement.type = "text";
        inputElement.placeholder = tool.placeholder;
        inputElement.classList.add("ai-input-inline");

        inputElement.onblur = () => {
          setUserInput(inputElement.value);
          handleAIEnhance();
          editorInstance.selection.insertHTML("");
        };

        editorInstance.selection.insertNode(inputElement);
        inputElement.focus();
      },
    });
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

  const toggleDropdown = (editorInstance) => {
    const range = editorInstance?.selection?.sel?.getRangeAt(0);
    if (range) {
      const rect = range.getBoundingClientRect();

      setDropdownPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX + 50,
      });
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  return (
    <div className="editor-container">
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        onBlur={(newContent) => setContent(newContent)}
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
