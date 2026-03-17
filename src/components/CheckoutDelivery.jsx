import { useState } from "react";
import { TextField } from "./TextField";
import SearchableDropdown from "./SearchableDropdown";
import DateField from "./DatePicker";
import countryList from "react-select-country-list";


const CheckoutDelivery = ({ globalCustomization, checkoutCustomization, deviceSettings, activeDevice, formData, setFormData, errors, setErrors }) => {
    const [deliveryMethod, setDeliveryMethod] = useState(formData.delivery_type || "delivery");
    const [deliveryCountry, setDeliveryCountry] = useState(formData.delivery_country || "");

    const [date, setDate] = useState(formData.prefered_delivery_date || new Date());
    const [timeSlot, setTimeSlot] = useState( formData.prefered_delivery_time_slot || "morning" );
    
    return (
        <section className="mb-8">
            <h2 className="font-semibold mb-4 text-lg" style={{ fontSize: deviceSettings.titleFontSize }}>
                {checkoutCustomization.deliveryHeading}
            </h2>
            <div className="mb-4 flex gap-4">
                <input type="hidden"  value={deliveryMethod} />
                {checkoutCustomization.allowPickups === true && (
                    <>
                        <button
                            type="button"
                            className={`px-4 py-2 rounded ${deliveryMethod === 'delivery' ? 'text-white' : 'bg-gray-200 text-gray-700'}`}
                            style={{
                                backgroundColor: deliveryMethod === 'delivery' ? checkoutCustomization.switchColor : '',
                            }}
                            onClick={() => {
                                setDeliveryMethod('delivery');
                                setFormData({ ...formData, delivery_type: 'delivery' });
                            }}
                        >
                            {checkoutCustomization.deliverySwitchLabel}
                        </button>
                        <button
                            type="button"
                            className={`px-4 py-2 rounded ${deliveryMethod === 'pickup' ? 'text-white' : 'bg-gray-200 text-gray-700'}`}
                            style={{
                                backgroundColor: deliveryMethod === 'pickup' ? checkoutCustomization.switchColor : '',
                            }}
                            onClick={() => {
                                setDeliveryMethod('pickup');
                                setFormData({ ...formData, 
                                    delivery_type: 'pickup',
                                    delivery_address: "",
                                    delivery_city: "",
                                    delivery_postal_code: "",
                                    prefered_delivery_date: "",
                                    prefered_delivery_time_slot: "",
                                    delivery_instructions: "",
                                });
                            }}
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
                        label={checkoutCustomization.deliveryAddressLabel }
                        placeholder={checkoutCustomization.deliveryAddressPlaceholder }
                        style={{ fontSize: deviceSettings.formFieldFontSize }}
                        value={formData.delivery_address}
                        onChange={(e) => {
                            setFormData({ ...formData, delivery_address: e.target.value });
                            setErrors(prev => ({ ...prev, delivery_address: null }));
                        }}
                        externalError={errors?.delivery_address}
                    />
                </div>
                <div className={`grid ${activeDevice !== 'desktop' ? "grid-cols-1" : "grid-cols-3"} gap-4 mb-4`}> 
                    <TextField
                        label={checkoutCustomization.deliveryCityLabel }
                        placeholder={checkoutCustomization.deliveryCityPlaceholder }
                        style={{ fontSize: deviceSettings.formFieldFontSize }}
                        value={formData.delivery_city}
                        externalError={errors?.delivery_city}
                        onChange={(e) => {
                            setFormData({ ...formData, delivery_city: e.target.value });
                            setErrors(prev => ({ ...prev, delivery_city: null }));
                        }}
                    />
                    <TextField
                        label={checkoutCustomization.deliveryPostalCodeLabel }
                        placeholder={checkoutCustomization.deliveryPostalCodePlaceholder }
                        style={{ fontSize: deviceSettings.formFieldFontSize }}
                        value={formData.delivery_postal_code}
                        externalError={errors?.delivery_postal_code}
                        onChange={(e) => {
                            setFormData({ ...formData, delivery_postal_code: e.target.value });
                            setErrors(prev => ({ ...prev, delivery_postal_code: null }));
                        }}
                    />
                    <SearchableDropdown
                        label={checkoutCustomization.deliveryCountryLabel }
                        placeholder={checkoutCustomization.deliveryCountryPlaceholder }
                        options={countryList().getData()}
                        style={{ fontSize: deviceSettings.formFieldFontSize }}
                        value={deliveryCountry}
                        onChange={e => {
                            setDeliveryCountry(e.target.value)
                            setFormData({ ...formData, delivery_country: e.target.value });
                        }}
                    />
                </div>
                {checkoutCustomization.allowDeliveryDate !== false && (
                    <div className={`grid ${activeDevice !== 'desktop' ? "grid-cols-1" : "grid-cols-2"} gap-4 mb-4`}>
                        <DateField
                            value={date}
                            onChange={e => {
                                setDate(e);
                                setFormData({ ...formData, prefered_delivery_date: e });
                            }}
                            label={checkoutCustomization.deliveryDeliveryDateLabel}
                            placeholder="DD-MM-YYYY"
                            style={{ 
                                fontSize: deviceSettings.formFieldFontSize
                            }} />
                        
                        <SearchableDropdown
                        label={checkoutCustomization.deliveryTimeSlotLabel}
                        value={timeSlot}
                        onChange={e => {
                            setTimeSlot(e.target.value);
                            setFormData({ ...formData, prefered_delivery_time_slot: e.target.value });
                        }}
                        options={[
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