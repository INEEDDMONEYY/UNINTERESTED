import { Link } from "react-router";

export default function PostForm() {
    //Form logic
    function PostFormSubmission() {
        const Form = document.getElementById('post-form')
    }
    //Payment Message
    function CheckboxMessage(message) {
        message = 'Checking this box you are acknowledging that each post will cost $10, if for any reason you have questions on our post requirements please look at our post policy. Sincerly, Myster Mansion !'
        return message;
    }

    return(
        <>
        <form action="" method="post" className="flex flex-col w-96" id="post-form">
            <input type="file" name="picture" id="post-picture" className="border-2 border-black m-2 px-1 text-[1rem] text-black rounded-lg" required/>
            <input type="text" name="username" id="post-username" className="border-2 border-black m-2 px-1 text-[1rem] text-black rounded-lg" placeholder="Enter alias" required/>
            <textarea name="post" id="post-description" className="border-2 border-black m-2 px-1 text-[1rem] text-black rounded-lg" placeholder="Enter text" required></textarea>
            <div className="p-1 text-[0.7rem]">
                <input type="checkbox" name="payment-checkbox" id="payment-checkbox" required/>
                <label htmlFor="payment-checkbox" className="mx-1">{CheckboxMessage()}</label>
            </div>
            <div>
                {/**Redirect to payment on click, after payment redirect to ths */}
                <button type="submit" name="submit" className="border-2 border-white m-1 px-1 text-black text-[1.3rem] rounded-md" id="post-submit-btn">Post</button>
            </div>
            <Link to="/home"><p className="underline text-black">Return home</p></Link>
        </form>
        </>
    )
}