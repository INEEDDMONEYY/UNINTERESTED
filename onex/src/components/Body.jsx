import { Link } from 'react-router'
//import { Scrollbars } from 'react-scrollbars-custom'
import SetLocation from '../components/LocationSet'
import Heading from '../components/Header'
export default function Body() {
    //Display posts in
    return(
        <>
        <section>
            <div className="bg-white h-screen p-5 h-auto scroll-smooth">
                <Heading />
                {/** Hidden button for post when logged in */}
                <div className="flex justify-between p-3 items-center">
                    <h3>Ads</h3>
                    <div className="w-auto h-auto">
                        <SetLocation />
                    </div>
                    <div className="post-btn-div">
                        <Link to="/post"><button className="border-1 p-1 rounded bg-pink-200 post-btn hover-pointer" id="post-btn">Post</button></Link>
                    </div>
                </div>
                <div className="h-full bg-gray-400 grid" id="post-grid-container">
                    {/**Post card will go here */}
                    
                </div>
            </div>
        </section>
        </>
    )
}