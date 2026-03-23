import useCart from "../hooks/useCart";

const CheckoutSummary = ({ globalCustomization, checkoutCustomization, deviceSettings, activeTab, goToNextStep, cartLocalStorageKey = "teserakto_cart", shippingCost = 0, shippingZoneName = "" }) => {
    const { cart } = useCart(cartLocalStorageKey);

    const summaryWidth = Math.min(70, Math.max(30, Number(deviceSettings.summaryWidth ?? 45)));
    const subtotal = cart.reduce((sum, product) => sum + Number(product.price || 0), 0);

    const total = subtotal + shippingCost;


    return (
        <div
            className={`rounded-lg border border-solid border-gray-200 p-4 flex flex-col h-full ${
                (deviceSettings.layoutMode) === 'column' ? 'w-full min-w-0' : ''
            }`}
            style={{
                backgroundColor: globalCustomization.surfaceColor,
                width: (deviceSettings.layoutMode) === 'column' ? '100%' : `${summaryWidth}%`,
            }}
        >
            <h3 className="font-semibold mb-3" style={{ fontSize: Math.max(14, deviceSettings.titleFontSize) }}>
                {checkoutCustomization.summaryTitleText}
            </h3>
            <div className="space-y-2 mb-4" style={{ fontSize: deviceSettings.summaryFontSize }}>
                {cart.map((product) => (
                    <div key={product.id} className="flex justify-between gap-2">
                        <div>
                            <span style={{ color: globalCustomization.textColor }}>{product.quantity} x </span>
                            <span className="truncate">{product.name}</span>
                        </div>
                        <span style={{ color: globalCustomization.accentColor }}>${Number(product?.price).toFixed(2)}</span>
                    </div>
                ))}
            </div>
            <div className="border-t pt-3 flex justify-between mb-4 border-gray-300" style={{ fontSize: deviceSettings.summaryFontSize }}>
                <span>{checkoutCustomization.subtotalLabelText}</span>
                <span style={{ color: globalCustomization.accentColor }}>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4" style={{ fontSize: deviceSettings.summaryFontSize }}>
                <span>{checkoutCustomization.shippingLabelText}
                    {shippingZoneName && (
                        <>
                            <br/>
                            ({shippingZoneName})
                        </>
                    )}
                </span>
                <span style={{ color: globalCustomization.accentColor }}>${shippingCost.toFixed(2)}</span>
            </div>

            <div className="border-t pt-3 flex justify-between font-semibold mb-4 border-gray-300" style={{ fontSize: deviceSettings.summaryFontSize }}>
                <span>{checkoutCustomization.totalLabelText}</span>
                <span style={{ color: globalCustomization.accentColor }}>${total.toFixed(2)}</span>
            </div>
            {/* Show Place Order button only in payment step, Next button otherwise */}
            {activeTab === "payment" ? (
                <button
                    key="submit"
                    type="submit"
                    className="transition select-none flex items-center justify-center px-6 py-3 rounded-md border-none"
                    style={{
                        backgroundColor: globalCustomization.primaryBtnColor,
                        color: globalCustomization.primaryBtnTextColor,
                        fontSize: deviceSettings.buttonFontSize,
                        fontFamily: globalCustomization.fontFamily
                    }}
                >  
                    {checkoutCustomization.placeOrderText}
                </button>
            ) : (
                <button
                    key="next"
                    type="button"
                    className="transition select-none flex items-center justify-center px-6 py-3 rounded-md border-none"
                    onClick={goToNextStep}
                    style={{
                        backgroundColor: globalCustomization.primaryBtnColor,
                        color: globalCustomization.primaryBtnTextColor,
                        fontSize: deviceSettings.buttonFontSize,
                        fontFamily: globalCustomization.fontFamily
                    }}
                >
                    {checkoutCustomization.nextBtnText}
                </button>
            )}
        </div>
    );
};

export default CheckoutSummary;