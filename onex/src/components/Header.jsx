import Logo from '../assets/Logo2.png'

export default function Header() {
    //Dev message for updates
    function OptionalMessage(message) {
        message = 'Respect all members on the platform, Post often and get rewarded in platfrom benefits 🌟';
        return message;
    }
    //Date function
    function CurrentDate(newDate) {
        newDate = new Date();
        const formattedDate = newDate.toDateString();
        return formattedDate
    }
    //Display logged in user from sign in form, (fetch usernames from backend in the future)/
    function LoggedInUser() {
        return localStorage.getItem("username") || "Guest";
    }
    //Sign out button logic
    // Add setState hook to toggle opcaity to hidden of the sign out button when user is logged in & out/
    document.addEventListener("DOMContentLoaded", function() {
        const signoutBtn = document.getElementById("signout-btn");
        if(signoutBtn){
            signoutBtn.addEventListener("click", function() {
                //Clear local storage
                localStorage.clear();
                //Redirect to sign in page
                window.location.href = "/signin";
            });
        }
    });
    
    
    
    return(
        //Import location component

        // /
        <>
            <section>
                <div className="m-2">
                    <div className="bg-white p-1 flex items-center rounded justify-between">
                        <div className="inline-block items-center text-center">
                            <img src={Logo} alt="Company Logo" className="logo" />
                            <h4 className="greeting">Welcome, <span className="underline" id="greet-user">{LoggedInUser()}</span></h4>
                            <div className="border-1 border-pink-400 rounded">
                                <p className="">{CurrentDate()}</p>
                            </div>
                            <div className="mt-1">
                                <button className="opacity border-1 border-pink-400 p-1 rounded bg-pink-200 signout-btn" id="signout-btn" onClick={() => {
                                    localStorage.clear();
                                    window.location.href = "/signin";
                                    }}
                                >Sign out</button>
                            </div>
                        </div>
                        <div className="bg-gray-300 mx-5 p-1 rounded border-1 border-red-600">
                            <p className="">{OptionalMessage()}</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}