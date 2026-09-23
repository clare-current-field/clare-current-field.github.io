'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';

const links = [{ label:'About', href:'/about' }, { label:'Services', href:'/services' }, { label:'Contact', href:'/#contact' }];

export default function About() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 18);
    const desktop = window.matchMedia('(min-width:801px)');
    const close = () => { if (desktop.matches) setMenuOpen(false); };
    update();
    window.addEventListener('scroll', update, { passive:true });
    desktop.addEventListener('change', close);
    return () => { window.removeEventListener('scroll', update); desktop.removeEventListener('change', close); };
  }, []);
  return <div className="about-page">
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <a className="wordmark" href="/" aria-label="Current Field home">Current Field</a>
      <nav className="desktop-nav" aria-label="Primary navigation">{links.map(link => <a key={link.label} href={link.href} aria-current={link.label === 'About' ? 'page' : undefined}>{link.label}</a>)}</nav>
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetTrigger className="mobile-menu-trigger" aria-label="Open navigation menu"><Menu size={23} strokeWidth={1.25} /></SheetTrigger>
        <SheetContent side="right" className="mobile-menu-panel" showCloseButton={false}>
          <SheetTitle className="menu-title">Current Field</SheetTitle>
          <SheetDescription className="sr-only">Website navigation</SheetDescription>
          <SheetClose className="menu-close" aria-label="Close navigation menu"><X size={24} strokeWidth={1.25} /></SheetClose>
          <nav className="mobile-nav" aria-label="Mobile navigation">{links.map(link => <a key={link.label} href={link.href} aria-current={link.label === 'About' ? 'page' : undefined} onClick={() => setMenuOpen(false)}>{link.label}</a>)}</nav>
        </SheetContent>
      </Sheet>
    </header>
    <main>
      <section className="services-page-intro about-page-intro" aria-labelledby="about-page-title">
        <div className="about-opening-text">
        <div className="service-eyebrow about-location">Los Altos, California · Est. 2026</div>
        <h1 id="about-page-title">About Current Field</h1>
        <div className="about-opening-copy">
          <p>Current Field is a residential design studio based in Los Altos, serving the San Francisco Bay Area. We believe a more beautiful, better-functioning home isn’t always about having more, but seeing what’s possible.</p>
          <p>We help you discover that potential and bring it to life, shaping your home around how you live and what you value.</p>
        </div>
        </div>
        <figure className="about-opening-photo">
          <img className="about-opening-image" src="/images/cfs-6-rectangle-2.jpeg" width="4337" height="1065" alt="Flowers, a small lamp and a wooden bowl on a marble coffee table beside a soft cream sofa" />
          <figcaption className="photography-credit">Photography by <a href="https://danielblue.com/">Daniel Blue</a></figcaption>
        </figure>
      </section>
      <section className="about-philosophy" aria-labelledby="philosophy-title">
        <div className="about-philosophy-heading">
          <svg className="about-philosophy-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 12v8M13 12v8" />
            <path d="M4.077 10.615A1 1 0 0 0 5 12h14a1 1 0 0 0 .923-1.385l-3.077-7.384A2 2 0 0 0 15 2H9a2 2 0 0 0-1.846 1.23Z" />
            <path d="M9 20h6" strokeWidth="1.1" />
          </svg>
          <h2 id="philosophy-title">Our philosophy</h2>
        </div>
        <div className="about-philosophy-copy">
          <p>A beautiful home isn’t simply a collection of beautiful things. It’s how they work together, how a room supports your routines, and how naturally you feel at home.</p>
          <p>Rather than fitting your home into a particular style, we start with what matters to you: the feeling you want to create, the things that aren’t working, and the pieces you want to keep. We bring these together with thoughtful choices about layout, materials and where to invest.</p>
          <p>We design for everyday use and the years ahead, with choices that last and room for life to change.</p>
        </div>
      </section>
      <section className="about-approach" aria-labelledby="approach-title">
        <h2 id="approach-title">Our approach</h2>
        <p className="approach-intro">Creating your home should leave room for discovery and enjoyment. It’s a chance to explore what you love and how you want to live. We guide the decisions and coordinate the details, so you can enjoy seeing it come together.</p>
        <div className="approach-map">
          <span className="map-endpoint map-start">Your idea</span>
          <svg className="approach-route" viewBox="0 0 1000 560" preserveAspectRatio="none" aria-hidden="true"><path d="M100 40 C200 40 350 35 350 100 C350 160 220 172 240 240 C258 286 610 258 600 341 C594 396 395 453 460 488 C510 520 680 520 780 520" /></svg>
          <ol className="approach-stops">
            {[
              { title:'Discover', detail:'Explore how you live, what you love and what could work better.' },
              { title:'Decide', detail:'Work through the options together, with clear guidance on design, budget and priorities.' },
              { title:'Bring it to life', detail:'Turn decisions into a home, with the details tracked and coordinated along the way.' },
            ].map((step,index) => <li key={step.title} className={`approach-stop approach-stop-${index}`}>
              <h3 className="map-step-heading">
                <span className="map-dot" aria-hidden="true" />
                <span className="map-number">0{index + 1}</span>
                <span className="map-step-title">{step.title}</span>
              </h3>
              <p className="map-step-detail">{step.detail}</p>
            </li>)}
          </ol>
          <span className="map-endpoint map-finish">Your home</span>
        </div>
      </section>
      <section className="about-founder" aria-labelledby="founder-title">
        <div>
        <div className="founder-story">
          <p>As a child, I was drawn to the warm glow of windows at dusk. I would imagine the homes behind those lights, the people who lived there, and the small routines that made each home their own.</p>
          <p>That curiosity stayed with me, even as my career took a different path. I studied civil engineering, earned a master’s in structural engineering at Stanford University, and went on to work in product management in tech. But in my own time, I kept coming back to homes.</p>
          <p>Renovating my own home brought that interest into focus. I loved choosing materials and imagining how rooms could feel, but also working through budgets, plans and the details that would make it all happen. More projects followed, for myself and for others. What had always drawn my attention became something I wanted to make room for in my life.</p>
          <p>I started Current Field to help others see what’s possible in their own homes. My engineering background helps me think through how things come together, while years in product management taught me to listen closely and start with people’s needs. For me, design brings those instincts together with something much more personal: a love of home and what it can mean to the people who live there.</p>
        </div>
        </div>
        <div className="founder-portrait">
          <h2 id="founder-title">Meet the founder</h2>
          <img src="/images/clare-founder-cutout.png" width="1024" height="1536" alt="Clare, founder of Current Field" loading="lazy" />
          <p className="founder-name">Clare Guo · Founder</p>
        </div>
      </section>
      <section className="services-conversation" aria-labelledby="about-connect-title">
        <h2 id="about-connect-title">Want to know more about us?</h2>
        <p>We’d love to hear about your home, answer your questions and see if we’re a good fit.</p>
        <a className="service-connect contact-submit" href="/#contact">Let’s connect</a>
      </section>
    </main>
  </div>;
}
