import ForgotPassword from '../components/ForgotPassForm.jsx'
import Logo from '../assets/Logo.png'

export default function ForgotPasswordPage() {
    return(
        <>
        <div className="flex flex-col signin-bg h-screen p-[200px] overflow-hidden place-content-center">
            <div className="inline-block bg-gray-300 text-center rounded-lg w-96 self-center p-2 form-bg">
                <div className="flex place-items-center justify-self-center text-center">
                    <h1 className="text-black text-[2rem] text-center">Mystery Mansion</h1>
                    <img src={Logo} alt="" className="signin-logo" />
                </div>
                <h3 className="text-red-700 text-[1.5rem]">Forgot Password?</h3>
                <p className="text-black text-[1.2rem]">We all do at times, reset password & get back to promoting your sex lifestyle!</p>
                <div className="justify-self-center">
                    <ForgotPassword />
                </div>
            </div>
        </div>
        </>
    )
}