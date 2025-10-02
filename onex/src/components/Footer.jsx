import Logo from '../assets/Logo.png';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white text-black py-6 px-4 w-full border-t border-gray-300">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left Section: Logo + Info */}
        <div className="flex items-center gap-4">
          <img src={Logo} alt="Company Logo" className="h-10 w-auto" />
          <div className="text-sm">
            <p className="font-semibold">Mystery Masnion</p>
            <p className="text-gray-600">© {year}. All rights reserved.</p>
          </div>
        </div>

        {/* Right Section: Links */}
        <div className="flex flex-col md:flex-row items-center gap-6 text-sm">
          <div>
            <h3 className="font-semibold underline mb-1">Platform Policies</h3>
            <p className="text-gray-600">Terms · Privacy · Guidelines</p>
          </div>
          <div>
            <h3 className="font-semibold underline mb-1">Follow Us</h3>
            <p className="text-gray-600">Instagram · Twitter · LinkedIn</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
