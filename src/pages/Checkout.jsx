import { useState,useEffect } from "react";
import CheckoutTabs from "../components/CheckoutTabs";
import CheckoutPersonalInfo from "../components/CheckoutPersonalInfo";
import CheckoutDelivery from "../components/CheckoutDelivery";
import useWindowDimensions from "../hooks/useScreenWidth";
import useCart from "../hooks/useCart";
import CheckoutPayment from "../components/CheckoutPayment";
import CheckoutGifts from "../components/CheckoutGifts";

// Dynamically build stepTabs based on enableGiftStep


const getStepTabs = (settings) => {
    const tabs = [
        { key: "personal", label:  "1. " + settings.personalInfoHeading },
        { key: "delivery", label: "2. " + (settings.deliveryHeading) },
    ];
    if (settings.enableGiftStep) {
        tabs.push({ key: "gift", label: "3. " + (settings.giftInfoHeading) });
        tabs.push({ key: "payment", label: "4. " + (settings.paymentHeading) });
    } else {
        tabs.push({ key: "payment", label: "3. " + (settings.paymentHeading) });
    }
    return tabs;
};

const Checkout = ({ customization = {}}) => {
    const [activeDevice, setActiveDevice] = useState('desktop');
    const { width } = useWindowDimensions();

    useEffect(() => {
        const newActiveDevice = (width < 768 ) ? 'phone' : (  width < 1024  ) ? 'tablet' : 'desktop';
        if (newActiveDevice !== activeDevice) {
            setActiveDevice(newActiveDevice);
        }
    }, [width, activeDevice]);

    
    const deviceSettings = customization[activeDevice] || customization.desktop || {};
    const { cart } = useCart();

    const stepTabs = getStepTabs(customization);
    const [activeTab, setActiveTab] = useState(stepTabs[0].key);
    const goToNextStep = () => {
        const idx = stepTabs.findIndex(tab => tab.key === activeTab);
        if (idx < stepTabs.length - 1) {
            setActiveTab(stepTabs[idx + 1].key);
        }
    };

    const summaryWidth = Math.min(70, Math.max(30, Number(deviceSettings.summaryWidth ?? 45)));
    const subtotal = cart.reduce((sum, product) => sum + Number(product.price || 0), 0);

    return (
        <div
            className="flex flex-col  p-6 md:p-6 min-h-[400px] w-full transition-all duration-300"
            style={{
                fontFamily: customization.fontFamily,
                color: customization.textColor,
            }}
        >
            <CheckoutTabs stepTabs={stepTabs} globalSettings={customization} deviceSettings={deviceSettings} activeTab={activeTab} setActiveTab={setActiveTab} />

            <div
                className={`gap-6 ${
                    customization[activeDevice]?.layoutMode === 'column' ? 'flex flex-col' : 'flex flex-col sm:flex-row'
                }`}
            >
                <div className="flex-1">
                    {activeTab === "personal" && (
                        <CheckoutPersonalInfo settings={customization} deviceSettings={deviceSettings} />
                    )}
                    {activeTab === "delivery" && (
                        <CheckoutDelivery settings={customization} deviceSettings={deviceSettings} />
                    )}
                    {/* Gift Info step is only rendered if enabled */}
                    {activeTab === "gift" && deviceSettings.enableGiftStep === true && (
                        <CheckoutGifts settings={customization} deviceSettings={deviceSettings} />
                    )}
                    {activeTab === "payment" && (
                        <CheckoutPayment settings={customization} deviceSettings={deviceSettings} />
                    )}

                </div>

                {/* Order summary right, always visible */}
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
            </div>
        </div>
    );
};

export default Checkout;
