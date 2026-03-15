import { useState } from "react";
import { TextField } from "./TextField";

const CheckoutPayment = ({ settings, deviceSettings }) => {
    const [paymentMethod, setPaymentMethod] = useState("card");
    
    return (
        <section className="mb-8">
            <h2
                className="font-semibold mb-4 text-lg"
                style={{ fontSize: deviceSettings.titleFontSize }}
            >{settings.paymentHeading}</h2>
            <div className="mb-4 flex gap-4">
                <input type="hidden" name="payment_method" value={paymentMethod} />
                {settings.allowBankTransfer !== false && (
                    <>
                        <button
                            type="button"
                            className={`px-4 py-2 rounded ${paymentMethod === 'card' ? 'text-white' : 'bg-gray-200 text-gray-700'}`}
                            style={{
                                backgroundColor: paymentMethod === 'card' ? settings.switchColor : '',
                            }}
                            onClick={() => setPaymentMethod('card')}
                        >
                            {settings.cardSwitchLabel}
                        </button>
                        <button
                            type="button"
                            className={`px-4 py-2 rounded ${paymentMethod === 'bank' ? 'text-white' : 'bg-gray-200 text-gray-700'}`}
                            style={{
                                backgroundColor: paymentMethod === 'bank' ? settings.switchColor : '',
                            }}
                            onClick={() => setPaymentMethod('bank')}
                        >
                            {settings.bankTransferSwitchLabel}
                        </button>
                    </>
                )}
            </div>
            {paymentMethod === 'card' && (
                <div
                    className="bg-gradient-to-br p-6 rounded-xl shadow-md flex flex-col gap-4 max-w-md mx-auto"
                    style={{
                        backgroundImage: `linear-gradient(135deg, ${settings.paymentCardGradientBase } 0%, #ffffff 60%, #e0e7ff 100%)`
                    }}
                >
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-gray-700 mb-1">{settings.cardNumberLabel}</label>
                        <TextField placeholder={settings.cardNumberPlaceholder} className="w-full text-lg tracking-widest bg-white rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200" style={{ fontSize: deviceSettings.formFieldFontSize }} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-xs font-semibold text-gray-700 mb-1">{settings.cardExpiryLabel}</label>
                            <TextField placeholder={settings.cardExpiryPlaceholder} className="w-full bg-white rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200" style={{ fontSize: deviceSettings.formFieldFontSize }} />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs font-semibold text-gray-700 mb-1">{settings.cardCvcLabel}</label>
                            <TextField placeholder={settings.cardCvcPlaceholder} className="w-full bg-white rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200" style={{ fontSize: deviceSettings.formFieldFontSize }} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-gray-700 mb-1">{settings.cardNameLabel}</label>
                        <TextField placeholder={settings.cardNamePlaceholder} className="w-full bg-white rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200" style={{ fontSize: deviceSettings.formFieldFontSize }} />
                    </div>
                </div>
            )}
            {paymentMethod === 'bank' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2 text-blue-700 text-sm shadow-sm">
                    <svg className="inline mr-2" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                    {settings.bankTransferInstructionsText}
                </div>
            )}
        </section>
    );
};

export default CheckoutPayment;