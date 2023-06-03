import { Link } from "react-router-dom"
import "./NavBar.css"

function NavBar() {
    return (
        <div className="navbar">
            <h2>
                <Link to={'/'}>Torfresma Social Book</Link>
            </h2>
            <ul>
                <li>
                    <Link to={'/'}>Home</Link>
                </li>
                <li>
                    <Link to={'/new'} className="new-btn">
                        Novo Post
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default NavBar