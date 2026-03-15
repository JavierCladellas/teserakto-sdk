import { useState, useEffect } from 'react';
import Modal from './Modal';

const apiUrl = import.meta.env.VITE_TESERAKTO_API_URL;

const ProductDetailModal = ({ isOpen, onClose, product, globalCustomization, shopCustomization, activeDevice = 'desktop', onAddToCart }) => {
    const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0] || null);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [quantityInput, setQuantityInput] = useState(1);
    const [isJustAdded, setIsJustAdded] = useState(false);

    useEffect(() => {
        if (product?.variants?.[0]) {
            setSelectedVariant(product.variants[0]);
            // Initialize selected attributes from first variant
            const initialAttributes = {};
            product.variants[0].attributes?.forEach(attr => {
                initialAttributes[attr.attribute.id] = attr.attribute_value.id;
            });
            setSelectedAttributes(initialAttributes);
            setQuantityInput(1);
            setIsJustAdded(false);
        }
    }, [product]);

    useEffect(() => {
        if (!isOpen) {
            setIsJustAdded(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isJustAdded) return;

        const timeoutId = setTimeout(() => {
            setIsJustAdded(false);
        }, 1500);

        return () => clearTimeout(timeoutId);
    }, [isJustAdded]);

    if (!product) return null;

    const deviceSettings = shopCustomization[activeDevice] || shopCustomization.desktop || {};
    const quantity = Math.max(1, parseInt(quantityInput, 10) || 1);

    const currentInStock = (product.is_variable ? selectedVariant?.has_stock : product.has_stock);
    const currentImage = product.image_url || selectedVariant?.image_url;
    const currentPrice = selectedVariant?.price;

    // Get all unique attributes from all variants
    const getProductAttributes = () => {
        if (!product.variants || product.variants.length <= 1) return [];
        
        const attributesMap = new Map();
        
        product.variants.forEach(variant => {
            variant.attributes?.forEach(attr => {
                if (!attributesMap.has(attr.attribute.id)) {
                    attributesMap.set(attr.attribute.id, {
                        id: attr.attribute.id,
                        name: attr.attribute.name,
                        values: []
                    });
                }
                
                const attribute = attributesMap.get(attr.attribute.id);
                if (!attribute.values.find(v => v.id === attr.attribute_value.id)) {
                    attribute.values.push({
                        id: attr.attribute_value.id,
                        value: attr.attribute_value.value
                    });
                }
            });
        });
        
        return Array.from(attributesMap.values());
    };

    // Find variant matching selected attributes
    const handleAttributeChange = (attributeId, valueId) => {
        const newSelectedAttributes = {
            ...selectedAttributes,
            [attributeId]: valueId
        };
        setSelectedAttributes(newSelectedAttributes);

        // Find matching variant
        const matchingVariant = product.variants.find(variant => {
            if (!variant.attributes) return false;
            return Object.keys(newSelectedAttributes).every(attrId => {
                const variantAttr = variant.attributes.find(a => a.attribute.id === parseInt(attrId));
                return variantAttr && variantAttr.attribute_value.id === newSelectedAttributes[attrId];
            });
        });

        if (matchingVariant) {
            setSelectedVariant(matchingVariant);
        }
    };

    const productAttributes = getProductAttributes();

    return (
        <Modal open={isOpen} onClose={onClose} size="lg">
            <div 
                className="flex flex-col sm:flex-row gap-6 items-center "
                style={{ fontFamily: globalCustomization.fontFamily }}
            >
                {/* Product Image */}
                <div className="w-1/2 sm:w-full h-full flex-shrink-0">
                    <div className="relative w-full h-72 sm:h-full bg-gray-100 rounded-lg  p-4 sm:p-6">
                        <img 
                            src={`${currentImage ? `${apiUrl}/${currentImage}` : ''}`} 
                            alt={product.name}
                            className="w-full h-full object-contain"
                        />
                        {!currentInStock && (
                            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                <span className="text-lg font-semibold" style={{ color: globalCustomization.notificationColor }}>{shopCustomization.outOfStockText }</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Product Details */}
                <div className="w-full flex flex-col h-full min-h-0 relative">
                    <div className="min-h-0 overflow-y-auto pr-1 sm:pb-40">
                        <h2 
                            className="font-bold mb-2"
                            style={{ 
                                color: globalCustomization.textColor,
                                fontSize: `${deviceSettings.titleFontSize}px`
                            }}
                        >
                            {selectedVariant && product.variants?.length > 1 ? selectedVariant.name : product.name}
                        </h2>

                        {/* Category */}
                        {product.category && (
                            <p className="text-sm text-gray-500 mb-4">
                                {product.category.name}
                            </p>
                        )}

                        {/* Price */}
                        <div className="mb-6">
                            <span 
                                className="text-2xl font-bold"
                                style={{ 
                                    color: globalCustomization.accentColor,
                                    fontSize: `${deviceSettings.priceFontSize}px`
                                }}
                            >
                                ${currentPrice?.toFixed(2)}
                            </span>
                        </div>
                        {/* Variants Selection - Attribute Based */}
                        {productAttributes.length > 0 && (
                            <div className="mb-6">
                                <h3 
                                    className="font-semibold mb-3"
                                    style={{ 
                                        color: globalCustomization.textColor,
                                        fontSize: `${deviceSettings.titleFontSize}px`
                                    }}
                                >
                                    Options
                                </h3>
                                {productAttributes.map((attribute) => (
                                    <div key={attribute.id} className="mb-4">
                                        <label 
                                            className="block text-sm font-medium mb-2"
                                            style={{ 
                                                color: globalCustomization.textColor,
                                                fontSize: `${deviceSettings.descriptionFontSize}px`
                                            }}
                                        >
                                            {attribute.name}
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {attribute.values.map((value) => (
                                                <button
                                                    key={value.id}
                                                    onClick={() => handleAttributeChange(attribute.id, value.id)}
                                                    className={`px-4 py-2 rounded-md border-2 transition-all ${
                                                        selectedAttributes[attribute.id] === value.id
                                                            ? 'border-current font-semibold'
                                                            : 'border-gray-300 hover:border-gray-400'
                                                    }`}
                                                    style={{ 
                                                        borderColor: selectedAttributes[attribute.id] === value.id ? globalCustomization.primaryBtnColor : undefined,
                                                        color: selectedAttributes[attribute.id] === value.id ? globalCustomization.primaryBtnColor : globalCustomization.textColor,
                                                        fontSize: `${deviceSettings.buttonFontSize}px`,
                                                        backgroundColor: selectedAttributes[attribute.id] === value.id ? `${globalCustomization.primaryBtnColor}10` : 'transparent'
                                                    }}
                                                >
                                                    {value.value}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Description */}
                        <div className="mb-6">
                            <h3 
                                className="font-semibold mb-2"
                                style={{ 
                                    color: globalCustomization.textColor,
                                    fontSize: `${deviceSettings.titleFontSize}px`
                                }}
                            >
                                Description
                            </h3>
                            <p 
                                className="text-gray-700"
                                style={{ 
                                    color: globalCustomization.textColor,
                                    fontSize: `${deviceSettings.descriptionFontSize}px`,
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word'
                                }}
                            >
                                {product.description}
                            </p>
                        </div>

                        
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 md:absolute md:bottom-0 md:left-0 md:right-0 md:mt-0 md:bg-white md:pt-4">
                        {/* Quantity Selector */}
                        {currentInStock && (
                            <div className="mb-4">
                                <h3 
                                    className="font-semibold mb-2"
                                    style={{ 
                                        color: globalCustomization.textColor,
                                        fontSize: `${deviceSettings.titleFontSize}px`
                                    }}
                                >
                                    Quantity
                                </h3>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setQuantityInput(String(Math.max(1, quantity - 1)))}
                                        className="w-10 h-10 rounded-md border-2 border-gray-300 hover:border-gray-400 flex items-center justify-center font-semibold"
                                        style={{ color: globalCustomization.textColor }}
                                    >
                                        −
                                    </button>
                                    <input
                                        type="number"
                                        value={quantityInput}
                                        onChange={(e) => {
                                            const nextValue = e.target.value;
                                            if (nextValue === '' || /^\d+$/.test(nextValue)) {
                                                setQuantityInput(nextValue);
                                            }
                                        }}
                                        onBlur={() => {
                                            const normalizedValue = Math.max(1, parseInt(quantityInput, 10) || 1);
                                            setQuantityInput(String(normalizedValue));
                                        }}
                                        className="w-20 h-10 text-center border-2 border-gray-300 rounded-md appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                        style={{ 
                                            fontSize: `${deviceSettings.buttonFontSize }px`,
                                            color: globalCustomization.textColor
                                        }}
                                        min="1"
                                    />
                                    <button
                                        onClick={() => setQuantityInput(String(quantity + 1))}
                                        className="w-10 h-10 rounded-md border-2 border-gray-300 hover:border-gray-400 flex items-center justify-center font-semibold"
                                        style={{ color: globalCustomization.textColor }}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Add to Cart Button */}
                        <button
                            className="w-full py-3 rounded-md text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ 
                                backgroundColor: globalCustomization.primaryBtnColor,
                                color: globalCustomization.primaryBtnTextColor,
                                fontSize: `${deviceSettings.buttonFontSize}px`
                            }}
                            onClick={() => {
                                if (!currentInStock) return;
                                setIsJustAdded(true);
                                onAddToCart?.(selectedVariant, quantity);
                                onClose?.();
                            }}
                            disabled={!currentInStock}
                        >
                            {currentInStock
                                ? (isJustAdded
                                    ? (shopCustomization.addedToCartText)
                                    : `${shopCustomization.addToCartText}${quantity > 1 ? ` (${quantity})` : ''}`)
                                : (shopCustomization.outOfStockText)}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ProductDetailModal;
