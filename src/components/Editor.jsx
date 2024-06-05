import React from "react";
import { UnControlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import 'codemirror/theme/monokai.css';
import "codemirror/mode/clike/clike";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/closetag";

function Editor() {
    return (
        <div style={{ width: 'calc(100vw - 200px)' }}>
            <CodeMirror
                options={{
                    lineNumbers: true,
                    theme: 'monokai',
                    autoCloseTags: true,
                    autoCloseBrackets: true,
                    mode: "text/x-csrc",
                }}
            />
        </div>
    );
}

export default Editor;