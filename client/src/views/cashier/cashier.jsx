import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Toastify from 'toastify-js';
import DocumentStatus from "../../components/DocStatus";
import PageTitle from "../../components/pageTitle";
import { fetchAllSales } from "../../features/Sales/Sales.js";

export default function Cashier({ url }) {

  const { sales, loading, error } = useSelector((state) => state.sales);
  const dispatch = useDispatch();

  const [docStatus, setDocStatus] = useState('Draft')
  const navigate = useNavigate()

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  }

  async function handleDelete(id) {
    try {
      const res = await axios.delete(`${url}/operations/sales/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`
        }
      })

      const resMsg = res.data.message
      Toastify({
        text: resMsg,
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

      dispatch(fetchAllSales())

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
    dispatch(fetchAllSales())
  }, []);

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
      <PageTitle tag={'Cashier'} />
      <DocumentStatus selected={docStatus} setter={setDocStatus} />
      <div className="contentFrame">
        <div className="pageAction">
          <div className="createButton" onClick={() => { navigate('/cashier/create') }}>
            + NEW
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <td>
                DocNumber
              </td>
              <td>
                Table
              </td>
              <td>
                Amount
              </td>
              <td>
                Cashier Name
              </td>
              <td>
                CreatedAt
              </td>
              <td>
                UpdatedAt
              </td>
              <td>
                Action
              </td>
            </tr>
          </thead>
          <tbody>
            {!error && sales.length > 0 && (
              sales.map((el) => {
                if (el.docStatus === docStatus) {
                  return (
                    <tr key={el.id}>
                      <td>
                        {el.createdAt}-{el.id}
                      </td>
                      <td>
                        {el.table}
                      </td>
                      <td>
                        IDR   {formatNumber(el.amount)}
                      </td>
                      <td>
                        {el.cashier}
                      </td>
                      <td>
                        {el.createdAt}
                      </td>
                      <td>
                        {el.updatedAt}
                      </td>
                      <td className="horizontalButtonGroup">
                        <div className="viewButton" onClick={() => { navigate(`/cashier/${el.id}`) }}>
                          VIEW
                        </div>
                        {docStatus == 'Draft' && (
                          <div className="deleteButton" onClick={() => { handleDelete(el.id) }}>
                            DELETE
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                } else {
                  return null;
                }
              })
            )}
          </tbody>
        </table>
      </div>

    </>
  )
}