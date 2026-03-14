
const apiUrl = import.meta.env.VITE_API_URL;

const ProductThumbnail = ({ product, size }) => {
    const imageUrl = product.image_url ? `${apiUrl}/${product.image_url}` : product.variants?.[0]?.image_url ? `${apiUrl}/${product.variants[0].image_url}` : null;
    return (
        <div
            className="rounded flex-shrink-0 bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center text-gray-300"
            style={{ width: size, height: size }}
        >
            {imageUrl ? (
                <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
                <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-1 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
            )}
        </div>
    );
};

export default ProductThumbnail;