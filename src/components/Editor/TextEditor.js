import { useCallback, useMemo, useRef, useEffect, useState } from "react";
import QuillEditor from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from "./styles.module.css";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

const Editor = ({ value, setValue, saveCallback, cancelCallback }) => {
  const quill = useRef();

  function handler() {
    console.log(value);
  }

  const handleSave = () => {
    saveCallback();
  };

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const imageUrl = reader.result;
        const quillEditor = quill.current.getEditor();
        const range = quillEditor.getSelection(true);

        quillEditor.insertEmbed(range.index, "image", imageUrl, "user");
      };

      reader.readAsDataURL(file);
    };
  }, []);

  useEffect(() => {
    hljs.configure({
      languages: [
        "javascript",
        "python",
        "ruby",
        "java",
        "csharp",
        "go",
        "dart",
      ],
    });
  }, []);

  const modules = useMemo(
    () => ({
      syntax: {
        highlight: (text) => hljs.highlightAuto(text).value,
      },
      toolbar: {
        container: [
          [{ header: [2, 3, 4, false] }],
          ["bold", "italic", "underline", "blockquote"],
          [{ color: [] }],
          [{ "code-block": true }],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      clipboard: {
        matchVisual: true,
      },
    }),
    [imageHandler]
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "code-block",
  ];

  return (
    <div className={styles.mainArea}>
      <div className={styles.wrapper}>
        <QuillEditor
          ref={(el) => (quill.current = el)}
          className={styles.editor}
          theme="snow"
          value={value}
          formats={formats}
          modules={modules}
          onChange={(content, delta, source, editor) => setValue(content)}
        />
      </div>
      <div className={styles["editor-cta-wrapper"]}>
        <div className={styles["editor-cta-area"]}>
          <button
            onClick={() => {
              cancelCallback();
            }}
            className={styles["cta-cancel"]}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              handleSave();
            }}
            className={styles["cta-save"]}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Editor;
