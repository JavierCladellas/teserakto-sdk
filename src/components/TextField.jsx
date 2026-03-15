

const TextField = ({ label, name, value, onChange, type = "text", externalError, placeholder, readOnly, tooltip, required = false, style = {} }) => {
    const readOnlyStyle = readOnly ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "";

    const baseClasses = `w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${externalError ? "border-red-500" : "border-gray-300"} ${readOnlyStyle}`;
    const textareaClasses = `${baseClasses} min-h-[140px] max-h-64 resize-y leading-relaxed overflow-y-auto`;

    return (
        <div style={style}>
            <label className="text-gray-700 mb-1 flex items-center gap-1" style={style}>
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>

            {type === "textarea" ? (
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    rows={5}
                    wrap="soft"
                    className={textareaClasses}
                    style={style}
                />
            ) : (
                <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} readOnly={readOnly} className={baseClasses} style={style} />
            )}

            {externalError && <p className="text-red-500 text-sm mt-1">{externalError}</p>}
        </div>
    );
};

export { TextField };
