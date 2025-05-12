import Link from 'next/link';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#111827] border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Droply</h3>
            <p className="text-white text-sm">
              Secure and simple file sharing platform for everyone.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/Saksham-goel1107" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
                <FaGithub size="1.5rem" />
              </a>
              <a href="https://x.com/Saksham1199805" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
                <FaTwitter size="1.5rem" />
              </a>
              <a href="https://www.linkedin.com/in/saksham-goel-88b74b33a/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
                <FaLinkedin size="1.5rem" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-white hover:text-gray-300 text-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-white hover:text-gray-300 text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-white hover:text-gray-300 text-sm">
                  Features
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-white hover:text-gray-300 text-sm">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white hover:text-gray-300 text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-white hover:text-gray-300 text-sm">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-white hover:text-gray-300 text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white hover:text-gray-300 text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-white hover:text-gray-300 text-sm">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 py-6">
          <div className="text-center text-sm text-gray-300">
            <p>© {currentYear} Droply. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
