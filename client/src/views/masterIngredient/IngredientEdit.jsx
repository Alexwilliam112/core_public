import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Toastify from 'toastify-js';
import PageTitle from "../../components/pageTitle";
import '../../stylesheets/cashier.css';

export default function IngredientEdit({ url }) {
  const { id } = useParams()
  const [ingredientName, setIngredientName] = useState('')
  const [unit, setUnit] = useState('')
  const navigate = useNavigate()

  async function fetchIngredientDetail() {
    try {
      const data = await axios.get(`${url}/inventory/ingredients/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`
        }
      })

      const detail = data.data.data
      setIngredientName(detail.ingredientName)
      setUnit(detail.unit)

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
      const res = await axios.put(`${url}/inventory/ingredients/${id}`, {
        ingredientName,
        unit
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`
        }
      })
      
      const resMsg = res.data.message

      navigate('/masteringredient')
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
    fetchIngredientDetail()
  }, [])

  return (
    <>
      <PageTitle tag={'Edit Document'} />
      <div className="contentWithFooter">
        <div className="contentFrame">
          <div className="inputGroup2">
            <div className="formLabel2">
              IngredientId
            </div>
            <input className="formInput2" type="text" value={`ING-${id}`} readOnly />
          </div>

          <div className="inputGroup2">
            <div className="formLabel2">
              Ingredient Name
            </div>
            <input className="formInput2" type="text" defaultValue={ingredientName} onChange={(e) => { setIngredientName(e.target.value) }} />
          </div>

          <div className="inputGroup2">
            <div className="formLabel2">
              Unit
            </div>
            <select name="unit" id="unit" className="select2" value={unit} onChange={(e) => { setUnit(e.target.value) }}>
              <option value="Kilogram">Kilogram</option>
              <option value="Gram">Gram</option>
              <option value="Onz">Onz</option>
              <option value="Piece">Piece</option>
            </select>
          </div>
        </div>
        <div className="footer">
          <div className="cancelButton" onClick={() => { navigate('/masteringredient') }}>
            CANCEL
          </div>
          <div className="createButton" onClick={() => { handleEdit() }}>
            SAVE
          </div>
        </div>
      </div>
    </>
  )
}