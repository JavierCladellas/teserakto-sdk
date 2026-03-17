import { TextField } from "./TextField";

const CheckoutGifts = ({ globalCustomization, checkoutCustomization, deviceSettings }) => {

    return (
        <section className="mb-8">
            <input type="hidden" name="is_alt_recipient" value="true" />
            <h2 className="font-semibold mb-4 text-lg" style={{ fontSize: deviceSettings.titleFontSize }}>{checkoutCustomization.giftInfoHeading}</h2>
            <div className="grid grid-cols-1 gap-4">
                <TextField
                    name="alt_recipient_name"
                    label={checkoutCustomization.giftRecipientNameLabel }
                    placeholder={checkoutCustomization.giftRecipientNamePlaceholder}
                    style={{ fontSize: deviceSettings.formFieldFontSize }}
                />
            </div>
            <div className={`grid gap-4 mt-4 grid-cols-1 md:grid-cols-1 sm:grid-cols-2`}> 
                <TextField
                    name="alt_recipient_email"
                    label={checkoutCustomization.giftRecipientEmailLabel }
                    placeholder={checkoutCustomization.giftRecipientEmailPlaceholder }
                    style={{ fontSize: deviceSettings.formFieldFontSize }}
                />
                <TextField
                    name="alt_recipient_phone"
                    label={checkoutCustomization.giftRecipientPhoneLabel }
                    placeholder={checkoutCustomization.giftRecipientPhonePlaceholder}
                    style={{ fontSize: deviceSettings.formFieldFontSize }}
                />
            </div>
            <div className="grid grid-cols-1 gap-4 mt-4">
                <TextField
                    name="personal_message"
                    label={checkoutCustomization.giftPersonalMessageLabel }
                    placeholder={checkoutCustomization.giftPersonalMessagePlaceholder }
                    type="textarea"
                    style={{ fontSize: deviceSettings.formFieldFontSize }}
                />
            </div>
        </section>
    );
}

export default CheckoutGifts;