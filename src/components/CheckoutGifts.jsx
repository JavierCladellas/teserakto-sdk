import { TextField } from "./TextField";

const CheckoutGifts = ({ deviceSettings }) => {

    return (
        <section className="mb-8">
            <h2 className="font-semibold mb-4 text-lg" style={{ fontSize: deviceSettings.titleFontSize }}>{deviceSettings.giftInfoHeading}</h2>
            <div className="grid grid-cols-1 gap-4">
                <TextField
                    label={deviceSettings.giftRecipientNameLabel }
                    placeholder={deviceSettings.giftRecipientNamePlaceholder}
                    style={{ fontSize: deviceSettings.formFieldFontSize }}
                />
            </div>
            <div className={`grid gap-4 mt-4 grid-cols-1 md:grid-cols-1 sm:grid-cols-2`}> 
                <TextField
                    label={deviceSettings.giftRecipientEmailLabel }
                    placeholder={deviceSettings.giftRecipientEmailPlaceholder }
                    style={{ fontSize: deviceSettings.formFieldFontSize }}
                />
                <TextField
                    label={deviceSettings.giftRecipientPhoneLabel }
                    placeholder={deviceSettings.giftRecipientPhonePlaceholder}
                    style={{ fontSize: deviceSettings.formFieldFontSize }}
                />
            </div>
            <div className="grid grid-cols-1 gap-4 mt-4">
                <TextField
                    label={deviceSettings.giftPersonalMessageLabel }
                    placeholder={deviceSettings.giftPersonalMessagePlaceholder }
                    type="textarea"
                    style={{ fontSize: deviceSettings.formFieldFontSize }}
                />
            </div>
        </section>
    );
}

export default CheckoutGifts;