import { statuses } from "./codeExec";
import PropTypes from "prop-types";

const Output = ({ output, input, setInput, clearOutput }) => {
  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const getOutput = () => {
    if (!output || !output.status) return <></>;

    const statusId = output.status.id;
    const statusDescription =
      statuses.find((status) => status.id === statusId)?.description ||
      "Unknown status";

    if (statusId === 6) {
      return (
        <pre className="px-2 py-1 font-normal text-xs text-red-500">
          {atob(output.compile_output)}
        </pre>
      );
    } else if (statusId === 3) {
      return (
        <pre className="px-2 py-1 font-normal text-xs text-green-500">
          {atob(output.stdout) !== null ? atob(output.stdout) : "No output"}
        </pre>
      );
    } else if (statusId === 5) {
      return (
        <pre className="px-2 py-1 font-normal text-xs text-red-500">
          Time Limit Exceeded
        </pre>
      );
    } else {
      return (
        <pre className="px-2 py-1 font-normal text-xs text-red-500">
          {atob(output.stderr) !== null
            ? atob(output?.stderr)
            : statusDescription}
        </pre>
      );
    }
  };

  return (
    <div className="flex h-full">
      <div className=" bg-slate-950 overflow-auto " style={{ flex: "3 1 0%" }}>
        <div className="flex sticky top-0 text-sm p-1 font-semibold justify-between">
          <div>Output:</div>
          <div
            className="bg-blue-700 hover:bg-blue-900 cursor-pointer rounded-sm px-1"
            onClick={clearOutput}
          >
            Clear
          </div>
        </div>
        <div className="text-white font-normal text-sm">{getOutput()}</div>
      </div>
      <div className=" bg-slate-700 overflow-auto" style={{ flex: "2 1 0%" }}>
        <div className="sticky top-0 text-sm p-1 font-semibold">Input:</div>
        <textarea
          className="text-white text-sm w-full bg-inherit p-2 outline-none resize-none"
          style={{ height: "80%" }}
          placeholder="Enter custom stdin..."
          value={input}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

Output.propTypes = {
  output: PropTypes.any.isRequired,
  input: PropTypes.string.isRequired,
  setInput: PropTypes.func.isRequired,
  clearOutput: PropTypes.func.isRequired,
};

export default Output;
