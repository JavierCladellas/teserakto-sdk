import { useState, useEffect } from 'react';
import Modal from './Modal';

const apiUrl = import.meta.env.VITE_API_URL;

const ProductDetailModal = ({ isOpen, onClose, product, customization, activeDevice = 'desktop', onAddToCart }) => {
    const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0] || null);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [quantityInput, setQuantityInput] = useState('1');
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

    const inStock = product.has_stock;
    const deviceSettings = customization[activeDevice] || customization.desktop || {};
    const quantity = Math.max(1, parseInt(quantityInput, 10) || 1);

    const currentImage = product.image_url || selectedVariant?.image_url;
    const currentPrice = selectedVariant?.price || 0;

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
                className="flex flex-col md:flex-row gap-6 md:h-[68vh] md:max-h-[68vh]"
                style={{ fontFamily: customization.fontFamily }}
            >
                {/* Product Image */}
                <div className="md:w-1/2 md:h-full flex-shrink-0">
                    <div className="relative w-full h-72 md:h-full bg-gray-100 rounded-lg overflow-hidden p-4 md:p-6">
                        <img 
                            src={`${apiUrl}/${currentImage}`} 
                            alt={product.name}
                            className="w-full h-full object-contain"
                        />
                        {!inStock && (
                            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                <span className="text-lg font-semibold" style={{ color: customization.outOfStockColor || '#ef4444' }}>{customization.outOfStockText || 'Out of Stock'}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Product Details */}
                <div className="md:w-1/2 flex flex-col md:h-full min-h-0 md:relative">
                    <div className="min-h-0 overflow-y-auto pr-1 md:pb-40">
                        {/* Title */}
                        <h2 
                            className="font-bold mb-2"
                            style={{ 
                                color: customization.titleColor,
                                fontSize: `${deviceSettings.titleFontSize ? deviceSettings.titleFontSize + 4 : 22}px`
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
                                    color: customization.priceColor,
                                    fontSize: `${deviceSettings.priceFontSize ? deviceSettings.priceFontSize + 8 : 24}px`
                                }}
                            >
                                ${currentPrice.toFixed(2)}
                            </span>
                        </div>
                        {/* Variants Selection - Attribute Based */}
                        {productAttributes.length > 0 && (
                            <div className="mb-6">
                                <h3 
                                    className="font-semibold mb-3"
                                    style={{ 
                                        color: customization.titleColor,
                                        fontSize: `${deviceSettings.titleFontSize ? deviceSettings.titleFontSize - 2 : 16}px`
                                    }}
                                >
                                    Options
                                </h3>
                                {productAttributes.map((attribute) => (
                                    <div key={attribute.id} className="mb-4">
                                        <label 
                                            className="block text-sm font-medium mb-2"
                                            style={{ 
                                                color: customization.textColor,
                                                fontSize: `${deviceSettings.descriptionFontSize || 14}px`
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
                                                        borderColor: selectedAttributes[attribute.id] === value.id ? customization.buttonColor : undefined,
                                                        color: selectedAttributes[attribute.id] === value.id ? customization.buttonColor : customization.textColor,
                                                        fontSize: `${deviceSettings.buttonFontSize || 14}px`,
                                                        backgroundColor: selectedAttributes[attribute.id] === value.id ? `${customization.buttonColor}10` : 'transparent'
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
                                    color: customization.titleColor,
                                    fontSize: `${deviceSettings.titleFontSize ? deviceSettings.titleFontSize - 2 : 16}px`
                                }}
                            >
                                Description
                            </h3>
                            <p 
                                className="text-gray-700"
                                style={{ 
                                    color: customization.textColor,
                                    fontSize: `${deviceSettings.descriptionFontSize || 14}px`,
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word'
                                }}
                            >
                                {product.description || "No description available"}
                            </p>
                        </div>

                        
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 md:absolute md:bottom-0 md:left-0 md:right-0 md:mt-0 md:bg-white md:pt-4">
                        {/* Quantity Selector */}
                        {inStock && (
                            <div className="mb-4">
                                <h3 
                                    className="font-semibold mb-2"
                                    style={{ 
                                        color: customization.titleColor,
                                        fontSize: `${deviceSettings.titleFontSize ? deviceSettings.titleFontSize - 2 : 16}px`
                                    }}
                                >
                                    Quantity
                                </h3>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setQuantityInput(String(Math.max(1, quantity - 1)))}
                                        className="w-10 h-10 rounded-md border-2 border-gray-300 hover:border-gray-400 flex items-center justify-center font-semibold"
                                        style={{ color: customization.textColor }}
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
                                            fontSize: `${deviceSettings.buttonFontSize || 14}px`,
                                            color: customization.textColor
                                        }}
                                        min="1"
                                    />
                                    <button
                                        onClick={() => setQuantityInput(String(quantity + 1))}
                                        className="w-10 h-10 rounded-md border-2 border-gray-300 hover:border-gray-400 flex items-center justify-center font-semibold"
                                        style={{ color: customization.textColor }}
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
                                backgroundColor: customization.buttonColor,
                                color: customization.buttonTextColor || '#ffffff',
                                fontSize: `${deviceSettings.buttonFontSize || 14}px`
                            }}
                            onClick={() => {
                                if (!inStock) return;
                                setIsJustAdded(true);
                                onAddToCart?.(product, quantity);
                            }}
                            disabled={!inStock}
                        >
                            {inStock
                                ? (isJustAdded
                                    ? (customization.addedToCartText || 'Added!')
                                    : `${customization.addToCartText || 'Add to Cart'}${quantity > 1 ? ` (${quantity})` : ''}`)
                                : (customization.outOfStockText || 'Out of Stock')}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ProductDetailModal;
