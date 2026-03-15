import useCart from "../hooks/useCart";

const CheckoutSummary = ({ customization, deviceSettings, activeTab, goToNextStep }) => {
    const { cart } = useCart();

    const summaryWidth = Math.min(70, Math.max(30, Number(deviceSettings.summaryWidth ?? 45)));
    const subtotal = cart.reduce((sum, product) => sum + Number(product.price || 0), 0);


    return (
        <div
            className={`rounded-lg border border-gray-200 p-4 flex flex-col h-full ${
                (deviceSettings.layoutMode) === 'column' ? 'w-full min-w-0' : ''
            }`}
            style={{
                backgroundColor: customization.panelColor,
                width: (deviceSettings.layoutMode) === 'column' ? '100%' : `${summaryWidth}%`,
            }}
        >
            <h3 className="font-semibold mb-3" style={{ fontSize: Math.max(14, deviceSettings.titleFontSize) }}>
                {customization.summaryTitleText}
            </h3>
            <div className="space-y-2 mb-4" style={{ fontSize: deviceSettings.textFontSize }}>
                {cart.map((product) => (
                    <div key={product.id} className="flex justify-between gap-2">
                        <div>
                            <span style={{ color: customization.textColor }}>{product.quantity} x </span>
                            <span className="truncate">{product.name}</span>
                        </div>
                        <span style={{ color: customization.accentColor }}>${Number(product?.price).toFixed(2)}</span>
                    </div>
                ))}
            </div>
            <div className="border-t pt-3 flex justify-between font-semibold mb-4" style={{ fontSize: deviceSettings.textFontSize }}>
                <span>{customization.totalLabelText}</span>
                <span style={{ color: customization.accentColor }}>${subtotal.toFixed(2)}</span>
            </div>
            {/* Show Place Order button only in payment step, Next button otherwise */}
            {activeTab === "payment" ? (
                <button
                    type="button"
                    className="transition select-none flex items-center justify-center px-6 py-3 rounded-md"
                    style={{
                        backgroundColor: customization.primaryButtonColor,
                        color: customization.primaryButtonTextColor,
                        fontSize: deviceSettings.buttonFontSize,
                    }}
                >  
                    {customization.placeOrderText}
                </button>
            ) : (
                <button
                    type="button"
                    className="transition select-none flex items-center justify-center px-6 py-3 rounded-md"
                    onClick={goToNextStep}
                    style={{
                        backgroundColor: customization.primaryButtonColor,
                        color: customization.primaryButtonTextColor,
                        fontSize: deviceSettings.buttonFontSize,
                    }}
                >
                    {customization.nextBtnText}
                </button>
            )}
        </div>
    );
};

export default CheckoutSummary;