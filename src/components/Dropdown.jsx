import { useState, useEffect } from "react";

const Dropdown = ({ options, onSelect, defaultValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (defaultValue) {
      setSelectedOption(defaultValue);
    }
  }, [defaultValue]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div
      className="relative inline-block font-semibold text-sm"
      style={{ width: "140px" }}
    >
      <div
        className="flex justify-between items-center px-2 py-1 rounded-md bg-gray-700 cursor-pointer"
        onClick={toggleDropdown}
      >
        {selectedOption || "Select option"}
        <span
          className={`mx-1 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </div>
      {isOpen && (
        <ul className="absolute rounded-md left-0 right-0 mt-1 bg-gray-700 z-10 max-h-60 overflow-y-auto">
          {options.map((option, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-800 cursor-pointer"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
