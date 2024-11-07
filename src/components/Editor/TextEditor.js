import { useCallback, useMemo, useRef, useEffect, useState } from "react";
import QuillEditor, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from "./styles.module.css";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import ImageResize from "quill-image-resize-module-react";
import Table from "quill-table-ui";
import QuillBetterTable from "quill-better-table";

Quill.register("modules/imageResize", ImageResize);
Quill.register(
  {
    "modules/better-table": QuillBetterTable,
  },
  true
);

const Editor = ({ value, setValue, saveCallback, cancelCallback }) => {
  const quill = useRef();

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
      table:false,
      'better-table': {
        operationMenu: {
          items: {
            unmergeCells: {
              text: 'Another unmerge cells name'
            }
          }
        }
      },
      syntax: {
        highlight: (text) => hljs.highlightAuto(text).value,
      },
      imageResize: {
        parchment: Quill.import("parchment"),
        displayStyles: {
          backgroundColor: "#ccc",
          border: "none",
          color: "white",
        },
        modules: ["Resize", "DisplaySize"],
      },
      toolbar: {
        container: [
          [{ header: [2, 3, 4, false] }],
          ["bold", "italic", "underline", "blockquote"],
          [{ color: [] }],
          [{ "code-block": true }],
          ["table"],
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
    "better-table",
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
          <button onClick={cancelCallback} className={styles["cta-cancel"]}>
            Cancel
          </button>
          <button onClick={handleSave} className={styles["cta-save"]}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Editor;
