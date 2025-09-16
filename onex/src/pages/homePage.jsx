import Navbar from '../components/Navbar.jsx'
import Heading from '../components/Header.jsx'
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
                <Heading />
            </div>
        </main>
        <section>
            <Body />
        </section>
        <footer className="absolute bottom-0">
            <Footer />
        </footer>
        </>
    )
}