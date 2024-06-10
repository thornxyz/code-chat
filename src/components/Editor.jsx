import { useState, useRef, useEffect } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import ACTIONS from "../../Actions";

const Editor = ({ socketRef, roomId }) => {
  const [value, setValue] = useState("");
  const editorRef = useRef();

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
    <div style={{ width: "calc(100vw - 200px)" }}>
      <CodeMirror
        value={value}
        options={{
          lineNumbers: true,
          theme: "dracula",
          mode: "javascript",
        }}
        onBeforeChange={(editor, data, value) => {
          setValue(value);
        }}
        onChange={(editor, data, value) => {
          const { origin } = data;
          const code = value;
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
