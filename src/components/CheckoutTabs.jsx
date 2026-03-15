
const CheckoutTabs = ({ stepTabs, globalSettings, deviceSettings, activeTab, setActiveTab }) => {

    return (
        <div className="mb-8 gap-2 flex flex-wrap items-center justify-start">
            {stepTabs.map((tab, idx) => (
                <div key={idx} className="flex flex-shrink-0 items-center">
                    <button
                        key={tab.key}
                        type="button"
                        className={`bg-transparent px-0 py-0 text-base font-semibold transition-colors duration-150 ${activeTab === tab.key ? 'font-bold' : 'font-normal'}`}
                        style={{
                            boxShadow: 'none',
                            border: 'none',
                            outline: 'none',
                            fontSize: deviceSettings.stepFontSize,
                            color: activeTab === tab.key ? (globalSettings.stepColor) : '#a3a3a3',
                        }}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.label}
                    </button>
                    {idx < stepTabs.length - 1 && (
                        <span className="mx-1 text-gray-300 text-lg inline">&#8594;</span>
                    )}
                </div>
            ))}
        </div>
    );
};


export default CheckoutTabs;