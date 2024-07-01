import { useRef, useEffect, useState } from "react";
import { UnControlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material-darker.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/clike/clike";
import "codemirror/mode/python/python";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import run from "./run.svg";
import Output from "./Output";
import { handleRun } from "./codeExec";
import PropTypes from "prop-types";

const options = ["Javascript", "C", "C++", "Python"];

const Editor = ({
  socketRef,
  roomId,
  onCodeChange,
  onDropdownChange,
  onInputChange,
}) => {
  const editorRef = useRef();
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const handleDropdown = (e) => {
    const selectedValue = e.target.value;
    handleSelect(selectedValue, true);
  };

  const handleSelect = (option, emit = true) => {
    if (option) {
      onDropdownChange(option);
      setSelectedOption(option);
      if (emit) {
        socketRef.current.emit("dropdown-change", { roomId, option });
      }
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
    }
  };

  const handleInputChange = (newInput, emit = true) => {
    if (newInput !== null) {
      setInput(newInput);
      onInputChange(newInput);
      if (emit) {
        socketRef.current.emit("input-change", { roomId, input: newInput });
      }
    }
  };

  useEffect(() => {
    const socket = socketRef.current;

    if (socket) {
      socket.on("code-change", ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
          setCode(code);
        }
      });

      socket.on("dropdown-change", ({ option }) => {
        handleSelect(option, false);
      });

      socket.on("input-change", ({ input }) => {
        handleInputChange(input, false);
      });

      socket.on("output-change", ({ output }) => {
        setOutput(output);
      });

      socket.on("joined", ({ output }) => {
        if (output) {
          setOutput(output);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("code-change");
        socket.off("input-change");
        socket.off("dropdown-change");
        socket.off("output-change");
      }
    };
  }, [socketRef.current]);

  return (
    <div style={{ width: "calc(100vw - 300px)" }}>
      <div
        className="pl-6 px-2 py-1 flex justify-between border-b border-gray-950"
        style={{ background: "#212121" }}
      >
        <select
          className="bg-slate-800 font-semibold text-white p-0.5 rounded-md"
          value={selectedOption}
          onChange={handleDropdown}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {loading ? (
          <div className="mr-6 bg-green-800 px-2 rounded-md cursor-pointer font-semibold">
            Running...
          </div>
        ) : (
          <div
            className="mr-6 bg-green-700 px-2 rounded-md flex gap-1 hover:bg-green-800 cursor-pointer font-semibold"
            onClick={() =>
              handleRun(
                mode,
                code,
                input,
                setLoading,
                setOutput,
                socketRef,
                roomId
              )
            }
          >
            Run
            <img src={run} alt="run" width={12} />
          </div>
        )}
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
          setCode(code);
          if (origin !== "setValue") {
            socketRef.current.emit("code-change", { roomId, code });
          }
        }}
        editorDidMount={(editor) => {
          editorRef.current = editor;
        }}
      />
      <div className="bg-zinc-900 overflow-y-auto" style={{ height: "190px" }}>
        <Output
          output={output}
          clearOutput={() => {
            setOutput("");
          }}
          input={input}
          setInput={handleInputChange}
        />
      </div>
    </div>
  );
};

Editor.propTypes = {
  socketRef: PropTypes.object.isRequired,
  roomId: PropTypes.string.isRequired,
  onCodeChange: PropTypes.func.isRequired,
  onDropdownChange: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
};

export default Editor;
