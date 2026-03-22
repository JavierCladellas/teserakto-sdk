import { useState, useRef, useEffect } from "react";

const SearchableDropdown = ({ label, name, value, onChange, options = [], placeholder = "Select…", externalError, className = "", readOnly, creatable = false, onCreate = async ()=>{}, createLabel = "Create", tooltip, required = false, style = {} }) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [creating, setCreating] = useState(false);
    const containerRef = useRef(null);

    const selectedLabel = options.find((o) => o.value === value)?.label || "";

    useEffect(() => {
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
                setSearch("");
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const filtered = options.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase()) );

    const exactMatch = options.some(
        opt => opt.label.toLowerCase() === search.toLowerCase()
    );
    const handleSelect = (option) => {
        if (readOnly) return;
        onChange?.({ target: { name, value: option.value } });
        setOpen(false);
        setSearch("");
    };

    const handleCreate = async () => {
        if (!onCreate || !search.trim()) return;

        setCreating(true);
        try {
            const created = await onCreate(search.trim());
            onChange?.({ target: { name, value: created?.value } });
            setOpen(false);
            setSearch("");
        } finally {
            setCreating(false);
        }
    };

    const readOnlyStyle = readOnly ? "bg-gray-100 text-gray-500 cursor-not-allowed opacity-70" : "cursor-pointer";

    return (
        <div className={`relative w-full ${className}`} ref={containerRef} style={style}>
            {label && (
                <label className="mb-1 text-gray-700 flex items-center gap-1">
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className="relative w-full">
                {!open || readOnly ? (
                    <span
                        onClick={() => {
                            if (!readOnly) setOpen(true);
                        }}
                        className={`block w-full border border-solid rounded-md px-3 py-2 pr-6 lg:pr-2 ${externalError ? "border-red-500" : "border-gray-300"
                            } text-gray-900 ${readOnlyStyle}`}
                        style={style}
                    >
                        {selectedLabel || placeholder}
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                            ▾
                        </span>
                    </span>
                ) : (
                    <input
                        autoFocus
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={selectedLabel || placeholder}
                        onClick={(e) => e.stopPropagation()}
                        disabled={readOnly}
                        className={`w-full border border-solid box-border rounded-md px-3 py-2 ${externalError ? "border-red-500" : "border-gray-300"
                            } outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900`}
                        style={style}
                    />
                )}
            </div>

            {open && !readOnly && (
                <div className="absolute left-0 right-0 bg-white border border-solid border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-auto z-50">
                    {filtered.length === 0 ? (
                        <div className="px-3 py-2 text-gray-500 text-sm">No results</div>
                    ) : (
                        filtered.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => handleSelect(option)}
                                className={`py-2 px-3 pr-6 lg:pr-2 cursor-pointer hover:bg-indigo-100 rounded ${value === option.value ? "bg-indigo-100 font-medium" : ""
                                    }`}
                            >
                                {option.label}
                            </div>
                        ))
                    )}
                    {creatable && search && !exactMatch && (
                        <div
                            onClick={handleCreate}
                            className="py-2 px-3 cursor-pointer text-indigo-600 hover:bg-indigo-50 border-t"
                        >
                            {creating
                                ? "Creating…"
                                : `+ ${createLabel} “${search}”`}
                        </div>
                    )}
                </div>
            )}

            {externalError && (<p className="text-red-500 text-sm mt-1">{externalError}</p>)}
        </div>
    );
};

export default SearchableDropdown;