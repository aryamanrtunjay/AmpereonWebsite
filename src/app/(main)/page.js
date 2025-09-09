'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Zap, 
  ArrowRight, 
  Check, 
  Battery, 
  DollarSign,
  Leaf,
  Shield,
  Clock,
  TrendingUp,
  Award,
  Users,
  Play,
  X,
  Menu,
  Star
} from 'lucide-react';
import Image from 'next/image';

// Import Logo - you'll need to add this
// import Logo from '../../images/Logo.png';

const AmpereonLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const { scrollY } = useScroll();
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  
  // Parallax transforms
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Floating particles background
  const FloatingParticles = () => {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden">
      {/* Premium Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/80 border-b border-zinc-900"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Zap className="w-8 h-8 text-yellow-500" />
              <span className="text-2xl font-light tracking-wider">AMPEREON</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-10">
              <a href="#benefits" className="text-sm font-light text-gray-300 hover:text-yellow-500 transition-colors duration-300">
                Benefits
              </a>
              <a href="#how" className="text-sm font-light text-gray-300 hover:text-yellow-500 transition-colors duration-300">
                How It Works
              </a>
              <a href="#pricing" className="text-sm font-light text-gray-300 hover:text-yellow-500 transition-colors duration-300">
                Pricing
              </a>
              <motion.button
                className="px-6 py-2.5 bg-yellow-500 text-black font-medium text-sm rounded-full hover:bg-yellow-400 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Free Trial
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              <a href="#benefits" className="text-2xl font-light" onClick={() => setIsMenuOpen(false)}>Benefits</a>
              <a href="#how" className="text-2xl font-light" onClick={() => setIsMenuOpen(false)}>How It Works</a>
              <a href="#pricing" className="text-2xl font-light" onClick={() => setIsMenuOpen(false)}>Pricing</a>
              <button className="px-8 py-3 bg-yellow-500 text-black font-medium rounded-full">
                Start Free Trial
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section - Premium Minimalist */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20">
        <FloatingParticles />
        
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black opacity-50" />
        
        <motion.div 
          className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 text-center"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full mb-8"
          >
            <Award className="w-4 h-4 text-yellow-500" />
            <span className="text-xs font-medium text-yellow-500 uppercase tracking-wider">
              #1 Smart Charging Platform 2025
            </span>
          </motion.div>

          {/* Main Headline - Bold & Direct */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-thin leading-tight mb-6"
          >
            Charge smart.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 font-normal">
              Save $530/year.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 font-light"
          >
            AI-powered charging optimization that works with your existing EV. 
            No hardware. Just intelligence.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              className="group px-8 py-4 bg-yellow-500 text-black font-medium rounded-full text-lg hover:bg-yellow-400 transition-all duration-300 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Calculate Your Savings
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            
            <button className="px-8 py-4 border border-zinc-800 rounded-full text-lg font-light hover:border-zinc-600 transition-all duration-300">
              Watch Demo (2 min)
            </button>
          </motion.div>

          {/* Social Proof Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500"
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>10,000+ drivers</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>$5.3M saved</span>
            </div>
            <div className="flex items-center gap-2">
              <Battery className="w-4 h-4" />
              <span>15M kWh optimized</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6 text-gray-600" />
        </motion.div>
      </section>

      {/* Client Logos - Trust Building */}
      <section className="py-20 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <p className="text-center text-sm text-gray-500 uppercase tracking-widest mb-12">
            Trusted by leading companies
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-50">
            {/* Add actual client logos here */}
            {['Tesla', 'BMW', 'Ford', 'Audi', 'Mercedes', 'Rivian'].map((brand) => (
              <div key={brand} className="text-center text-2xl font-light text-gray-600">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section - Bento Grid */}
      <section id="benefits" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-thin mb-4">
              Why drivers choose{' '}
              <span className="text-yellow-500">Ampereon</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Advanced optimization that pays for itself in one week
            </p>
          </motion.div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Large Card - Savings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 bg-gradient-to-br from-zinc-900 to-black p-8 rounded-3xl border border-zinc-800 hover:border-yellow-500/30 transition-all duration-500"
            >
              <DollarSign className="w-10 h-10 text-yellow-500 mb-4" />
              <h3 className="text-3xl font-light mb-4">Intelligent Savings</h3>
              <p className="text-gray-400 text-lg mb-6">
                Our AI analyzes real-time electricity rates and your driving patterns to charge 
                during the cheapest hours automatically.
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-thin text-yellow-500">$530</span>
                <span className="text-gray-400">average annual savings</span>
              </div>
            </motion.div>

            {/* Battery Health */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 hover:border-yellow-500/30 transition-all duration-500"
            >
              <Battery className="w-10 h-10 text-yellow-500 mb-4" />
              <h3 className="text-2xl font-light mb-4">Battery Preservation</h3>
              <p className="text-gray-400 mb-4">
                Extend battery life by 3+ years with optimized charging windows.
              </p>
              <div className="text-3xl font-thin text-yellow-500">+40%</div>
              <div className="text-sm text-gray-500">lifespan increase</div>
            </motion.div>

            {/* Environmental Impact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 hover:border-yellow-500/30 transition-all duration-500"
            >
              <Leaf className="w-10 h-10 text-yellow-500 mb-4" />
              <h3 className="text-2xl font-light mb-4">Carbon Reduction</h3>
              <p className="text-gray-400 mb-4">
                Charge when energy is cleanest. Reduce emissions automatically.
              </p>
              <div className="text-3xl font-thin text-yellow-500">-300kg</div>
              <div className="text-sm text-gray-500">CO₂ per year</div>
            </motion.div>

            {/* Security */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 hover:border-yellow-500/30 transition-all duration-500"
            >
              <Shield className="w-10 h-10 text-yellow-500 mb-4" />
              <h3 className="text-2xl font-light mb-4">Bank-Level Security</h3>
              <p className="text-gray-400 mb-4">
                OAuth 2.0, end-to-end encryption, SOC 2 certified.
              </p>
              <div className="flex gap-2">
                {['SOC2', 'ISO', 'GDPR'].map((cert) => (
                  <span key={cert} className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-xs rounded-full">
                    {cert}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Time Saved */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 hover:border-yellow-500/30 transition-all duration-500"
            >
              <Clock className="w-10 h-10 text-yellow-500 mb-4" />
              <h3 className="text-2xl font-light mb-4">Zero Effort</h3>
              <p className="text-gray-400 mb-4">
                Set once, forget forever. Full automation from day one.
              </p>
              <div className="text-3xl font-thin text-yellow-500">0 min</div>
              <div className="text-sm text-gray-500">daily management</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works - Clean Process */}
      <section id="how" className="py-32 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-thin mb-4">
              Start saving in <span className="text-yellow-500">3 minutes</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              No hardware installation. No complex setup. Just smart charging.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Connect Your EV',
                description: 'Secure OAuth connection to your vehicle. Works with all major brands.',
                icon: <Zap className="w-6 h-6" />
              },
              {
                step: '02',
                title: 'AI Learns Your Routine',
                description: 'Our system analyzes your patterns and local rates in real-time.',
                icon: <TrendingUp className="w-6 h-6" />
              },
              {
                step: '03',
                title: 'Automatic Optimization',
                description: 'Charging schedules itself. You save money without thinking.',
                icon: <DollarSign className="w-6 h-6" />
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-7xl font-thin text-zinc-900 mb-4">{step.step}</div>
                <div className="bg-zinc-900/30 p-6 rounded-2xl border border-zinc-800 hover:border-yellow-500/30 transition-all duration-300">
                  <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500 mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Rotating */}
      <section className="py-32 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-thin mb-4">
              Trusted by <span className="text-yellow-500">10,000+</span> drivers
            </h2>
          </motion.div>

          <div className="relative h-64">
            <AnimatePresence mode="wait">
              {[
                {
                  quote: "Cut my charging costs by 42% in the first month. The AI perfectly times my overnight charging.",
                  author: "Sarah Chen",
                  role: "Tesla Model 3 Owner",
                  rating: 5
                },
                {
                  quote: "Our fleet of 50 vehicles saves $2,800/month. ROI was immediate. Implementation took 10 minutes.",
                  author: "Michael Rodriguez",
                  role: "Fleet Operations Manager",
                  rating: 5
                },
                {
                  quote: "Battery health improved by 15% after 6 months. Wish I had started using Ampereon sooner.",
                  author: "David Park",
                  role: "BMW iX Driver",
                  rating: 5
                }
              ].map((testimonial, index) => (
                index === activeTestimonial && (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center"
                  >
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <p className="text-xl sm:text-2xl font-light text-gray-300 mb-6 max-w-3xl">
                      "{testimonial.quote}"
                    </p>
                    <div>
                      <p className="font-medium">{testimonial.author}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>

          {/* Testimonial Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeTestimonial ? 'w-8 bg-yellow-500' : 'bg-zinc-700'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing - Simple & Clear */}
      <section id="pricing" className="py-32 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-thin mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-400">
              One plan. All features. Cancel anytime.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-zinc-900 to-black p-8 sm:p-12 rounded-3xl border border-zinc-800 relative overflow-hidden"
          >
            {/* Premium badge */}
            <div className="absolute top-8 right-8">
              <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-xs rounded-full uppercase tracking-wider">
                Launch Pricing
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <div className="text-6xl font-thin mb-2">
                  $8.49<span className="text-2xl text-gray-400">/mo</span>
                </div>
                <p className="text-gray-400 mb-8">
                  Pays for itself in one week of use
                </p>
                
                <motion.button
                  className="w-full px-8 py-4 bg-yellow-500 text-black font-medium rounded-full text-lg hover:bg-yellow-400 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start 7-Day Free Trial
                </motion.button>
                
                <p className="text-sm text-gray-500 mt-4 text-center">
                  No credit card required • Cancel anytime
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-light mb-4">Everything included:</h3>
                {[
                  'Unlimited smart charging optimization',
                  'Real-time rate monitoring',
                  'Battery health protection',
                  'All vehicle brands supported',
                  'Priority customer support',
                  'Advanced analytics dashboard'
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Value Proposition */}
            <div className="mt-12 pt-8 border-t border-zinc-800">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-2xl font-light text-yellow-500">$530</div>
                  <div className="text-sm text-gray-400">Avg. annual savings</div>
                </div>
                <div>
                  <div className="text-2xl font-light text-yellow-500">10,000+</div>
                  <div className="text-sm text-gray-400">Active users</div>
                </div>
                <div>
                  <div className="text-2xl font-light text-yellow-500">4.9/5</div>
                  <div className="text-sm text-gray-400">App Store rating</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-thin mb-6">
              Ready to start saving?
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Join 10,000+ drivers who save an average of $530 per year with zero effort.
            </p>
            
            <motion.button
              className="group px-10 py-5 bg-yellow-500 text-black font-medium rounded-full text-lg hover:bg-yellow-400 transition-all duration-300 inline-flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Calculate Your Savings
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-yellow-500" />
                <span>7-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-yellow-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-yellow-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="w-8 h-8 text-yellow-500" />
                <span className="text-2xl font-light tracking-wider">AMPEREON</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                The most advanced EV charging optimization platform. 
                Save money, extend battery life, reduce emissions.
              </p>
              <div className="flex space-x-4">
                {/* Social Media Icons */}
                <a href="#" className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-all duration-300">
                  <span className="text-sm font-bold">X</span>
                </a>
                <a href="#" className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-all duration-300">
                  <span className="text-sm font-bold">LI</span>
                </a>
                <a href="#" className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-all duration-300">
                  <span className="text-sm font-bold">YT</span>
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-medium mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-yellow-500 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition-colors">API</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-medium mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-yellow-500 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition-colors">Documentation</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-zinc-900 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2025 Ampereon. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400 mt-4 md:mt-0">
              <a href="#" className="hover:text-yellow-500 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-yellow-500 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-yellow-500 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AmpereonLanding;