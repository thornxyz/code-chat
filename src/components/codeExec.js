import axios from "axios";
import toast from "react-hot-toast";

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

const handleRun = async (mode, code, input, setLoading, setOutput, socketRef, roomId) => {
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

    try {
        const response = await axios.request(options);
        const token = response.data.token;
        await checkStatus(token, setOutput, setLoading, socketRef, roomId);
    } catch (err) {
        const error = err.response ? err.response.data : err;
        console.log(error);
        setLoading(false);
        toast.error("Error submitting code");
    }
};

const checkStatus = async (token, setOutput, setLoading, socketRef, roomId) => {
    const options = {
        method: "GET",
        url: `${import.meta.env.VITE_RAPID_API_URL}/${token}`,
        params: { base64_encoded: "true", fields: "*" },
        headers: {
            "X-RapidAPI-Host": import.meta.env.VITE_RAPID_API_HOST,
            "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY,
        },
    };

    try {
        const response = await axios.request(options);
        const statusId = response.data.status?.id;

        if (statusId === 1 || statusId === 2) {
            setTimeout(() => {
                checkStatus(token, setOutput, setLoading, socketRef, roomId);
            }, 2000);
        } else {
            setOutput(response.data);
            setLoading(false);
            socketRef.current.emit("output-change", {
                roomId,
                output: response.data,
            });
            if (statusId === 3) {
                toast.success("Code executed successfully");
            } else {
                toast.error(
                    `Code execution failed: ${statuses.find((status) => status.id === statusId)?.description
                    }`
                );
            }
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

export { handleRun, statuses };
