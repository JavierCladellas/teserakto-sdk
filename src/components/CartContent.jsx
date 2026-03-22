import { FaTimes } from "react-icons/fa";
import CartItemRow from "./CartItemRow";

const CartContent = ({ products, globalCustomization, cartCustomization, deviceSettings, onClose, onRemoveItem, checkoutUrl }) => {

    const subtotal = products.reduce((sum, p) => sum + Number(p?.price ?? 0), 0);

    return (
        <div className="flex flex-col py-4" style={{
            backgroundColor: globalCustomization?.surfaceColor,
            fontFamily: globalCustomization?.fontFamily 
        }}>
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ 
                borderColor: globalCustomization?.surfaceColor,
             }}>
                <h2 className="font-semibold" style={{ 
                    color: globalCustomization?.textColor,
                    fontSize: deviceSettings?.titleFontSize
                }}>{cartCustomization?.titleText}</h2>
                <button type="button" onClick={onClose} className="border-none bg-transparent">
                    <FaTimes className="text-gray-400" size={14} />
                </button>
            </div>
            <div className="px-4">
                {products.map(product => (
                    <CartItemRow key={product.id} product={product} globalCustomization={globalCustomization} cartCustomization={cartCustomization} deviceSettings={deviceSettings} onRemoveItem={onRemoveItem} />
                ))}
            </div>
            <div className="px-4 pt-3 pb-4 border-t" style={{ 
                borderColor: globalCustomization?.surfaceColor,
             }}>
                <div className="flex justify-between items-center mb-3">
                    <span className="font-medium text-gray-600" style={{ 
                        fontSize: deviceSettings?.subtotalLabelFontSize
                    }}>
                        {cartCustomization?.subtotalLabelText}
                    </span>
                    <span className="font-bold" style={{
                        color: globalCustomization?.accentColor,
                        fontSize: deviceSettings?.priceFontSize 
                    }}>${subtotal.toFixed(2)}</span>
                </div>
                <button
                    type="button"
                    className="w-full py-2 rounded-md font-semibold transition-opacity hover:opacity-90 border-none"
                    style={{ 
                        backgroundColor: globalCustomization?.primaryBtnColor,
                        color: globalCustomization?.primaryBtnTextColor, 
                        fontSize: deviceSettings?.buttonFontSize
                    }}
                    onClick={() => (checkoutUrl && (window.location.href = checkoutUrl))}
                >
                    {cartCustomization?.checkoutButtonText}
                </button>
            </div>
        </div>
    );
};

export default CartContent;