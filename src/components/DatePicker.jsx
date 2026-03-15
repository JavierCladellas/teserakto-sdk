import { Calendar, Info } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/datePickerStyles.css"; // Custom styles for the date picker

const DateField = ({ label, name, value, onChange, min, max, externalError, placeholder, readOnly, tooltip, style }) => {
    const readOnlyStyle = readOnly ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "";

    // Convert string value to Date object for DatePicker
    const dateValue = value ? new Date(value) : new Date();
    
    // Convert min/max strings to Date objects
    const minDate = min ? new Date(min) : new Date();
    const maxDate = max ? new Date(max) : new Date(new Date().setFullYear(new Date().getFullYear() + 1)); // Default max date is 1 year from now

    const handleDateChange = (date) => {
        if (date) {
            // Format date as MM-DD-YYYY for consistency with HTML date input
            onChange?.(date.toISOString());
        } else {
            const syntheticEvent = {
                target: {
                    name: name,
                    value: ''
                }
            };
            onChange?.(syntheticEvent);
        }
    };

    return (
        <div>
            <label className="text-gray-700 mb-1 flex items-center" style={style}>
                {label}
                {tooltip && (
                    <span className="group relative">
                        <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
                        <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 hidden group-hover:block px-2 py-1 text-xs bg-gray-800 text-white rounded-md shadow-lg whitespace-normal text-center max-w-56 w-max z-[70]">
                            {tooltip}
                        </span>
                    </span>
                )}
            </label>

            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                    <Calendar className="w-5 h-5 text-gray-400" />
                </div>
                <DatePicker
                    selected={dateValue}
                    onChange={handleDateChange}
                    minDate={minDate}
                    maxDate={maxDate}
                    placeholderText={placeholder || "Select a date"}
                    dateFormat="MMM d, yyyy"
                    disabled={readOnly}
                    className={`w-full border rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        externalError ? "border-red-500" : "border-gray-300"
                    } ${readOnlyStyle} hover:border-indigo-400 transition-colors`}
                    calendarClassName="modern-datepicker"
                    wrapperClassName="w-full"
                />
            </div>

            {externalError && <p className="text-red-500 text-sm mt-1">{externalError}</p>}
            
        </div>
    );
};

export default DateField;
