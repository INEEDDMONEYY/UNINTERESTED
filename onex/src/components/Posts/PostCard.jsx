export default function PostCard() {
   // Individual post card component, displays post picture username, post title, post description

   //Fecth post data from backend and display it here.
   //(For testing pruposes only static data used from the post form is used here)
    function fetchPostData() {
        //Use data from post form
        const picture = document.getElementById("post-picture").files[0];
        const username = document.getElementById("post-username").value;
        const description = document.getElementById("post-description").value;
        console.log("Picture: ", picture);
        console.log("Username: ", username);
        console.log("Description: ", description);
    }
    return(
        <>
        <div className="w-68">
            <div className="pic-container"></div>
            <div className="post-content-container">
                <h2 className="text-[1.5rem] font-bold">{username}</h2>
            </div>
        </div>
        </>
    )
}