import { Link } from 'react-router'

export default function Form() {
    return(
        <>
        <form action="" method="post" className="flex flex-col w-96">
            <input type="text" name="email" placeholder="Enter your username" className="border-2 border-pink-600 m-2 px-1 text-[1rem] text-black rounded-lg" id="username"/>
            <input type="text" name="password" placeholder="Enter your password" className="border-2 border-pink-600 m-2 px-1 text-[1rem] text-black rounded-lg" id="password"/>
            <div>
                <button name="submit-btn" type="submit" className="border-2 border-white m-1 px-1 text-black text-[1.3rem] rounded-md" id="sign-in-btn">Sign In</button>
            </div>
            <div>
                {/**Import link from react router & link sign up to it's link */}
                <h3 className="text-black text-[1rem] underline">Don't have an account yet? <Link to="/signup" className="text-pink-700">Sign Up</Link></h3>
                <Link to="/forgotpassword">Forgot password ?</Link>
                <Link to="/home"><p className="underline text-pink-700">Return home</p></Link>
            </div>
        </form>
        </>
    )
}