'use client';
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronDown, Zap, Smartphone, DollarSign, Battery, Clock, ChevronRight, Check, Shield, BarChart3, Wifi, Download, Star } from 'lucide-react';
import Image from 'next/image';
import Logo from '../../images/Logo.png';

// Lazy load non-critical components
const SubtlePattern = React.lazy(() => Promise.resolve({ default: ({ opacity = 0.02 }) => (
  <div className="absolute inset-0 pointer-events-none z-0" style={{ opacity }}>
    <div className="w-full h-full bg-[radial-gradient(circle,#D4AF37_1px,transparent_1px)] bg-[size:60px_60px]" />
  </div>
) }));

// Animated hero background (Canvas): connected network, random flowing particles, no stretching
const HeroBackground = React.memo(() => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let rafId;
    let running = true;

  const DPR = Math.min(window.devicePixelRatio || 1, 2);

    // Resize to container size
    const resize = () => {
      const { clientWidth, clientHeight } = canvas;
      canvas.width = Math.max(1, Math.floor(clientWidth * DPR));
      canvas.height = Math.max(1, Math.floor(clientHeight * DPR));
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      buildNetwork();
    };

    // Network data
    let nodes = [];
    let edges = []; // [{a: index, b: index, len}]
    let adjacency = new Map();
    let particles = [];

    const gold = 'rgba(212,175,55,';

    const buildNetwork = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      nodes = [];
      edges = [];
      adjacency = new Map();

      // Place nodes on a jittered grid, expanded beyond edges for off-screen bleed
      const bleed = Math.max(w, h) * 0.1;
      const effW = w + bleed * 2;
      const effH = h + bleed * 2;
      const cols = Math.max(8, Math.floor(w / 160));
      const rows = Math.max(6, Math.floor(h / 140));
      const xGap = effW / (cols + 1);
      const yGap = effH / (rows + 1);
      for (let r = 0; r <= rows + 1; r++) {
        for (let c = 0; c <= cols + 1; c++) {
          const jx = (Math.random() - 0.5) * xGap * 0.35;
          const jy = (Math.random() - 0.5) * yGap * 0.35;
          nodes.push({
            x: -bleed + c * xGap + jx,
            y: -bleed + r * yGap + jy,
            pulsePhase: Math.random() * Math.PI * 2
          });
        }
      }

      // Connect each node to its 2-3 nearest neighbors to form a cohesive graph
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const dists = nodes.map((m, j) => ({ j, d: i === j ? Infinity : (m.x - n.x) ** 2 + (m.y - n.y) ** 2 }));
        dists.sort((a, b) => a.d - b.d);
        const degree = 2 + Math.floor(Math.random() * 2); // 2 or 3
        for (let k = 0; k < degree; k++) {
          const j = dists[k].j;
          if (j == null) continue;
          const a = Math.min(i, j), b = Math.max(i, j);
          const key = `${a}-${b}`;
          if (!edges.some(e => e.key === key)) {
            const len = Math.sqrt(dists[k].d);
            edges.push({ a, b, len, key });
            if (!adjacency.has(a)) adjacency.set(a, []);
            if (!adjacency.has(b)) adjacency.set(b, []);
            adjacency.get(a).push(b);
            adjacency.get(b).push(a);
          }
        }
      }

      // Build particles traveling along edges with random timing and speed
      particles = [];
    const particleCount = Math.min(40, Math.floor(edges.length * 0.7));
      for (let i = 0; i < particleCount; i++) {
        const e = edges[Math.floor(Math.random() * edges.length)];
        const dir = Math.random() < 0.5 ? 1 : -1;
        particles.push({
          edgeIndex: edges.indexOf(e),
          t: Math.random(),
      speed: 0.06 + Math.random() * 0.12, // fraction of edge per second
          dir,
          pause: 0
        });
      }
    };

    const pickNextEdgeFromNode = (nodeIdx, prevEdgeIdx) => {
      const neighbors = adjacency.get(nodeIdx) || [];
      if (neighbors.length === 0) return prevEdgeIdx;
      // pick a neighbor and find edge index
      const candidate = neighbors[Math.floor(Math.random() * neighbors.length)];
      const a = Math.min(nodeIdx, candidate), b = Math.max(nodeIdx, candidate);
      const edgeIdx = edges.findIndex(e => e.a === a && e.b === b);
      return edgeIdx >= 0 ? edgeIdx : prevEdgeIdx;
    };

    let last = performance.now();
    const loop = (now) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      // Faint background grid lines (non-stretched, absolute px spacing)
      const gridStep = Math.max(60, Math.min(120, Math.floor(Math.max(w, h) / 12)));
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255,255,255,0.07)';
      ctx.beginPath();
      for (let x = -gridStep; x <= w + gridStep; x += gridStep) {
        ctx.moveTo(x, -gridStep);
        ctx.lineTo(x, h + gridStep);
      }
      for (let y = -gridStep; y <= h + gridStep; y += gridStep) {
        ctx.moveTo(-gridStep, y);
        ctx.lineTo(w + gridStep, y);
      }
      ctx.stroke();

  // Draw edges (thicker, brighter)
  ctx.lineWidth = 1.8;
  ctx.strokeStyle = `${gold}0.35)`;
      ctx.beginPath();
      for (const e of edges) {
        const A = nodes[e.a], B = nodes[e.b];
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
      }
      ctx.stroke();

      // Draw nodes (soft pulse)
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const pulse = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(n.pulsePhase + now * 0.001 * (0.6 + Math.random() * 0.2)));
        const r = 3 + pulse; // slightly larger nodes
        ctx.shadowColor = `${gold}0.6)`;
        ctx.shadowBlur = 14;
        ctx.fillStyle = `${gold}0.9)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Update and draw particles
      for (const p of particles) {
        if (p.pause > 0) {
          p.pause -= dt;
          continue;
        }
        const e = edges[p.edgeIndex];
        const from = p.dir > 0 ? nodes[e.a] : nodes[e.b];
        const to = p.dir > 0 ? nodes[e.b] : nodes[e.a];
        p.t += p.speed * dt;
        if (p.t >= 1) {
          // Arrived at node, pick a new edge from this node
          const atIdx = p.dir > 0 ? e.b : e.a;
          const nextEdge = pickNextEdgeFromNode(atIdx, p.edgeIndex);
          // Avoid immediate reversal
          if (nextEdge === p.edgeIndex) {
            p.dir *= Math.random() < 0.5 ? -1 : 1;
          } else {
            // adjust direction based on connectivity
            const ne = edges[nextEdge];
            const connectsForward = (atIdx === ne.a);
            p.dir = connectsForward ? 1 : -1;
            p.edgeIndex = nextEdge;
          }
          p.t = 0;
          p.pause = Math.random() * 0.4;
          p.speed = 0.05 + Math.random() * 0.15;
          continue;
        }
        const x = from.x + (to.x - from.x) * p.t;
        const y = from.y + (to.y - from.y) * p.t;
        const alpha = 0.7 + 0.3 * Math.sin((now * 0.003) + p.edgeIndex);
  ctx.fillStyle = `${gold}${alpha.toFixed(2)})`;
  ctx.shadowColor = `${gold}0.9)`;
  ctx.shadowBlur = 12;
        ctx.beginPath();
  ctx.arc(x, y, 3, 0, Math.PI * 2); // larger particles
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      rafId = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener('resize', resize);
    rafId = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {/* Aurora-like gradient blobs */}
      <motion.div
        className="absolute -top-24 -right-16 w-[42rem] h-[42rem] rounded-full"
        style={{
          background: 'radial-gradient(closest-side, rgba(212,175,55,0.25), rgba(212,175,55,0))',
          filter: 'blur(40px)'
        }}
        initial={{ opacity: 0.25, scale: 0.95 }}
        animate={{ opacity: 0.35, scale: 1.05 }}
        transition={{ duration: 6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute -bottom-24 -left-24 w-[38rem] h-[38rem] rounded-full"
        style={{
          background: 'radial-gradient(closest-side, rgba(184,134,11,0.22), rgba(184,134,11,0))',
          filter: 'blur(48px)'
        }}
        initial={{ opacity: 0.2, scale: 1.05 }}
        animate={{ opacity: 0.3, scale: 0.95 }}
        transition={{ duration: 7, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      />

      {/* Canvas network (no stretching) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Soft vignette */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.6) 100%)'
      }} />
    </div>
  );
});

const AmpereonLanding = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const heroRef = useRef(null);

  // Counter component to handle individual metric counters
  const CounterMetric = ({ metric, index }) => {
    const { count, ref } = useCounter(metric.value);
    
    return (
      <motion.div
        ref={ref}
        className="bg-[#2A2A2A]/60 backdrop-blur-sm rounded-xl p-8 text-center border border-[#D4AF37]/20
                 hover:border-[#D4AF37]/40 hover:bg-[#2A2A2A]/80 transition-all duration-300"
        variants={fadeUpVariants}
        transition={{ delay: index * 0.2 }}
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="mb-6">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/20 
                        flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]/30">
            <div className="text-[#D4AF37]">{metric.icon}</div>
          </div>
        </div>
        
        <div className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-2">
          {metric.prefix}{count}{metric.suffix}
        </div>
        <div className="text-lg text-white font-medium mb-4">{metric.label}</div>
        
        <p className="text-gray-300 text-sm leading-relaxed mb-6">{metric.how}</p>
        
        <div className="space-y-2">
          {metric.advantages.map((advantage, j) => (
            <div key={j} className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <Check className="w-3 h-3 text-[#D4AF37] flex-shrink-0" />
              <span>{advantage}</span>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  const useCounter = (end, duration = 2000) => {
    const [count, setCount] = useState(0);
    const ref = useRef();
    const inView = useInView(ref, { once: true });
    
    useEffect(() => {
      if (inView) {
        let startTime;
        const animate = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          setCount(Math.floor(progress * end));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, [inView, end, duration]);
    
    return { count, ref };
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

  // Detect user's device for app store links
  const getAppStoreLink = () => {
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent;
      if (/iPhone|iPad|iPod/i.test(userAgent)) {
        return 'https://apps.apple.com/app/ampereon'; // Placeholder
      } else if (/Android/i.test(userAgent)) {
        return 'https://play.google.com/store/apps/details?id=com.ampereon'; // Placeholder
      }
    }
    return 'https://apps.apple.com/app/ampereon'; // Default to App Store
  };

  // Key features of the SaaS smart charging app
  const features = [
    { 
      icon: <Zap className="w-6 h-6" />, 
      title: "AmplifyAI Smart Scheduling", 
      desc: "AmplifyAI learns your driving patterns and schedules charging when electricity rates are lowest, automatically saving you money while ensuring your car is ready when you need it.", 
      stats: [{ value: "$266", label: "Avg yearly savings" }]
    },
    { 
      icon: <Battery className="w-6 h-6" />, 
      title: "Battery Health Optimization", 
      desc: "AmplifyAI's advanced algorithms prevent overcharging and optimize charging cycles to extend your EV battery life by up to 3 years, protecting your investment and maximizing resale value.", 
      stats: [{ value: "3yrs", label: "Extended battery life" }]
    },
    { 
      icon: <BarChart3 className="w-6 h-6" />, 
      title: "Real-Time Cost Tracking", 
      desc: "Monitor your charging costs in real-time with detailed analytics showing exactly how much you're saving. Get monthly reports and track your environmental impact.", 
      stats: [{ value: "$22.18", label: "Monthly savings" }]
    },
    { 
      icon: <Smartphone className="w-6 h-6" />, 
      title: "Universal Compatibility", 
      desc: "Works with any EV make and model through our smart app. No additional hardware needed - just download, connect, and start saving immediately.", 
      stats: [{ value: "100%", label: "EV compatibility" }]
    }
  ];

  // Updated metrics for SaaS smart charging app
  const savingsMetrics = [
    { 
      value: 266, prefix: "$", suffix: "", label: "Annual Savings per Car", 
      how: "Save up to $22.18 monthly through AmplifyAI-optimized charging schedules that automatically charge during off-peak hours when electricity rates are lowest.", 
      icon: <DollarSign className="w-5 h-5" />,
      advantages: ["Automatic optimization", "No manual scheduling", "Works with any utility"]
    },
    { 
      value: 3, prefix: "", suffix: " years", label: "Extended Battery Life", 
      how: "AmplifyAI prevents battery degradation by optimizing charging patterns, potentially extending your EV battery life by up to 3 years.", 
      icon: <Battery className="w-5 h-5" />,
      advantages: ["Smart charging curves", "Temperature awareness", "Degradation prevention"]
    },
    { 
      value: 849, prefix: "$", suffix: "", label: "Annual Subscription Value", 
      how: "At just $8.49/month, Ampereon pays for itself in just over 2 weeks through intelligent charging optimization and battery protection.", 
      icon: <Clock className="w-5 h-5" />,
      advantages: ["Instant setup", "No hardware costs", "Cancel anytime"]
    }
  ];

  // Updated testimonials for the SaaS app
  const testimonials = [
    {
      name: "Kirit S.",
      quote: "This app has saved me over $200 already this year! AmplifyAI automatically charges my car when rates are cheapest - I don't have to think about it.",
      rating: 5,
    },
    {
      name: "Andreas G.",
      quote: "My battery health has noticeably improved since using Ampereon. The smart algorithms really do extend battery life.",
      rating: 5,
    },
    {
      name: "Vivaan P.",
      quote: "Setup took 2 minutes and I immediately started saving money. The monthly reports show exactly how much I'm saving.",
      rating: 5,
    },
    {
      name: "Peter Z.",
      quote: "For $8.49 a month, this app pays for itself in the first week. Best investment I've made for my EV.",
      rating: 5,
    },
  ];

  return (
  <div className="bg-[#0A0A0A] text-white">
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        ref={heroRef}
      >
  <Suspense fallback={null}><HeroBackground /></Suspense>
  <Suspense fallback={null}><SubtlePattern /></Suspense>
        
  <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#1A1A1A]/10 via-[#0A0A0A]/25 to-[#0A0A0A]/50" />

        {/* Hero content for SaaS app */}
        <motion.div
          className="relative z-20 px-6 max-w-6xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Ampereon Logo */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <Image 
              src={Logo} 
              alt="Ampereon" 
              className="h-16 w-auto"
              priority
            />
          </motion.div>

          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Zap className="w-4 h-4" />
            AI-Powered Smart Charging
          </motion.div>

          <h1 className="font-light leading-tight mb-8 text-white"
              style={{ fontSize: 'clamp(2.5rem,5.5vw,4.5rem)' }}>
            Save <span className="font-bold text-[#D4AF37]">$266/year</span> on EV charging <br />
            with <span className="font-bold text-[#D4AF37]">AmplifyAI automation</span>
          </h1>

          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light mb-8">
            Ampereon's intelligent app learns your routine and automatically charges your EV when electricity is cheapest. 
            Extend battery life by up to 3 years while saving $22.18 every month. No hardware needed.
          </p>

          {/* Value proposition badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <DollarSign className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-white font-medium">$22.18/month savings</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <Battery className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-white font-medium">3 years longer battery</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <Smartphone className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-white font-medium">Just $8.49/month</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6 mb-12">
            <a href={getAppStoreLink()} target="_blank" rel="noopener noreferrer">
              <button
                className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-medium rounded-lg
                          hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all duration-300 flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download App - Start Saving
              </button>
            </a>

            <button
              className="px-8 py-4 border border-[#D4AF37]/30 text-white font-medium rounded-lg
                        hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/50 transition-all duration-300 backdrop-blur-sm"
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4" />
                See How It Works
              </span>
            </button>
          </div>

          {/* Trust indicators for SaaS */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#D4AF37]" />
              <span>7-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#D4AF37]" />
              <span>No setup fees</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#D4AF37]" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <motion.button
            className="p-3 rounded-full border border-white/20 hover:border-[#D4AF37]/50 transition-colors duration-300"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
          >
            <ChevronDown className="w-6 h-6 text-gray-400" />
          </motion.button>
        </motion.div>
      </section>

      {/* Features Section */}
      <Suspense fallback={null}>
        <motion.section 
          className="py-20 px-6 bg-gradient-to-br from-[#0F0F0F] to-[#1A1A1A] relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <Suspense fallback={null}><SubtlePattern /></Suspense>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light mb-6 text-white" id="features">
                Why Choose <span className="font-semibold text-[#D4AF37]">Ampereon</span>
              </h2>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
                The intelligent charging app powered by AmplifyAI that saves money, extends battery life, and works with any EV. 
                No hardware needed - just download and start saving.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  className="group"
                  variants={fadeUpVariants}
                  transition={{ delay: i * 0.1 }}
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <div className="bg-[#2A2A2A]/60 backdrop-blur-sm rounded-xl p-8 h-full border border-[#D4AF37]/20 
                               hover:border-[#D4AF37]/40 hover:bg-[#2A2A2A]/80 transition-all duration-300">
                    <div className="flex items-start gap-6">
                      <div className="flex items-center justify-center w-12 h-12 mb-4
                                    bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/20 rounded-lg 
                                    border border-[#D4AF37]/30 text-[#D4AF37] flex-shrink-0">
                        {feature.icon}
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                        <p className="text-gray-300 leading-relaxed mb-4">{feature.desc}</p>
                        <div className="grid grid-cols-1 gap-2">
                          {feature.stats.map((stat, j) => (
                            <div key={j} className="bg-[#D4AF37]/10 rounded-lg p-3 text-center border border-[#D4AF37]/20">
                              <div className="text-lg font-bold text-[#D4AF37]">{stat.value}</div>
                              <div className="text-xs text-gray-300">{stat.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </Suspense>

      {/* How It Works Section */}
      <Suspense fallback={null}>
        <motion.section 
          className="py-20 px-6 bg-[#1A1A1A] relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <Suspense fallback={null}><SubtlePattern /></Suspense>
          
          <div className="max-w-7xl mx-auto">
            <motion.div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light mb-6 text-white">
                How <span className="font-semibold text-[#D4AF37]">Ampereon</span> Works
              </h2>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
                Get started in minutes. AmplifyAI immediately begins learning your patterns to maximize savings.
              </p>
            </motion.div>

            {/* How it works steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  step: "01",
                  title: "Download & Connect",
                  desc: "Download the app, create your account, and connect your EV. Works with Tesla, BMW, Ford, Chevy, and all major brands.",
                  icon: <Download className="w-8 h-8" />
                },
                {
                  step: "02", 
                  title: "AI Learns Your Routine",
                  desc: "Our intelligent system analyzes your driving patterns, local electricity rates, and charging needs to create an optimal schedule.",
                  icon: <Zap className="w-8 h-8" />
                },
                {
                  step: "03",
                  title: "Automatic Savings",
                  desc: "Sit back and save. The app automatically schedules charging during off-peak hours and monitors your battery health 24/7.",
                  icon: <DollarSign className="w-8 h-8" />
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="bg-[#2A2A2A]/60 backdrop-blur-sm rounded-xl p-8 border border-[#D4AF37]/20 text-center
                           hover:border-[#D4AF37]/40 transition-all duration-300"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUpVariants}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/20 
                                flex items-center justify-center mx-auto mb-6 border border-[#D4AF37]/30">
                    <div className="text-[#D4AF37]">{step.icon}</div>
                  </div>
                  
                  <div className="text-sm font-medium text-[#D4AF37] mb-3">
                    STEP {step.step}
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4 text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* App preview mockup */}
            <div className="bg-[#2A2A2A]/60 backdrop-blur-sm rounded-xl p-8 border border-[#D4AF37]/20">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/2">
                  <h3 className="text-3xl font-light mb-4 text-white">Smart Dashboard</h3>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    Track your savings in real-time with detailed analytics. Monitor charging costs, 
                    battery health, and environmental impact all in one place.
                  </p>
                  
                  <ul className="space-y-3 mb-8">
                    {[
                      "Real-time cost tracking",
                      "Battery health monitoring", 
                      "Charging schedule optimization",
                      "Monthly savings reports",
                      "Environmental impact metrics"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-300">
                        <Check className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                        <span className="text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a href={getAppStoreLink()} target="_blank" rel="noopener noreferrer">
                    <button className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-medium rounded-lg
                                     hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all duration-300 flex items-center gap-2">
                      <Download className="w-5 h-5" />
                      Download Now
                    </button>
                  </a>
                </div>
                <div className="md:w-1/2">
                  <div className="bg-gradient-to-br from-[#2A2A2A]/40 to-[#1A1A1A]/60 rounded-2xl p-8 max-w-sm mx-auto border border-[#D4AF37]/20">
                    <div className="text-center">
                      <div className="w-full h-64 bg-[#1A1A1A] rounded-lg border border-[#D4AF37]/30 flex items-center justify-center mb-4">
                        <div className="text-[#D4AF37]/60">
                          <Smartphone className="w-16 h-16 mx-auto mb-4" />
                          <div className="text-sm font-medium">App Preview</div>
                          <div className="text-xs text-gray-400 mt-1">Coming Soon</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">
                        See your real-time savings and charging analytics
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </Suspense>

      {/* Pricing Section */}
      <Suspense fallback={null}>
        <motion.section 
          className="py-20 px-6 bg-gradient-to-br from-[#0F0F0F] to-[#1A1A1A] relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariants}
        >
          <Suspense fallback={null}><SubtlePattern /></Suspense>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.h2 
              className="text-4xl md:text-5xl font-light mb-6 leading-tight text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              Simple <span className="font-semibold text-[#D4AF37]">Pricing</span>
            </motion.h2>
            
            <motion.p 
              className="text-xl mb-12 text-gray-300 max-w-2xl mx-auto font-light"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Start saving immediately. Cancel anytime.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Free Trial */}
              <motion.div 
                className="bg-[#2A2A2A]/60 backdrop-blur-sm rounded-xl p-8 border border-[#D4AF37]/20
                         hover:border-[#D4AF37]/40 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <h3 className="text-2xl font-semibold text-white mb-4">Free Trial</h3>
                <div className="text-4xl font-bold text-[#D4AF37] mb-2">$0</div>
                <div className="text-gray-400 mb-6">7 days</div>
                
                <ul className="space-y-3 mb-8">
                  {[
                    "Full app access",
                    "AI charging optimization", 
                    "Real-time savings tracking",
                    "Battery health monitoring",
                    "No credit card required"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-300">
                      <Check className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a href={getAppStoreLink()} target="_blank" rel="noopener noreferrer">
                  <button className="w-full px-6 py-3 border border-[#D4AF37]/30 text-white font-medium rounded-lg
                                   hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/50 transition-all duration-300">
                    Start Free Trial
                  </button>
                </a>
              </motion.div>

              {/* Premium Plan */}
              <motion.div 
                className="bg-gradient-to-br from-[#D4AF37]/10 to-[#B8860B]/10 backdrop-blur-sm rounded-xl p-8 
                         border border-[#D4AF37]/40 relative hover:border-[#D4AF37]/60 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white text-sm font-semibold 
                                 px-4 py-1 rounded-full">Most Popular</span>
                </div>

                <h3 className="text-2xl font-semibold text-white mb-4">Premium</h3>
                <div className="text-4xl font-bold text-[#D4AF37] mb-2">$8.49</div>
                <div className="text-gray-400 mb-6">per month</div>
                
                <ul className="space-y-3 mb-8">
                  {[
                    "Everything in Free Trial",
                    "Advanced AI optimization",
                    "Detailed analytics & reports", 
                    "Priority customer support",
                    "Multi-vehicle support",
                    "Export data for tax purposes"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-300">
                      <Check className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a href={getAppStoreLink()} target="_blank" rel="noopener noreferrer">
                  <button className="w-full px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-medium 
                                   rounded-lg hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all duration-300">
                    Start Premium
                  </button>
                </a>
              </motion.div>
            </div>

            {/* Value proposition */}
            <motion.div 
              className="bg-[#1A1A1A]/60 backdrop-blur-sm rounded-lg p-6 border border-[#D4AF37]/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="text-center">
                <div className="text-lg text-gray-300 mb-2">
                  Average savings: <span className="text-[#D4AF37] font-semibold">$266/year per car</span>
                </div>
                <div className="text-sm text-gray-400">
                  Premium subscription pays for itself in just 2 weeks of use
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </Suspense>

      {/* Savings Metrics Section */}
      <Suspense fallback={null}>
        <motion.section 
          className="py-20 px-6 bg-[#1A1A1A] relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <Suspense fallback={null}><SubtlePattern /></Suspense>
          
          <div className="max-w-7xl mx-auto">
            <motion.div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light mb-6 text-white">
                Real <span className="font-semibold text-[#D4AF37]">Results</span>
              </h2>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
                Join thousands of EV owners who are already saving money and extending their battery life.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {savingsMetrics.map((metric, i) => (
                <CounterMetric key={i} metric={metric} index={i} />
              ))}
            </div>
          </div>
        </motion.section>
      </Suspense>

      {/* Testimonials Section */}
      <Suspense fallback={null}>
        <motion.section 
          className="py-20 px-6 bg-gradient-to-br from-[#0F0F0F] to-[#1A1A1A] relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <Suspense fallback={null}><SubtlePattern /></Suspense>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light mb-6 text-white">
                What EV Owners <span className="font-semibold text-[#D4AF37]">Are Saying</span>
              </h2>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
                Thousands of drivers are already saving money with Ampereon.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-[#2A2A2A]/60 to-[#1A1A1A]/60 backdrop-blur-sm rounded-xl p-6 border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 hover:shadow-lg hover:shadow-[#D4AF37]/10 transition-all duration-300"
                  variants={fadeUpVariants}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex flex-col items-center gap-4 mb-4">
                    <h4 className="text-xl font-semibold text-white">{testimonial.name}</h4>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(testimonial.rating) ? 'text-[#D4AF37] fill-current' : 'text-gray-600'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300 text-base leading-relaxed text-center">{testimonial.quote}</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <a href={getAppStoreLink()} target="_blank" rel="noopener noreferrer">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-semibold rounded-lg 
                            hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300 flex items-center gap-2 mx-auto"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="w-5 h-5" />
                  Join Thousands of Happy Users
                </motion.button>
              </a>
            </div>
          </div>
        </motion.section>
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={null}>
        <motion.section 
          className="py-20 px-6 bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariants}
        >
          <Suspense fallback={null}><SubtlePattern /></Suspense>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.h2 
              className="text-4xl md:text-5xl font-light mb-6 leading-tight text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Start Saving <span className="font-semibold text-[#D4AF37]">Today</span>
            </motion.h2>
            
            <motion.p 
              className="text-xl mb-10 text-gray-300 max-w-3xl mx-auto font-light"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Download Ampereon and let AmplifyAI optimize your EV charging. Start with a free trial and see the savings add up.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <a href={getAppStoreLink()} target="_blank" rel="noopener noreferrer">
                <button 
                  className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-semibold rounded-lg 
                          hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300 flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Free Trial
                </button>
              </a>
            </motion.div>
            
            <motion.div 
              className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#D4AF37]" />
                <span>7-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#D4AF37]" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#D4AF37]" />
                <span>Cancel anytime</span>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </Suspense>
    </div>
  );
};

export default AmpereonLanding;
