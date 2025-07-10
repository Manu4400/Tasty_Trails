import { createContext, useEffect, useState, useContext } from "react";
import { UserContext } from "./UserContext";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const { user } = useContext(UserContext);
    const [cartItems, setCartItems] = useState({});
    const [foodList, setFoodList] = useState([]);

    useEffect(() => {
        fetch("http://localhost:4000/api/food")
            .then(res => res.json())
            .then(data => setFoodList(data));
    }, []);

    useEffect(() => {
        if (user && user.token) {
            fetch("http://localhost:4000/api/cart", {
                headers: { 'Authorization': `Bearer ${user.token}` }
            })
            .then(res => res.json())
            .then(data => {
                const cartObj = {};
                data.forEach(item => { cartObj[item.item_id] = item.quantity; });
                setCartItems(cartObj);
            });
        } else {
            setCartItems({});
        }
    }, [user]);

    const addToCart = async (itemId) => {
        const newQty = (cartItems[itemId] || 0) + 1;
        setCartItems((prev)=>({...prev,[itemId]:newQty}));
        if (user && user.token) {
            await fetch("http://localhost:4000/api/cart", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ item_id: itemId, quantity: newQty })
            });
        }
    }
    const removeFromCart = async (itemId) => {
        const newQty = (cartItems[itemId] || 0) - 1;
        if (newQty > 0) {
            setCartItems((prev)=>({...prev,[itemId]:newQty}));
            if (user && user.token) {
                await fetch("http://localhost:4000/api/cart", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
                    body: JSON.stringify({ item_id: itemId, quantity: newQty })
                });
            }
        } else {
            setCartItems((prev) => {
                const copy = { ...prev };
                delete copy[itemId];
                return copy;
            });
            if (user && user.token) {
                await fetch("http://localhost:4000/api/cart", {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
                    body: JSON.stringify({ item_id: itemId })
                });
            }
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for(const item in cartItems)
        {
            if (cartItems[item]>0) {
                let itemInfo = foodList.find((product)=>String(product.id) === String(item));
                if (itemInfo) {
                    totalAmount += itemInfo.price*cartItems[item];
                }
            }  
        }
        return totalAmount;
    }

    const contextValue = {
        food_list: foodList,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount
    }
    
    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;