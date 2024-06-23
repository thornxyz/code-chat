const statuses = [
  {
    id: 1,
    description: "In Queue",
  },
  {
    id: 2,
    description: "Processing",
  },
  {
    id: 3,
    description: "Accepted",
  },
  {
    id: 4,
    description: "Wrong Answer",
  },
  {
    id: 5,
    description: "Time Limit Exceeded",
  },
  {
    id: 6,
    description: "Compilation Error",
  },
  {
    id: 7,
    description: "Runtime Error (SIGSEGV)",
  },
  {
    id: 8,
    description: "Runtime Error (SIGXFSZ)",
  },
  {
    id: 9,
    description: "Runtime Error (SIGFPE)",
  },
  {
    id: 10,
    description: "Runtime Error (SIGABRT)",
  },
  {
    id: 11,
    description: "Runtime Error (NZEC)",
  },
  {
    id: 12,
    description: "Runtime Error (Other)",
  },
  {
    id: 13,
    description: "Internal Error",
  },
  {
    id: 14,
    description: "Exec Format Error",
  },
];

const Output = ({ output }) => {
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
    <div className="h-full bg-slate-950 overflow-auto ">
      <div className="text-sm p-1 font-semibold">Output:</div>
      <div className="  text-white font-normal text-sm">{getOutput()}</div>
    </div>
  );
};

export { statuses };
export default Output;
