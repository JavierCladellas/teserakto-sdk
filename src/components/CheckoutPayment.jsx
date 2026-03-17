import { useState } from "react";
import { TextField } from "./TextField";

const CheckoutPayment = ({ globalCustomization, checkoutCustomization, deviceSettings, formData, setFormData }) => {
    const [paymentMethod, setPaymentMethod] = useState(formData.payment_method || "card");
    
    return (
        <section className="mb-8">
            <h2
                className="font-semibold mb-4 text-lg"
                style={{ fontSize: deviceSettings.titleFontSize }}
            >{checkoutCustomization.paymentHeading}</h2>
            <div className="mb-4 flex gap-4">
                {checkoutCustomization.allowBankTransfer !== false && (
                    <>
                        <button
                            type="button"
                            className={`px-4 py-2 rounded ${paymentMethod === 'card' ? 'text-white' : 'bg-gray-200 text-gray-700'}`}
                            style={{
                                backgroundColor: paymentMethod === 'card' ? checkoutCustomization.switchColor : '',
                            }}
                            onClick={() =>{
                                setPaymentMethod('card');
                                setFormData({ ...formData, payment_method: 'card' });
                            }}
                        >
                            {checkoutCustomization.cardSwitchLabel}
                        </button>
                        <button
                            type="button"
                            className={`px-4 py-2 rounded ${paymentMethod === 'bank' ? 'text-white' : 'bg-gray-200 text-gray-700'}`}
                            style={{
                                backgroundColor: paymentMethod === 'bank' ? checkoutCustomization.switchColor : '',
                            }}
                            onClick={() => {
                                setPaymentMethod('bank');
                                setFormData({ ...formData, payment_method: 'bank' });
                            }}
                        >
                            {checkoutCustomization.bankTransferSwitchLabel}
                        </button>
                    </>
                )}
            </div>
            {paymentMethod === 'card' && (
                <div
                    className="bg-gradient-to-br p-6 rounded-xl shadow-md flex flex-col gap-4 max-w-md mx-auto"
                    style={{
                        backgroundImage: `linear-gradient(135deg, ${checkoutCustomization.paymentCardGradientBase } 0%, #ffffff 60%, #e0e7ff 100%)`
                    }}
                >
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-gray-700 mb-1">{checkoutCustomization.cardNumberLabel}</label>
                        <TextField 
                            placeholder={checkoutCustomization.cardNumberPlaceholder}
                            className="w-full text-lg tracking-widest bg-white rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                            style={{ fontSize: deviceSettings.formFieldFontSize }}
                            value={ formData.card_number }
                            onChange={(e) => setFormData({ ...formData, card_number: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-xs font-semibold text-gray-700 mb-1">{checkoutCustomization.cardExpiryLabel}</label>
                            <TextField 
                                placeholder={checkoutCustomization.cardExpiryPlaceholder}
                                className="w-full bg-white rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                                style={{ fontSize: deviceSettings.formFieldFontSize }}
                                value={ formData.card_expiry }
                                onChange={(e) => setFormData({ ...formData, card_expiry: e.target.value })}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs font-semibold text-gray-700 mb-1">{checkoutCustomization.cardCvcLabel}</label>
                            <TextField 
                                placeholder={checkoutCustomization.cardCvcPlaceholder}
                                className="w-full bg-white rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                                style={{ fontSize: deviceSettings.formFieldFontSize }}
                                value={ formData.card_cvc }
                                onChange={(e) => setFormData({ ...formData, card_cvc: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-gray-700 mb-1">{checkoutCustomization.cardNameLabel}</label>
                        <TextField 
                            placeholder={checkoutCustomization.cardNamePlaceholder}
                            className="w-full bg-white rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                            style={{ fontSize: deviceSettings.formFieldFontSize }}
                            value={ formData.card_name }
                            onChange={(e) => setFormData({ ...formData, card_name: e.target.value })}
                        />
                    </div>
                </div>
            )}
            {paymentMethod === 'bank' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2 text-blue-700 text-sm shadow-sm">
                    <svg className="inline mr-2" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                    {checkoutCustomization.bankTransferInstructionsText}
                </div>
            )}
        </section>
    );
};

export default CheckoutPayment;