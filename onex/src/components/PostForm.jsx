import { Link } from "react-router";
//import { useState } from React;
//import { useNavigate } from "react-router";
//import React from "react";
//import axios from "axios";

export default function PostForm() {

    //Payment Message
    function CheckboxMessage(message) {
        message = 'Checking this box you are acknowledging that each post will cost $10, if for any reason you have questions on our post requirements please look at our post policy. Sincerly, Myster Mansion !'
        return message;
    }

    //Pst form logic 
    function handleSubmit(event) {
        event.preventDefault();
        const picture = document.getElementById("post-picture").files[0];
        const username = document.getElementById("post-username").value;
        const description = document.getElementById("post-description").value;
        const paymentChecked = document.getElementById("payment-checkbox").checked;
        //Log input values to console (for testing purposes)
        console.log("Picture: ", picture);
        console.log("Username: ", username);
        console.log("Description: ", description);
        console.log("Payment Checked: ", paymentChecked);
        if(!paymentChecked){
            alert("You must agree to the payment terms to post.");
            return;
        }
        //Clear form fields on submission
        document.getElementById("post-picture").value = "";
        document.getElementById("post-username").value = "";
        document.getElementById("post-description").value = "";
        document.getElementById("payment-checkbox").checked = false;
        //Add logic to send data to backend
        alert("Post submitted successfully!");
        //Redirect to home page on successful post submission
        window.location.href = "/home";
    }   

    return(
        <>
        <form action="" method="post" className="flex flex-col w-96" id="post-form" onSubmit={handleSubmit}>
            <input type="file" name="picture" id="post-picture" className="border-2 border-black m-2 px-1 text-[1rem] text-black rounded-lg"/>
            <input type="text" name="username" id="post-username" className="border-2 border-black m-2 px-1 text-[1rem] text-black rounded-lg" placeholder="Enter Title" required/>
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