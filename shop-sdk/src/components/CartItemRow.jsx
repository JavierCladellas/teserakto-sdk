import { FaTrash } from "react-icons/fa";
import ProductThumbnail from "./ProductThumbnail";


const CartItemRow = ({ product, cartCustomization, deviceSettings, showThumbnails, onRemoveItem }) => {
    const { itemTextColor, itemPriceColor, removeButtonText, borderColor } = cartCustomization;
    const thumbnailSize = deviceSettings.thumbnailSize;
    const productNameFontSize = deviceSettings.itemFontSize;
    const descriptionFontSize = deviceSettings.descriptionFontSize;
    const quantityFontSize = deviceSettings.quantityFontSize;
    const priceFontSize = deviceSettings.priceFontSize;
    const price = product.variants?.[0]?.price;
    return (
        <div className="flex items-start gap-3 py-3" style={{ borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: borderColor }}>
            {showThumbnails && <ProductThumbnail product={product} size={thumbnailSize} />}
            <div className="flex-1 min-w-0">
                <p className="font-medium truncate" style={{ color: itemTextColor, fontSize: productNameFontSize }}>{product.name}</p>
                {product.variants?.[0]?.name && (
                    <p className="mt-0.5 text-gray-400" style={{ fontSize: descriptionFontSize }}>{product.variants[0].name}</p>
                )}
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-400" style={{ fontSize: quantityFontSize }}>Qty: 1</span>
                    <span className="font-semibold" style={{ color: itemPriceColor, fontSize: priceFontSize }}>
                        ${Number(price).toFixed(2)}
                    </span>
                </div>
            </div>
            <button className="mt-0.5 text-gray-400 hover:text-red-500 flex items-center gap-1 flex-shrink-0" style={{ fontSize: descriptionFontSize }} type="button" onClick={() => onRemoveItem(product.id)}>
                <FaTrash size={10} />
                <span>{removeButtonText}</span>
            </button>
        </div>
    );
};

export default CartItemRow;