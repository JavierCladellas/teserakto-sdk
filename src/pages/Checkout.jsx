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

const Checkout = ({ globalCustomization, checkoutCustomization, device = null, cartLocalStorageKey = "teserakto_cart", handleSubmit = null, validate = true, endpoint = null, shippingSettings = {}}) => {
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
        const sectionErrors = validateField(activeTab, formData[activeTab], formData);

        if (validate && sectionErrors) {
            setErrors((prev) => ({ ...prev, [activeTab]: sectionErrors }));
            return;
        }

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
        gift: {
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
    const validateField = (section, values, allData, forSubmit = false) => {
        const errors = {};

        if (section === "personal") {
            if (!values.firstname?.trim()) errors.firstname = "First name is required";
            if (!values.lastname?.trim()) errors.lastname = "Last name is required";

            if (!values.email?.trim()) {
                errors.email = "Email is required";
            } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
                errors.email = "Invalid email";
            }

            if (values.telephone && !/^[0-9+()\s-]+$/.test(values.telephone)) {
                errors.telephone = "Invalid phone number";
            }
        }

        if (section === "delivery") {
            if (values.delivery_type==="delivery" && !values.delivery_address?.trim()) errors.delivery_address = "Address required";
            if (values.delivery_type==="delivery" && !values.delivery_city?.trim()) errors.delivery_city = "City required";
            if (values.delivery_type==="delivery" && !values.delivery_postal_code?.trim()) errors.delivery_postal_code = "Postal code required";
        }

        if (section === "gift" && checkoutCustomization.enableGiftStep) {
            if (!values.alt_recipient_name?.trim()) {
                errors.alt_recipient_name = "Recipient name required";
            }
        }

        if (section === "payment" && values.payment_method === "card") {
            if (!values.card_name?.trim()) errors.card_name = "Cardholder name required";

            if (!values.card_number?.trim()) {
                errors.card_number = "Card number required";
            } else if (!/^\d{16}$/.test(values.card_number.replace(/\s/g, ""))) {
                errors.card_number = "Invalid card number";
            }

            if (!values.card_expiry?.trim()) errors.card_expiry = "Expiry required";
            if (!values.card_cvc?.trim()) errors.card_cvc = "CVC required";
        }

        return Object.keys(errors).length > 0 ? errors : null;
    };

    const [formData, setFormData] = useState(inputDefaults);
    const [errors, setErrors] = useState({});

    const validateAll = (forSubmit = true) => {
        const newErrors = {};
        
        Object.keys(formData).forEach((section) => {
            const sectionErrors = validateField(section, formData[section], formData, forSubmit);
            if (sectionErrors) {
                newErrors[section] = sectionErrors;
            }
        });
        setErrors(newErrors);
        return newErrors;
    };

    const submitOrder = (e) => {
        e.preventDefault();
        if (activeTab !== "payment") {
            console.log("Place order prematurely fired")
            return 
        }

        const validationErrors = validateAll(true);
        if (Object.keys(validationErrors).length > 0) {
            return;
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


    const handleTabChange = (nextTab) => {
        const currentIndex = stepTabs.findIndex(tab => tab.key === activeTab);
        const nextIndex = stepTabs.findIndex(tab => tab.key === nextTab);

        // Allow going backwards freely
        if (nextIndex <= currentIndex) {
            setActiveTab(nextTab);
            return;
        }

        const sectionErrors = validateField(
            activeTab,
            formData[activeTab],
            formData
        );

        if (validate && sectionErrors) {
            setErrors(prev => ({ ...prev, [activeTab]: sectionErrors }));
            return; 
        }

        setActiveTab(nextTab);
    };


    const [shippingCost, setShippingCost] = useState(0);
    const [ availableCountries, setAvailableCountries] = useState([]);
    const [ availableCities, setAvailableCities] = useState([]);
    
    useEffect(() => {
        if (shippingSettings && formData.delivery) {
            setShippingCost(shippingSettings.base_rate || 0);
            let countries = [];
            let cities = [];
            if (!shippingSettings.ship_worldwide) {
                countries = shippingSettings.shipping_zones?.map((z) => z.countries).flat() || [];
                cities = shippingSettings.shipping_zones?.map((z) => z.cities).flat() || [];
            }
            setAvailableCountries(countries);
            setAvailableCities(cities);
        }
    },[shippingSettings]);


    //Get the shipping cost from the selected country + city

    useEffect(() => {
        if (shippingSettings && formData.delivery) {
            let cost = shippingSettings.base_rate || 0;
            const selectedCountry = formData.delivery.delivery_country;
            const selectedCity = formData.delivery.delivery_city;

            //Look in each shipping zone if the selected country or city is present and add the corresponding cost
            shippingSettings.shipping_zones?.forEach((zone) => {
                if (zone.countries?.includes(selectedCountry)){
                    if (zone.cities?.length > 0) {
                        if (zone.cities?.includes(selectedCity)) {
                            cost = zone.shipping_rate;
                        }
                    } else {
                        cost = zone.shipping_rate;
                    }
                }
            });

            setShippingCost(cost);
        }
    }, [formData.delivery, shippingSettings]);

    return (
        <div
            className="flex flex-col  p-6 md:p-6 min-h-[400px] w-full transition-all duration-300"
            style={{
                fontFamily: globalCustomization.fontFamily,
                color: globalCustomization.textColor,
            }}
        >
            <CheckoutTabs stepTabs={stepTabs} globalCustomization={globalCustomization} checkoutCustomization={checkoutCustomization} deviceSettings={deviceSettings} activeTab={activeTab} setActiveTab={handleTabChange} />

            <form onSubmit={submitOrder}
                className={`gap-6 ${ deviceSettings?.layoutMode === 'column' ? 'flex flex-col' : 'flex flex-col sm:flex-row' }`}
                action={endpoint || null}//For now teserakto doesnt handle payments.
            >
                <div className="flex-1 rounded-lg border border-gray-200 p-4" style={{ backgroundColor: globalCustomization.surfaceColor }}>
                    {activeTab === "personal" && (
                        <CheckoutPersonalInfo globalCustomization={globalCustomization} checkoutCustomization={checkoutCustomization} deviceSettings={deviceSettings} formData={formData.personal} setFormData={(personal) => setFormData({ ...formData, personal })}  errors={errors.personal} setErrors={(personalErrors) => setErrors({ ...errors, personal: personalErrors })} />
                    )}
                    {activeTab === "delivery" && (
                        <CheckoutDelivery globalCustomization={globalCustomization} checkoutCustomization={checkoutCustomization} deviceSettings={deviceSettings} activeDevice={activeDevice} formData={formData.delivery} setFormData={(delivery) => setFormData({ ...formData, delivery })} errors={errors.delivery} setErrors={(deliveryErrors) => setErrors({ ...errors, delivery: deliveryErrors })} availableCountries={availableCountries} availableCities={availableCities} />
                    )}
                    {/* Gift Info step is only rendered if enabled */}
                    {activeTab === "gift" && checkoutCustomization.enableGiftStep === true && (
                        <CheckoutGifts globalCustomization={globalCustomization} checkoutCustomization={checkoutCustomization} deviceSettings={deviceSettings} formData={formData.gift} setFormData={(gift) => setFormData({ ...formData, gift })} errors={errors.gift} setErrors={(giftsErrors) => setErrors({ ...errors, gift: giftsErrors })} />
                    )}
                    {activeTab === "payment" && (
                        <CheckoutPayment globalCustomization={globalCustomization} checkoutCustomization={checkoutCustomization} deviceSettings={deviceSettings} formData={formData.payment} setFormData={(payment) => setFormData({ ...formData, payment })} errors={errors.payment} setErrors={(paymentErrors) => setErrors({ ...errors, payment: paymentErrors })} />
                    )}

                </div>

                <CheckoutSummary globalCustomization={globalCustomization} checkoutCustomization={checkoutCustomization} deviceSettings={deviceSettings} activeTab={activeTab} goToNextStep={goToNextStep} cartLocalStorageKey={cartLocalStorageKey} shippingCost={shippingCost} />
            </form>
        </div>
    );
};

export default Checkout;
