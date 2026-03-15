import { TextField } from "./TextField";


const CheckoutPersonalInfo = ({ settings, deviceSettings }) => {

    return (
        <section className="mb-8">
            <h2
                className="font-semibold mb-4 text-lg"
                style={{ fontSize: deviceSettings.titleFontSize  }}
            >{ settings.personalInfoHeading }</h2>
            <div className="grid grid-cols-2 gap-4">
                <TextField
                    name="firstname"
                    label={ settings.personalFirstNameLabel }
                    placeholder={settings.personalFirstNamePlaceholder}
                    style={{ fontSize: settings.formFieldFontSize }}
                />
                <TextField
                    name="lastname"
                    label={ settings.personalLastNameLabel }
                    placeholder={settings.personalLastNamePlaceholder}
                    style={{ fontSize: settings.formFieldFontSize }}
                />
            </div>
            <div className="grid gap-4 mt-4 grid-cols-1 sm:grid-cols-2">
                <TextField
                    type="email"
                    name="email"
                    label={settings.personalEmailLabel}
                    placeholder={settings.personalEmailPlaceholder}
                    style={{ fontSize: settings.formFieldFontSize }}
                />
                <TextField
                    type="tel"
                    name="telephone"
                    label={settings.personalPhoneLabel }
                    placeholder={settings.personalPhonePlaceholder }
                    style={{ fontSize: settings.formFieldFontSize }}
                />
            </div>
            <div className="grid grid-cols-1 gap-4 mt-4">
                <TextField
                    name="company_name"
                    label={settings.personalCompanyLabel}
                    placeholder={settings.personalCompanyPlaceholder }
                    style={{ fontSize: settings.formFieldFontSize }}
                />
            </div>
        </section>
    );
}

export default CheckoutPersonalInfo;