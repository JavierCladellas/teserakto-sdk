import { useState } from "react";
import { TextField } from "./TextField";
import SearchableDropdown from "./SearchableDropdown";
import DateField from "./DatePicker";
import countryList from "react-select-country-list";


const CheckoutDelivery = ({ settings, deviceSettings }) => {
    const [deliveryMethod, setDeliveryMethod] = useState("delivery");
    const [deliveryCountry, setDeliveryCountry] = useState("");

    const [date, setDate] = useState(new Date());
    const [timeSlot, setTimeSlot] = useState("morning");
    
    return (
        <section className="mb-8">
            <h2 className="font-semibold mb-4 text-lg" style={{ fontSize: deviceSettings.titleFontSize }}>
                {settings.deliveryHeading}
            </h2>
            <div className="mb-4 flex gap-4">
                <input type="hidden" name="delivery_type" value={deliveryMethod} />
                {settings.allowPickups === true && (
                    <>
                        <button
                            type="button"
                            className={`px-4 py-2 rounded ${deliveryMethod === 'delivery' ? 'text-white' : 'bg-gray-200 text-gray-700'}`}
                            style={{
                                backgroundColor: deliveryMethod === 'delivery' ? settings.switchColor : '',
                            }}
                            onClick={() => setDeliveryMethod('delivery')}
                        >
                            {settings.deliverySwitchLabel}
                        </button>
                        <button
                            type="button"
                            className={`px-4 py-2 rounded ${deliveryMethod === 'pickup' ? 'text-white' : 'bg-gray-200 text-gray-700'}`}
                            style={{
                                backgroundColor: deliveryMethod === 'pickup' ? settings.switchColor : '',
                            }}
                            onClick={() => setDeliveryMethod('pickup')}
                        >
                            {settings.pickupSwitchLabel}
                        </button>
                    </>
                )}
            </div>
            {deliveryMethod === 'delivery' && (
                <>
                <div className="grid grid-cols-1 gap-4 mb-4">
                    <TextField
                        name="delivery_address"
                        label={settings.deliveryAddressLabel }
                        placeholder={settings.deliveryAddressPlaceholder }
                        style={{ fontSize: deviceSettings.formFieldFontSize }}
                    />
                </div>
                <div className={`grid gap-4 mb-4 'grid-cols-1'md:grid-cols-1 sm:grid-cols-3`}> 
                    <TextField
                        name="delivery_city"
                        label={settings.deliveryCityLabel }
                        placeholder={settings.deliveryCityPlaceholder }
                        style={{ fontSize: deviceSettings.formFieldFontSize }}
                    />
                    <TextField
                        name="delivery_postal_code"
                        label={settings.deliveryPostalCodeLabel }
                        placeholder={settings.deliveryPostalCodePlaceholder }
                        style={{ fontSize: deviceSettings.formFieldFontSize }}
                    />
                    <SearchableDropdown
                        name="delivery_country"
                        label={settings.deliveryCountryLabel }
                        placeholder={settings.deliveryCountryPlaceholder }
                        options={countryList().getData()}
                        style={{ fontSize: deviceSettings.formFieldFontSize }}
                        value={deliveryCountry}
                        onChange={e => setDeliveryCountry(e.target.value)}
                    />
                </div>
                {settings.allowDeliveryDate !== false && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <DateField name="prefered_delivery_date" value={date} onChange={setDate} label={settings.deliveryDeliveryDateLabel} placeholder="DD-MM-YYYY" style={{ fontSize: deviceSettings.formFieldFontSize }} />
                        
                        <SearchableDropdown name="prefered_delivery_time_slot" label={settings.deliveryTimeSlotLabel}  value={timeSlot} onChange={e => setTimeSlot(e.target.value)} options={[
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
                    label={settings.deliveryNotesLabel }
                    placeholder={settings.deliveryNotesPlaceholder}
                    type="textarea"
                    style={{ fontSize: deviceSettings.formFieldFontSize }}
                />
            </div>
        </section>
    );
}

export default CheckoutDelivery;