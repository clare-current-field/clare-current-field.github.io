 'use client';

import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from '@/components/ui/carousel';
import { useEffect, useState, useRef, type FormEvent } from 'react';
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';
import { Menu, X, DraftingCompass, Focus, ArrowUpRight, Info } from 'lucide-react';

const selectedSpaces: { id: number; height: number; title: string; description: string; crop?: boolean }[] = [{"id":10,"height":1601,"title":"Space to work","description":"Creating distinct, purposeful spaces within an open plan."},{"id":8,"height":1601,"title":"Space to gather","description":"Bringing existing pieces and new finds together for easy conversation.","crop":true},{"id":17,"height":3598,"title":"Space for kids","description":"Keeping clutter in check with storage that feels part of the room."},{"id":15,"height":3599,"title":"Space to grow","description":"Balancing childhood imagination with choices that can grow with them."},{"id":11,"height":1601,"title":"Space for both","description":"Defining areas for work and pause while keeping adjoining spaces connected."},{"id":18,"height":3598,"title":"A simpler bathroom","description":"Keeping the design simple, with each detail carefully considered."},{"id":20,"height":3599,"title":"A more expressive bathroom","description":"Bringing pattern and personality together without overwhelming the space."},{"id":3,"height":3598,"title":"Privacy when needed","description":"Creating flexible boundaries for privacy without permanently closing off a space."}];

const inquiryServices = ['Home Design Consultation', 'Design Direction & Space Planning', 'Materials, Fixtures & Millwork', 'Furnishing & Styling', 'Project Management', 'Home Organization & Refresh', 'Not sure yet'];

export default function Home() {
  const [showStatement, setShowStatement] = useState(false);
  const [statementOverride, setStatementOverride] = useState<boolean | null>(null);
  const [heroHovered, setHeroHovered] = useState(false);
  const heroImage = useRef<HTMLElement>(null);
  const autoRevealHandled = useRef(false);
  const statementVisible = statementOverride ?? (showStatement || heroHovered);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [galleryApi, setGalleryApi] = useState<CarouselApi>();
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [contactMessage, setContactMessage] = useState('');
  const sending = useRef(false);
  const inquiryId = useRef('');
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [serviceHelpOpen, setServiceHelpOpen] = useState(false);

  const submitInquiry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending.current || contactStatus === 'success') return;
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get('botcheck')) {
      setContactStatus('error');
      setContactMessage('Your submission could not be sent. Please contact hello@currentfield.com for help.');
      return;
    }
    data.set('access_key', 'f4584345-b3d2-45d0-9cd6-0c8d6f2427b5');
    data.set('subject', 'New inquiry · Current Field');
    data.set('from_name', 'Current Field website');
    if (!inquiryId.current) inquiryId.current = crypto.randomUUID();
    data.set('inquiry_reference', inquiryId.current);
    data.delete('rooms');
    data.set('rooms', selectedRooms.join(', ') || 'Not specified');
    data.delete('service');
    data.set('service', selectedServices.join(', ') || 'Not specified');
    sending.current = true;
    setContactStatus('sending');
    setContactMessage('');
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch('https://api.web3forms.com/submit', { method:'POST', body:data, signal:controller.signal, headers:{ Accept:'application/json' } });
      const result = await response.json();
      if (!response.ok || typeof result !== 'object' || result === null || !('success' in result) || result.success !== true) {
        setContactStatus('error');
        setContactMessage(response.status === 429 ? 'Too many attempts. Please wait a little before trying again.' : 'Your inquiry could not be sent. Your details are still here. Please try again.');
        return;
      }
      setContactStatus('success');
      setContactMessage('');
      try {
        sessionStorage.setItem('current-field-inquiry', JSON.stringify({ id:inquiryId.current, createdAt:Date.now() }));
      } catch { /* The original inquiry is delivered even if browser storage is unavailable. */ }
      window.location.assign('/thank-you');
    } catch {
      setContactStatus('error');
      setContactMessage('We couldn’t confirm delivery. Please check your connection before trying again. Your details have been kept here.');
    } finally {
      window.clearTimeout(timeout);
      sending.current = false;
    }
  };

  useEffect(() => {
    if (!galleryApi) return;
    const updateIndex = () => setGalleryIndex(galleryApi.selectedScrollSnap());
    updateIndex();
    galleryApi.on('select', updateIndex);
    galleryApi.on('reInit', updateIndex);
    return () => { galleryApi.off('select', updateIndex); galleryApi.off('reInit', updateIndex); };
  }, [galleryApi]);

  useEffect(() => {
    if (!galleryApi) return;
    const updateVisibility = () => {
      const viewport = galleryApi.rootNode().getBoundingClientRect();
      galleryApi.slideNodes().forEach(slide => {
        const photo = slide.querySelector<HTMLElement>('.work-photo-button');
        if (!photo) return;
        const bounds = photo.getBoundingClientRect();
        photo.dataset.fullyVisible = String(bounds.left >= viewport.left - 1 && bounds.right <= viewport.right + 1);
      });
    };
    updateVisibility();
    galleryApi.on('scroll', updateVisibility);
    galleryApi.on('settle', updateVisibility);
    galleryApi.on('reInit', updateVisibility);
    return () => {
      galleryApi.off('scroll', updateVisibility);
      galleryApi.off('settle', updateVisibility);
      galleryApi.off('reInit', updateVisibility);
    };
  }, [galleryApi]);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 801px)');
    const closeOnDesktop = () => { if (desktop.matches) { setMenuOpen(false); setSelectedPhoto(null); } };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  useEffect(() => {
    const updateStatement = () => {
      setShowStatement(window.scrollY > 18);
      setStatementOverride(null);
    };
    updateStatement();
    window.addEventListener('scroll', updateStatement, { passive: true });
    return () => window.removeEventListener('scroll', updateStatement);
  }, []);

  useEffect(() => {
    const hero = heroImage.current;
    if (!hero) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let sufficientlyVisible = false;
    const updateTimer = () => {
      clearTimeout(timer);
      if (!sufficientlyVisible || document.hidden || autoRevealHandled.current) return;
      timer = setTimeout(() => {
        if (autoRevealHandled.current) return;
        autoRevealHandled.current = true;
        setStatementOverride(true);
      }, 1500);
    };
    const observer = new IntersectionObserver(([entry]) => {
      sufficientlyVisible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
      updateTimer();
    }, { threshold: [0, 0.5] });
    observer.observe(hero);
    document.addEventListener('visibilitychange', updateTimer);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      document.removeEventListener('visibilitychange', updateTimer);
    };
  }, []);

  return (
    <main>
      <header className={`site-header ${showStatement ? 'is-scrolled' : ''}`}>
        <a className="wordmark" href="#" aria-label="Current Field home">Current Field</a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="/about">About</a>
          <a href="/services">Services</a><a href="#contact">Contact</a>
        </nav>
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger className="mobile-menu-trigger" aria-label="Open navigation menu"><Menu size={23} strokeWidth={1.25} /></SheetTrigger>
          <SheetContent side="right" className="mobile-menu-panel" showCloseButton={false}>
            <SheetTitle className="menu-title">Current Field</SheetTitle>
            <SheetDescription className="sr-only">Website navigation</SheetDescription>
            <SheetClose className="menu-close" aria-label="Close navigation menu"><X size={24} strokeWidth={1.25} /></SheetClose>
            <nav className="mobile-nav" aria-label="Mobile navigation">
              {['About', 'Services', 'Contact'].map(label => (
                <a key={label} href={label === 'Services' ? '/services' : label === 'About' ? '/about' : '#contact'} onClick={() => setMenuOpen(false)}>{label}</a>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </header>
      <section className="hero" aria-labelledby="hero-title">
        <figure ref={heroImage} className="hero-image" onPointerEnter={event => { if (event.pointerType === 'mouse') setHeroHovered(true); }} onPointerLeave={() => setHeroHovered(false)}>
          <Image src="/images/cfs-7.jpg" alt="Layered living room with sculptural seating, green leather, artwork, and a marble table" fill priority sizes="100vw" />
          <button type="button" className="hero-reveal" aria-label={statementVisible ? 'Hide our statement' : 'Show our statement'} aria-pressed={statementVisible} onClick={() => { autoRevealHandled.current = true; setStatementOverride(!statementVisible); }} />
          <h1 id="hero-title" className={statementVisible ? 'is-visible' : ''}>
            <span>Beautifully considered.</span>{' '}
            <span>Made for living. Made real.</span>
          </h1>
          <p className="hero-descriptor">Bay Area Residential Design</p>
        </figure>
      </section>
      <section className="belief" id="belief">
        <figure className="belief-image">
          <Image src="/images/cfs-1.jpg" alt="Foyer with a checkerboard marble floor, original artwork, console, and leather stools" fill sizes="(max-width: 800px) 100vw, 38vw" />
        </figure>
        <div className="belief-copy">
          <div className="belief-heading">
            <p className="section-number">01 / Our belief</p>
            <h2><span>A home should be more</span>{' '}<span>than beautifully designed</span></h2>
          </div>
          <p>It should feel distinctly yours, work for the way you live, and continue to feel right long after trends have moved on. At Current Field, thoughtful design is only the beginning. We bring the clarity, structure, and persistence required to make it real.</p>
        </div>
      </section>
      <section className="services-preview" id="services" aria-labelledby="services-title">
        <div className="services-intro">
          <p className="section-number">02 / Services</p>
          <h2 id="services-title">Ways we work together</h2>
        </div>
        <div className="services-grid">
          <article className="service-summary">
            <DraftingCompass className="service-icon" size={32} strokeWidth={1.1} aria-hidden="true" />
            <h3>A complete approach</h3>
            <p>We bring the right services together to help you plan your space, make design decisions and carry them through to a finished home.</p>
          </article>
          <article className="service-summary">
            <Focus className="service-icon" size={32} strokeWidth={1.1} aria-hidden="true" />
            <h3>Focused support</h3>
            <p>Help with a specific part of your home or project, from a design consultation or room layout to furnishing, organization or renovation coordination.</p>
          </article>
        </div>
        <div className="services-footer"><a className="services-link-preview" href="/services">Explore our services <ArrowUpRight className="link-arrow" aria-hidden="true" /></a></div>
      </section>
      <section className="selected-work" id="gallery" aria-labelledby="work-title">
        <Carousel className="work-carousel" style={{ '--active-photo-ratio': 2400 / selectedSpaces[galleryIndex].height } as React.CSSProperties} setApi={setGalleryApi} opts={{ align: 'start', loop: true, containScroll: 'trimSnaps' }} aria-label="Selected spaces">
          <div className="work-toolbar">
            <h2 className="section-number" id="work-title">03 / Selected work</h2>
            <div className="work-controls"><span className="work-counter" aria-live="polite" aria-atomic="true">{galleryIndex + 1} / {selectedSpaces.length}</span><CarouselPrevious className="work-arrow" /><CarouselNext className="work-arrow" /></div>
          </div>
          <CarouselContent className="work-track">
            {selectedSpaces.map((space, index) => (
              <CarouselItem key={space.id} className="work-slide" style={{ '--photo-ratio': space.crop ? 1.8 : 2400 / space.height, '--original-ratio': 2400 / space.height } as React.CSSProperties}>
                  <button type="button" className={`work-photo-button ${space.crop ? 'work-crop-ceiling' : ''}`} aria-label={`${space.title}: ${space.description}`} onClick={() => { if (window.matchMedia('(max-width: 800px)').matches) setSelectedPhoto(index); }}>
                    <Image src={`/images/cfs-${space.id}.jpg`} alt={space.description} width={2400} height={space.height} sizes="(max-width: 800px) 648px, 936px" />
                    <span className="work-hover-caption" aria-hidden="true">
                      <span className="work-space-name">{space.title}</span>
                      <span className="work-space-description">{space.description}</span>
                    </span>
                  </button>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <Dialog open={selectedPhoto !== null} onOpenChange={open => { if (!open) setSelectedPhoto(null); }}>
          <DialogContent className="mobile-work-viewer" showCloseButton={false}>
            <DialogTitle className="sr-only">Selected work</DialogTitle>
            <DialogDescription className="sr-only">Swipe left or right to browse the photographs.</DialogDescription>
            <DialogClose className="viewer-close" aria-label="Close photographs"><X size={26} strokeWidth={1.25} /></DialogClose>
            {selectedPhoto !== null && <Carousel key={selectedPhoto} className="viewer-carousel" opts={{ startIndex: selectedPhoto, loop: true, align: 'start' }} aria-label="Full-screen photographs">
              <CarouselContent className="viewer-track">
                {selectedSpaces.map((space, index) => (
                  <CarouselItem key={space.id} className="viewer-slide">
                    <figure>
                      <div className="viewer-image-stage"><Image src={`/images/cfs-${space.id}.jpg`} alt={space.description} width={2400} height={space.height} sizes="100vw" /></div>
                      <figcaption className="viewer-caption"><span className="viewer-name">{space.title}<span>{index + 1} / {selectedSpaces.length}</span></span><p>{space.description}</p></figcaption>
                    </figure>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="viewer-controls"><CarouselPrevious className="viewer-arrow" /><CarouselNext className="viewer-arrow" /></div>
            </Carousel>}
          </DialogContent>
        </Dialog>
        <p className="photography-credit">Photography by <a href="https://danielblue.com/">Daniel Blue</a></p>
      </section>
      <section className="about-preview" id="about" aria-labelledby="about-title">
        <div className="about-intro">
          <p className="section-number">04 / About</p>
          <h2 id="about-title">A little about us</h2>
        </div>
        <div className="about-summary">
          <p>Current Field is an interior design studio based in the San Francisco Bay Area. We take the time to understand how you live, what you value, and what you’d like to keep or change. From the first conversation to the final details, we help you make decisions with confidence and keep the work moving forward.</p>
          <div className="about-footer"><a className="services-link-preview" href="/about">More about us <ArrowUpRight className="link-arrow" aria-hidden="true" /></a></div>
        </div>
      </section>
      <section id="contact" className="contact-section" aria-labelledby="contact-title">
        <div className="contact-intro">
          <p className="section-number">05 / Get in touch</p>
          <h2 id="contact-title">Tell us what you have in mind</h2>
          <p className="contact-invitation">If you value thoughtful design and a home that feels distinctly yours, we’d love to hear from you.</p>
        </div>
        <form className="contact-form" onSubmit={submitInquiry} aria-busy={contactStatus === 'sending'}>
          <input type="checkbox" name="botcheck" style={{ display:'none' }} tabIndex={-1} aria-hidden="true" />
          <div className="contact-field"><label id="project-type-label" htmlFor="contact-project-type">What are you planning?</label>
            <Select name="project-type" items={['New home construction', 'Home addition', 'Renovation', 'Furnishing & styling', 'Home organization & refresh', 'Not sure yet'].map(value => ({ label:value, value }))}>
              <SelectTrigger id="contact-project-type" aria-labelledby="project-type-label"><SelectValue placeholder="Select an option" /></SelectTrigger>
              <SelectContent className="contact-options" alignItemWithTrigger={false}>{['New home construction', 'Home addition', 'Renovation', 'Furnishing & styling', 'Home organization & refresh', 'Not sure yet'].map(value => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="contact-field">
            <label id="rooms-label" htmlFor="contact-rooms">Which spaces are you thinking about?</label>
            <Select multiple name="rooms" value={selectedRooms} onValueChange={setSelectedRooms} items={['Living / Family room', 'Dining room', 'Kitchen', 'Bathroom', 'Bedroom', 'Kids’ room', 'Home office', 'Laundry room', 'Entryway', 'Other'].map(value => ({ label:value, value }))}>
              <SelectTrigger id="contact-rooms" aria-labelledby="rooms-label">
                <SelectValue placeholder="Select all spaces that apply">{selectedRooms.length ? `${selectedRooms.slice(0,2).join(', ')}${selectedRooms.length > 2 ? ` +${selectedRooms.length - 2}` : ''}` : 'Select all spaces that apply'}</SelectValue>
              </SelectTrigger>
              <SelectContent className="contact-options" alignItemWithTrigger={false}>
                {['Living / Family room', 'Dining room', 'Kitchen', 'Bathroom', 'Bedroom', 'Kids’ room', 'Home office', 'Laundry room', 'Entryway', 'Other'].map(room => <SelectItem key={room} value={room}>{room}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {[
            { id:'stage', label:'Where are you in the process?', options:['Just exploring ideas', 'Ready to plan', 'Already underway', 'Not sure yet'] },
          ].map(question => <div className="contact-field" key={question.id}>
            <label id={`${question.id}-label`} htmlFor={`contact-${question.id}`}>{question.label}</label>
            <Select name={question.id} items={question.options.map(value => ({ label:value, value }))}>
              <SelectTrigger id={`contact-${question.id}`} aria-labelledby={`${question.id}-label`}><SelectValue placeholder="Select an option" /></SelectTrigger>
              <SelectContent className="contact-options" alignItemWithTrigger={false}>{question.options.map(value => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent>
            </Select>
          </div>)}
          <div className="contact-field">
            <div className="contact-label-row">
              <label id="service-label" htmlFor="contact-service">What would you like help with?</label>
              <button type="button" className="contact-info-button" aria-label="About our services" aria-expanded={serviceHelpOpen} aria-controls="service-help" onClick={() => setServiceHelpOpen(open => !open)}><Info size={15} strokeWidth={1.5} aria-hidden="true" /></button>
            </div>
            <p id="service-help" className="contact-service-help" hidden={!serviceHelpOpen}><a href="/services" target="_blank" rel="noopener noreferrer">Explore what services we offer<span className="sr-only"> (opens in a new tab)</span></a>, or select “Not sure yet” and we’ll guide you.</p>
            <Select multiple name="service" value={selectedServices} onValueChange={setSelectedServices} items={inquiryServices.map(value => ({ label:value, value }))}>
              <SelectTrigger id="contact-service" aria-labelledby="service-label">
                <SelectValue placeholder="Select all that apply">{selectedServices.length === 1 ? selectedServices[0] : selectedServices.length ? `${selectedServices.length} options selected` : 'Select all that apply'}</SelectValue>
              </SelectTrigger>
              <SelectContent className="contact-options" alignItemWithTrigger={false}>
                {inquiryServices.map(service => <SelectItem key={service} value={service}>{service}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="contact-field"><label htmlFor="contact-location">Project location</label><Input id="contact-location" name="location" placeholder="City or ZIP code" maxLength={150} /></div>
          <div className="contact-identity">
            <div className="contact-field"><label htmlFor="contact-name">Your name *</label><Input id="contact-name" name="name" autoComplete="name" required maxLength={150} /></div>
            <div className="contact-field"><label htmlFor="contact-email">Your email *</label><Input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} /></div>
          </div>
          <div className="contact-actions contact-actions-end contact-wide"><Button type="submit" className="contact-submit" disabled={contactStatus === 'sending' || contactStatus === 'success'}>{contactStatus === 'sending' ? 'Sending…' : contactStatus === 'success' ? 'Inquiry sent' : 'Send my note'} <ArrowUpRight className="link-arrow" aria-hidden="true" /></Button></div>
          {contactStatus === 'error' && <p role="alert" className="contact-status contact-wide">{contactMessage}</p>}
        </form>
      </section>
    </main>
  );
}
