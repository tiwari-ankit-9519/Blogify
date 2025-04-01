/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Github,
  Twitter,
  Youtube,
  Linkedin,
  Mail,
  ArrowUp,
  BookOpen,
  PenLine,
  HomeIcon,
  User,
} from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const footerAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.footer
      className="bg-gradient-to-br from-zinc-50 to-purple-50 dark:from-zinc-900 dark:to-zinc-900/90 border-t border-zinc-200 dark:border-zinc-800 relative overflow-hidden"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={footerAnimation}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-200 dark:bg-purple-900 rounded-full opacity-10 dark:opacity-5 blur-3xl"></div>
        <div className="absolute top-0 left-1/3 w-72 h-72 bg-blue-100 dark:bg-blue-900 rounded-full opacity-10 dark:opacity-5 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Column 1: Logo & About */}
          <motion.div variants={fadeIn} className="md:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <h2 className="font-pacifico text-3xl bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Blogify
              </h2>
            </Link>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              A modern platform for sharing knowledge, stories, and insights
              across various topics.
            </p>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="flex space-x-4"
            >
              {[
                { icon: <Github size={18} />, href: "#", label: "GitHub" },
                { icon: <Twitter size={18} />, href: "#", label: "Twitter" },
                { icon: <Youtube size={18} />, href: "#", label: "YouTube" },
                { icon: <Linkedin size={18} />, href: "#", label: "LinkedIn" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  variants={fadeIn}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white dark:hover:text-white transition-all duration-300 shadow-sm"
                >
                  {social.icon}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div variants={fadeIn} className="md:col-span-1">
            <h3 className="text-zinc-900 dark:text-white font-bold text-lg mb-4">
              Quick Links
            </h3>
            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="space-y-3"
            >
              {[
                { icon: <HomeIcon size={16} />, label: "Home", href: "/" },
                {
                  icon: <BookOpen size={16} />,
                  label: "All Blogs",
                  href: "/all-blogs",
                },
                {
                  icon: <PenLine size={16} />,
                  label: "Write Blog",
                  href: "/create",
                },
                {
                  icon: <User size={16} />,
                  label: "Profile",
                  href: "/profile",
                },
              ].map((link, index) => (
                <motion.li key={index} variants={fadeIn}>
                  <Link
                    to={link.href}
                    className="text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 transition-colors"
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Column 3: Categories */}
          <motion.div variants={fadeIn} className="md:col-span-1">
            <h3 className="text-zinc-900 dark:text-white font-bold text-lg mb-4">
              Categories
            </h3>
            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="space-y-3"
            >
              {[
                "Technology",
                "ReactJS",
                "Web Development",
                "Programming",
                "UI/UX Design",
              ].map((category, index) => (
                <motion.li key={index} variants={fadeIn}>
                  <Link
                    to={`/all-blogs?category=${category}`}
                    className="text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {category}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Column 4: Newsletter */}
          <motion.div variants={fadeIn} className="md:col-span-1">
            <h3 className="text-zinc-900 dark:text-white font-bold text-lg mb-4">
              Newsletter
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              Subscribe to get notified about new blogs and updates.
            </p>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-zinc-900 dark:text-white placeholder-zinc-500"
                />
                <button className="absolute right-1 top-1 bottom-1 px-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:opacity-90 transition-opacity">
                  <Mail size={18} />
                </button>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-500">
                By subscribing, you agree to our Privacy Policy.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 my-8"></div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Blogify. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/privacy"
              className="text-zinc-600 dark:text-zinc-400 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-zinc-600 dark:text-zinc-400 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Terms of Service
            </Link>
            <button
              onClick={scrollToTop}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-300 shadow-sm"
              aria-label="Scroll to top"
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
