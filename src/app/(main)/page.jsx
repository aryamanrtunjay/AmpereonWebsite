'use client';

import React, { useState } from 'react';
import { motion, useInView } from 'framer-motion';

/* --- Dark Gold (muted, luxe) --- */
const goldText =
  'bg-clip-text text-transparent bg-gradient-to-r from-[#E1B954] via-[#C69C3D] to-[#8E6E24]';
const goldBg =
  'bg-gradient-to-r from-[#E1B954] via-[#C69C3D] to-[#8E6E24]';

/* --- Utilities --- */
const ScrollSection = ({ children }) => {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};


/* --- Icons (white stroke) --- */
const IconMoney = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" className="text-neutral-100" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconBattery = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" className="text-neutral-100" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="7" width="18" height="10" rx="2" />
    <rect x="20" y="10" width="2" height="4" rx="0.5" />
    <path d="M6 12h6" />
  </svg>
);

const IconTarget = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" className="text-neutral-100" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconLeaf = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" className="text-neutral-100" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20 4c-7 0-12 5-12 12 0 2 1 4 3 4 7 0 12-5 12-12 0-2-1-4-3-4z" />
    <path d="M10 14c2 0 4-2 4-4" />
  </svg>
);

/* --- Buttons --- */
const PrimaryButton = ({ children }) => (
  <button className={`${goldBg} text-neutral-900 font-light text-lg px-12 py-4 rounded-full shadow-xl hover:brightness-110 transition-all duration-300`}>
    {children}
  </button>
);

const SecondaryButton = ({ children }) => (
  <div className={`relative rounded-full p-[1px] ${goldBg}`}>
    <button className="rounded-full px-12 py-4 glass bg-neutral-900/60 text-neutral-100 transition-all duration-300 hover:bg-neutral-900/50">
      {children}
    </button>
  </div>
);

/* --- Mini components --- */
const RateBar = () => {
  const data = [0.2,0.18,0.16,0.15,0.16,0.18,0.22,0.35,0.55,0.58,0.57,0.5,0.42,0.3,0.25,0.22,0.2,0.19,0.18,0.2,0.32,0.45,0.5,0.38];
  return (
    <div className="flex gap-[3px] items-end h-16">
      {data.map((v,i)=>(
        <div key={i} className="w-[10px] rounded-sm" style={{height: `${Math.max(8, v*60)}px`, background: 'linear-gradient(180deg,#E1B954,#8E6E24)'}} />
      ))}
    </div>
  );
};

const UIPreviewCard = () => (
  <div className="glass rounded-2xl p-5 text-left">
    <div className="flex items-center justify-between mb-4">
      <div>
        <div className={`text-sm ${goldText}`}>Next charge window</div>
        <div className="text-xl text-neutral-100">1:30 AM – 6:30 AM</div>
      </div>
      <div className="rounded-lg p-[1px] bg-gradient-to-r from-white/20 to-white/5">
        <div className="px-3 py-2 rounded-lg bg-neutral-900/60 text-sm">Est. $2.84</div>
      </div>
    </div>
    <RateBar />
    <div className="mt-4 text-sm text-neutral-400">Based on today’s utility rates and your target SoC.</div>
  </div>
);

/* --- FULLY POPULATED 24H TIMELINE --- */
const Timeline24h = () => {
  // segments cover 0–24 with no gaps
  const segs = [
    { label: 'Idle',         start: 0.0,   end: 1.5,   color: '#232323' },
    { label: 'Charge',       start: 1.5,   end: 4.083, color: 'linear-gradient(90deg,#E1B954,#8E6E24)' },
    { label: 'Ready buffer', start: 4.083, end: 6.5,   color: '#262626' },
    { label: 'Morning',      start: 6.5,   end: 8.0,   color: '#2B2B2B' },
    { label: 'Away',         start: 8.0,   end: 18.5,  color: '#1F1F1F' },
    { label: 'Home',         start: 18.5,  end: 19.0,  color: '#2A2A2A' },
    { label: 'Peak pause',   start: 19.0,  end: 21.0,  color: '#383838' },
    { label: 'Evening',      start: 21.0,  end: 24.0,  color: '#272727' },
  ];
  return (
    <div className="glass rounded-2xl p-6">
      <div className="text-sm text-neutral-400 mb-3">A typical weekday (24h)</div>
      <div className="w-full rounded-md overflow-hidden">
        <div className="flex h-8">
          {segs.map((s, i) => {
            const w = ((s.end - s.start) / 24) * 100;
            return (
              <div
                key={i}
                className="h-full relative"
                style={{ width: `${w}%`, background: s.color }}
                title={`${s.label}`}
              >
                <span className="absolute inset-0 flex items-center justify-center text-[11px] text-neutral-300/90">
                  {w > 8 ? s.label : ''}
                </span>
              </div>
            );
          })}
        </div>
        {/* tick marks */}
        <div className="mt-2 flex justify-between text-[11px] text-neutral-500">
          {[0,6,12,18,24].map(h => <span key={h}>{h}:00</span>)}
        </div>
      </div>
      <div className="mt-3 text-xs text-neutral-500">Charge scheduled overnight to avoid 4–9 PM peak.</div>
    </div>
  );
};

const AmpereonLanding = () => {
  const [faqOpen, setFaqOpen] = useState({});

  const benefits = [
    { title: 'Intelligent Savings', description: 'Optimize charging during off-peak windows. Save $300–$400 annually with automated scheduling.', highlight: 'Up to $30 monthly savings', Icon: IconMoney },
    { title: 'Battery Preservation', description: 'Reduce degradation by charging in healthier windows learned from your routine.', highlight: 'Healthier charge cycles', Icon: IconBattery },
    { title: 'Effortless Automation', description: 'Plug in and forget—Ampereon times charging for you.', highlight: 'Zero manual intervention', Icon: IconTarget },
    { title: 'Sustainable Impact', description: 'Shift demand off-peak to ease grid load and use cleaner energy.', highlight: 'Lower carbon footprint', Icon: IconLeaf },
  ];

  const steps = [
    { number: '01', title: 'Connect', description: 'Secure OAuth—link your Tesla without sharing your password.' },
    { number: '02', title: 'Customize', description: 'Set preferences or let our AI learn your schedule.' },
    { number: '03', title: 'Save', description: 'We monitor rates and charge at the optimal times—automatically.' },
  ];

  const faqs = [
    { q: 'What if my schedule changes unexpectedly?', a: "Override at any time—you’re always in control." },
    { q: 'Do I need additional hardware?', a: "No. It works via your Tesla’s built-in systems." },
    { q: 'How secure is my data?', a: "Secure OAuth + encryption; revoke access instantly, any time." },
    { q: 'What are typical savings?', a: 'Most drivers see ~$20–$30/month in electricity savings.' },
    { q: 'Does this help battery life?', a: 'Yes—optimal timing reduces stress and slows degradation.' },
  ];

  const fadeInUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.8, ease: 'easeOut' } };
  const stagger = { animate: { transition: { staggerChildren: 0.15 } } };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 overflow-x-hidden selection:bg-[#E1B954]/20 selection:text-neutral-100">
      {/* Background beams / grid (muted) */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -inset-40 opacity-20 blur-3xl [mask-image:radial-gradient(circle_at_center,white,transparent_70%)] bg-[conic-gradient(from_0deg_at_50%_50%,rgba(225,185,84,0.18),rgba(0,0,0,0)_70%)]" />
        <div className="absolute top-[-15%] left-[-10%] w-[42rem] h-[42rem] rounded-full blur-3xl opacity-15 bg-gradient-to-br from-[#E1B954] via-[#C69C3D] to-transparent" />
        <div className="absolute bottom-[-20%] right-[-15%] w-[46rem] h-[46rem] rounded-full blur-3xl opacity-10 bg-gradient-to-tr from-[#8E6E24] via-[#C69C3D] to-transparent" />
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.6)_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),rgba(0,0,0,0.65))]" />
      </div>

      {/* HERO */}
      <section className="relative min-h-[88vh] flex items-center justify-center px-6 pt-28 pb-20">
        <motion.div className="max-w-6xl mx-auto text-center z-10" initial={false}>
          {/* Badge (replaced private alpha previously) */}
          <div className="mx-auto w-fit glass rounded-2xl px-5 py-2 mb-6">
            <span className="uppercase text-[11px] tracking-[0.22em] gold-text">Launch Promo</span>
          </div>

          {/* Headline with subtle crystal */}
          <div className="relative mx-auto mb-6 max-w-3xl">
            <div className="absolute inset-0 -z-10 rotate-6 scale-105">
              <div className="mx-auto w-full max-w-3xl h-40 rounded-3xl opacity-25 blur-xl" style={{ background: 'linear-gradient(90deg, rgba(225,185,84,0.35), rgba(142,110,36,0.2))' }} />
            </div>
            <div className="glass rounded-3xl px-6 py-8">
              <motion.h1
                className="text-5xl md:text-7xl font-light leading-tight"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
              >
                <span className="block text-neutral-300">Charge smarter,</span>
                <span className={`block font-normal ${goldText}`}>save automatically.</span>
              </motion.h1>
            </div>
          </div>

          <motion.p
            className="text-lg md:text-xl text-neutral-300/90 max-w-2xl mx-auto font-light leading-relaxed mb-10"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
          >
            Ampereon schedules your Tesla’s charging to hit the lowest-cost, battery-friendly windows—automatically.
          </motion.p>

          {/* Honest badges */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-3 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            {[
              'Secure OAuth (no passwords)',
              'No hardware required',
              '30-day money-back guarantee',
              'Real-time rate monitoring',
            ].map((t, i) => (
              <span key={i} className="glass rounded-full px-4 py-2 text-sm text-neutral-200/90">
                {t}
              </span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <PrimaryButton>Start Saving Now</PrimaryButton>
            <SecondaryButton>How It Works</SecondaryButton>
          </motion.div>

          {/* Hero UI preview row */}
          <div className="mt-14 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <UIPreviewCard />
            <div className="glass rounded-2xl p-5 text-left">
              <div className="text-sm text-neutral-400 mb-2">Tonight’s plan</div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-3 w-3 rounded-full" style={{ background: 'linear-gradient(90deg,#E1B954,#8E6E24)' }} />
                <div className="text-neutral-200">Charge to 73% by 6:30 AM</div>
              </div>
              <div className="text-sm text-neutral-400">- Will pause during peak 4–9 PM.</div>
              <div className="text-sm text-neutral-400 mt-3">- Minimizing energy waste by charging to 73%</div>
              <div className="text-sm text-neutral-400 mt-3">- Charging when low-carbon electricity available</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* BENEFITS (glass cards) */}
      <ScrollSection>
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light mb-4">
                <span className="text-neutral-400">Why Choose</span>{' '}
                <span className={goldText}>Ampereon</span>
              </h2>
              <div className={`w-24 h-px ${goldBg} mx-auto mt-6`} />
            </div>

            <motion.div className="grid md:grid-cols-2 gap-6" variants={stagger} initial="initial" animate="animate">
              {benefits.map((b, i) => (
                <motion.div
                  key={i}
                  className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-white/10 to-transparent"
                  {...fadeInUp}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative p-10 rounded-2xl glass">
                    <div className="flex items-start gap-6">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10">
                        <b.Icon />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-medium mb-3 text-neutral-100">{b.title}</h3>
                        <p className="text-neutral-300 font-light leading-relaxed mb-4">{b.description}</p>
                        <span className={`text-sm font-medium ${goldText}`}>{b.highlight}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </ScrollSection>

      {/* HOW IT WORKS + FULL 24H TIMELINE (no gaps) */}
      <ScrollSection>
        <section className="py-24 px-6 bg-neutral-950/60">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light mb-4">
                <span className="text-neutral-400">Simple</span>{' '}
                <span className={goldText}>Three Steps</span>
              </h2>
              <div className={`w-24 h-px ${goldBg} mx-auto mt-6`} />
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {steps.map((s, i) => (
                <motion.div
                  key={i}
                  className="text-center glass rounded-2xl px-8 py-10"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                >
                  <div className="mb-6">
                    <span className={`text-6xl font-thin ${goldText}`}>{s.number}</span>
                  </div>
                  <h3 className="text-xl font-medium mb-3 text-neutral-100">{s.title}</h3>
                  <p className="text-neutral-300 font-light">{s.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-16">
              <Timeline24h />
            </div>
          </div>
        </section>
      </ScrollSection>

      {/* PRICING — Monthly only */}
      <ScrollSection>
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light mb-4">
                <span className="text-neutral-400">Transparent</span>{' '}
                <span className={goldText}>Pricing</span>
              </h2>
              <div className={`w-24 h-px ${goldBg} mx-auto mt-6`} />
            </div>

            <motion.div className="relative" whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
              <div className="relative p-12 rounded-3xl text-center glass">
                <div className="mb-8">
                  <span className="text-neutral-500 line-through text-lg">$19.99</span>
                  <div className="text-5xl font-light text-neutral-100 my-4">
                    $9.99<span className="text-xl text-neutral-400">/month</span>
                  </div>
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${goldText} bg-white/5 border border-white/10`}>
                    Limited Time: 50% Off
                  </span>
                </div>

                <div className="space-y-4 mb-10 max-w-sm mx-auto text-left">
                  {[
                    'Intelligent charging automation',
                    'Battery health optimization',
                    'Real-time rate monitoring',
                    'Lifetime updates included',
                    'Priority support',
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-[#E1B954]">✓</span>
                      <span className="text-neutral-300 font-light">{f}</span>
                    </div>
                  ))}
                </div>

                <PrimaryButton>Start 30-Day Free Trial</PrimaryButton>

                <p className="mt-6 text-sm text-neutral-400 font-light">
                  No credit card required • Cancel anytime • 30-day guarantee
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </ScrollSection>

      {/* FAQ */}
      <ScrollSection>
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light mb-4">
                <span className="text-neutral-400">Common</span>{' '}
                <span className={goldText}>Questions</span>
              </h2>
              <div className={`w-24 h-px ${goldBg} mx-auto mt-6`} />
            </div>

            <div className="space-y-4">
              {[
                { q: 'What if my schedule changes unexpectedly?', a: "Override at any time—you’re always in control." },
                { q: 'Do I need additional hardware?', a: "No. It works via your Tesla’s built-in systems." },
                { q: 'How secure is my data?', a: "Secure OAuth + encryption; revoke access instantly, any time." },
                { q: 'What are typical savings?', a: 'Most drivers see ~$20–$30/month in electricity savings.' },
                { q: 'Does this help battery life?', a: 'Yes—optimal timing reduces stress and slows degradation.' },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  className="relative rounded-xl glass"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <div className="relative overflow-hidden">
                    <button
                      className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-white/5 transition-colors rounded-xl"
                      onClick={() => setFaqOpen({ ...faqOpen, [index]: !faqOpen[index] })}
                    >
                      <span className="font-medium text-neutral-100">{faq.q}</span>
                      <motion.span
                        className={`${goldText} text-xl font-light`}
                        animate={{ rotate: faqOpen[index] ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        ↓
                      </motion.span>
                    </button>
                    <motion.div
                      initial={false}
                      animate={{ height: faqOpen[index] ? 'auto' : 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-6 text-neutral-300 font-light">{faq.a}</div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </ScrollSection>

      {/* FINAL CTA */}
      <section className="py-32 px-6">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-light mb-6">
            <span className="text-neutral-400">Ready to</span>{' '}
            <span className={goldText}>Start Saving?</span>
          </h2>
          <p className="text-lg text-neutral-300 font-light mb-10 max-w-2xl mx-auto">
            Lock in launch pricing and let Ampereon handle the rest.
          </p>

          <div className="mb-10">
            <span className={`inline-block px-6 py-3 rounded-full text-sm font-medium ${goldText} bg-white/5 border border-white/10`}>
              $9.99 per month • 50% off first month
            </span>
          </div>

          <PrimaryButton>Link Your Tesla</PrimaryButton>

          <p className="mt-8 text-sm text-neutral-400 font-light">
            No hardware required • Cancel anytime • 30-day money-back guarantee
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default AmpereonLanding;
