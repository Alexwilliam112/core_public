import axios from "axios";
import Swal from "sweetalert2";
import Toastify from 'toastify-js';
import '../stylesheets/cashier.css';

export default function Payment({ url, document, refresh_cb }) {

    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.access_token}`
        }
    }

    async function handlePayment() {
        try {
            const { data } = await axios(`${url}/payment/midtrans?amount=${document.amount}&SalesId=${document.id}`, config)

            window.snap.pay(data.transaction_token, {
                onSuccess: async function () {
                    const response = await axios.patch(`${url}/payment/status`, { orderId: data.orderId }, config)
                    Swal.fire({
                        icon: "success",
                        title: response.data.message,
                        didClose: () => {
                            refresh_cb()
                        }
                    });
                },
                onPending: function () {
                    Swal.fire({
                        icon: "warning",
                        title: "Waiting your payment!",
                    });
                },
                onError: function () {
                    Swal.fire({
                        icon: "error",
                        title: "Payment failed!"
                    });
                },
                onClose: function () {
                    Swal.fire({
                        icon: "question",
                        title: "Cancel payment?",
                    });
                }
            })

            refresh_cb()

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

    return (
        <>
            <div className="processButton" onClick={() => { handlePayment() }}>
                PAYMENT
            </div>
        </>
    )
}