import { useState } from "react"
import { useNavigate, Link } from 'react-router'


export default function SignupForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://uninterested.onrender.com/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ username, password }),
                credentials: 'include',
            });

            const data = await response.json();
            if (response.ok) {
                navigate('/home');
            } else {
                setError(data.error || 'Signup failed');
            }
        } catch (err) {
            setError('Server error: ' + err.message)
        }
    }

    

    return(
        <>
        <form onSubmit={handleSignup} action="" method="post" className="flex flex-col w-96" >
            <input type="text" name="username" placeholder="Create a username" className="border-2 border-pink-600 m-2 px-1 text-[1rem] text-black rounded-lg" onChange={(e) => setUsername(e.target.value)} />
            <input type="text" name="password" placeholder="Enter your password" className="border-2 border-pink-600 m-2 px-1 text-[1rem] text-black rounded-lg" id="password" onChange={(e) => setPassword(e.target.value)}/>
            <div>
                <button name="submit-btn" type="submit" className="border-2 border-white m-1 px-1 text-black text-[1.3rem] rounded-md" id="sign-up-btn">Sign Up</button>
            </div>
            {error && <div className="text-red-600">{error}</div>}
            <div>
                {/**Import link from react router & link sign up to it's link */}
                <h3 className="text-black text-[1rem] underline">Have an account already? <Link to="/signin" className="text-pink-700">Sign In</Link></h3>
                <Link to="/home"><p className="underline text-pink-700">Return home</p></Link>
            </div>
        </form>
        </>
    )
}