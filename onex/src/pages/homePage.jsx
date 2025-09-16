import Navbar from '../components/Navbar.jsx'
import Heading from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
export default function HomePage() {
    return(
        <>
        <nav>
            <Navbar />
        </nav>
        <main>
            <div className="bg-img">
                <Heading />
            </div>
        </main>
        <footer className="absolute bottom-0">
            <Footer />
        </footer>
        </>
    )
}