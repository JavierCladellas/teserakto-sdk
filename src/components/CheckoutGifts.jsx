import { TextField } from "./TextField";

const CheckoutGifts = ({ globalCustomization, checkoutCustomization, deviceSettings, formData, setFormData }) => {

    return (
        <section className="mb-8">
            <h2 className="font-semibold mb-4 text-lg" style={{ fontSize: deviceSettings.titleFontSize }}>{checkoutCustomization.giftInfoHeading}</h2>
            <div className="grid grid-cols-1 gap-4">
                <TextField
                    label={checkoutCustomization.giftRecipientNameLabel }
                    placeholder={checkoutCustomization.giftRecipientNamePlaceholder}
                    style={{ fontSize: deviceSettings.formFieldFontSize }}
                    value={formData.alt_recipient_name}
                    onChange={(e) => setFormData({ ...formData, alt_recipient_name: e.target.value })}
                />
            </div>
            <div className={`grid gap-4 mt-4 grid-cols-1 md:grid-cols-1 sm:grid-cols-2`}> 
                <TextField
                    label={checkoutCustomization.giftRecipientEmailLabel }
                    placeholder={checkoutCustomization.giftRecipientEmailPlaceholder }
                    style={{ fontSize: deviceSettings.formFieldFontSize }}
                    value={formData.alt_recipient_email}
                    onChange={(e) => setFormData({ ...formData, alt_recipient_email: e.target.value })}
                />
                <TextField
                    label={checkoutCustomization.giftRecipientPhoneLabel }
                    placeholder={checkoutCustomization.giftRecipientPhonePlaceholder}
                    style={{ fontSize: deviceSettings.formFieldFontSize }}
                    value={formData.alt_recipient_phone}
                    onChange={(e) => setFormData({ ...formData, alt_recipient_phone: e.target.value })}
                />
            </div>
            <div className="grid grid-cols-1 gap-4 mt-4">
                <TextField
                    label={checkoutCustomization.giftPersonalMessageLabel }
                    placeholder={checkoutCustomization.giftPersonalMessagePlaceholder }
                    type="textarea"
                    style={{ fontSize: deviceSettings.formFieldFontSize }}
                    value={formData.personal_message}
                    onChange={(e) => setFormData({ ...formData, personal_message: e.target.value })}
                />
            </div>
        </section>
    );
}

export default CheckoutGifts;