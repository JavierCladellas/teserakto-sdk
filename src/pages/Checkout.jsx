import { useState,useEffect } from "react";
import CheckoutTabs from "../components/CheckoutTabs";
import CheckoutPersonalInfo from "../components/CheckoutPersonalInfo";
import CheckoutDelivery from "../components/CheckoutDelivery";
import useWindowDimensions from "../hooks/useScreenWidth";
import CheckoutPayment from "../components/CheckoutPayment";
import CheckoutGifts from "../components/CheckoutGifts";
import CheckoutSummary from "../components/CheckoutSummary";
import useCart from "../hooks/useCart";

const API_URL = import.meta.env.VITE_TESERAKTO_API_URL;



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

const Checkout = ({ globalCustomization, checkoutCustomization, device = null, cartLocalStorageKey = "teserakto_cart", handleSubmit = null }) => {
    const [activeDevice, setActiveDevice] = useState(device);
    const { width } = useWindowDimensions();

    const cart = useCart(cartLocalStorageKey);
   
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

    const inputDefaults = {
        personal: {
            firstname: "",
            lastname: "",
            email: "",
            telephone: "",
            company_name: "",
        },
        delivery:{
            delivery_type: "delivery",
            delivery_address: "",
            delivery_city: "",
            delivery_country: "SV",
            delivery_postal_code: "",
            prefered_delivery_date: new Date(),
            prefered_delivery_time_slot: "morning",
            delivery_instructions: "",
        },
        gifts: {
            is_alt_recipient: checkoutCustomization?.enableGiftStep,
            alt_recipient_name: "",
            alt_recipient_email: "",
            alt_recipient_phone: "",
            personal_message: "",
        },
        payment: {
            payment_method: "card",
            //CHECK PCI COMPLIANCE...
            card_number: "",
            card_expiry: "",
            card_cvc: "",
            card_name: ""
        }
    };

    const [formData, setFormData] = useState(inputDefaults);
    const [errors, setErrors] = useState({});

    const submitOrder = (e) => {
        e.preventDefault();
        if (activeTab !== "payment") {
            console.log("Place order prematurely fired")
            return 
        }
        handleSubmit(formData)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("Order placed successfully!");
                setFormData(inputDefaults);
                setErrors({});
                cart.clear();
            } else {
                setErrors(data.errors || {});
            }
        })
        .catch(err => {
            console.error("Error submitting order:", err);
        });
    }

    return (
        <div
            className="flex flex-col  p-6 md:p-6 min-h-[400px] w-full transition-all duration-300"
            style={{
                fontFamily: globalCustomization.fontFamily,
                color: globalCustomization.textColor,
            }}
        >
            <CheckoutTabs stepTabs={stepTabs} globalCustomization={globalCustomization} checkoutCustomization={checkoutCustomization} deviceSettings={deviceSettings} activeTab={activeTab} setActiveTab={setActiveTab} />

            <form onSubmit={submitOrder}
                className={`gap-6 ${ deviceSettings?.layoutMode === 'column' ? 'flex flex-col' : 'flex flex-col sm:flex-row' }`}
            >
                <div className="flex-1 rounded-lg border border-gray-200 p-4" style={{ backgroundColor: globalCustomization.surfaceColor }}>
                    {activeTab === "personal" && (
                        <CheckoutPersonalInfo globalCustomization={globalCustomization} checkoutCustomization={checkoutCustomization} deviceSettings={deviceSettings} formData={formData.personal} setFormData={(personal) => setFormData({ ...formData, personal })} />
                    )}
                    {activeTab === "delivery" && (
                        <CheckoutDelivery globalCustomization={globalCustomization} checkoutCustomization={checkoutCustomization} deviceSettings={deviceSettings} activeDevice={activeDevice} formData={formData.delivery} setFormData={(delivery) => setFormData({ ...formData, delivery })} />
                    )}
                    {/* Gift Info step is only rendered if enabled */}
                    {activeTab === "gift" && checkoutCustomization.enableGiftStep === true && (
                        <CheckoutGifts globalCustomization={globalCustomization} checkoutCustomization={checkoutCustomization} deviceSettings={deviceSettings} formData={formData.gifts} setFormData={(gifts) => setFormData({ ...formData, gifts })} />
                    )}
                    {activeTab === "payment" && (
                        <CheckoutPayment globalCustomization={globalCustomization} checkoutCustomization={checkoutCustomization} deviceSettings={deviceSettings} formData={formData.payment} setFormData={(payment) => setFormData({ ...formData, payment })} />
                    )}

                </div>

                <CheckoutSummary globalCustomization={globalCustomization} checkoutCustomization={checkoutCustomization} deviceSettings={deviceSettings} activeTab={activeTab} goToNextStep={goToNextStep} cartLocalStorageKey={cartLocalStorageKey} formData={formData} />
            </form>
        </div>
    );
};

export default Checkout;
