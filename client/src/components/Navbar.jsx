import { useNavigate } from "react-router-dom";
import '../stylesheets/navbar.css';

export default function Navbar() {
    const navigate = useNavigate()

    function handleLogout() {
        try {
            localStorage.removeItem("access_token")
            navigate('/login')
            
        } catch (err) {
            Toastify({
                text: err,
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
                    fontWeight: "bold",
                    position: "absolute",
                    right: 0
                }
            }).showToast();
        }
    }

    return (
        <div className="outerFrameNavbar">
            <div className="logoFont">
                CORE
            </div>
            <div className="CTAgroup">
                {/* <div className="navButton">
                    HUMAN CAPITAL
                    <div className="dropdownContent">
                        <div className="dropdownItem" onClick={() => { navigate('/users') }}>USER MANAGEMENT</div>
                        <div className="dropdownItem" onClick={() => { navigate('/auths') }}>USER AUTHORIZATION</div>
                        <div className="dropdownItem" onClick={() => { navigate('/jobtitles') }}>JOBTITLES</div>
                    </div>
                </div>
                | */}
                <div className="navButton">
                    POINT OF SALES
                    <div className="dropdownContent">
                        <div className="dropdownItem" onClick={() => { navigate('/cashier') }}>CASHIER</div>
                    </div>
                </div>
                |
                <div className="navButton">
                    INVENTORY
                    <div className="dropdownContent">
                        <div className="dropdownItem" onClick={() => { navigate('/masteringredient') }}>MASTER INGREDIENT</div>
                        <div className="dropdownItem" onClick={() => { navigate('/menus') }}>MENUS</div>
                    </div>
                </div>
                |
                <div className="navButton">
                    EXPENSES
                    <div className="dropdownContent">
                        <div className="dropdownItem" onClick={() => { navigate('/buyings') }}>SUPPLY BUYINGS</div>
                        <div className="dropdownItem" onClick={() => { navigate('/payrolls') }}>PAYROLLS</div>
                        <div className="dropdownItem" onClick={() => { navigate('/expensetypes') }}>EXPENSES TYPES</div>
                        <div className="dropdownItem" onClick={() => { navigate('/routines') }}>ROUTINE EXPENSES</div>
                    </div>
                </div>
                |
                <div className="navButton">
                    REPORTS
                    <div className="dropdownContent">
                        <div className="dropdownItem" onClick={() => { navigate('/genreports') }}>GENERAL REPORTS</div>
                    </div>
                </div>
                |
                <div className="navButton" onClick={() => {handleLogout()}}>
                    LOGOUT
                </div>
            </div>
        </div>
    )
}