import { useState } from "react";
import { TextField } from "./TextField";
import SearchableDropdown from "./SearchableDropdown";
import DateField from "./DatePicker";
import countryList from "react-select-country-list";


const CheckoutDelivery = ({ globalCustomization, checkoutCustomization, deviceSettings, activeDevice }) => {
    const [deliveryMethod, setDeliveryMethod] = useState("delivery");
    const [deliveryCountry, setDeliveryCountry] = useState("");

    const [date, setDate] = useState(new Date());
    const [timeSlot, setTimeSlot] = useState("morning");
    
    return (
        <section className="mb-8">
            <h2 className="font-semibold mb-4 text-lg" style={{ fontSize: deviceSettings.titleFontSize }}>
                {checkoutCustomization.deliveryHeading}
            </h2>
            <div className="mb-4 flex gap-4">
                <input type="hidden" name="delivery_type" value={deliveryMethod} />
                {checkoutCustomization.allowPickups === true && (
                    <>
                        <button
                            type="button"
                            className={`px-4 py-2 rounded ${deliveryMethod === 'delivery' ? 'text-white' : 'bg-gray-200 text-gray-700'}`}
                            style={{
                                backgroundColor: deliveryMethod === 'delivery' ? checkoutCustomization.switchColor : '',
                            }}
                            onClick={() => setDeliveryMethod('delivery')}
                        >
                            {checkoutCustomization.deliverySwitchLabel}
                        </button>
                        <button
                            type="button"
                            className={`px-4 py-2 rounded ${deliveryMethod === 'pickup' ? 'text-white' : 'bg-gray-200 text-gray-700'}`}
                            style={{
                                backgroundColor: deliveryMethod === 'pickup' ? checkoutCustomization.switchColor : '',
                            }}
                            onClick={() => setDeliveryMethod('pickup')}
                        >
                            {checkoutCustomization.pickupSwitchLabel}
                        </button>
                    </>
                )}
            </div>
            {deliveryMethod === 'delivery' && (
                <>
                <div className="grid grid-cols-1 gap-4 mb-4">
                    <TextField
                        name="delivery_address"
                        label={checkoutCustomization.deliveryAddressLabel }
                        placeholder={checkoutCustomization.deliveryAddressPlaceholder }
                        style={{ fontSize: deviceSettings.formFieldFontSize }}
                    />
                </div>
                <div className={`grid ${activeDevice !== 'desktop' ? "grid-cols-1" : "grid-cols-3"} gap-4 mb-4`}> 
                    <TextField
                        name="delivery_city"
                        label={checkoutCustomization.deliveryCityLabel }
                        placeholder={checkoutCustomization.deliveryCityPlaceholder }
                        style={{ fontSize: deviceSettings.formFieldFontSize }}
                    />
                    <TextField
                        name="delivery_postal_code"
                        label={checkoutCustomization.deliveryPostalCodeLabel }
                        placeholder={checkoutCustomization.deliveryPostalCodePlaceholder }
                        style={{ fontSize: deviceSettings.formFieldFontSize }}
                    />
                    <SearchableDropdown
                        name="delivery_country"
                        label={checkoutCustomization.deliveryCountryLabel }
                        placeholder={checkoutCustomization.deliveryCountryPlaceholder }
                        options={countryList().getData()}
                        style={{ fontSize: deviceSettings.formFieldFontSize }}
                        value={deliveryCountry}
                        onChange={e => setDeliveryCountry(e.target.value)}
                    />
                </div>
                {checkoutCustomization.allowDeliveryDate !== false && (
                    <div className={`grid ${activeDevice !== 'desktop' ? "grid-cols-1" : "grid-cols-2"} gap-4 mb-4`}>
                        <DateField name="prefered_delivery_date" value={date} onChange={setDate} label={checkoutCustomization.deliveryDeliveryDateLabel} placeholder="DD-MM-YYYY" style={{ fontSize: deviceSettings.formFieldFontSize }} />
                        
                        <SearchableDropdown name="prefered_delivery_time_slot" label={checkoutCustomization.deliveryTimeSlotLabel}  value={timeSlot} onChange={e => setTimeSlot(e.target.value)} options={[
                            { label: "Morning (9AM-12PM)", value: "morning" },
                            { label: "Afternoon (12PM-5PM)", value: "afternoon" },
                            { label: "Evening (5PM-8PM)", value: "evening" },
                        ]} style={{ fontSize: deviceSettings.formFieldFontSize }} />
                    </div>
                )}
                </>
            )}
            <div className="grid grid-cols-1 gap-4">
                <TextField
                    name="delivery_instructions" 
                    label={checkoutCustomization.deliveryNotesLabel }
                    placeholder={checkoutCustomization.deliveryNotesPlaceholder}
                    type="textarea"
                    style={{ fontSize: deviceSettings.formFieldFontSize }}
                />
            </div>
        </section>
    );
}

export default CheckoutDelivery;