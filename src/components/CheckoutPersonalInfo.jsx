import { TextField } from "./TextField";


const CheckoutPersonalInfo = ({ globalCustomization, checkoutCustomization, deviceSettings }) => {

    return (
        <section className="mb-8">
            <h2
                className="font-semibold mb-4 text-lg"
                style={{ fontSize: deviceSettings.titleFontSize  }}
            >{ checkoutCustomization.personalInfoHeading }</h2>
            <div className="grid grid-cols-2 gap-4">
                <TextField
                    name="firstname"
                    label={ checkoutCustomization.personalFirstNameLabel }
                    placeholder={checkoutCustomization.personalFirstNamePlaceholder}
                    style={{ fontSize: deviceSettings.formFieldFontSize }}
                />
                <TextField
                    name="lastname"
                    label={ checkoutCustomization.personalLastNameLabel }
                    placeholder={checkoutCustomization.personalLastNamePlaceholder}
                    style={{ fontSize: deviceSettings.formFieldFontSize }}
                />
            </div>
            <div className="grid gap-4 mt-4 grid-cols-1 sm:grid-cols-2">
                <TextField
                    type="email"
                    name="email"
                    label={checkoutCustomization.personalEmailLabel}
                    placeholder={checkoutCustomization.personalEmailPlaceholder}
                    style={{ fontSize: deviceSettings.formFieldFontSize }}
                />
                <TextField
                    type="tel"
                    name="telephone"
                    label={checkoutCustomization.personalPhoneLabel }
                    placeholder={checkoutCustomization.personalPhonePlaceholder }
                    style={{ fontSize: deviceSettings.formFieldFontSize }}
                />
            </div>
            <div className="grid grid-cols-1 gap-4 mt-4">
                <TextField
                    name="company_name"
                    label={checkoutCustomization.personalCompanyLabel}
                    placeholder={checkoutCustomization.personalCompanyPlaceholder }
                    style={{ fontSize: deviceSettings.formFieldFontSize }}
                />
            </div>
        </section>
    );
}

export default CheckoutPersonalInfo;