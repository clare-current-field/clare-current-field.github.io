'use client';

import { Check, ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';


export default function ThankYou() {
  const [reference, setReference] = useState('');
  const [preview, setPreview] = useState(false);
  const [ready, setReady] = useState(false);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const sending = useRef(false);

  useEffect(() => {
    setPreview(new URLSearchParams(window.location.search).get('preview') === '1');
    try {
      const value = JSON.parse(sessionStorage.getItem('current-field-inquiry') || 'null');
      if (value && typeof value.id === 'string' && /^[\da-f-]{36}$/i.test(value.id) && Date.now() - value.createdAt < 86400000) {
        setReference(value.id);
        setSent(sessionStorage.getItem(`current-field-details-${value.id}`) === 'sent');
      }
    } catch { /* A direct visit must not imply that an inquiry was received. */ }
    setReady(true);
  }, []);

  const submit = async (event:FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending.current || sent || preview || !reference) return;
    const data = new FormData(event.currentTarget);
    if (!['budget','timing','priorities','inspiration'].some(key => String(data.get(key) || '').trim())) {
      setMessage('You can skip this step, or share any one detail below.'); return;
    }
    if (data.get('botcheck')) { setMessage('Your submission could not be sent. Please contact hello@currentfield.com for help.'); return; }
    data.set('access_key','f4584345-b3d2-45d0-9cd6-0c8d6f2427b5');
    data.set('subject','Additional project details · Current Field');
    data.set('from_name','Current Field website');
    data.set('inquiry_reference',reference);
    sending.current = true; setBusy(true); setMessage('');
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(),20000);
    try {
      const response = await fetch('https://api.web3forms.com/submit',{method:'POST',body:data,signal:controller.signal,headers:{Accept:'application/json'}});
      const result = await response.json();
      if (!response.ok || typeof result !== 'object' || result === null || !('success' in result) || result.success !== true) throw new Error('Not confirmed');
      setSent(true); setMessage('');
      try { sessionStorage.setItem(`current-field-details-${reference}`,'sent'); } catch { /* Optional duplicate guard. */ }
    } catch {
      setMessage('We couldn’t confirm delivery of these extra details. Your original inquiry is already received. Your answers are still here if you’d like to try again.');
    } finally {
      window.clearTimeout(timeout); sending.current = false; setBusy(false);
    }
  };

  return <main>
    <header className="site-header"><a className="wordmark" href="/">Current Field</a><a className="thank-back" href="/"><span className="thank-back-full">Back to home</span><span className="thank-back-short">Back</span> <ArrowUpRight className="link-arrow" aria-hidden="true" /></a></header>
    <div className="thank-page">
      {ready && (reference || preview) ? <>
        {preview && <p className="contact-hint">Page preview. No inquiry has been sent from this preview.</p>}
        <section className="thank-intro" aria-labelledby="thank-title">
          <Check className="thank-check" size={32} strokeWidth={1.25} aria-hidden="true" />
          <h2 id="thank-title">Thank you.<br />We’re glad you reached out.</h2>
          <p>We’ve received your inquiry and will be in touch by email to explore your project together.</p>
        </section>
        <section className="thank-extra" aria-labelledby={sent ? undefined : 'extra-title'} aria-label={sent ? 'Additional details received' : undefined}>
          {!sent && <>
          <h2 id="extra-title">Tell us a little more</h2>
          <p className="thank-description">If you have any of these details in mind, we’d love to hear them ahead of our first conversation.<br />They’ll help us make the most of our time together. If not, that’s perfectly fine.</p>
          </>}
          {sent ? <p role="status" className="thank-description">All set! We’ve received your extra details.</p> : <form className="contact-form" onSubmit={submit} aria-busy={busy}>
            <input type="checkbox" name="botcheck" style={{display:'none'}} tabIndex={-1} aria-hidden="true" />
            <div className="contact-field"><label htmlFor="extra-budget">Approximate total project budget</label><Input id="extra-budget" name="budget" maxLength={150} placeholder="An estimate in USD, or 'Not Sure Yet'" /></div>
            <div className="contact-field"><label htmlFor="extra-timing">Your ideal timing</label><Input id="extra-timing" name="timing" maxLength={150} placeholder="A start date, a season, or simply flexible" /></div>
            <div className="contact-field"><label htmlFor="extra-priorities">What would make the biggest difference?</label><Textarea id="extra-priorities" name="priorities" maxLength={5000} rows={3} placeholder="Anything that isn’t working, something you love, or a change you’re hoping for." /></div>
            <div className="contact-field"><label htmlFor="extra-inspiration">Inspiration &amp; mood</label><Input id="extra-inspiration" name="inspiration" maxLength={2000} placeholder="A Pinterest board, a link, or a few words" /></div>
            <div className="contact-actions thank-extra-actions"><Button type="submit" className="contact-submit" disabled={busy || preview}>{busy ? 'Sending…' : 'Share a little more'} <ArrowUpRight className="link-arrow" aria-hidden="true" /></Button><a className="thank-skip" href="/">Skip for now</a></div>
            {!busy && message && <p role="alert" className="contact-status">{message}</p>}
          </form>}
          {sent && <a className="thank-skip" href="/">Back to home <ArrowUpRight className="link-arrow" aria-hidden="true" /></a>}
        </section>
      </> : <section className="thank-intro"><h2>{ready ? 'Let’s start with your home' : 'One moment…'}</h2>{ready && <><p>To share a new project, please start with our short inquiry form. If you’ve already submitted and closed that tab, there’s no need to submit again; we’ll follow up by email.</p><a className="thank-skip" href="/#contact">Go to the inquiry form <ArrowUpRight className="link-arrow" aria-hidden="true" /></a></>}</section>}
    </div>
  </main>;
}
