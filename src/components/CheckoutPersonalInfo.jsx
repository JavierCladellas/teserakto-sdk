import { TextField } from "./TextField";


const CheckoutPersonalInfo = ({ globalCustomization, checkoutCustomization, deviceSettings, formData, setFormData, errors, setErrors }) => {

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
                    externalError={errors?.firstname}
                    value={formData.firstname}
                    onChange={(e) => {
                        setFormData({ ...formData, firstname: e.target.value });
                        setErrors(prev => ({ ...prev, firstname: null }));
                    }}
                />
                <TextField
                    label={ checkoutCustomization.personalLastNameLabel }
                    placeholder={checkoutCustomization.personalLastNamePlaceholder}
                    style={{ fontSize: deviceSettings.formFieldFontSize }}
                    externalError={errors?.lastname}
                    value={formData.lastname}
                    onChange={(e) => {
                        setFormData({ ...formData, lastname: e.target.value });
                        setErrors(prev => ({ ...prev, lastname: null }));
                    }}
                />
            </div>
            <div className="grid gap-4 mt-4 grid-cols-1 sm:grid-cols-2">
                <TextField
                    type="email"
                    label={checkoutCustomization.personalEmailLabel}
                    placeholder={checkoutCustomization.personalEmailPlaceholder}
                    style={{ fontSize: deviceSettings.formFieldFontSize }}
                    externalError={errors?.email}
                    value={formData.email}
                    onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        setErrors(prev => ({ ...prev, email: null }));
                    }}
                />
                <TextField
                    type="tel"
                    label={checkoutCustomization.personalPhoneLabel }
                    placeholder={checkoutCustomization.personalPhonePlaceholder }
                    style={{ fontSize: deviceSettings.formFieldFontSize }}
                    externalError={errors?.telephone}
                    value={formData.telephone}
                    onChange={(e) => {
                        setFormData({ ...formData, telephone: e.target.value });
                        setErrors(prev => ({ ...prev, telephone: null }));
                    }}
                />
            </div>
            <div className="grid grid-cols-1 gap-4 mt-4">
                <TextField
                    label={checkoutCustomization.personalCompanyLabel}
                    placeholder={checkoutCustomization.personalCompanyPlaceholder }
                    style={{ fontSize: deviceSettings.formFieldFontSize }}
                    externalError={errors?.company_name}
                    value={formData.company_name}
                    onChange={(e) => {
                        setFormData({ ...formData, company_name: e.target.value });
                        setErrors(prev => ({ ...prev, company_name: null }));
                    }}
                />
            </div>
        </section>
    );
}

export default CheckoutPersonalInfo;