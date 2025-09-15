//Using logic code for a export default function className={``} are need. Use ?: alternative for (If else).
import { useRef } from "react";
import Logo from "../assets/Logo2.png"
import { 
    ArrowUpRight, 
    ChevronsRightLeft, 
    User, 
    FileUser,
} 
from "lucide-react"
import { Link } from "react-router"

export default function Navbar() {
    const navRef = useRef();
    //Arrow function
    const showNavbar = () => {
        navRef.current.classList.toggle("responsive_nav")
    }

return(
    <>
    <header className="navbar-bg-container bg-black flex justify-between w-full mb-3 items-center">
        <img src={Logo} alt="" className="logo"/>
        <nav className="nav-items flex gap-5 text-white" ref={navRef}>
            {/**Link the sign up/in pages */}
            <Link to="/Signin"><User /> Sign In</Link>
            <Link to="/signup"><FileUser />Sign Up</Link>
            {/**Close btn for nav on smaller screens*/}
            <button className="nav-btn nav-close-btn" onClick={showNavbar}>
                <ArrowUpRight />
            </button>
        </nav>
        {/**Open btn for nav on smaller screens*/}
        <button className="nav-btn nav-open-btn" onClick={showNavbar}>
            <ChevronsRightLeft />
        </button>
    </header>
    </>
)
}
