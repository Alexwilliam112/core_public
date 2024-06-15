import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Toastify from 'toastify-js';
import MenuCard from "../../components/MenuCard";
import PageTitle from "../../components/pageTitle";
import { fetchAllMenus } from "../../features/Menus/Menus";
import '../../stylesheets/cashier.css';

export default function CashierCreate({ url }) {
    const { menus, loading, error } = useSelector((state) => state.menus);
    const dispatch = useDispatch();

    const [table, setTable] = useState('')
    const [docNumber, setDocNumber] = useState('')
    const [amount, setAmount] = useState(0)
    const [docStatus, setDocStatus] = useState('Draft')
    const [items, setItems] = useState([])
    const navigate = useNavigate()

    const formatNumber = (num) => {
        return new Intl.NumberFormat('en-US').format(num);
    }

    function calculateAmount() {
        let totalAmount = 0
        items.forEach((el) => {
            totalAmount += el.price * el.quantity
        })

        setAmount(totalAmount)
    }

    async function handlePost() {
        try {
            const orders = items.map((el) => {
                el.menuName = el.name
                delete el.id
                delete el.name
                return el
            })

            await axios.post(`${url}/operations/sales`, {
                table,
                amount,
                orders
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.access_token}`
                }
            })

            navigate('/cashier')
            Toastify({
                text: "Success Created New Order",
                duration: 2000,
                newWindow: true,
                close: true,
                gravity: "bottom",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "#00B29F",
                    color: "#17202A",
                    boxShadow: "0 5px 10px black",
                    fontWeight: "bold",
                    position: 'absolute',
                    right: '0',
                    padding: "10px 20px",
                }
            }).showToast();

        } catch (err) {
            Toastify({
                text: err.response.data.message,
                duration: 2000,
                newWindow: true,
                close: true,
                gravity: "bottom",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "#EF4C54",
                    color: "#17202A",
                    boxShadow: "0 5px 10px black",
                    fontWeight: "bold"
                }
            }).showToast();
        }
    }

    useEffect(() => {
        dispatch(fetchAllMenus())
    }, [])

    useEffect(() => {
        calculateAmount()
    }, [items])

    useEffect(() => {
        if (error) {
            Toastify({
                text: error,
                duration: 2000,
                newWindow: true,
                close: true,
                gravity: "bottom",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "#EF4C54",
                    color: "#17202A",
                    boxShadow: "0 5px 10px black",
                    fontWeight: "bold"
                }
            }).showToast();
        }
    }, [error]);

    return (
        <>
            <PageTitle tag={'New Order'} />
            <div className="contentWithFooter">
                <div className="contentFrame">
                    <div className="pageSection1">
                        <div className="formCashier">
                            <div className="generalInformations">
                                <div className="inputGroup2">
                                    <div className="formLabel">
                                        DocNumber
                                    </div>
                                    <input className="formInput2" type="text" value={docNumber} readOnly />
                                </div>

                                <div className="inputGroup2">
                                    <div className="formLabel">
                                        Table
                                    </div>
                                    <input className="formInput2" type="text" onChange={(e) => {setTable(e.target.value)}} />
                                </div>

                                <div className="inputGroup2">
                                    <div className="formLabel">
                                        Amount
                                    </div>
                                    <input className="formInput2" type="text" value={`IDR  ` + formatNumber(amount)} readOnly />
                                </div>

                                <div className="inputGroup2">
                                    <div className="formLabel">
                                        Status
                                    </div>
                                    <input className="formInput2" type="text" value={docStatus} readOnly />
                                </div>
                            </div>

                            <table>
                                <thead>
                                    <tr>
                                        <td>
                                            Menu Name
                                        </td>
                                        <td>
                                            Quantity
                                        </td>
                                        <td>
                                            Price
                                        </td>
                                        <td>
                                            Subtotal
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((el) => {
                                        return (
                                            <tr key={el.id}>
                                                <td>
                                                    {el.name}
                                                </td>
                                                <td>
                                                    {el.quantity}
                                                </td>
                                                <td>
                                                    IDR {formatNumber(el.price)}
                                                </td>
                                                <td>
                                                    IDR {formatNumber(el.price * el.quantity)}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="menuGrid">
                            {!error && menus.length > 0 && (
                                menus.map((el) => {
                                    return (
                                        <MenuCard
                                            key={'c' + el.id}
                                            imgUrl={el.imgUrl}
                                            name={el.name}
                                            price={el.price}
                                            id={el.id}
                                            items={items}
                                            setItems={setItems}
                                            formatNumber={formatNumber}
                                        />
                                    )
                                })
                            )}
                        </div>
                    </div>
                </div>
                <div className="footer">
                    <div className="cancelButton" onClick={() => {navigate('/cashier')}}>
                        CANCEL
                    </div>
                    <div className="createButton" onClick={() => {handlePost()}}>
                        CREATE
                    </div>
                </div>
            </div>
        </>
    )
}