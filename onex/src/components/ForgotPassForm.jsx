import { Link } from 'react-router'

export default function ForgotPasswordForm() {
    return(
        <>
        <form action="" method="post" className="flex flex-col w-96">
            <input type="text" name="email" placeholder="Enter your email" className="border-2 border-red-600 m-2 px-1 text-[1rem] text-black rounded-lg" id="email"/>
            <input type="text" name="password" placeholder="Enter a new password" className="border-2 border-red-600 m-2 px-1 text-[1rem] text-black rounded-lg" id="password"/>
            <div>
                <button name="submit-btn" type="submit" className="border-2 border-black m-1 px-1 text-red-700 text-[1.2rem] rounded-md" id="reset-password-btn">Reset Password</button>
            </div>
            <div>
                {/**Import link from react router & link sign up to it's link */}
                <h3 className="text-black text-[1rem] underline">Don't have an account yet? <Link to="/signup" className="text-pink-700">Sign Up</Link></h3>
                <Link to="/home"><p className="underline text-pink-700">Return home</p></Link>
            </div>
        </form>
        </>
    )
}