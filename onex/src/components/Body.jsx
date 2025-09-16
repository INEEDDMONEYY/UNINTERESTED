import { Link } from 'react-router'

export default function Body() {
    return(
        <>
        <section>
            <div className="bg-white p-5">
                {/** Hidden button for post when logged in */}
                <div className="flex justify-between p-3 items-center">
                    <h3>Ads</h3>
                    <div className="post-btn-div">
                        <Link to="/post"><button className="border-1 p-1 rounded bg-pink-200 post-btn hover-pointer" id="post-btn">Post</button></Link>
                    </div>
                </div>
                <div className="h-full bg-gray-400 grid">
                    {/**Post card will go here */}
                </div>
            </div>
        </section>
        </>
    )
}