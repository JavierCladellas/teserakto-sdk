import { useState,useEffect } from "react";
import CheckoutTabs from "../components/CheckoutTabs";
import CheckoutPersonalInfo from "../components/CheckoutPersonalInfo";
import CheckoutDelivery from "../components/CheckoutDelivery";
import useWindowDimensions from "../hooks/useScreenWidth";
import CheckoutPayment from "../components/CheckoutPayment";
import CheckoutGifts from "../components/CheckoutGifts";
import CheckoutSummary from "../components/CheckoutSummary";

const getStepTabs = (settings) => {
    const tabs = [
        { key: "personal", label:  "1. " + settings?.personalInfoHeading },
        { key: "delivery", label: "2. " + (settings?.deliveryHeading) },
    ];
    if (settings?.enableGiftStep) {
        tabs.push({ key: "gift", label: "3. " + (settings?.giftInfoHeading) });
        tabs.push({ key: "payment", label: "4. " + (settings?.paymentHeading) });
    } else {
        tabs.push({ key: "payment", label: "3. " + (settings?.paymentHeading) });
    }
    return tabs;
};

const Checkout = ({ globalCustomization, checkoutCustomization, device = null, cartLocalStorageKey = "teserakto_cart" }) => {
    const [activeDevice, setActiveDevice] = useState(device);
    const { width } = useWindowDimensions();

    useEffect(() => {
        if (device) {
            setActiveDevice(device);
            return;
        }
        const newActiveDevice = (width < 768 ) ? 'phone' : (  width < 1024  ) ? 'tablet' : 'desktop';
        if (newActiveDevice !== activeDevice) {
            setActiveDevice(newActiveDevice);
        }
    }, [width, activeDevice, device]);


    const deviceSettings = checkoutCustomization[activeDevice] || checkoutCustomization.desktop || {};

    const stepTabs = getStepTabs(checkoutCustomization);
    const [activeTab, setActiveTab] = useState(stepTabs[0].key);
    const goToNextStep = () => {
        const idx = stepTabs.findIndex(tab => tab.key === activeTab);
        if (idx < stepTabs.length - 1) {
            setActiveTab(stepTabs[idx + 1].key);
        }
    };

    return (
        <div
            className="flex flex-col  p-6 md:p-6 min-h-[400px] w-full transition-all duration-300"
            style={{
                fontFamily: globalCustomization.fontFamily,
                color: globalCustomization.textColor,
            }}
        >
            <CheckoutTabs stepTabs={stepTabs} globalCustomization={globalCustomization} checkoutCustomization={checkoutCustomization} deviceSettings={deviceSettings} activeTab={activeTab} setActiveTab={setActiveTab} />

            <div
                className={`gap-6 ${
                    deviceSettings?.layoutMode === 'column' ? 'flex flex-col' : 'flex flex-col sm:flex-row'
                }`}
            >
                <div className="flex-1 rounded-lg border border-gray-200 p-4" style={{ backgroundColor: globalCustomization.surfaceColor }}>
                    {activeTab === "personal" && (
                        <CheckoutPersonalInfo globalCustomization={globalCustomization} checkoutCustomization={checkoutCustomization} deviceSettings={deviceSettings} />
                    )}
                    {activeTab === "delivery" && (
                        <CheckoutDelivery globalCustomization={globalCustomization} checkoutCustomization={checkoutCustomization} deviceSettings={deviceSettings} activeDevice={activeDevice} />
                    )}
                    {/* Gift Info step is only rendered if enabled */}
                    {activeTab === "gift" && checkoutCustomization.enableGiftStep === true && (
                        <CheckoutGifts globalCustomization={globalCustomization} checkoutCustomization={checkoutCustomization} deviceSettings={deviceSettings} />
                    )}
                    {activeTab === "payment" && (
                        <CheckoutPayment globalCustomization={globalCustomization} checkoutCustomization={checkoutCustomization} deviceSettings={deviceSettings} />
                    )}

                </div>

                <CheckoutSummary globalCustomization={globalCustomization} checkoutCustomization={checkoutCustomization} deviceSettings={deviceSettings} activeTab={activeTab} goToNextStep={goToNextStep} cartLocalStorageKey={cartLocalStorageKey} />
            </div>
        </div>
    );
};

export default Checkout;
