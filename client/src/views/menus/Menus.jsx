import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Toastify from 'toastify-js';
import PageTitle from "../../components/pageTitle";
import { fetchAllMenus } from "../../features/Menus/Menus";

export default function Menus({ url }) {

  const { menus, loading, error } = useSelector((state) => state.menus);
  const dispatch = useDispatch();

  const [docStatus, setDocStatus] = useState('Draft')
  const navigate = useNavigate()

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  }

  async function handleDelete(id) {
    try {
      const res = await axios.delete(`${url}/inventory/menus/${id}`, {
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

    dispatch(fetchAllMenus())

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
      <PageTitle tag={'Menu Management'} />
      <div className="contentFrame">
        <div className="pageAction">
          <div className="createButton" onClick={() => { navigate('/menus/create') }}>
            + NEW
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <td>
                MenuId
              </td>
              <td>
                Menu Name
              </td>
              <td>
                Menu Price
              </td>
              <td>
                CreatedAt
              </td>
              <td>
                UpdatedAt
              </td>
              <td>
                UpdatedBy
              </td>
              <td>
                Action
              </td>
            </tr>
          </thead>
          <tbody>
            {menus.map((el) => {
              return (
                <tr key={el.id}>
                  <td>
                    MN-{el.id}
                  </td>
                  <td>
                    {el.name}
                  </td>
                  <td>
                    IDR  {formatNumber(el.price)}
                  </td>
                  <td>
                    {el.createdAt}
                  </td>
                  <td>
                    {el.updatedAt}
                  </td>
                  <td>
                    {el.updatedBy}
                  </td>
                  <td>
                    <div className="horizontalButtonGroup">
                      {/* <div className="viewButton" onClick={() => { navigate(`/menus/edit/${el.id}`) }}>
                        VIEW
                      </div> */}
                      <div className="deleteButton" onClick={() => { handleDelete(el.id) }}>
                        DELETE
                      </div>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}