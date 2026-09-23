'use client';

import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { Menu, X, Minus, ArrowUpRight } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';

const links = [{ label:'About', href:'/about' }, { label:'Services', href:'/services' }, { label:'Contact', href:'/#contact' }];
const services = [
  { title:'Home Design Consultation', description:'If you have ideas for your home but aren’t sure how to move forward, we’ll help you work through your questions with thoughtful recommendations and clear next steps.', scope:['An initial conversation, online or in your home', 'A follow-up meeting with recommendations and a written summary', 'One round of written follow-up to clarify the recommendations'] },
  { title:'Design Direction & Space Planning', description:'If you’re reimagining an existing space or planning a new one, we help define how it should feel and function, creating a clear foundation for the decisions ahead.', scope:['A design direction board capturing the mood, palette and textures that feel right for you', 'A dimensioned furniture layout with functional zones, suggested furniture sizes and clear paths through the space', 'A presentation and written next steps, with one round of refinement to the proposed design'] },
  { title:'Materials, Fixtures & Millwork', description:'If you’re planning a renovation, addition or new build, we help bring the fixed elements of your home together through thoughtful selections, budget planning and coordinated design details.', scopeTitles:['Materials, fixtures & budget planning', 'Cabinetry & custom millwork', 'Design specifications & details'], scope:['Coordinated selections, with guidance on where to invest and where to save.', 'Initial designs shaped around your needs, developed with your cabinet or millwork vendor.', 'Selected products and design details documented through specification lists and drawings, from lighting placement to tile layouts.'] },
  { title:'Furnishing & Styling', description:'If your space needs furnishing or a fresh start, we help bring it together with considered pieces, a clear budget and thoughtful styling, including the things you already love.', scopeTitles:['Furniture & décor selections', 'Furnishing budget planning', 'On-site finishing & styling'], scope:['Furniture, lighting, textiles and accessories selected to work together, with a shopping list for purchasing.', 'A budget shaped around your priorities, with guidance on where to invest and where to save.', 'Final styling of textiles, art and accessories to bring the furnished space together.'] },
  { title:'Project Management', description:'Whether you’re finding an architect, navigating the permit process or already under construction, we help coordinate the people, decisions and timelines that move your project toward move-in.', scopeTitles:['Planning & team coordination', 'Selections & ordering timelines', 'Progress tracking & follow-through'], scope:['Coordinating with your architect, contractor and vendors, from early planning and permitting or once construction is underway.', 'Working backward from the construction schedule to plan selections, approvals and ordering deadlines, and track delivery dates to help avoid delays on site.', 'Tracking milestones and outstanding tasks, flagging potential delays and following up to keep work moving toward move-in.'] },
  { title:'Home Organization & Refresh', description:'If you want your home to work better without renovation or replacing major furniture, we help bring order to your space with practical organization that fits your daily routines.', scopeTitles:['Hands-on home organization', 'Storage essentials', 'An easy-to-maintain plan'], scope:['Sorting and organizing alongside you, with clear places for the things you use and want to keep.', 'Selecting and purchasing practical organizers to support your space, routines and budget.', 'A simple written guide to keeping things organized, with everyday habits and reset routines that work for you.'] },
];
const combinations = [
  { title:'Complete Home', intro:'From the first layout to the final furnishings.', description:'For a new home or a substantial transformation, with design and coordination considered together throughout.', includes:[1,2,3,4] },
  { title:'From Plans to Move-In', intro:'A finished interior, ready for your furnishings.', description:'For a new build, addition or renovation that needs a clear design direction and support through implementation.', includes:[1,2,4] },
  { title:'Furnished & Finished', intro:'A cohesive home, without a major renovation.', description:'For spaces ready for furniture and finishing touches, bringing layouts, selections and installation together.', includes:[1,3] },
];

export default function Services() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const exploreIncludedService = (index: number) => {
    flushSync(() => setSelectedService(index));
    const target = document.getElementById(`individual-service-${index}`);
    target?.focus({ preventScroll:true });
    (isMobile ? target : document.getElementById('service-detail'))?.scrollIntoView({ block:'start', behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };

  useEffect(() => {
    const query = window.matchMedia('(max-width:800px)');
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const detail = <div key={selectedService ?? 'empty'} className={`service-detail ${selectedService === null ? 'service-detail-empty' : 'service-detail-visible'}`} id="service-detail">
    {selectedService !== null && <>
      <button className="service-detail-close" aria-label="Close service details" onClick={() => setSelectedService(null)}><Minus size={20} strokeWidth={1.25} /></button>
      <p className="service-eyebrow">Individual service / 0{selectedService + 1}</p>
      <h2>{services[selectedService].title}</h2>
      <p className="service-detail-lead">{services[selectedService].description}</p>
      <ol className="service-scope service-scope-numbered">{services[selectedService].scope.map((item,index) => <li key={item}>{services[selectedService].scopeTitles?.[index] && <strong className="service-scope-heading">{services[selectedService].scopeTitles[index]}</strong>}{item}</li>)}</ol>
      <div className="service-connect-row"><a className="service-connect contact-submit" href="/#contact">Let’s connect</a></div>
    </>}
  </div>;

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 18);
    const desktop = window.matchMedia('(min-width:801px)');
    const closeMenu = () => { if (desktop.matches) setMenuOpen(false); };
    update();
    window.addEventListener('scroll', update, { passive:true });
    desktop.addEventListener('change', closeMenu);
    return () => { window.removeEventListener('scroll', update); desktop.removeEventListener('change', closeMenu); };
  }, []);

  return <div className="services-page">
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <a className="wordmark" href="/" aria-label="Current Field home">Current Field</a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {links.map(link => <a key={link.label} href={link.href} aria-current={link.label === 'Services' ? 'page' : undefined}>{link.label}</a>)}
      </nav>
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetTrigger className="mobile-menu-trigger" aria-label="Open navigation menu"><Menu size={23} strokeWidth={1.25} /></SheetTrigger>
        <SheetContent side="right" className="mobile-menu-panel" showCloseButton={false}>
          <SheetTitle className="menu-title">Current Field</SheetTitle>
          <SheetDescription className="sr-only">Website navigation</SheetDescription>
          <SheetClose className="menu-close" aria-label="Close navigation menu"><X size={24} strokeWidth={1.25} /></SheetClose>
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {links.map(link => <a key={link.label} href={link.href} aria-current={link.label === 'Services' ? 'page' : undefined} onClick={() => setMenuOpen(false)}>{link.label}</a>)}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
    <main aria-label="Services">
      <section className="services-page-intro" aria-labelledby="services-page-title">
        <svg className="services-intro-icon" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M8 19 4.5 7.5Q4 5.5 6 5l1.5-.4q1.5-.4 2 1.4l3.3 11.5" />
          <path d="M9 18h15a2 2 0 0 1 2 2v1H11a3 3 0 0 1-3-2" />
          <path d="m12 21-3 7m14-7 3 7" />
        </svg>
        <h1 id="services-page-title">Ways we work together</h1>
        <p>From a single consultation to a complete home, we offer support at every scale.</p>
      </section>
      <section className="service-explorer" id="individual-services" aria-label="Focused support">
        <aside className="service-menu">
          <p className="service-eyebrow">Focused support</p>
          <div className="service-menu-items">
            {services.map((service,index) => <div key={service.title}><button id={`individual-service-${index}`} className={`service-menu-item ${selectedService === index ? 'is-selected' : ''}`} aria-pressed={selectedService === index} aria-expanded={selectedService === index} aria-controls={selectedService === index || !isMobile ? 'service-detail' : undefined} onClick={() => setSelectedService(current => current === index ? null : index)}>
              <span className="service-index">0{index + 1}</span><span>{service.title}</span><span className="service-marker" aria-hidden="true">{selectedService === index ? <ArrowUpRight className="link-arrow" /> : '+'}</span>
            </button>{isMobile && selectedService === index && detail}</div>)}
          </div>
        </aside>
        {!isMobile && detail}
      </section>
      <section className="service-combinations" id="combinations" aria-labelledby="combinations-title">
        <p className="service-eyebrow" id="combinations-title">A complete approach</p>
        <div className="service-combination-grid">
          {combinations.map((bundle, index) => <article className="combination-description" key={bundle.title}>
            <div className="service-eyebrow">Package {String.fromCharCode(65 + index)}</div>
            <h3>{bundle.title}</h3>
            <p>{bundle.intro}</p>
            <p className="service-inclusion-label">Included services</p>
            <ul className="service-inclusions">{bundle.includes.map(index => <li key={index}><button className="included-service-link" onClick={() => exploreIncludedService(index)}>{services[index].title}</button></li>)}</ul>
          </article>)}
        </div>
      </section>
      <section className="services-conversation" aria-labelledby="services-conversation-title">
        <h2 id="services-conversation-title">Let’s find what works for you</h2>
        <p>Have questions or need a different combination? We’re happy to talk through your options and shape the right support for your home.</p>
        <a className="service-connect contact-submit" href="/#contact">Let’s connect</a>
      </section>
    </main>
  </div>;
}
