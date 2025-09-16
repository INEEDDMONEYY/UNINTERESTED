import PostForm from "../components/PostForm"
import Logo from '../assets/Logo.png'

export default function PostPage() {
    return(
        <>
        <div className="flex flex-col bg-pink-400 h-screen p-[200px] overflow-hidden place-content-center">
                    <div className="inline-block bg-gray-300 text-center rounded-lg w-96 self-center p-2 form-bg">
                        <div className="flex place-items-center justify-self-center align-center text-center">
                            <h1 className="text-black text-[2rem]">Mystery Mansion</h1>
                            <img src={Logo} alt="" className="signin-logo" />
                        </div>
                        <h3 className="text-black text-[2rem]">Post</h3>
                        <p className="text-black text-[1.2rem]">There's men waiting to hear from you!</p>
                        <div className="justify-self-center">
                            <PostForm />
                        </div>
                    </div>
                </div>
        </>
    )
}