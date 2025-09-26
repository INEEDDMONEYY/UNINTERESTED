import Logo from '../assets/Logo.png'
//import { Link } from 'react-router'
export default function Footer() {
    //Footer text
    const year = new Date().getFullYear();
    return(
        <>
        <div className="h-auto text-white p-2 bg-white w-screen">
            <div className="d-flex inline-flex items-center text-[0.8rem] place-self-center text-black">
                <img src={Logo} alt="Company Logo" className="logo"/>
                <div className="ml-5">
                    <h3 className="underline">Platform policies</h3>
                    
                </div>
                <div className="ml-5">
                    <h3 className="underline">Follow us!</h3>
                </div>
            </div>
            <div className="text-[0.8rem] place-self-center text-black">
                <p>© Mystery Masnion {year}. All rights reserved.</p>
            </div>
        </div>
        </>
    )
}