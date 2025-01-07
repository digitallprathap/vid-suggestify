import { Link } from "react-router-dom";
import { Youtube } from "lucide-react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-youtube-light">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-youtube-red">
            <Youtube size={32} />
            <span className="text-xl font-bold">YT Keywords Generator</span>
          </Link>
          <Link
            to="/admin/login"
            className="text-sm text-gray-600 hover:text-youtube-red"
          >
            Admin Login
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <Link to="/privacy-policy" className="hover:text-youtube-red">
              Privacy Policy
            </Link>
            <Link to="/terms-and-conditions" className="hover:text-youtube-red">
              Terms & Conditions
            </Link>
            <Link to="/about-us" className="hover:text-youtube-red">
              About Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;