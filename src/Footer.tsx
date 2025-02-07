import { motion } from 'framer-motion';
import { Instagram, Medal, Move } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: <Instagram className="w-4 h-4" />,
      href: "https://www.instagram.com/smanerefunrun25?igsh=bXRtemxyM2QzMHRw",
      label: "Instagram"
    },
    {
      icon: <Medal className="w-4 h-4" />,
      href: "#",
      label: "Medal"
    },
    {
      icon: <Move className="w-4 h-4" />,
      href: "#",
      label: "Running"
    }
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="fixed bottom-0 left-0 right-0 bg-black/30 backdrop-blur-md"
    >
      <div className="max-w-6xl mx-auto px-4 py-2">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="text-center md:text-left">
            <p className="text-white/90 text-xs">
              © {currentYear} SMAN 1 Turen
            </p>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={link.label}
              >
                {link.icon}
              </motion.a>
            ))}
          </div>

          <div className="text-white/70 text-xs text-center md:text-right hidden md:block">
            <p>Fun Run 2025</p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
