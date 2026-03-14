import { FaTimes } from "react-icons/fa";
import CartItemRow from "./CartItemRow";

const CartContent = ({ products, cartCustomization, deviceSettings, onClose, onRemoveItem }) => {
    const {
        backgroundColor, titleColor, titleText,
        subtotalLabelText, checkoutButtonText, checkoutButtonColor,
        checkoutButtonTextColor, borderColor, itemPriceColor,
        fontFamily,
    } = cartCustomization;
    const titleFontSize  = deviceSettings.titleFontSize;
    const priceFontSize  = deviceSettings.priceFontSize;
    const subtotalLabelFontSize = deviceSettings.subtotalLabelFontSize;
    const buttonFontSize = deviceSettings.buttonFontSize;
    const showThumbnails = deviceSettings.showThumbnails;
    const subtotal = products.reduce((sum, p) => sum + Number(p.variants?.[0]?.price ?? 0), 0);

    return (
        <div className="flex flex-col" style={{ backgroundColor, fontFamily }}>
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor }}>
                <h2 className="font-semibold" style={{ color: titleColor, fontSize: titleFontSize }}>{titleText}</h2>
                <button type="button" onClick={onClose}>
                    <FaTimes className="text-gray-400" size={14} />
                </button>
            </div>
            <div className="px-4">
                {products.map(product => (
                    <CartItemRow key={product.id} product={product} cartCustomization={cartCustomization} deviceSettings={deviceSettings} showThumbnails={showThumbnails} onRemoveItem={onRemoveItem} />
                ))}
            </div>
            <div className="px-4 pt-3 pb-4 border-t" style={{ borderColor }}>
                <div className="flex justify-between items-center mb-3">
                    <span className="font-medium text-gray-600" style={{ fontSize: subtotalLabelFontSize }}>{subtotalLabelText}</span>
                    <span className="font-bold" style={{ color: itemPriceColor, fontSize: priceFontSize }}>${subtotal.toFixed(2)}</span>
                </div>
                <button
                    type="button"
                    className="w-full py-2.5 rounded-md font-semibold transition-opacity hover:opacity-90"
                    style={{ backgroundColor: checkoutButtonColor, color: checkoutButtonTextColor, fontSize: buttonFontSize }}
                >
                    {checkoutButtonText}
                </button>
            </div>
        </div>
    );
};

export default CartContent;