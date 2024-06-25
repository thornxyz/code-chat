import { useRef, useEffect, useState } from "react";
import { UnControlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material-darker.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/clike/clike";
import "codemirror/mode/python/python";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import axios from "axios";
import run from "./run.svg";
import Output from "./Output";
import { statuses } from "./statuses";
import Dropdown from "./Dropdown";
import toast from "react-hot-toast";

const options = ["Javascript", "C", "C++", "Python"];

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const [mode, setMode] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const editorRef = useRef();
  const [input, setInput] = useState("");
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const handleSelect = (option, emit = true) => {
    setSelectedOption(option);
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
    if (emit) {
      socketRef.current.emit("dropdown-change", { roomId, option });
    }
  };

  const handleInputChange = (newInput, emit = true) => {
    setInput(newInput);
    if (emit) {
      socketRef.current.emit("input-change", { roomId, input: newInput });
    }
  };

  const handleRun = () => {
    setLoading(true);
    const formData = {
      language_id: getLanguageId(mode),
      source_code: btoa(code),
      stdin: btoa(input),
    };
    const options = {
      method: "POST",
      url: import.meta.env.VITE_RAPID_API_URL,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Host": import.meta.env.VITE_RAPID_API_HOST,
        "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY,
      },
      data: formData,
    };

    axios
      .request(options)
      .then(function (response) {
        const token = response.data.token;
        checkStatus(token);
      })
      .catch((err) => {
        let error = err.response ? err.response.data : err;
        console.log(error);
        setLoading(false);
        toast.error("Error submitting code");
      });
  };

  const checkStatus = async (token) => {
    const options = {
      method: "GET",
      url: import.meta.env.VITE_RAPID_API_URL + "/" + token,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": import.meta.env.VITE_RAPID_API_HOST,
        "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY,
      },
    };
    try {
      let response = await axios.request(options);
      let statusId = response.data.status?.id;

      if (statusId === 1 || statusId === 2) {
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
        return;
      } else {
        setOutput(response.data);
        setLoading(false);
        if (statusId === 3) {
          toast.success("Code executed successfully");
        } else {
          toast.error(
            `Code execution failed: ${
              statuses.find((status) => status.id === statusId)?.description
            }`
          );
        }
        return;
      }
    } catch (err) {
      console.log("err", err);
      setLoading(false);
      toast.error("Error checking status");
    }
  };

  const getLanguageId = (mode) => {
    switch (mode) {
      case "javascript":
        return 63;
      case "text/x-c++src":
        return 54;
      case "text/x-csrc":
        return 50;
      case "text/x-python":
        return 71;
      default:
        return 63;
    }
  };

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("code-change", ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
          setCode(code);
        }
      });

      socketRef.current.on("dropdown-change", ({ option }) => {
        handleSelect(option, false);
      });

      socketRef.current.on("input-change", ({ input }) => {
        setInput(input);
      });

      socketRef.current.on("joined", ({ mode, input }) => {
        if (input) {
          setInput(input);
        }
        if (mode) {
          handleSelect(mode, false);
        }
      });
    }
    return () => {
      socketRef.current.off("code-change");
      socketRef.current.off("input-change");
      socketRef.current.off("dropdown-change");
    };
  }, [socketRef.current]);

  return (
    <div style={{ width: "calc(100vw - 300px)" }}>
      <div
        className="pl-6 px-2 py-1 flex justify-between border-b border-gray-950"
        style={{ background: "#212121" }}
      >
        <Dropdown
          options={options}
          onSelect={handleSelect}
          defaultValue={selectedOption}
        />

        {loading ? (
          <div className="mr-6 bg-green-800 px-2 rounded-md cursor-pointer font-semibold">
            Running...
          </div>
        ) : (
          <div
            className="mr-6 bg-green-700 px-2 rounded-md flex gap-1 hover:bg-green-800 cursor-pointer font-semibold"
            onClick={handleRun}
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
      <div
        className="bg-zinc-900 border-t overflow-y-auto"
        style={{ height: "190px" }}
      >
        <Output output={output} input={input} setInput={handleInputChange} />
      </div>
    </div>
  );
};

export default Editor;
