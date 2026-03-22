import { FaTrash } from "react-icons/fa";
import ProductThumbnail from "./ProductThumbnail";


const CartItemRow = ({ product, globalCustomization, cartCustomization, deviceSettings, onRemoveItem }) => {

    const price = product.price;
    
    return (
        <div className="flex items-start gap-3 py-3" style={{
            borderBottomWidth: 1,
            borderBottomStyle: 'solid',
            borderBottomColor: globalCustomization?.surfaceColor
        }}>
            {deviceSettings?.showThumbnails && <ProductThumbnail product={product} size={deviceSettings?.thumbnailSize} />}
            <div className="flex-1 min-w-0">
                <p className="font-medium truncate" style={{
                    color: globalCustomization?.textColor,
                    fontSize: deviceSettings?.productNameFontSize
                }}>{product.name}</p>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-400" style={{ fontSize: deviceSettings?.quantityFontSize }}>Qty: {product.quantity}</span>
                    <span className="font-semibold" style={{ color: globalCustomization?.accentColor, fontSize: deviceSettings?.priceFontSize }}>
                        ${Number(price).toFixed(2)}
                    </span>
                </div>
            </div>
            <button className="mt-0.5 text-gray-400 hover:text-red-500 flex items-center gap-1 flex-shrink-0 border-none bg-transparent" style={{ fontSize: deviceSettings?.removeBtnFontSize }} type="button" onClick={() => onRemoveItem(product.id)}>
                <FaTrash size={10} />
                <span>{cartCustomization?.removeButtonText}</span>
            </button>
        </div>
    );
};

export default CartItemRow;