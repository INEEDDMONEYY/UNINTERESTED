import SignupForm from "../components/SignUpForm.jsx"
import Logo from '../assets/Logo.png'

export default function SignupPage() {
    return(
        <>
        <div className="flex flex-col signup-bg h-screen p-[200px] overflow-hidden place-content-center">
            <div className="inline-block bg-gray-300 text-center rounded-lg w-96 self-center p-2 form-bg">
                <div className="flex place-items-center justify-self-center text-center">
                    <h1 className="text-black text-[2rem]">Mystery Mansion</h1>
                    <img src={Logo} alt="" className="signin-logo" />
                </div>
                <h3 className="text-black text-[2rem]">Sign Up</h3>
                <p className="text-black text-[1.2rem]">Signup for an account please, pleasure, promote your sex lifestyle!</p>
                <div className="justify-self-center">
                    <SignupForm/>
                </div>
            </div>
        </div>
        </>
    )
}