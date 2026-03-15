const Chips = ({
    items = [],
    selectedItems = [],
    onItemClick,
    onClearFilters,
    selectedChipColor = '#4f46e5',
    clearLabel = 'Clear filters'
}) => {
    return (
        <div className="mb-6 flex flex-wrap gap-2">
            {items.map((name) => (
                <button
                    key={name}
                    type="button"
                    onClick={() => onItemClick?.(name)}
                    className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                        selectedItems.includes(name)
                            ? ''
                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                    style={selectedItems.includes(name)
                        ? {
                            borderColor: selectedChipColor,
                            color: selectedChipColor,
                            backgroundColor: `${selectedChipColor}1A`
                        }
                        : undefined
                    }
                >
                    {name}
                </button>
            ))}
            {selectedItems.length > 0 && (
                <button
                    type="button"
                    onClick={() => onClearFilters?.()}
                    className="px-2 py-1 text-sm font-medium text-gray-500 hover:text-gray-700 underline underline-offset-2"
                >
                    {clearLabel}
                </button>
            )}
        </div>
    );
};

export default Chips;
