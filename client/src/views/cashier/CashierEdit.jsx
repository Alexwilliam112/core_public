import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Toastify from 'toastify-js';
import MenuCard from "../../components/CashierEditCard";
import Payment from "../../components/Payment";
import PageTitle from "../../components/pageTitle";
import { fetchAllMenus } from "../../features/Menus/Menus";
import '../../stylesheets/cashier.css';

export default function CashierEdit({ url }) {
  const { menus, loading, error } = useSelector((state) => state.menus);
  const dispatch = useDispatch();

  const { id } = useParams()
  const [SalesId, setSalesId] = useState(id)
  const [table, setTable] = useState('')
  const [docNumber, setDocNumber] = useState('')
  const [amount, setAmount] = useState(0)
  const [docStatus, setDocStatus] = useState('Draft')
  const [items, setItems] = useState([])
  const [newOrders, setNewOrders] = useState([])
  const [document, setDocument] = useState({})
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

  function handleRemove(id) {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, toDelete: true } : item
    );
    setItems(updatedItems);
  }

  async function handlePatch(newStatus) {
    try {
      const res = await axios.patch(`${url}/operations/sales/${id}`, {
        updateTo: newStatus
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`
        }
      })

      fetchSalesDetail()
      Toastify({
        text: res.data.message,
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
      navigate('/cashier')

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

  async function fetchSalesDetail() {
    try {
      const data = await axios.get(`${url}/operations/sales/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`
        }
      })

      const salesDetail = data.data.data
      setTable(salesDetail.table)
      setDocNumber(salesDetail.createdAt + '-' + salesDetail.id)
      setDocStatus(salesDetail.docStatus)
      setItems(salesDetail.SalesDetails)
      setDocument(salesDetail)

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

  async function handleEdit() {
    try {
      setItems((prevItems) => {
        const updatedItems = [...prevItems];

        newOrders.forEach((newOrder) => {
          const itemFound = updatedItems.find((el) => el.menuName === newOrder.menuName);

          if (!itemFound) {
            updatedItems.push(newOrder);
          } else {
            if (itemFound.toDelete) {
              itemFound.toDelete = false;
              itemFound.quantity = newOrder.quantity;
            } else {
              itemFound.quantity += newOrder.quantity;
            }
          }
        });
        return updatedItems;
      })

      const orders = items.map((el) => {
        el.SalesId = SalesId
        delete el.name
        return el
      })

      const res = await axios.put(`${url}/operations/sales/${id}`, {
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
        text: res.data.message,
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
      console.log(err);
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
    fetchSalesDetail()
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
      <PageTitle tag={'Update Order'} />
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
                  <input className="formInput2" type="text" value={table} readOnly />
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
                    {docStatus !== 'Posted' && (
                      <td>
                        ACTION
                      </td>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {items.map((el) => {
                    if (!el.toDelete) {
                      return (
                        <tr key={el.id}>
                          <td>
                            {el.menuName}
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
                          {docStatus !== 'Posted' && (
                            <td>
                              <div className="smallDelete" onClick={() => handleRemove(el.id)}>
                                REMOVE
                              </div>
                            </td>
                          )}
                        </tr>
                      )
                    }
                  })}
                  {newOrders.map((el) => {
                    if (!el.toDelete) {
                      return (
                        <tr key={el.id}>
                          <td>
                            {el.menuName}
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
                          <td>

                          </td>
                        </tr>
                      )
                    }
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
                      formatNumber={formatNumber}
                      setNewOrders={setNewOrders}
                      newOrders={newOrders}
                      docStatus={docStatus}
                    />
                  )
                })
              )}
            </div>
          </div>
        </div>
        <div className="footer">
          {docStatus === 'Posted' && (
            <div className="cancelButton" onClick={() => { navigate('/cashier') }}>
              CLOSE
            </div>
          )}
          {docStatus !== 'Posted' && (
            <>
              <div className="cancelButton" onClick={() => { navigate('/cashier') }}>
                CANCEL
              </div>
              <div className="createButton" onClick={() => { handleEdit() }}>
                SAVE
              </div>
            </>
          )}
          {docStatus === 'On Process' && (
            <Payment url={url} document={document} refresh_cb={fetchSalesDetail} />
          )}
          {docStatus === 'Draft' && (
            <div className="processButton" onClick={() => { handlePatch('On Process') }}>
              PROCESS
            </div>
          )}
        </div>
      </div>
    </>
  )
}