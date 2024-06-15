import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toastify from 'toastify-js';
import loadingAnimation from '../../assets/loading.svg';
import PageTitle from "../../components/pageTitle";
import '../../stylesheets/cashier.css';

export default function MenuCreate({ url }) {

    const [name, setname] = useState('')
    const [price, setPrice] = useState(0)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    async function handlePost() {
        try {
            setLoading(true)

            const formData = new FormData();
            formData.append('image', selectedFile);
            formData.append('name', name);
            formData.append('price', price);

            const res = await axios.post(`${url}/inventory/menus`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.access_token}`
                }
            })

            const resMsg = res.data.message

            navigate('/menus')
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

            navigate('/menus')

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

        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <PageTitle tag={'Create Document'} />
            <div className="contentWithFooter">
                <div className="contentFrame">
                    <div className="inputGroup2">
                        <div className="formLabel2">
                            MenuId
                        </div>
                        <input className="formInput2" type="text" value={''} readOnly />
                    </div>

                    <div className="inputGroup2">
                        <div className="formLabel2">
                            Menu Name
                        </div>
                        <input className="formInput2" type="text" onChange={(e) => { setname(e.target.value) }} />
                    </div>

                    <div className="inputGroup2">
                        <div className="formLabel2">
                            Price
                        </div>
                        <input className="formInput2" type="number" onChange={(e) => { setPrice(e.target.value) }} />
                    </div>

                    <div className="inputGroup2">
                        <div className="formLabel2">
                            Menu Image
                        </div>
                        <input className="formInput2" type="file" onChange={handleFileChange} />
                    </div>

                    {loading == true && (
                        <div className="loadingContainer">
                            <img src={loadingAnimation} />
                        </div>
                    )}

                </div>
                <div className="footer">
                    <div className="cancelButton" onClick={() => { navigate('/menus') }}>
                        CANCEL
                    </div>
                    <div className="createButton" onClick={() => { handlePost() }}>
                        CREATE
                    </div>
                </div>
            </div>
        </>
    )
}