import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Toastify from 'toastify-js';
import DocumentStatus from "../../components/DocStatus";
import PageTitle from "../../components/pageTitle";
import { fetchAllPayrolls } from "../../features/Payrolls/Payrolls";

export default function Payroll() {

  const { payrolls, loading, error } = useSelector((state) => state.payrolls);
  const dispatch = useDispatch();

  const [docStatus, setDocStatus] = useState('Draft')
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchAllPayrolls())
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
      <PageTitle tag={'Payroll Expenses'} />
      <DocumentStatus selected={docStatus} setter={setDocStatus} />
      <div className="contentFrame">
        <div className="pageAction">
          <div className="createButton" onClick={() => { navigate('/payrolls') }}>
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
                Date
              </td>
              <td>
                Amount
              </td>
              <td>
                CreatedAt
              </td>
              <td>
                UpdatedAt
              </td>
              <td>
                CreatedBy
              </td>
              <td>
                PostedBy
              </td>
              <td>
                Action
              </td>
            </tr>
          </thead>
          <tbody>
            {!error && payrolls.length > 0 && (
              payrolls.map((el) => {
                if (el.docStatus === docStatus) {
                  return (
                    <tr key={el.id}>
                      <td>
                        {el.date}-{el.id}EP
                      </td>
                      <td>
                        {el.date}
                      </td>
                      <td>
                        {el.amount}
                      </td>
                      <td>
                        {el.createdAt}
                      </td>
                      <td>
                        {el.updatedAt}
                      </td>
                      <td>
                        {el.createdBy}
                      </td>
                      <td>
                        {el.postedBy}
                      </td>
                      <td>
                        {/* <div className="viewButton" onClick={() => { }}>
                          VIEW
                        </div> */}
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