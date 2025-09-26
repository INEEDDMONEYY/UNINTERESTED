import Navbar from '../components/Navbar.jsx'
import Body from '../components/Body.jsx'
import Footer from '../components/Footer.jsx'
export default function HomePage() {
    return(
        <>
        <nav>
            <Navbar />
        </nav>
        <main>
            <div className="bg-img">
                <Body />
            </div>
        </main>
        <footer className="static bottom-0">
            <Footer />
        </footer>
        </>
    )
}