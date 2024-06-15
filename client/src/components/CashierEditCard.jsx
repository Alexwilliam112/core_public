import { useState } from 'react';
import '../stylesheets/cashier.css';

export default function MenuCard({ imgUrl, name, price, id, newOrders, setNewOrders, formatNumber, docStatus }) {

    const [quantity, setQuantity] = useState(0)

    function increment() {
        const existingItem = newOrders.find(item => item.id === id);
        if (!existingItem) {
            const newItem = { id, menuName: name, price, quantity: 1, toDelete: false };
            setNewOrders([...newOrders, newItem]);
            setQuantity(1);
        } else {
            const newQuantity = quantity + 1;
            setQuantity(newQuantity);
            const updatedItems = newOrders.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            );
            setNewOrders(updatedItems);
        }
    }

    function decrement() {
        if (quantity > 0) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);

            if (newQuantity === 0) {
                const updatedItems = newOrders.filter(item => item.id !== id);
                setNewOrders(updatedItems);

            } else {
                const updatedItems = newOrders.map(item =>
                    item.id === id ? { ...item, quantity: newQuantity } : item
                );
                setNewOrders(updatedItems);
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
            {docStatus !== 'Posted' && (
                <div className='quantityGroup'>
                    <div className='qtyButton' onClick={() => { decrement() }}>
                        -
                    </div>
                    <input className='quantityInput' type="number" value={quantity} readOnly />
                    <div className='qtyButton' onClick={() => { increment() }}>
                        +
                    </div>
                </div>
            )}
        </div>
    )
}