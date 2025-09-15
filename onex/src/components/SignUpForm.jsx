import { Link } from 'react-router'

export default function SignupForm() {
    return(
        <>
        <form action="" method="post" className="flex flex-col w-96">
            <input type="text" name="username" placeholder="Create a username" className="border-2 border-pink-600 m-2 px-1 text-[1rem] text-black rounded-lg" id="username"/>
            <input type="text" name="email" placeholder="Enter your email" className="border-2 border-pink-600 m-2 px-1 text-[1rem] text-black rounded-lg" id="email"/>
            <input type="text" name="password" placeholder="Enter your password" className="border-2 border-pink-600 m-2 px-1 text-[1rem] text-black rounded-lg" id="password"/>
            <div>
                <button name="submit-btn" type="submit" className="border-2 border-white m-1 px-1 text-black text-[1.3rem] rounded-md" id="sign-up-btn">Sign Up</button>
            </div>
            <div>
                {/**Import link from react router & link sign up to it's link */}
                <h3 className="text-black text-[1rem] underline">Have an account already? <Link to="/signin" className="text-pink-700">Sign In</Link></h3>
                <Link to="/home"><p className="underline text-pink-700">Return home</p></Link>
            </div>
        </form>
        </>
    )
}