/* eslint-disable no-unused-vars */
import React from "react";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

function HeroSection() {
  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] flex items-center bg-gradient-to-br from-white via-purple-50 to-white dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle Background Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 dark:bg-purple-900 rounded-full opacity-30 blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 dark:bg-blue-900 rounded-full opacity-20 blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
      >
        {/* Content Section */}
        <div className="space-y-8 text-center lg:text-left">
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight"
          >
            Explore the World through{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Boundless Words
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base md:text-lg text-zinc-600 dark:text-zinc-300 max-w-xl mx-auto lg:mx-0"
          >
            Dive into a universe of knowledge with curated articles, innovative
            insights, and transformative stories that spark curiosity and
            intellectual growth.
          </motion.p>

          {/* Call to Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <Button
              variant="outline"
              className="w-full sm:w-auto group relative overflow-hidden border-2 border-zinc-200 dark:border-zinc-700 hover:border-purple-500 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center">
                Start Reading
                <Check className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
            </Button>
            <Button className="w-full sm:w-auto group flex items-center justify-center text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300">
              Explore Topics
              <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 mt-8"
          >
            {[
              { value: "1K+", label: "Published Articles", icon: "📝" },
              { value: "50+", label: "Expert Writers", icon: "✍️" },
              { value: "10M+", label: "Monthly Readers", icon: "👥" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center"
              >
                <div className="text-3xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 flex items-center justify-center gap-1">
                  <span>{stat.icon}</span>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hidden lg:flex items-center justify-center"
        >
          <div className="relative w-full max-w-xl group">
            <img
              src="https://images.unsplash.com/photo-1485988412941-77a35537dae4?q=80&w=2992&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Blog Image Illustration"
              className="w-full h-auto rounded-2xl shadow-2xl object-cover transform transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default HeroSection;
