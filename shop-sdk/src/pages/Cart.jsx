import { FaShoppingCart } from 'react-icons/fa';
import { useEffect, useState  } from "react";
import CartContent from "../components/CartContent";
import useWindowDimensions from "../hooks/useScreenWidth";
import useCart from "../hooks/useCart";

/**
 * Cart — absolute overlay rendered on top of ShopPreview.
 * Parent container must be `position: relative` with a defined height.
 */
const Cart = ({ cartCustomization = {} }) => {
    const [activeDevice, setActiveDevice] = useState('desktop');
    const { width } = useWindowDimensions();

    const [showDrawer, setShowDrawer] = useState(false);
    const [ cartCount, setCartCount ] = useState(0);

    useEffect(() => {
        const newActiveDevice = (width < 768 ) ? 'phone' : (  width < 1024  ) ? 'tablet' : 'desktop';
        if (newActiveDevice !== activeDevice) {
            setActiveDevice(newActiveDevice);
        }
    }, [width, activeDevice]);

    const { cart, removeFromCart } = useCart();

    const handleRemoveItem = (productId) => {
        removeFromCart(productId);
    };

    
    useEffect(() => {
        setCartCount(cart.reduce((sum, p) => sum + p.quantity, 0));
    }, [cart]);

    const deviceSettings = cartCustomization[activeDevice] || cartCustomization.desktop || {};
    const { drawerPosition, iconColor, badgeColor, badgeTextColor } = cartCustomization;
    const rawDrawerWidth = deviceSettings.drawerWidth ?? 360;
    const isFullDrawer = activeDevice === 'phone' || drawerPosition === 'full' || rawDrawerWidth === 0;
    const drawerWidth = isFullDrawer ? '100%' : `${rawDrawerWidth}px`;


    return (
        <div className="relative w-full h-full mx-auto rounded-lg" >
            <button onClick={( e) => {e.stopPropagation(); setShowDrawer(!showDrawer)}} >
                <FaShoppingCart size={22} style={{ color: iconColor }} />
                <span
                    className="absolute -top-2 -right-2 text-[10px] font-semibold rounded-full min-w-4 h-4 px-1 flex items-center justify-center"
                    style={{
                        backgroundColor: badgeColor,
                        color: badgeTextColor
                    }}
                >
                    {cartCount}
                </span>
            </button>
            {showDrawer && (
                <div
                    className="absolute z-30 shadow-md pointer-events-auto overflow-y-auto"
                    style={{
                        width: drawerWidth,
                        ...(isFullDrawer
                            ? { left: 0, right: 0 }
                            : { [drawerPosition === 'right' ? 'right' : 'left']: 0 }),
                    }}
                >
                    <CartContent 
                        products={cart} 
                        cartCustomization={cartCustomization}
                        deviceSettings={deviceSettings}
                        onClose={() => setShowDrawer(false)}
                        onRemoveItem={handleRemoveItem}
                    />
                </div>
            )}
        </div>
    );
};



export default Cart;
