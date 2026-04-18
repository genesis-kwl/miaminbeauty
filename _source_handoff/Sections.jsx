/* global React */
// Sections.jsx — landing page sections

const { useState: useSState } = React;
const Sections = {};

// ========== Hero Visual (brow/lip illustrated) ==========
Sections.HeroVisual = function HeroVisual() {
  return (
    <div className="hero-image-wrap fadein d2">
      <div className="hero-image">
        <svg className="brow-svg" viewBox="0 0 600 700" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="skinGrad" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
            <linearGradient id="browGrad" x1="0" x2="1">
              <stop offset="0%" stopColor="#3A2418" />
              <stop offset="100%" stopColor="#1F120A" />
            </linearGradient>
          </defs>
          {/* soft light */}
          <rect width="600" height="700" fill="url(#skinGrad)"/>
          {/* Upper face abstraction — brow arch + eye */}
          <g transform="translate(300 340)">
            {/* left brow */}
            <g>
              {Array.from({length: 28}).map((_, i) => {
                const x = -180 + i * 5.5;
                const y = -60 + Math.sin(i * 0.25) * 8 - (i < 14 ? i * 0.6 : (28 - i) * 0.8);
                const len = 14 + Math.sin(i * 0.4) * 6;
                const angle = -15 + i * 1.2;
                return (
                  <line key={i} x1={x} y1={y} x2={x + Math.cos(angle * Math.PI/180) * len}
                    y2={y - Math.sin(angle * Math.PI/180) * len}
                    stroke="url(#browGrad)" strokeWidth="1.6" strokeLinecap="round"
                    opacity={0.85 - Math.abs(14 - i) * 0.015}/>
                );
              })}
            </g>
            {/* eye suggestion */}
            <ellipse cx="-110" cy="10" rx="55" ry="7" fill="rgba(30,20,15,0.25)"/>
            <path d="M -160 10 Q -110 -8 -60 10" stroke="rgba(30,20,15,0.45)" strokeWidth="1.2" fill="none"/>
            {/* right side mirror */}
            <g transform="scale(-1,1)">
              {Array.from({length: 28}).map((_, i) => {
                const x = -180 + i * 5.5;
                const y = -60 + Math.sin(i * 0.25) * 8 - (i < 14 ? i * 0.6 : (28 - i) * 0.8);
                const len = 14 + Math.sin(i * 0.4) * 6;
                const angle = -15 + i * 1.2;
                return (
                  <line key={'r'+i} x1={x} y1={y} x2={x + Math.cos(angle * Math.PI/180) * len}
                    y2={y - Math.sin(angle * Math.PI/180) * len}
                    stroke="url(#browGrad)" strokeWidth="1.6" strokeLinecap="round"
                    opacity={0.85 - Math.abs(14 - i) * 0.015}/>
                );
              })}
              <ellipse cx="-110" cy="10" rx="55" ry="7" fill="rgba(30,20,15,0.25)"/>
              <path d="M -160 10 Q -110 -8 -60 10" stroke="rgba(30,20,15,0.45)" strokeWidth="1.2" fill="none"/>
            </g>
          </g>
          {/* measurement marks */}
          <g stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none">
            <line x1="80" y1="340" x2="110" y2="340"/>
            <line x1="95" y1="320" x2="95" y2="360"/>
            <circle cx="95" cy="340" r="3" fill="rgba(255,255,255,0.5)"/>
            <line x1="490" y1="340" x2="520" y2="340"/>
            <line x1="505" y1="320" x2="505" y2="360"/>
            <circle cx="505" cy="340" r="3" fill="rgba(255,255,255,0.5)"/>
          </g>
        </svg>
      </div>
      <div className="hero-tag t1">
        <span className="dot-g"></span>
        <span>Hand-drawn strokes</span>
      </div>
      <div className="hero-tag t2">
        <span>Natural fade · 1.5–3 yrs</span>
      </div>
    </div>
  );
};

// ========== Services ==========
Sections.Services = function Services({ onAskAboutService }) {
  const services = [
    {
      cat: 'Eyebrows',
      title: 'Brows',
      titleEm: 'that feel like yours',
      body: "Microblading, airy shading, or our signature combo. Every stroke designed around your face shape, brow hair, and skin type — no two sets are alike.",
      variants: [
        { name: 'Microblading', price: '$550' },
        { name: 'Airy Shading', price: '$550' },
        { name: 'Signature Combo', price: '$600' },
      ],
    },
    {
      cat: 'Lips',
      title: 'Lips',
      titleEm: 'brightened, not painted',
      body: "Natural Lip Blush by machine — soft pinks, corals, nudes chosen for your skin tone. You'll wake up looking refreshed without lipstick.",
      variants: [
        { name: 'Natural Lip Blush', price: '$880' },
        { name: 'Extra Session (within 12 wk)', price: '$120' },
        { name: 'Touch-up (10–18 mo)', price: '$450' },
      ],
    },
  ];
  return (
    <section id="services">
      <div className="container">
        <div className="section-header">
          <div>
            <div className="eyebrow">Services</div>
            <h2 className="display">Two specialties. <em>Mastered.</em></h2>
          </div>
          <p className="lead">Mia has spent eight years on exactly two procedures. That focus is why clients fly in from across the country — and why our revisit rate is what it is.</p>
        </div>

        <div className="services-grid">
          {services.map((s, i) => (
            <div key={i} className="service-card">
              <div className="cat">{s.cat}</div>
              <h3>{s.title} <em>{s.titleEm}</em></h3>
              <p>{s.body}</p>
              <div className="service-variants">
                {s.variants.map((v, j) => (
                  <div key={j} className="row">
                    <div className="name">{v.name}</div>
                    <div className="price">{v.price}</div>
                  </div>
                ))}
              </div>
              <button className="service-ask" onClick={() => onAskAboutService?.(s.title)}>
                Ask Mia about {s.title.toLowerCase()}
                <svg viewBox="0 0 14 14" fill="none"><path d="M2 7H12M12 7L8 3M12 7L8 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ========== Process ==========
Sections.Process = function Process() {
  const steps = [
    { no: '01', title: 'Consultation', body: "We'll talk through your face, skin type, lifestyle, and what you hope for." },
    { no: '02', title: 'Design Approval', body: "I draw the shape on you. Nothing permanent happens until you say yes." },
    { no: '03', title: 'The Procedure', body: "2–3 hours. Numbing applied first. Most feel it like eyebrow plucking." },
    { no: '04', title: 'Free Touch-up', body: "One complimentary refinement 4–12 weeks later. The healed result is yours." },
  ];
  return (
    <section>
      <div className="container">
        <div className="process">
          <div className="section-header" style={{marginBottom: 0}}>
            <div>
              <div className="eyebrow">The Process</div>
              <h2 className="display">How a session <em>unfolds.</em></h2>
            </div>
            <p className="lead">Precise, unhurried, built around you. First timers usually say they were more relaxed than they expected.</p>
          </div>
          <div className="process-steps">
            {steps.map((s, i) => (
              <div key={i} className="process-step">
                <div className="no">{s.no}</div>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ========== About Mia ==========
Sections.About = function About() {
  return (
    <section id="about">
      <div className="container">
        <div className="about">
          <div className="about-portrait">
            {/* Editorial portrait placeholder */}
            <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" style={{width:'100%', height:'100%', position:'absolute', inset:0}}>
              <defs>
                <radialGradient id="p1" cx="50%" cy="35%" r="55%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.4)"/>
                  <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
                </radialGradient>
              </defs>
              {/* face silhouette */}
              <g transform="translate(200 220)">
                <ellipse cx="0" cy="0" rx="110" ry="140" fill="rgba(30,20,15,0.18)"/>
                <ellipse cx="0" cy="-10" rx="95" ry="120" fill="rgba(200,145,115,0.35)"/>
                {/* hair */}
                <path d="M -110 -30 Q -130 -130 -20 -150 Q 120 -145 110 -20 L 100 40 L 95 -10 Q 70 -110 -10 -110 Q -90 -105 -95 -20 Z" fill="rgba(20,12,8,0.7)"/>
                {/* brow */}
                <path d="M -70 -55 Q -50 -65 -20 -58" stroke="rgba(20,12,8,0.75)" strokeWidth="3" fill="none" strokeLinecap="round"/>
                <path d="M 20 -58 Q 50 -65 70 -55" stroke="rgba(20,12,8,0.75)" strokeWidth="3" fill="none" strokeLinecap="round"/>
                {/* eyes closed */}
                <path d="M -65 -35 Q -50 -28 -30 -35" stroke="rgba(20,12,8,0.55)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <path d="M 30 -35 Q 50 -28 65 -35" stroke="rgba(20,12,8,0.55)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                {/* lips */}
                <path d="M -25 35 Q -12 28 0 32 Q 12 28 25 35 Q 12 48 0 45 Q -12 48 -25 35 Z" fill="rgba(190,100,85,0.55)"/>
                <path d="M -25 35 Q 0 40 25 35" stroke="rgba(140,60,50,0.6)" strokeWidth="1" fill="none"/>
              </g>
              <rect width="400" height="500" fill="url(#p1)"/>
            </svg>
            <div className="about-signature">Mia Min</div>
          </div>
          <div>
            <div className="eyebrow">About</div>
            <h2 className="display">Eight years. Over <em>a thousand</em> faces.</h2>
            <p>Mia grew up in South Korea where women take deep pride in beauty. She trained there, won awards, and brought that discipline to New York — where she's spent the last decade quietly building one of the city's most loyal client books.</p>
            <p>Her work is recognizable for what it <em>doesn't</em> look like: overdone, blocky, too dark. Mia's goal is a result that reads as yours, only clearer.</p>
            <div className="quote">
              "Natural beauty from start to the end — that's the goal. This is why my clients come back."
            </div>
            <div className="about-stats">
              <div>
                <div className="num">1,000+</div>
                <div className="lbl">Procedures</div>
              </div>
              <div>
                <div className="num">8 yrs</div>
                <div className="lbl">In practice</div>
              </div>
              <div>
                <div className="num">~90%</div>
                <div className="lbl">Revisit rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ========== Gallery (Instagram link) ==========
Sections.Gallery = function Gallery() {
  return (
    <section id="gallery">
      <div className="container">
        <div className="gallery">
          <div className="gallery-head">
            <div>
              <div className="eyebrow" style={{color: 'inherit', opacity: 0.6}}>Portfolio</div>
              <h2 className="display" style={{marginTop: 16}}>Her work, <em>unretouched.</em></h2>
            </div>
            <div className="handle">@miamin_ny</div>
          </div>
          <div className="insta-tiles">
            {Array.from({length: 12}).map((_, i) => (
              <a key={i} className="tile" href="https://www.instagram.com/miamin_ny/" target="_blank" rel="noopener">
                <TileArt seed={i}/>
              </a>
            ))}
          </div>
          <a className="insta-cta" href="https://www.instagram.com/miamin_ny/" target="_blank" rel="noopener">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8"/>
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
            </svg>
            View the full portfolio on Instagram
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          </a>
        </div>
      </div>
    </section>
  );
};

function TileArt({ seed }) {
  const variants = [
    // brow close-up
    <svg key="1" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <defs><radialGradient id={`tg${seed}`} cx="50%" cy="50%"><stop offset="0%" stopColor="rgba(255,255,255,0.25)"/><stop offset="100%" stopColor="rgba(255,255,255,0)"/></radialGradient></defs>
      <rect width="100" height="100" fill={`url(#tg${seed})`}/>
      {Array.from({length: 14}).map((_, i) => (
        <line key={i} x1={10 + i * 6} y1={55 + Math.sin(i + seed) * 4} x2={14 + i * 6} y2={48 + Math.sin(i + seed) * 4} stroke="rgba(20,12,8,0.7)" strokeWidth="1.4" strokeLinecap="round"/>
      ))}
    </svg>,
    // lip close-up
    <svg key="2" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <path d="M 20 50 Q 35 40 50 48 Q 65 40 80 50 Q 65 62 50 58 Q 35 62 20 50 Z" fill="rgba(190,100,90,0.6)"/>
      <path d="M 20 50 Q 50 55 80 50" stroke="rgba(140,60,50,0.7)" strokeWidth="1.2" fill="none"/>
    </svg>,
    // geometric abstraction
    <svg key="3" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
      <circle cx="50" cy="50" r="20" fill="rgba(255,255,255,0.15)"/>
    </svg>,
  ];
  return variants[seed % variants.length];
}

// ========== FAQ ==========
Sections.FAQ = function FAQ({ onAskMia }) {
  const [open, setOpen] = useSState(0);
  const faqs = [
    { q: "How long will results last?", a: "Brows last about 1.5–3 years, lips about 1–3 years — depending on your skin type and lifestyle. We recommend a touch-up around the 12–24 month mark." },
    { q: "Does it hurt?", a: "We apply numbing ointment first. Most clients describe it as similar to eyebrow plucking — any discomfort usually fades within five minutes." },
    { q: "How long is an appointment?", a: "Brow sessions take about 2–2.5 hours; lips 2.5–3 hours. That includes a full consultation, drawing the shape on you, and waiting for your approval before we start." },
    { q: "Can I go to work the next day?", a: "Yes — as long as you follow aftercare. Brows will look bold and slightly red for about a week; lips may swell for 1–2 days and look darker for 2–3 days before softening." },
    { q: "Can I work out after?", a: "No — skip the gym for at least one week post-procedure. Sweat, heat, and friction interfere with healing." },
    { q: "Do you take touch-ups from other studios?", a: "No. We only touch up work done by Mia. If you've had brows done elsewhere, email photos to miamin0915@gmail.com and we'll be in touch." },
  ];
  return (
    <section id="faq">
      <div className="container">
        <div className="section-header">
          <div>
            <div className="eyebrow">Questions</div>
            <h2 className="display">Most asked, <em>answered.</em></h2>
          </div>
          <p className="lead">Can't find yours? Mia's on the right — ask her anything. If it's sensitive, she'll pass it straight to her team.</p>
        </div>
        <div className="faq-wrap">
          <div className="faq-list">
            {faqs.map((f, i) => (
              <div key={i} className={`faq-item ${open === i ? 'open' : ''}`} onClick={() => setOpen(open === i ? -1 : i)}>
                <div className="faq-q">
                  <span>{f.q}</span>
                  <span className="plus">+</span>
                </div>
                <div className="faq-a">{f.a}</div>
              </div>
            ))}
          </div>
          <div className="faq-ask-cta">
            <div className="eyebrow">Ask Mia</div>
            <h4>Get a real answer, <em>right now.</em></h4>
            <p>Mia's AI assistant is trained on everything we do. For sensitive questions it'll hand you off to the team.</p>
            <div className="suggestions">
              <button className="faq-chip" onClick={() => onAskMia("What should I avoid before my appointment?")}>
                <span>What should I avoid before my appointment?</span>
                <svg viewBox="0 0 14 14" fill="none"><path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
              </button>
              <button className="faq-chip" onClick={() => onAskMia("I'm pregnant — can I still book?")}>
                <span>I'm pregnant — can I still book?</span>
                <svg viewBox="0 0 14 14" fill="none"><path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
              </button>
              <button className="faq-chip" onClick={() => onAskMia("Which service is best for oily skin?")}>
                <span>Which service is best for oily skin?</span>
                <svg viewBox="0 0 14 14" fill="none"><path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
              </button>
              <button className="faq-chip" onClick={() => onAskMia("What does a session actually look like?")}>
                <span>What does a session actually look like?</span>
                <svg viewBox="0 0 14 14" fill="none"><path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ========== Contact ==========
Sections.Contact = function Contact() {
  return (
    <section id="contact">
      <div className="container">
        <div className="contact">
          <div>
            <div className="eyebrow">Visit</div>
            <h2 className="display">Midtown Manhattan. <em>By appointment.</em></h2>
          </div>
          <div className="contact-info">
            <div className="contact-row">
              <div className="lbl">Studio</div>
              <div className="val">315 5th Ave, Suite 605<br/>New York, NY 10016</div>
            </div>
            <div className="contact-row">
              <div className="lbl">Hours</div>
              <div className="val">Monday – Friday · 9:00 AM – 7:00 PM<br/>Saturday + Sunday · Closed</div>
            </div>
            <div className="contact-row">
              <div className="lbl">Phone</div>
              <div className="val"><a href="tel:3472449608">347-244-9608</a></div>
            </div>
            <div className="contact-row">
              <div className="lbl">Email</div>
              <div className="val"><a href="mailto:miamin0915@gmail.com">miamin0915@gmail.com</a></div>
            </div>
            <div className="contact-row">
              <div className="lbl">Instagram</div>
              <div className="val"><a href="https://www.instagram.com/miamin_ny/" target="_blank" rel="noopener">@miamin_ny</a></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

window.Sections = Sections;
