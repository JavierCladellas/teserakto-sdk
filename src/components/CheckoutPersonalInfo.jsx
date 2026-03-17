import { TextField } from "./TextField";


const CheckoutPersonalInfo = ({ globalCustomization, checkoutCustomization, deviceSettings, formData, setFormData }) => {

    return (
        <section className="mb-8">
            <h2
                className="font-semibold mb-4 text-lg"
                style={{ fontSize: deviceSettings.titleFontSize  }}
            >{ checkoutCustomization.personalInfoHeading }</h2>
            <div className="grid grid-cols-2 gap-4">
                <TextField
                    label={ checkoutCustomization.personalFirstNameLabel }
                    placeholder={checkoutCustomization.personalFirstNamePlaceholder}
                    style={{ fontSize: deviceSettings.formFieldFontSize }}
                    onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                />
                <TextField
                    label={ checkoutCustomization.personalLastNameLabel }
                    placeholder={checkoutCustomization.personalLastNamePlaceholder}
                    style={{ fontSize: deviceSettings.formFieldFontSize }}
                    onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                />
            </div>
            <div className="grid gap-4 mt-4 grid-cols-1 sm:grid-cols-2">
                <TextField
                    type="email"
                    label={checkoutCustomization.personalEmailLabel}
                    placeholder={checkoutCustomization.personalEmailPlaceholder}
                    style={{ fontSize: deviceSettings.formFieldFontSize }}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <TextField
                    type="tel"
                    label={checkoutCustomization.personalPhoneLabel }
                    placeholder={checkoutCustomization.personalPhonePlaceholder }
                    style={{ fontSize: deviceSettings.formFieldFontSize }}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                />
            </div>
            <div className="grid grid-cols-1 gap-4 mt-4">
                <TextField
                    label={checkoutCustomization.personalCompanyLabel}
                    placeholder={checkoutCustomization.personalCompanyPlaceholder }
                    style={{ fontSize: deviceSettings.formFieldFontSize }}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                />
            </div>
        </section>
    );
}

export default CheckoutPersonalInfo;