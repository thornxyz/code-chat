import { useRef, useEffect } from "react";
import { UnControlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import ACTIONS from "../../Actions";

const Editor = ({ socketRef, roomId, onCodeChange }) => {
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
    <div style={{ width: "calc(100vw - 300px)" }}>
      <CodeMirror
        options={{
          lineNumbers: true,
          theme: "dracula",
          mode: "javascript",
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
