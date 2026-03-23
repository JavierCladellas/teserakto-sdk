
import { useEffect, useState } from 'react';

const apiUrl = import.meta.env.VITE_TESERAKTO_API_URL;

const ProductCard = ({ product, globalCustomization, shopCustomization, activeDevice = 'desktop', onClick, onAddToCart }) => {
    const [isJustAdded, setIsJustAdded] = useState(false);
    const variant = product.variants?.[0];
    const price = variant?.price;
    const inStock = (product.is_variable ? true : product.has_stock);

    const deviceSettings = shopCustomization[activeDevice] || shopCustomization.desktop || {};
    const titleFontSize = deviceSettings.titleFontSize ;
    const descriptionFontSize = deviceSettings.descriptionFontSize;
    const priceFontSize = deviceSettings.priceFontSize;
    const buttonFontSize = deviceSettings.buttonFontSize;
    useEffect(() => {
        if (!isJustAdded) return;

        const timeoutId = setTimeout(() => {
            setIsJustAdded(false);
        }, 1500);

        return () => clearTimeout(timeoutId);
    }, [isJustAdded]);

    const handleAddToCartClick = (event) => {
        event.stopPropagation();
        if (product.is_variable) {
            onClick?.(product);
            return;
        }
        if (!inStock) return;
        setIsJustAdded(true);
        onAddToCart?.(1);
    };

    return (
            <div 
                className="group flex flex-col h-full relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                style={{ 
                    backgroundColor: globalCustomization.surfaceColor,
                    fontFamily: globalCustomization.fontFamily 
                }}
                onClick={onClick}
            >
            {/* Product Image */}
            <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                {product.image_url || product.variants?.[0]?.image_url ? (
                    <img 
                        src={product.image_url ? `${apiUrl}/${product.image_url}` : `${apiUrl}/${product.variants?.[0]?.image_url}`} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                    </div>
                )}
            </div>

            {!inStock && (
                <>
                    <div className="absolute inset-0 bg-white/60 pointer-events-none z-10"></div>
                    <div className="absolute top-2 left-2 text-white text-xs px-2 py-1 rounded z-10" style={{ backgroundColor: globalCustomization.notificationColor }}>
                        {shopCustomization.outOfStockText}
                    </div>
                </>
            )}

            {/* Product Info */}
            <div className="p-4 flex-col flex-1 flex justify-between flex-grow">
                <div className="mb-2">
                    <h3 
                        className="font-semibold text-lg mb-2 truncate"
                        style={{ 
                            color: globalCustomization.textColor,
                            fontSize: `${titleFontSize}px`
                        }}
                    >
                        {product.name}
                    </h3>

                    <p 
                        className="text-sm mb-3 line-clamp-2"
                        style={{ 
                            color: globalCustomization.textColor,
                            fontSize: `${descriptionFontSize}px`
                        }}
                    >
                        {product.description}
                    </p>
                </div>
                <div className={`flex gap-2 min-h-[42px] ${
                    activeDevice === 'phone'
                        ? 'flex-col items-stretch'
                        : 'flex-row justify-between items-center'
                }`}>
                    <span 
                        className="text-md font-bold"
                        style={{ 
                            color: globalCustomization.accentColor,
                            fontSize: `${priceFontSize}px`
                        }}
                    >
                        ${price.toFixed(2)}
                    </span>
                    <button 
                        className={`px-4 py-2 border-none rounded-md text-white font-medium hover:opacity-90 transition-opacity ${
                            activeDevice === 'phone' ? 'w-full' : 'w-auto'
                        }`}
                        onClick={handleAddToCartClick}
                        style={{ 
                            backgroundColor: globalCustomization.primaryBtnColor,
                            color: globalCustomization.primaryBtnTextColor,
                            fontFamily: globalCustomization.fontFamily,
                            fontSize: `${buttonFontSize}px`
                        }}
                        disabled={!inStock}
                    >
                        {inStock
                            ? (
                                !product.is_variable && isJustAdded ? (shopCustomization.addedToCartText) : (shopCustomization.addToCartText)
                            )
                            : (shopCustomization.outOfStockText)}
                    </button>
                </div>
            </div>
        </div>
    );
};


export default ProductCard;