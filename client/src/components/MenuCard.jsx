import { useState } from 'react';
import '../stylesheets/cashier.css';

export default function MenuCard({ imgUrl, name, price, id, items, setItems, formatNumber }) {

    const [quantity, setQuantity] = useState(0)

    function increment() {
        const existingItem = items.find(item => item.id === id);
        if (!existingItem) {
            const newItem = { id, name, price, quantity: 1 };
            setItems([...items, newItem]);
            setQuantity(1);
        } else {
            const newQuantity = quantity + 1;
            setQuantity(newQuantity);
            const updatedItems = items.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            );
            setItems(updatedItems);
        }
    }

    function decrement() {
        if (quantity > 0) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);

            if (newQuantity === 0) {
                const updatedItems = items.filter(item => item.id !== id);
                setItems(updatedItems);

            } else {
                const updatedItems = items.map(item =>
                    item.id === id ? { ...item, quantity: newQuantity } : item
                );
                setItems(updatedItems);
            }
        }
    }

    return (
        <div className='card'>
            <div className='menuName'>
                {name}
            </div>
            <img className="menuImage" src={imgUrl} />
            <div className='menuPrice'>
                IDR {formatNumber(price)}
            </div>
            <div className='quantityGroup'>
                <div className='qtyButton' onClick={() => { decrement() }}>
                    -
                </div>
                <input className='quantityInput' type="number" value={quantity} readOnly />
                <div className='qtyButton' onClick={() => { increment() }}>
                    +
                </div>
            </div>
        </div>
    )
}