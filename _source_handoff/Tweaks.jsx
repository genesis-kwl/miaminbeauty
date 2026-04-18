/* global React */
// Tweaks.jsx — in-page tweaks panel

const { useState: useTState, useEffect: useTEffect } = React;

function TweaksPanel({ tweaks, setTweaks, active }) {
  if (!active) return null;

  const update = (key, value) => {
    const next = { ...tweaks, [key]: value };
    setTweaks(next);
    // Persist to disk
    window.parent?.postMessage({ type: '__edit_mode_set_keys', edits: { [key]: value } }, '*');
  };

  const Section = ({ label, children }) => (
    <div className="tweak-group">
      <label>{label}</label>
      <div className="tweak-opts">{children}</div>
    </div>
  );

  const Opt = ({ k, v, cur, children }) => (
    <button className={`tweak-opt ${cur === v ? 'active' : ''}`} onClick={() => update(k, v)}>
      {children || v}
    </button>
  );

  const Swatch = ({ k, v, cur, color }) => (
    <button
      className={`tweak-swatch ${cur === v ? 'active' : ''}`}
      onClick={() => update(k, v)}
      style={{ background: color }}
      title={v}
    />
  );

  return (
    <div className="tweaks-panel active">
      <h3>Tweaks</h3>
      <div className="sub">Toggle the design in real time</div>

      <div className="tweak-group">
        <label>Palette</label>
        <div className="tweak-swatches">
          <Swatch k="palette" v="ocean" cur={tweaks.palette} color="linear-gradient(135deg,#F6D9C8,#7FA0AC)"/>
          <Swatch k="palette" v="blush" cur={tweaks.palette} color="linear-gradient(135deg,#FBDCCB,#C76A55)"/>
          <Swatch k="palette" v="noir" cur={tweaks.palette} color="linear-gradient(135deg,#2A1F18,#D4A25E)"/>
          <Swatch k="palette" v="sage" cur={tweaks.palette} color="linear-gradient(135deg,#D8E0CE,#3E5240)"/>
          <Swatch k="palette" v="sand" cur={tweaks.palette} color="linear-gradient(135deg,#EBD5AD,#6A4422)"/>
        </div>
      </div>

      <Section label="Chat Placement">
        <Opt k="placement" v="hero" cur={tweaks.placement}>Hero</Opt>
        <Opt k="placement" v="docked" cur={tweaks.placement}>Docked</Opt>
        <Opt k="placement" v="drawer" cur={tweaks.placement}>Drawer</Opt>
        <Opt k="placement" v="fullscreen" cur={tweaks.placement}>Full-screen</Opt>
      </Section>

      <Section label="Hero Layout">
        <Opt k="hero" v="split" cur={tweaks.hero}>Split</Opt>
        <Opt k="hero" v="full-bleed" cur={tweaks.hero}>Centered</Opt>
        <Opt k="hero" v="ambient" cur={tweaks.hero}>Ambient</Opt>
      </Section>

      <Section label="Chatbot Voice">
        <Opt k="persona" v="mia" cur={tweaks.persona}>Mia</Opt>
        <Opt k="persona" v="concierge" cur={tweaks.persona}>Concierge</Opt>
        <Opt k="persona" v="clinical" cur={tweaks.persona}>Clinical</Opt>
        <Opt k="persona" v="quiet" cur={tweaks.persona}>Quiet</Opt>
      </Section>

      <Section label="Booking Flow">
        <Opt k="flow" v="conversational" cur={tweaks.flow}>Conversational</Opt>
        <Opt k="flow" v="fast" cur={tweaks.flow}>Fast</Opt>
      </Section>

      <Section label="Typography">
        <Opt k="type" v="grotesk" cur={tweaks.type}>Grotesk</Opt>
        <Opt k="type" v="serif-mix" cur={tweaks.type}>Serif Mix</Opt>
        <Opt k="type" v="mono-accent" cur={tweaks.type}>Mono Accent</Opt>
      </Section>

      <Section label="Density">
        <Opt k="density" v="airy" cur={tweaks.density}>Airy</Opt>
        <Opt k="density" v="compact" cur={tweaks.density}>Compact</Opt>
      </Section>
    </div>
  );
}

window.TweaksPanel = TweaksPanel;
