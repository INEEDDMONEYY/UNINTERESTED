import { Link } from 'react-router';
import { useState } from 'react';

export default function Form() {
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        //Regex for validating password (min 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character)
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if(!passwordRegex.test(password)){
            setError("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character");
            return;
        }
        try {
            const response = await fetch('https://glorious-space-trout-9vw7vw7pvgphxvq5-5173.app.github.dev/Signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const result = await response.text();
            if (response.ok) {
                localStorage.setItem("username", username);
                window.location.href = '/home';
            } else {
                setError(result);
            }
        } catch (err) {
            setError('Error connecting to server. ' + (err && err.message ? err.message : ''));
        }
        //Clear form fields on submission
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
    }

    return(
        <>
        <form action="" method="post" className="flex flex-col w-96" onSubmit={handleSubmit}>
            <input type="text" name="email" placeholder="Enter your username" className="border-2 border-pink-600 m-2 px-1 text-[1rem] text-black rounded-lg" id="username" required/>
            <input type="password" name="password" placeholder="Enter your password" className="border-2 border-pink-600 m-2 px-1 text-[1rem] text-black rounded-lg" id="password" required/>
            <div>
                <button name="submit-btn" type="submit" className="border-2 border-white m-1 px-1 text-black text-[1.3rem] rounded-md" id="sign-in-btn">Sign In</button>
            </div>
            {error && (
                <div className="text-red-600 text-sm m-2">{error}</div>
            )}
            <div>
                {/**Import link from react router & link sign up to it's link */}
                <h3 className="text-black text-[1rem] underline">Don't have an account yet? <Link to="/signup" className="text-pink-700">Sign Up</Link></h3>
                <Link to="/forgotpass"><p className="underline text-red-700">Forgot password ?</p></Link>
                <Link to="/home"><p className="underline text-pink-700">Return home</p></Link>
            </div>
        </form>
        </>
    )
}