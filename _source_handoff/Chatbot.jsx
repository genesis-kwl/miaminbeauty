/* global React */
// Chatbot.jsx — Mia herself, hybrid AI with handoff

const { useState, useEffect, useRef, useCallback } = React;

// ============ KNOWLEDGE BASE ============
const SERVICES = [
  { id: 'microblading', name: 'Microblading', cat: 'eyebrows', price: 550, sub: 'Hand-drawn natural hair strokes', dur: '2.5h', best: 'Normal to dry skin, even brow hair' },
  { id: 'airy-shading', name: 'Airy Shading', cat: 'eyebrows', price: 550, sub: 'Soft powdered shadow effect', dur: '2.5h', best: 'All skin types, incl. oily/sensitive' },
  { id: 'combo', name: 'Microblading + Airy Shading Combo', cat: 'eyebrows', price: 600, sub: 'Mia Min Signature — both techniques', dur: '3h', best: 'Thin, light, or patchy arches' },
  { id: 'lip-blush', name: 'Natural Lip Blush', cat: 'lips', price: 880, sub: 'Soft, natural lip tint by machine', dur: '3h', best: 'Anyone wanting brighter, more defined lips' },
  { id: 'touchup-brow', name: 'Eyebrow Touch-up', cat: 'eyebrows', price: 300, sub: '10–18 months refresh — our clients only', dur: '2h', best: 'Existing Mia Min clients, 10–18 mo out' },
  { id: 'touchup-lip', name: 'Lip Blush Touch-up', cat: 'lips', price: 450, sub: '10–18 months refresh — our clients only', dur: '2h', best: 'Existing Mia Min clients, 10–18 mo out' },
];

const FAQ_CONTEXT = `
MIA MIN BEAUTY — KEY FACTS (use these for answers, in Mia's voice):

STUDIO
• 315 5th Ave, #605, New York, NY 10016
• Hours: Mon–Fri 9:00am–7:00pm. Closed Sat + Sun.
• Phone 347-244-9608 • Email miamin0915@gmail.com
• Mia: 8+ years experience, award-winning, Korean-trained semi-permanent makeup artist

PRICING
• Microblading $550 • Airy Shading $550 • Combo (Signature) $600
• Natural Lip Blush $880
• Eyebrow touch-up 10–18mo $300, 18–24mo $350 (our clients only)
• Lip touch-up 10–18mo $450, 18–24mo $550 (our clients only)
• After 24 months = new set pricing
• Extra lip session within 12 weeks $120
• 4.5% NY tax additional
• First touch-up (4–12 weeks) is FREE and highly recommended

LONGEVITY
• Brows: 1.5–3 years depending on skin + lifestyle
• Lips: 1–3 years

TIME
• Brow appt: 2–2.5 hours (incl. consult, design approval, procedure)
• Lip appt: 2.5–3 hours

PAIN
• Numbing ointment applied first
• Most clients describe it like eyebrow plucking; discomfort fades in ~5 minutes

HEALING
• ~1 week healing; aftercare is strict
• Avoid: workouts, makeup on brows, getting the area wet, sun, sweat, pools/sauna (15 days), tanning (30 days)
• Scabbing will happen — do NOT pick
• Color looks darker/bolder first ~7 days, settles natural

CONTRAINDICATIONS — cannot do if client is:
• Pregnant or nursing
• In chemotherapy
• Has viral infections/diseases
• Epileptic, diabetic
• Has pacemaker or major heart problems
• Had organ transplant
• Has skin irritation/psoriasis near area
• Currently sick (cold/flu)
• Had Botox/filler in past 8 weeks (brows) or 12 weeks (lips)

PRE-CARE (BROWS, 24h before)
• No alcohol
• No Aspirin, Niacin, Vitamin E, Fish Oil, Ibuprofen
• No retinol/tretinoin/acid/Vit-C for 30 days prior
• No chemical peels / laser for 30 days
• No tanning 15 days
• Arrive with clean face (only sunscreen or eye makeup OK)

PRE-CARE (LIPS)
• Lips must be fully hydrated 3+ days before — apply Aquaphor/Vaseline every 2-3 hrs
• Do NOT scrub or pick dead skin
• Eat before appt (no food for 3 hrs after)
• No alcohol 24 hrs before
• Cold sore history? Must get antiviral Rx and take 1 day before / 3 days after
• We don't work on very dark lips

LIP NOTES
• We recommend natural pinks/corals/nudes — no wine or dark colors
• No overlip (use filler instead)
• Can partly cover scars within the lip
• Asymmetry can be improved but not perfectly corrected

TOUCH-UPS
• First touch-up: 4–12 weeks after initial, FREE
• We only touch up work WE did — not other studios
• After 24 months = new set pricing

GALLERY
• Instagram: @miamin_ny — full portfolio there

BOOKING POLICY
• Previous eyebrow tattoos from elsewhere? Must email photos to miamin0915@gmail.com before booking.
`;

const PERSONAS = {
  mia: {
    system: `You are Mia Min, award-winning semi-permanent makeup artist and owner of Mia Min Beauty in NYC. You speak in the first person as Mia. You are warm, precise, and deeply experienced (8+ years, 1000+ procedures). You grew up in South Korea and bring that aesthetic — natural, soft, beautiful.

Voice: warm but professional, occasional "I" statements like "I'll personally..." or "in my experience...". Brief — 1-3 sentences usually. Use em-dashes sparingly. Never use emoji. Never use bullet points for simple answers. For anything sensitive (medical, past work done elsewhere, allergies, pregnancy), you hand off to a real team member — say "let me have my team follow up personally" or similar.

You can wrap up to 3 words in <em>...</em> for emphasis — use it for poetic accents like natural, soft, personal.`,
    label: 'Mia',
    greeting: "Hi, I'm Mia. So glad you're here.",
    greeting2: "Tell me what brings you in — a new set, a touch-up, or questions? I'll guide you."
  },
  concierge: {
    system: `You are the front-desk concierge at Mia Min Beauty in NYC. Warm, efficient, stylist-energy. You greet clients by wrapping them in hospitality. Brief replies (1-3 sentences). Never use emoji. For sensitive medical/past-work questions, hand off: "Let me pass this to Mia's team to follow up personally."`,
    label: 'Studio',
    greeting: "Welcome to Mia Min Beauty.",
    greeting2: "I can book you in, answer questions, or get you in touch with Mia directly. What do you need?"
  },
  clinical: {
    system: `You are the intake coordinator at Mia Min Beauty, a medical-aesthetic studio. Precise, clinical, reassuring. Cite specifics (timing, percentages, contraindications). Brief (1-3 sentences). Never use emoji. Hand off sensitive cases to Mia's clinical team.`,
    label: 'Intake',
    greeting: "Welcome. This is the Mia Min Beauty intake assistant.",
    greeting2: "I'll help you choose a service, screen for contraindications, and schedule. Where shall we start?"
  },
  quiet: {
    system: `You work the front of Mia Min Beauty. Minimal, elegant. Speak in short fragments — 1-2 sentences max. Lowercase feel. Never use emoji. For anything sensitive, defer to Mia.`,
    label: 'Studio',
    greeting: "Hello.",
    greeting2: "How can I help?"
  },
};

// ============ UTILITIES ============
function getNextDays(count = 30) {
  const days = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

function formatDate(d) {
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

const TIME_SLOTS = ['9:30 AM', '11:00 AM', '12:30 PM', '2:30 PM', '4:00 PM', '5:30 PM'];

// ============ CHATBOT COMPONENT ============
function Chatbot({ persona = 'mia', flow = 'conversational', onMinimize, placement = 'hero' }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState('greeting'); // greeting | open | booking-service | booking-screen | booking-date | booking-time | booking-name | booking-email | booking-phone | booking-done | faq | handoff
  const [booking, setBooking] = useState({ service: null, date: null, time: null, name: '', email: '', phone: '' });
  const [conversationHistory, setConversationHistory] = useState([]);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);

  const p = PERSONAS[persona] || PERSONAS.mia;

  // Initial greeting
  useEffect(() => {
    setMessages([]);
    setMode('greeting');
    const t1 = setTimeout(() => {
      setMessages([{ id: 'g1', from: 'mia', text: p.greeting }]);
    }, 400);
    const t2 = setTimeout(() => {
      setIsTyping(true);
    }, 1000);
    const t3 = setTimeout(() => {
      setIsTyping(false);
      setMessages(m => [...m, { id: 'g2', from: 'mia', text: p.greeting2 }]);
      setTimeout(() => {
        setMessages(m => [...m, {
          id: 'g3', from: 'mia', kind: 'chips',
          chips: [
            { label: 'Book an appointment', action: 'start-booking', primary: true },
            { label: 'How does microblading work?', action: 'ask-microblading' },
            { label: 'Does it hurt?', action: 'ask-pain' },
            { label: 'I have questions', action: 'open-faq' },
          ]
        }]);
        setMode('open');
      }, 300);
    }, 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [persona]);

  // Auto-scroll
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // External trigger — from FAQ chips and service cards
  const askAIRef = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (e.detail && askAIRef.current) askAIRef.current(e.detail);
    };
    window.addEventListener('ask-mia', handler);
    return () => window.removeEventListener('ask-mia', handler);
  }, []);

  const pushMia = (content, extra = {}) => {
    const id = 'm' + Date.now() + Math.random();
    setMessages(m => [...m, { id, from: 'mia', ...(typeof content === 'string' ? { text: content } : content), ...extra }]);
  };
  const pushUser = (text) => {
    const id = 'u' + Date.now();
    setMessages(m => [...m, { id, from: 'user', text }]);
  };

  const typeThen = (fn, delay = 700) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      fn();
    }, delay);
  };

  // ========== CHIP ACTIONS ==========
  const handleChipAction = (action, label) => {
    if (label) pushUser(label);

    if (action === 'start-booking') {
      typeThen(() => {
        pushMia("Beautiful. Which service were you thinking about?");
        setTimeout(() => {
          setMessages(m => [...m, {
            id: 'svc' + Date.now(),
            from: 'mia',
            kind: 'services',
            services: SERVICES,
          }]);
          setMode('booking-service');
        }, 200);
      });
    } else if (action === 'ask-microblading') {
      askAI("How does microblading work and who is it for?");
    } else if (action === 'ask-pain') {
      askAI("Does microblading or lip blush hurt?");
    } else if (action === 'open-faq') {
      typeThen(() => {
        pushMia("Of course. What would you like to know?");
        setTimeout(() => {
          setMessages(m => [...m, {
            id: 'faq-chips',
            from: 'mia',
            kind: 'chips',
            chips: [
              { label: 'How long do results last?', action: 'ask-longevity' },
              { label: 'What to avoid beforehand', action: 'ask-precare' },
              { label: 'Touch-up policy', action: 'ask-touchup' },
              { label: 'Can I work out after?', action: 'ask-workout' },
              { label: 'Cost + payment', action: 'ask-cost' },
              { label: 'I had brows done elsewhere', action: 'handoff-prior-work' },
            ]
          }]);
        }, 200);
      });
    } else if (action === 'ask-longevity') askAI("How long do microblading and lip blush results last?");
    else if (action === 'ask-precare') askAI("What should I avoid before my appointment?");
    else if (action === 'ask-touchup') askAI("What's the touch-up policy?");
    else if (action === 'ask-workout') askAI("Can I work out after the procedure?");
    else if (action === 'ask-cost') askAI("What does everything cost including tax?");
    else if (action === 'handoff-prior-work') {
      typeThen(() => {
        setMessages(m => [...m, {
          id: 'handoff-' + Date.now(),
          from: 'mia',
          kind: 'handoff',
          title: "I'll connect you with my team",
          body: "Since you've had work done elsewhere, I need to personally review photos before we can book. Please email a clear photo of your current brows to miamin0915@gmail.com or text 347-244-9608 — my team will reach out within 24 hours."
        }]);
      });
    }
  };

  // ========== SERVICE SELECTION → SCREENING ==========
  const handleServiceSelect = (service) => {
    pushUser(`${service.name} — $${service.price}`);
    setBooking(b => ({ ...b, service }));
    typeThen(() => {
      pushMia(`Lovely choice. ${service.cat === 'lips' ? "Lip blush is one of my favorites — it'll brighten your whole face." : "It'll look soft and natural, I promise."}`);
      setTimeout(() => {
        pushMia("Before we pick a date — a few quick safety questions. Any of these apply to you right now?");
        setTimeout(() => {
          setMessages(m => [...m, {
            id: 'screen-' + Date.now(),
            from: 'mia',
            kind: 'chips',
            chips: [
              { label: 'None of the below ✓', action: 'screen-clear', primary: true },
              { label: 'Pregnant / nursing', action: 'screen-block' },
              { label: 'In chemotherapy', action: 'screen-block' },
              { label: 'Had Botox/filler recently', action: 'screen-botox' },
              { label: service.cat === 'lips' ? 'Cold sore history' : 'Skin condition near brows', action: 'screen-soft' },
              { label: 'Diabetic / heart condition', action: 'screen-soft' },
            ]
          }]);
          setMode('booking-screen');
        }, 400);
      }, 500);
    });
  };

  const handleScreening = (action, label) => {
    pushUser(label);
    if (action === 'screen-clear') {
      typeThen(() => {
        pushMia("Perfect — let's get you on the books.");
        setTimeout(() => showCalendar(), 300);
      });
    } else if (action === 'screen-block') {
      typeThen(() => {
        setMessages(m => [...m, {
          id: 'handoff-' + Date.now(),
          from: 'mia',
          kind: 'handoff',
          title: "Let's wait until it's safe",
          body: "I can't perform this procedure under these conditions — your safety comes first. Once you're in the clear, reach out and we'll get you in. In the meantime, my team can answer any questions: miamin0915@gmail.com"
        }]);
      });
    } else if (action === 'screen-botox') {
      const waitWeeks = booking.service.cat === 'lips' ? 12 : 8;
      typeThen(() => {
        pushMia(`I'll need you to wait ${waitWeeks} weeks after your last ${booking.service.cat === 'lips' ? 'lip' : 'brow/forehead'} Botox or filler before we begin.`);
        setTimeout(() => {
          pushMia("Want to book a date beyond that, or have my team check your timing?");
          setTimeout(() => {
            setMessages(m => [...m, {
              id: 'cont-' + Date.now(),
              from: 'mia',
              kind: 'chips',
              chips: [
                { label: `I'll book past ${waitWeeks} weeks`, action: 'screen-clear', primary: true },
                { label: 'Have team follow up', action: 'handoff-timing' },
              ]
            }]);
          }, 500);
        }, 400);
      });
    } else if (action === 'screen-soft') {
      typeThen(() => {
        setMessages(m => [...m, {
          id: 'handoff-' + Date.now(),
          from: 'mia',
          kind: 'handoff',
          title: "Let me personally review",
          body: "This one needs my eyes on it before we confirm. Please email a quick note (and a photo if relevant) to miamin0915@gmail.com — I'll reach out within a day and we'll make a plan together."
        }]);
      });
    } else if (action === 'handoff-timing') {
      typeThen(() => {
        setMessages(m => [...m, {
          id: 'handoff-' + Date.now(),
          from: 'mia',
          kind: 'handoff',
          title: "I'll have my team check in",
          body: "Text 347-244-9608 with your last filler date and we'll confirm a safe appointment window."
        }]);
      });
    }
  };

  // ========== CALENDAR ==========
  const showCalendar = () => {
    setMessages(m => [...m, {
      id: 'cal-' + Date.now(),
      from: 'mia',
      kind: 'calendar',
    }]);
    setMode('booking-date');
  };

  const handleDateSelect = (date) => {
    pushUser(formatDate(date));
    setBooking(b => ({ ...b, date }));
    typeThen(() => {
      pushMia("And what time works for you?");
      setTimeout(() => {
        setMessages(m => [...m, {
          id: 'time-' + Date.now(),
          from: 'mia',
          kind: 'time-slots',
          slots: TIME_SLOTS,
        }]);
        setMode('booking-time');
      }, 200);
    }, 500);
  };

  const handleTimeSelect = (time) => {
    pushUser(time);
    setBooking(b => ({ ...b, time }));
    typeThen(() => {
      if (flow === 'fast') {
        pushMia("Last step — name, email, phone to lock it in.");
      } else {
        pushMia("Almost there. What should I call you?");
      }
      setTimeout(() => {
        setMessages(m => [...m, {
          id: 'form-name-' + Date.now(),
          from: 'mia',
          kind: 'form',
          field: 'name',
          placeholder: 'Your name',
        }]);
        setMode('booking-name');
      }, 200);
    });
  };

  const handleFormSubmit = (field, value) => {
    pushUser(value);
    setBooking(b => ({ ...b, [field]: value }));
    if (field === 'name') {
      typeThen(() => {
        pushMia(flow === 'fast' ? "Email?" : `Lovely to meet you, ${value}. What's your email?`);
        setTimeout(() => {
          setMessages(m => [...m, {
            id: 'form-email-' + Date.now(),
            from: 'mia', kind: 'form', field: 'email', placeholder: 'you@email.com', inputType: 'email',
          }]);
          setMode('booking-email');
        }, 200);
      }, 400);
    } else if (field === 'email') {
      typeThen(() => {
        pushMia(flow === 'fast' ? "Phone?" : "And a phone number — in case we need to reach you?");
        setTimeout(() => {
          setMessages(m => [...m, {
            id: 'form-phone-' + Date.now(),
            from: 'mia', kind: 'form', field: 'phone', placeholder: '(555) 123-4567', inputType: 'tel',
          }]);
          setMode('booking-phone');
        }, 200);
      }, 400);
    } else if (field === 'phone') {
      finalizeBooking(value);
    }
  };

  const finalizeBooking = (phone) => {
    const finalBooking = { ...booking, phone };
    typeThen(() => {
      setMessages(m => [...m, {
        id: 'summary-' + Date.now(),
        from: 'mia',
        kind: 'summary',
        booking: finalBooking,
      }]);
      setTimeout(() => {
        pushMia(`You're all set, ${finalBooking.name.split(' ')[0]}. I've sent your pre-care instructions to ${finalBooking.email} — please read them carefully, they really do matter for the result.`);
        setTimeout(() => {
          pushMia("Any last questions before we wrap?");
          setMessages(m => [...m, {
            id: 'post-' + Date.now(),
            from: 'mia',
            kind: 'chips',
            chips: [
              { label: 'Send pre-care again', action: 'resend-precare' },
              { label: "I'm nervous — what should I expect?", action: 'ask-expect' },
              { label: "That's all, thank you!", action: 'wrap-up', primary: true },
            ]
          }]);
          setMode('open');
        }, 800);
      }, 900);
    }, 900);
  };

  // ========== AI CALL ==========
  const askAI = useCallback(async (question) => {
    pushUser(question);
    setIsTyping(true);

    const newHistory = [...conversationHistory, { role: 'user', content: question }];

    try {
      if (!window.claude || !window.claude.complete) {
        throw new Error('No AI available');
      }

      const systemPrompt = `${p.system}

STUDIO KNOWLEDGE:
${FAQ_CONTEXT}

RULES:
- Keep replies SHORT (1-3 sentences usually, max 4).
- Speak as ${p.label}.
- If question involves: pregnancy, nursing, chemo, serious medical conditions, tattoo removal, prior work from another studio, allergies, specific Botox timing, custom color requests → say you'll connect them with the team and suggest emailing miamin0915@gmail.com or texting 347-244-9608.
- Never invent prices or policies not in the knowledge above.
- Use <em>word</em> for up to 3 italic emphasis words per reply.
- Never use emoji.
- Never use bullet points unless listing 3+ things.`;

      const response = await window.claude.complete({
        messages: newHistory,
        system: systemPrompt,
      });

      setConversationHistory([...newHistory, { role: 'assistant', content: response }]);
      setIsTyping(false);

      // Render response, parse <em> tags
      pushMia({ text: response });

      // Suggest follow-ups after AI answer
      setTimeout(() => {
        setMessages(m => [...m, {
          id: 'followup-' + Date.now(),
          from: 'mia',
          kind: 'chips',
          chips: [
            { label: 'Book me in', action: 'start-booking', primary: true },
            { label: 'Another question', action: 'open-faq' },
          ]
        }]);
      }, 400);
    } catch (e) {
      setIsTyping(false);
      pushMia("I'm having trouble reaching my notes right now — email miamin0915@gmail.com or text 347-244-9608 and my team will answer right away.");
    }
  }, [conversationHistory, p]);

  // Keep ref in sync for use in pre-definition effects
  useEffect(() => { askAIRef.current = askAI; }, [askAI]);

  // ========== FREE INPUT ==========
  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;
    setInputValue('');

    if (mode === 'booking-name' || mode === 'booking-email' || mode === 'booking-phone') {
      const field = mode.split('-')[1];
      handleFormSubmit(field, text);
    } else {
      askAI(text);
    }
  };

  const handleResendPrecare = () => {
    pushUser("Please resend pre-care");
    typeThen(() => {
      pushMia(`Done — pre-care for ${booking.service?.cat === 'lips' ? 'lip blush' : 'brows'} is on its way to ${booking.email}.`);
    });
  };

  const handleAskExpect = () => {
    pushUser("I'm nervous — what should I expect?");
    askAI(`The client is nervous about their upcoming ${booking.service?.name} appointment. In 2-3 warm sentences, walk them through exactly what will happen on the day.`);
  };

  // ============ RENDER ============
  return (
    <div className="chatbox">
      <div className="chat-head">
        <div className="chat-avatar">
          M
          <div className="online"></div>
        </div>
        <div className="chat-who">
          <div className="name">
            {p.label === 'Mia' ? 'Mia Min' : p.label}
            <span className="badge">AI + Team</span>
          </div>
          <div className="status"><span className="dot"></span>Usually replies instantly</div>
        </div>
        <div className="chat-actions">
          {onMinimize && (
            <button className="chat-icon-btn" onClick={onMinimize} aria-label="Minimize">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 10L7 5L12 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          )}
        </div>
      </div>

      <div className="chat-body" ref={bodyRef}>
        <div className="chat-divider">Today — {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</div>

        {messages.map((m) => {
          if (m.kind === 'chips') {
            return (
              <div key={m.id} className="chips">
                {m.chips.map((c, i) => (
                  <button
                    key={i}
                    className={`chip ${c.primary ? 'primary' : ''}`}
                    onClick={() => {
                      if (c.action.startsWith('screen-')) handleScreening(c.action, c.label);
                      else if (c.action === 'handoff-timing') handleScreening(c.action, c.label);
                      else if (c.action === 'resend-precare') handleResendPrecare();
                      else if (c.action === 'ask-expect') handleAskExpect();
                      else if (c.action === 'wrap-up') {
                        pushUser("That's all, thank you!");
                        typeThen(() => pushMia("See you soon. Truly — I can't wait. <em>x Mia</em>"));
                      }
                      else handleChipAction(c.action, c.label);
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            );
          }
          if (m.kind === 'services') {
            return (
              <div key={m.id} className="chat-cards">
                {m.services.map(s => (
                  <button key={s.id} className="chat-card" onClick={() => handleServiceSelect(s)}>
                    <div>
                      <div className="cc-name">{s.name}</div>
                      <div className="cc-sub">{s.sub} · {s.dur}</div>
                    </div>
                    <div className="cc-price">${s.price}</div>
                  </button>
                ))}
              </div>
            );
          }
          if (m.kind === 'calendar') {
            return <CalendarPicker key={m.id} onPick={handleDateSelect} />;
          }
          if (m.kind === 'time-slots') {
            return (
              <div key={m.id} className="time-slots">
                {m.slots.map((s, i) => (
                  <button key={i} className="time-slot" onClick={() => handleTimeSelect(s)}>{s}</button>
                ))}
              </div>
            );
          }
          if (m.kind === 'form') {
            return <InlineForm key={m.id} field={m.field} placeholder={m.placeholder} inputType={m.inputType} onSubmit={(v) => handleFormSubmit(m.field, v)} />;
          }
          if (m.kind === 'summary') {
            return (
              <div key={m.id} className="summary-card">
                <div className="summary-inner">
                  <div className="summary-title">Appointment Confirmed</div>
                  <div className="summary-row"><span className="k">Service</span><span className="v">{m.booking.service.name}</span></div>
                  <div className="summary-row"><span className="k">When</span><span className="v">{formatDate(m.booking.date)} · {m.booking.time}</span></div>
                  <div className="summary-row"><span className="k">Name</span><span className="v">{m.booking.name}</span></div>
                  <div className="summary-row"><span className="k">Email</span><span className="v">{m.booking.email}</span></div>
                  <div className="summary-total"><span>Total (+4.5% tax)</span><span>${(m.booking.service.price * 1.045).toFixed(2)}</span></div>
                </div>
              </div>
            );
          }
          if (m.kind === 'handoff') {
            return (
              <div key={m.id} className="handoff-card">
                <div className="handoff-inner">
                  <div className="ic">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 8.5C9.38 8.5 10.5 7.38 10.5 6C10.5 4.62 9.38 3.5 8 3.5C6.62 3.5 5.5 4.62 5.5 6C5.5 7.38 6.62 8.5 8 8.5ZM8 9.75C6.33 9.75 3 10.58 3 12.25V13H13V12.25C13 10.58 9.67 9.75 8 9.75Z" fill="currentColor"/></svg>
                  </div>
                  <div className="txt">
                    <strong>{m.title}</strong>
                    {m.body}
                  </div>
                </div>
              </div>
            );
          }
          return <MiaMessage key={m.id} msg={m} persona={p} />;
        })}

        {isTyping && (
          <div className="msg from-mia">
            <div className="msg-avatar">M</div>
            <div className="typing"><span></span><span></span><span></span></div>
          </div>
        )}
      </div>

      <div className="chat-foot">
        <div className="chat-input-row">
          <input
            ref={inputRef}
            type="text"
            className="chat-input"
            placeholder="Ask me anything..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
          />
          <button className="chat-send" onClick={handleSend} disabled={!inputValue.trim()}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7L12 2L9.5 12L7 8L2 7Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="none"/></svg>
          </button>
        </div>
        <div className="chat-hint">
          <span>Real answers. Real booking.</span>
          <span className="powered"><span className="sparkle">✦</span> AI + Mia's team</span>
        </div>
      </div>
    </div>
  );
}

// ============ HELPER COMPONENTS ============
function MiaMessage({ msg, persona }) {
  // Parse <em> tags for emphasis
  const renderText = (text) => {
    if (!text) return null;
    const parts = text.split(/(<em>.*?<\/em>|\*\*.*?\*\*)/g);
    return parts.map((p, i) => {
      if (p.startsWith('<em>')) return <em key={i}>{p.slice(4, -5)}</em>;
      if (p.startsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>;
      return p;
    });
  };
  return (
    <div className={`msg from-${msg.from}`}>
      {msg.from === 'mia' && <div className="msg-avatar">M</div>}
      <div className="msg-bubble">{renderText(msg.text)}</div>
    </div>
  );
}

function InlineForm({ field, placeholder, inputType, onSubmit }) {
  const [v, setV] = useState('');
  const ref = useRef(null);
  useEffect(() => { setTimeout(() => ref.current?.focus(), 100); }, []);
  return (
    <div className="chat-form">
      <input
        ref={ref}
        type={inputType || 'text'}
        className="chat-input-inline"
        placeholder={placeholder}
        value={v}
        onChange={(e) => setV(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && v.trim()) onSubmit(v.trim()); }}
      />
    </div>
  );
}

function CalendarPicker({ onPick }) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [selected, setSelected] = useState(null);

  const firstDay = new Date(viewYear, viewMonth, 1);
  const lastDay = new Date(viewYear, viewMonth + 1, 0);
  const startPad = firstDay.getDay();
  const totalDays = lastDay.getDate();

  const monthName = firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const cells = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);

  const isPast = (d) => {
    if (!d) return true;
    const dt = new Date(viewYear, viewMonth, d);
    return dt < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };
  const isClosed = (d) => {
    if (!d) return false;
    const dt = new Date(viewYear, viewMonth, d);
    return dt.getDay() === 0 || dt.getDay() === 6;
  };
  const isToday = (d) => d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  return (
    <div className="chat-calendar">
      <div className="cal-wrap">
        <div className="cal-head">
          <div className="cal-month">{monthName}</div>
          <div className="cal-nav">
            <button onClick={() => {
              const d = new Date(viewYear, viewMonth - 1, 1);
              setViewMonth(d.getMonth()); setViewYear(d.getFullYear());
            }}>‹</button>
            <button onClick={() => {
              const d = new Date(viewYear, viewMonth + 1, 1);
              setViewMonth(d.getMonth()); setViewYear(d.getFullYear());
            }}>›</button>
          </div>
        </div>
        <div className="cal-grid">
          {['S','M','T','W','T','F','S'].map((d, i) => <div key={'l'+i} className="cal-day-label">{d}</div>)}
          {cells.map((d, i) => {
            if (d === null) return <div key={'e'+i}></div>;
            const closed = isClosed(d);
            const past = isPast(d);
            return (
              <button
                key={'d'+i}
                className={`cal-day ${isToday(d) ? 'today' : ''} ${closed ? 'closed' : ''} ${selected === d ? 'selected' : ''}`}
                disabled={past || closed}
                onClick={() => {
                  if (!past && !closed) {
                    setSelected(d);
                    onPick(new Date(viewYear, viewMonth, d));
                  }
                }}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

window.Chatbot = Chatbot;
