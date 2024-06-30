import PropTypes from "prop-types";

const Dropdown = ({ options, onSelect, selectedOption }) => {
  const handleChange = (e) => {
    const selectedValue = e.target.value;
    onSelect(selectedValue);
  };

  return (
    <select
      className="bg-slate-800 font-semibold text-white p-0.5 rounded-md"
      value={selectedOption}
      onChange={handleChange}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

Dropdown.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedOption: PropTypes.string.isRequired,
};

export default Dropdown;
