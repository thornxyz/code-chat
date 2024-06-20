import { useRef, useEffect, useState } from "react";
import { UnControlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material-darker.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/clike/clike";
import "codemirror/mode/python/python";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import ACTIONS from "../../Actions";
import Dropdown from "./Dropdown";

const options = ["Javascript", "C", "C++", "Python"];

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const [mode, setMode] = useState("javascript");
  const editorRef = useRef();

  const handleSelect = (option) => {
    switch (option) {
      case "Javascript":
        setMode("javascript");
        break;
      case "C++":
        setMode("text/x-c++src");
        break;
      case "C":
        setMode("text/x-csrc");
        break;
      case "Python":
        setMode("text/x-python");
        break;
      default:
        setMode("javascript");
    }
  };

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }
    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  return (
    <div className="overflow-auto" style={{ width: "calc(100vw - 300px)" }}>
      <div className="pl-6 px-2 py-1" style={{ background: "#212121" }}>
        <Dropdown
          options={options}
          onSelect={handleSelect}
          defaultValue={options[0]}
        />
      </div>
      <CodeMirror
        options={{
          lineNumbers: true,
          theme: "material-darker",
          mode: mode,
          autoCloseTags: true,
          autoCloseBrackets: true,
        }}
        onChange={(editor, data, value) => {
          const { origin } = data;
          const code = value;
          onCodeChange(code);
          if (origin !== "setValue") {
            socketRef.current.emit(ACTIONS.CODE_CHANGE, { roomId, code });
          }
        }}
        editorDidMount={(editor) => {
          editorRef.current = editor;
        }}
      />
    </div>
  );
};

export default Editor;
