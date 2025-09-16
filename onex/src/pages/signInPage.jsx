import SignInForm from '../components/SignInForm.jsx'
import SigninLogo from '../assets/Logo.png'

export default function SignIn() {
    return(
        <>
        <div className="flex flex-col signin-bg h-screen p-[200px] overflow-hidden place-content-center">
            <div className="inline-block bg-gray-300 text-center rounded-lg w-96 self-center p-2 form-bg">
                <div className="flex place-items-center justify-center align-center text-center">
                    <h1 className="text-black text-[2rem] text-center">Mystery Mansion</h1>
                    <img src={SigninLogo} alt="" className="signin-logo" />
                </div>
                <h3 className="text-black text-[2rem]">Sign In</h3>
                <p className="text-black text-[1.2rem]">Sign into your account to continue to please, pleasure, promote your sex lifestyle!</p>
                <div className="justify-self-center">
                    <SignInForm />
                </div>
            </div>
        </div>
        </>
    )
}