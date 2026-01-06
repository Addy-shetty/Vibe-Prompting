import { motion } from 'framer-motion'
import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-neo-black text-white border-t-3 border-black">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-12 h-12 bg-neo-pink border-3 border-white flex items-center justify-center shadow-neo-sm">
                <span className="text-white font-black text-2xl">V</span>
              </div>
              <span className="text-2xl font-black uppercase tracking-tighter">
                Vibe<span className="text-neo-yellow">Prompting</span>
              </span>
            </div>
            <p className="font-mono font-bold text-sm text-neutral-300 leading-relaxed">
              AI-powered prompt engineering for developers. Build better prompts, ship faster code.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-black uppercase mb-6 tracking-wider">Product</h3>
            <ul className="space-y-3">
              {['Generate', 'Explore', 'Pricing', 'Dashboard'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className="font-mono font-bold text-sm text-neutral-300 hover:text-neo-green transition-colors hover:underline decoration-2 underline-offset-4"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-lg font-black uppercase mb-6 tracking-wider">Resources</h3>
            <ul className="space-y-3">
              {['Documentation', 'API Reference', 'Examples', 'Blog'].map((item) => (
                <li key={item}>
                  <Link
                    to="/docs"
                    className="font-mono font-bold text-sm text-neutral-300 hover:text-neo-blue transition-colors hover:underline decoration-2 underline-offset-4"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h3 className="text-lg font-black uppercase mb-6 tracking-wider">Connect</h3>
            <div className="flex gap-4 mb-6">
              {[
                { icon: Github, href: 'https://github.com', color: 'hover:bg-neo-green' },
                { icon: Twitter, href: 'https://twitter.com', color: 'hover:bg-neo-blue' },
                { icon: Linkedin, href: 'https://linkedin.com', color: 'hover:bg-neo-pink' },
                { icon: Mail, href: 'mailto:hello@vibeprompting.com', color: 'hover:bg-neo-sunshine' },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3 }}
                  className={`p-3 bg-white border-3 border-white text-black ${social.color} hover:text-black transition-all shadow-neo-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] duration-150`}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
            <p className="font-mono font-bold text-xs text-neutral-400">
              hello@vibeprompting.com
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-3 border-neutral-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono font-bold text-sm text-neutral-400">
            © {currentYear} VibePrompting. All rights reserved.
          </p>
          
          <div className="flex items-center gap-2 font-mono font-bold text-sm text-neutral-400">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-neo-pink fill-neo-pink animate-pulse" />
            <span>for developers</span>
          </div>

          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Security'].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="font-mono font-bold text-sm text-neutral-400 hover:text-white transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Bottom Border */}
      <div className="h-2 bg-gradient-to-r from-neo-pink via-neo-blue to-neo-green"></div>
    </footer>
  )
}
