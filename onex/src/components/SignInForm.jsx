import { Link } from 'react-router'
    //Form submission logic
    const handleSubmit = (event) => {
        event.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        //Log input values to console (for testing purposes)
        console.log("Username: ", username);
        console.log("Password: ", password);
        //Regex for validating password (min 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character)
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if(!passwordRegex.test(password)){
            alert("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character");
            return;
        }
        //Clear form fields on submission
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
        //Display username in greet user id in header component (testing purposes only)
        localStorage.setItem("username", username);
        //On successful sign in redirect to home page
        window.location.href = "/home";
        //Add logic to send data to backend
    }
export default function Form() {
    return(
        <>
        <form action="" method="post" className="flex flex-col w-96" onSubmit={handleSubmit}>
            <input type="text" name="email" placeholder="Enter your username" className="border-2 border-pink-600 m-2 px-1 text-[1rem] text-black rounded-lg" id="username" required/>
            <input type="text" name="password" placeholder="Enter your password" className="border-2 border-pink-600 m-2 px-1 text-[1rem] text-black rounded-lg" id="password" required/>
            <div>
                <button name="submit-btn" type="submit" className="border-2 border-white m-1 px-1 text-black text-[1.3rem] rounded-md" id="sign-in-btn">Sign In</button>
            </div>
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