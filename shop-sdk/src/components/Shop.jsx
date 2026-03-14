import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import PaginationControls from "./PaginationControls";
import Chips from "./Chips";
import ProductDetailModal from "./ProductDetailModal";
import useWindowDimensions from "../hooks/useScreenWidth";


const normalizeConfig = (config) => {
    return {
        ...config.config_json.global_config,
        desktop: {... config.config_json.devices.desktop},
        tablet: {... config.config_json.devices.tablet},
        phone: {... config.config_json.devices.phone},
    };
}



const Shop = ({ products = [], customization = {} }) => {
    const [activeDevice, setActiveDevice] = useState('desktop');
    const { width } = useWindowDimensions();

    useEffect(() => {
        const newActiveDevice = (width < 768 ) ? 'phone' : (  width < 1024  ) ? 'tablet' : 'desktop';
        if (newActiveDevice !== activeDevice) {
            setActiveDevice(newActiveDevice);
        }
    }, [width, activeDevice]);


    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showProductModal, setShowProductModal] = useState(false);

    const toggleCategory = (categoryName) => {
        setSelectedCategories((prev) => (
            prev.includes(categoryName) ? prev.filter((item) => item !== categoryName) : [...prev, categoryName]
        ));
    };
    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setShowProductModal(true);
    };
    const handleAddToCart = () => {
        if (selectedProduct?.is_variable) {
            //open product modal to select variant
            setShowProductModal(true);
            return;
        }
        else {
            //add to cart directly
            console.log(`Adding product ${selectedProduct.name} to cart`);
        }
    };

    const normalizedCustomization = normalizeConfig(customization);

    const activeDeviceSettings = normalizedCustomization[activeDevice] || normalizedCustomization.desktop;
    const itemsPerPage = Math.max(1, (activeDeviceSettings?.columns) * (activeDeviceSettings?.rowsPerPage));
    useEffect(() => {
        setCurrentPage(1);
    }, [activeDevice, itemsPerPage, selectedCategories, searchQuery]);

    const visibleProducts = products.filter(p => p.visibility);

    const categoryChips = Array.from( new Set(visibleProducts.map(product => product.category?.name).filter(Boolean) ) );
    useEffect(() => {
        const validSelections = selectedCategories.filter((category) => categoryChips.includes(category));
        if (validSelections.length !== selectedCategories.length) {
            setSelectedCategories(validSelections);
        }
    }, [selectedCategories, categoryChips]);


    const normalizedSearchQuery = searchQuery.trim().toLowerCase();
    const categoryFilteredProducts = selectedCategories.length === 0 ? visibleProducts : visibleProducts.filter(product => selectedCategories.includes(product.category?.name));
    const filteredProducts = normalizedSearchQuery
        ? categoryFilteredProducts.filter((product) => {
            const productName = product.name?.toLowerCase() || '';
            const productDescription = product.description?.toLowerCase() || '';
            return ( productName.includes(normalizedSearchQuery) || productDescription.includes(normalizedSearchQuery) );
        })
        : categoryFilteredProducts;

    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        setCurrentPage((prev) => Math.min(prev, totalPages));
    }, [totalPages]);


    return (
        <>
        <div className="flex flex-col items-center">
            <div  className="border border-gray-300 bg-white rounded-lg p-3 sm:p-6 min-h-[400px] w-full transition-all duration-300 w-full" >
                {/* Products Grid */}
                <>
                    <div className="mb-4">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search products..."
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>

                    {categoryChips.length > 0 && (
                        <Chips
                            items={categoryChips}
                            selectedItems={selectedCategories}
                            onItemClick={toggleCategory}
                            onClearFilters={() => setSelectedCategories([])}
                            selectedChipColor={normalizedCustomization.selectedChipColor }
                        />
                    )}


                    <div 
                        className="grid gap-6"
                        style={{ gridTemplateColumns: `repeat(${activeDeviceSettings?.columns}, minmax(0, 1fr))` }}
                    >
                        {paginatedProducts.map((product) => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                customization={normalizedCustomization}
                                activeDevice={activeDevice}
                                onClick={() => handleProductClick(product)}
                                onAddToCart={handleAddToCart}
                            />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <PaginationControls currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
                    )}
                </>
            </div>
        </div>

        <ProductDetailModal
            isOpen={showProductModal}
            onClose={() => setShowProductModal(false)}
            product={selectedProduct}
            customization={normalizedCustomization}
            activeDevice={activeDevice}
            onAddToCart={handleAddToCart}
        />
    </>
    );
}

export default Shop;