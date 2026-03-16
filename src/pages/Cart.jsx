import { FaShoppingCart } from 'react-icons/fa';
import { useEffect, useState  } from "react";
import CartContent from "../components/CartContent";
import useWindowDimensions from "../hooks/useScreenWidth";
import useCart from "../hooks/useCart";


const Cart = ({ globalCustomization = {}, cartCustomization = {}, checkoutUrl, device = null }) => {
    const [activeDevice, setActiveDevice] = useState('desktop');
    const { width } = useWindowDimensions();

    const [showDrawer, setShowDrawer] = useState(false);
    const [ cartCount, setCartCount ] = useState(0);

    useEffect(() => {
        if (device) {
            setActiveDevice(device);
            return;
        }
        const newActiveDevice = (width < 768 ) ? 'phone' : (  width < 1024  ) ? 'tablet' : 'desktop';
        if (newActiveDevice !== activeDevice) {
            setActiveDevice(newActiveDevice);
        }
    }, [width, activeDevice, device]);

    const { cart, removeFromCart } = useCart();

    const handleRemoveItem = (productId) => {
        removeFromCart(productId);
    };

    
    useEffect(() => {
        setCartCount(cart.reduce((sum, p) => sum + p.quantity, 0));
    }, [cart]);

    const deviceSettings = cartCustomization[activeDevice] || cartCustomization.desktop || {};
    const isFullDrawer = activeDevice === 'phone' || deviceSettings?.drawerPosition === 'full' || deviceSettings.drawerWidth === 0;
    const drawerWidth = isFullDrawer ? '100%' : `${deviceSettings.drawerWidth}px`;


    return (
        <div className="relative w-full h-full mx-auto rounded-lg" >
            <button 
                className="relative"
                onClick={( e) => {e.stopPropagation(); setShowDrawer(!showDrawer)}} 
            >
                <span className="relative inline-flex items-center justify-center w-6 h-6">
                    <FaShoppingCart size={22} style={{ color: "black" }} />
                    <span
                        className="absolute -top-1 -right-1 
                            w-4 h-4 text-[10px] font-semibold rounded-full
                            flex items-center justify-center"
                        style={{
                            backgroundColor: globalCustomization?.notificationColor,
                            color: globalCustomization?.primaryBtnTextColor,
                        }}
                    >
                        {cartCount}
                    </span>
                </span>
            </button>
            {showDrawer && (
                <div
                    className="fixed z-30 shadow-md pointer-events-auto overflow-y-auto"
                    style={{
                        top: 0,
                        width: isFullDrawer ? '100vw' : drawerWidth,
                        ...(isFullDrawer ? { left: 0 }  : { [deviceSettings?.drawerPosition === 'right' ? 'right' : 'left']: 0 }),
                    }}
                >
                    <CartContent 
                        products={cart} 
                        globalCustomization={globalCustomization}
                        cartCustomization={cartCustomization}
                        deviceSettings={deviceSettings}
                        onClose={() => setShowDrawer(false)}
                        onRemoveItem={handleRemoveItem}
                        checkoutUrl={checkoutUrl}
                    />
                </div>
            )}
        </div>
    );
};



export default Cart;
