import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Toastify from 'toastify-js';
import PageTitle from "../../components/pageTitle";
import { fetchAllMasterIngredients } from "../../features/MasterIngredient/MasterIngredients";

export default function MasterIngredient() {

  const { masterIngredients, loading, error } = useSelector((state) => state.masterIngredients);
  const dispatch = useDispatch();

  const [docStatus, setDocStatus] = useState('Draft')
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchAllMasterIngredients())
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
      <PageTitle tag={'Master Ingredient'} />
      <div className="contentFrame">
        <div className="pageAction">
          <div className="createButton" onClick={() => { navigate('/masteringredient/create') }}>
            + NEW
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <td>
                IngredientId
              </td>
              <td>
                Ingredient Name
              </td>
              <td>
                Unit of Measurement
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
            {masterIngredients.map((el) => {
              return (
                <tr key={el.id}>
                  <td>
                    ING-{el.id}
                  </td>
                  <td>
                    {el.ingredientName}
                  </td>
                  <td>
                    {el.unit}
                  </td>
                  <td>
                    {el.updatedBy}
                  </td>
                  <td>
                    <div className="viewButton" onClick={() => { navigate(`/masteringredient/edit/${el.id}`) }}>
                      VIEW
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