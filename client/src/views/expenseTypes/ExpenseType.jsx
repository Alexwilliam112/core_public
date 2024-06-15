import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Toastify from 'toastify-js';
import PageTitle from "../../components/pageTitle";
import { fetchAllExpenseTypes } from "../../features/ExpenseTypes/ExpenseTypes";

export default function ExpenseType() {

  const { expenseTypes, loading, error } = useSelector((state) => state.expenseTypes);
  const dispatch = useDispatch();

  const [docStatus, setDocStatus] = useState('Draft')
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchAllExpenseTypes())
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
      <PageTitle tag={'Expense Types'} />
      <div className="contentFrame">
        <div className="pageAction">
          <div className="createButton" onClick={() => { navigate('/expensetypes') }}>
            + NEW
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <td>
                TypeId
              </td>
              <td>
                Expense Type Name
              </td>
              <td>
                Description
              </td>
              <td>
                Action
              </td>
            </tr>
          </thead>
          <tbody>
            {expenseTypes.map((el) => {
              return (
                <tr key={el.id}>
                  <td>
                    ET-{el.id}
                  </td>
                  <td>
                    {el.name}
                  </td>
                  <td>
                    {el.description}
                  </td>
                  <td>
                    {/* <div className="viewButton" onClick={() => { }}>
                      VIEW
                    </div> */}
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