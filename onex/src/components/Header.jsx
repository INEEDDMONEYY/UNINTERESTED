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
    
    return(
        //Import location component
        // /
        <>
            <section>
                <div className="m-2">
                    <div className="bg-white p-1 flex items-center rounded justify-between">
                        <div className="inline-block items-center text-center">
                            <img src={Logo} alt="Company Logo" className="logo" />
                            <h4 className="greeting">Welcome, <span className="underline" id="greet-user">Whisper</span></h4>
                            <div className="border-1 border-pink-400 rounded">
                                <p className="">{CurrentDate()}</p>
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