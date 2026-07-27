import { motion } from 'framer-motion'
import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-noir-black border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-noir-yellow flex items-center justify-center shadow-glow-yellow-sm">
                <span className="text-noir-black font-display font-bold text-xl">V</span>
              </div>
              <span className="text-xl font-display font-bold uppercase tracking-wider">
                <span className="text-white">Vibe</span>
                <span className="text-noir-yellow">Prompting</span>
              </span>
            </div>
            <p className="font-sans text-sm text-neutral-400 leading-relaxed">
              AI-powered prompt engineering for developers. Build better prompts, ship faster code.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-display uppercase mb-6 tracking-wider text-noir-yellow">Product</h3>
            <ul className="space-y-3">
              {['Generate', 'Explore', 'Pricing', 'Dashboard'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className="font-sans text-sm text-neutral-400 hover:text-noir-yellow transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-sm font-display uppercase mb-6 tracking-wider text-noir-yellow">Resources</h3>
            <ul className="space-y-3">
              {['Documentation', 'API Reference', 'Examples', 'Blog'].map((item) => (
                <li key={item}>
                  <Link
                    to="/docs"
                    className="font-sans text-sm text-neutral-400 hover:text-noir-yellow transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h3 className="text-sm font-display uppercase mb-6 tracking-wider text-noir-yellow">Connect</h3>
            <div className="flex gap-3 mb-6">
              {[
                { icon: Github, href: 'https://github.com' },
                { icon: Twitter, href: 'https://twitter.com' },
                { icon: Linkedin, href: 'https://linkedin.com' },
                { icon: Mail, href: 'mailto:hello@vibeprompting.com' },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2 }}
                  className="p-2.5 border border-neutral-800 text-neutral-500 hover:border-noir-yellow/50 hover:text-noir-yellow transition-all duration-300"
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
            <p className="font-mono text-xs text-neutral-600">
              hello@vibeprompting.com
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-sans text-sm text-neutral-500">
            © {currentYear} VibePrompting. All rights reserved.
          </p>
          
          <div className="flex items-center gap-2 font-sans text-sm text-neutral-500">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>for developers</span>
          </div>

          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Security'].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="font-sans text-sm text-neutral-500 hover:text-noir-yellow transition-colors duration-300"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Bottom Border - Yellow Glow Line */}
      <div className="h-px bg-gradient-to-r from-transparent via-noir-yellow/50 to-transparent"></div>
    </footer>
  )
}
