"use client";

import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import dynamic from "next/dynamic";
import { PipPortrait } from "./pip-portrait";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import "../signup/signup.css";
import "./signup-3d.css";

const OfficeWorld = dynamic(() => import("./office-world"), { ssr: false });

export type OfficeStep =
  | "welcome"
  | "phone"
  | "calling"
  | "otp"
  | "verifying"
  | "success"
  | "profile";
const lines: Record<OfficeStep, [string, string]> = {
  welcome: ["Zzz… quarterly reports… zzz…", "Ring the bell. He’s definitely working."],
  phone: ["OH! A HUMAN. For me?!", "Your number, please. HR is a fern. Very strict."],
  calling: ["Hello, secret code department?", "Six digits. Extra secret. Hold the spam."],
  otp: ["A code! For you! From… me!", "Type it into my computer. Gently. It’s vintage."],
  verifying: ["Enhancing… verifying… looking busy…", "This is a very sophisticated operation."],
  success: ["I’M GETTING A PROMOTION!!!", "Please tell the fern. She never checks her email."],
  profile: ["Your very own employee badge!", "You’re not an employee. I just like the printer."],
};
const countries = [
  { code: "+91", name: "India", digits: 10 },
  { code: "+1", name: "US / Canada", digits: 10 },
  { code: "+44", name: "UK", digits: 10 },
  { code: "+61", name: "Australia", digits: 9 },
];

export function Signup3dExperience() {
  const [step, setStep] = useState<OfficeStep>("welcome");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("+91");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [aside, setAside] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const phoneRef = useRef<HTMLInputElement>(null);
  const otpRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const reduced = useReducedMotion();
  const busy = step === "calling" || step === "verifying";
  const done = step === "success" || step === "profile";

  useEffect(() => {
    if (step === "phone") phoneRef.current?.focus({ preventScroll: true });
    if (step === "otp") otpRef.current?.focus({ preventScroll: true });
    if (step === "profile") nameRef.current?.focus({ preventScroll: true });
    if (step === "calling") {
      const timer = window.setTimeout(
        () => {
          setStep("otp");
          setCooldown(30);
        },
        reduced ? 400 : 2400,
      );
      return () => window.clearTimeout(timer);
    }
    if (step === "verifying") {
      const timer = window.setTimeout(() => setStep("success"), reduced ? 400 : 1500);
      return () => window.clearTimeout(timer);
    }
    if (step === "success") {
      const timer = window.setTimeout(() => {
        setStep("profile");
        window.history.replaceState(null, "", "#profile");
      }, 3500);
      return () => window.clearTimeout(timer);
    }
  }, [step, reduced]);
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((n) => n - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);
  useEffect(() => {
    if (!aside) return;
    const timer = window.setTimeout(() => setAside(""), 4000);
    return () => window.clearTimeout(timer);
  }, [aside]);

  function sendCode(event: FormEvent) {
    event.preventDefault();
    const digits = phone.replace(/\D/g, "");
    const selected = countries.find((item) => item.code === country)!;
    if (digits.length !== selected.digits || /^(\d)\1+$/.test(digits)) {
      setError(`${selected.digits} digits for ${selected.name}, please. Pip counted twice.`);
      phoneRef.current?.focus();
      return;
    }
    setPhone(digits);
    setError("");
    setOtp("");
    setStep("calling");
  }
  function verify(event: FormEvent) {
    event.preventDefault();
    if (otp !== "123456") {
      setError(
        otp.length < 6
          ? "All six digits, human. No digit left behind."
          : "CODE NOT FOUND. Pip suggests 123456.",
      );
      otpRef.current?.focus();
      return;
    }
    setError("");
    setStep("verifying");
  }
  function restart() {
    setStep("welcome");
    setPhone("");
    setOtp("");
    setName("");
    setSaved(false);
    setError("");
    setAside("");
    setCooldown(0);
    window.history.replaceState(null, "", window.location.pathname);
  }

  return (
    <div className="pixel-signup signup-3d" data-step={step}>
      <header className="pixel-header">
        <button
          className="pixel-logo"
          onClick={restart}
          aria-label="The Little Office, start again"
        >
          <span className="logo-building" aria-hidden="true">
            ▦
          </span>{" "}
          little office<span className="logo-dot">®</span>
        </button>
        <span className="header-world">A SMALL PLACE TO START SOMETHING BIG</span>
        <span className="office-status">
          <i /> {done ? "ONE HAPPY NEW HUMAN" : "OPEN FOR ADVENTURE"}
        </span>
      </header>
      <section
        className="pixel-stage"
        aria-label="The Little Office interactive signup adventure"
        aria-busy={busy}
      >
        <div className="world-heading">
          <span className="world-eyebrow">THE DEPARTMENT OF NEW BEGINNINGS</span>
          <h1>
            A tiny office.
            <br />
            <span>A big little beginning.</span>
          </h1>
          <p>No passwords. No paperwork.* Just one very enthusiastic Pip.</p>
        </div>
        <OfficeWorld step={step} reduced={reduced} />
        <div className="office-sign" aria-hidden="true">
          WELCOME DEPT.<span>EST. THIS MORNING</span>
        </div>
        <div className="pip-dialogue" aria-live="polite" key={aside || step}>
          <span className="dialogue-name">
            <PipPortrait /> PIP <span>LVL {done ? "02" : "01"} · WELCOME COMMITTEE</span>
          </span>
          <p>{aside || lines[step][0]}</p>
          <small>{aside ? "His manager is a plant. It’s a flat hierarchy." : lines[step][1]}</small>
        </div>
        <div className="desk-computer">
          <div className="computer-casing">
            <span className="computer-brand" aria-hidden="true">
              PIP-BOY 2000
            </span>
            <div className="computer-screen">
              <div className="screen-topbar">
                <span>WELCOME.EXE</span>
                <span>— □ ×</span>
              </div>
              {step === "welcome" || step === "phone" ? (
                <div className="sleep-screen">
                  <span className="pixel-face" aria-hidden="true">
                    {step === "welcome" ? "−.−" : "^‿^"}
                  </span>
                  <span>
                    {step === "welcome" ? "EMPLOYEE IN POWER-SAVING MODE" : "NEW HUMAN DETECTED!"}
                  </span>
                  <small>
                    {step === "welcome"
                      ? "awaiting one (1) little bell ring…"
                      : "Preparing your very official paperwork…"}
                  </small>
                  <i className="terminal-cursor">_</i>
                </div>
              ) : step === "calling" ? (
                <div className="transmission-screen">
                  <span className="signal-pixels" aria-hidden="true">
                    ▂ ▄ ▆ █
                  </span>
                  <strong>CONTACTING CODE HQ</strong>
                  <p>
                    Connecting one tiny landline
                    <br />
                    to the entire internet<span className="terminal-cursor">_</span>
                  </p>
                </div>
              ) : step === "otp" || step === "verifying" ? (
                <form className="terminal-form" onSubmit={verify} noValidate>
                  <label htmlFor="pixel-otp">
                    {step === "verifying"
                      ? "CHECKING HUMAN AUTHENTICITY"
                      : "YOU HAVE ONE SECRET MESSAGE"}
                  </label>
                  <div className="terminal-recipient">
                    TO: {country} {phone}{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setStep("phone");
                        setError("");
                      }}
                      disabled={busy}
                    >
                      EDIT
                    </button>
                  </div>
                  <div className="terminal-code" data-invalid={Boolean(error)}>
                    <div className="code-digits" aria-hidden="true">
                      {Array.from({ length: 6 }, (_, i) => (
                        <span key={i} data-current={i === otp.length}>
                          {otp[i] || "_"}
                        </span>
                      ))}
                    </div>
                    <input
                      ref={otpRef}
                      id="pixel-otp"
                      aria-label="Six-digit verification code"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      value={otp}
                      onChange={(event) => {
                        setOtp(event.target.value.replace(/\D/g, "").slice(0, 6));
                        setError("");
                      }}
                      disabled={busy}
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? "pixel-error" : "demo-code"}
                    />
                  </div>
                  <div className="terminal-bottom">
                    <span>{busy ? "VERIFYING…" : "6 DIGITS. BIG RESPONSIBILITY."}</span>
                    <button className="verify-key" type="submit" disabled={busy}>
                      {busy ? "WAIT…" : "VERIFY ↵"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="success-screen">
                  <span className="pixel-heart" aria-hidden="true">
                    ♥
                  </span>
                  <strong>
                    {step === "success"
                      ? "HUMAN VERIFIED!"
                      : saved
                        ? `HI, ${name.trim().toUpperCase()}!`
                        : "WELCOME TO YOUR WORLD"}
                  </strong>
                  <p>
                    {step === "success"
                      ? "> promotion.exe successfully installed"
                      : "> a new adventure has been unlocked"}
                  </p>
                  <span className="terminal-cursor">_</span>
                </div>
              )}
            </div>
            <span className="computer-led" />
            <span className="computer-slots" aria-hidden="true">
              ▥ ▥ ▥
            </span>
          </div>
          <div className="computer-neck" />
          <div className="computer-foot" />
          <div className="pixel-keyboard" aria-hidden="true">
            {Array.from({ length: 26 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
        </div>
        {step === "phone" && (
          <form className="pixel-clipboard" onSubmit={sendCode} noValidate>
            <span className="clipboard-clip" aria-hidden="true" />
            <span className="paper-serial">FORM 001 / HUMAN CONTACT</span>
            <span className="paper-title">Let’s get your digits.</span>
            <label htmlFor="pixel-phone">A number for Pip’s very important call:</label>
            <div className="paper-phone">
              <select
                aria-label="Country calling code"
                value={country}
                onChange={(event) => {
                  setCountry(event.target.value);
                  setError("");
                }}
              >
                {countries.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.code} {item.name}
                  </option>
                ))}
              </select>
              <input
                ref={phoneRef}
                id="pixel-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                placeholder="98765 43210"
                maxLength={18}
                value={phone}
                onChange={(event) => {
                  setPhone(event.target.value.replace(/[^\d ()-]/g, ""));
                  setError("");
                }}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "pixel-error" : "phone-note"}
              />
            </div>
            <div className="paper-bottom">
              <span id="phone-note">No spam. Fern’s orders.</span>
              <button className="paper-stamp" type="submit">
                SEND TO PIP ↗
              </button>
            </div>
            <button
              className="clipboard-back"
              type="button"
              onClick={() => {
                setStep("welcome");
                setError("");
              }}
            >
              ← put it back
            </button>
          </form>
        )}
        {step === "welcome" && (
          <button
            className="service-bell"
            onClick={() => setStep("phone")}
            aria-label="Ring the bell to sign up"
          >
            <span className="bell-hint">
              YOUR ADVENTURE STARTS HERE<span>↓</span>
            </span>
            <span className="bell-art" aria-hidden="true">
              <i />
              <b />
              <em />
            </span>
            <span className="bell-plaque">
              RING FOR SERVICE <span>↵</span>
            </span>
            <span className="bell-subtext">One ring could change his whole career.</span>
          </button>
        )}
        {(step === "otp" || step === "verifying") && (
          <div className="delivery-slip">
            <span className="slip-fold" aria-hidden="true" />
            <span>✉ CODE DELIVERY RECEIPT</span>
            <p id="demo-code">
              DEMO CODE{" "}
              <button
                onClick={() => {
                  setOtp("123456");
                  setError("");
                  otpRef.current?.focus();
                }}
                disabled={busy}
              >
                123456 ↗
              </button>
            </p>
            <button
              className="resend-code"
              disabled={cooldown > 0 || busy}
              onClick={() => {
                setOtp("");
                setError("");
                setStep("calling");
              }}
            >
              {cooldown > 0 ? `NEXT DELIVERY IN ${cooldown}s` : "↻ REQUEST ANOTHER DELIVERY"}
            </button>
          </div>
        )}
        {step === "calling" && (
          <div className="flying-envelope" aria-hidden="true">
            ✉<span>TOP SECRET</span>
          </div>
        )}
        {step === "success" && (
          <div className="promotion-banner" role="status">
            <span>★</span> PROMOTION UNLOCKED <span>★</span>
            <small>PIP → SENIOR HEAD OF HELLOS</small>
          </div>
        )}
        {step === "profile" && (
          <form
            className="employee-badge"
            onSubmit={(event) => {
              event.preventDefault();
              if (!name.trim()) {
                setError("Pip needs a name for the badge. Even an alter ego.");
                nameRef.current?.focus();
                return;
              }
              setSaved(true);
              setError("");
              setAside(`Welcome aboard, ${name.trim()}. Best day of my tiny life.`);
            }}
          >
            <span className="badge-slot" aria-hidden="true" />
            <span className="badge-header">OFFICIAL NEW HUMAN</span>
            <div className="badge-main">
              <PipPortrait />
              <div>
                <label htmlFor="pixel-name">THIS ADVENTURE BELONGS TO</label>
                <input
                  ref={nameRef}
                  id="pixel-name"
                  autoComplete="name"
                  placeholder="Your name here"
                  maxLength={32}
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setSaved(false);
                    setError("");
                  }}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "pixel-error" : undefined}
                />
                <span>
                  ✓ {country} {phone} · DEMO VERIFIED
                </span>
              </div>
            </div>
            <div className="badge-bottom">
              <span className="badge-barcode" aria-hidden="true">
                ▥▥▥▥▥▥▥
              </span>
              <button type="submit">{saved ? "✓ BADGE PRINTED" : "PRINT MY BADGE ↗"}</button>
            </div>
            {saved && (
              <span className="badge-saved" role="status">
                Profile complete. Main character energy confirmed.
              </span>
            )}
          </form>
        )}
        {error && (
          <div className="pixel-error" id="pixel-error" role="alert">
            <span>!</span>
            {error}
          </div>
        )}
        <button
          className="plant-hotspot"
          aria-label="Talk to Fern, Pip’s manager"
          onClick={() => setAside("Fern says: less chatting, more photosynthesis.")}
        >
          <span>FERN</span>
          <small>regional manager</small>
        </button>
        <button
          className="coffee-hotspot"
          aria-label="Inspect Pip’s coffee"
          onClick={() => setAside("That’s coffee number 7. I can hear colors now.")}
        >
          <span>inspect coffee ↗</span>
        </button>
        {done && (
          <div className="pixel-confetti" aria-hidden="true">
            {Array.from({ length: 24 }, (_, i) => (
              <i key={i} style={{ "--i": i } as CSSProperties} />
            ))}
          </div>
        )}
        <div className="scene-caption">
          <span>
            <i />{" "}
            {busy
              ? "VERY IMPORTANT TINY BUSINESS"
              : done
                ? "QUEST COMPLETE. FRIENDSHIP ACQUIRED."
                : "TINY OFFICE · ENORMOUS POSSIBILITIES"}
          </span>
          <span>USE YOUR MOUSE. FOLLOW YOUR CURIOSITY.</span>
        </div>
      </section>
      <footer className="pixel-footer">
        <span>*There is a little paperwork. Pip got excited.</span>
        <span className="demo-notice">PLAYABLE DEMO · NO SMS SENT · NO DATA SAVED</span>
        <button onClick={restart}>↻ PLAY AGAIN</button>
      </footer>
    </div>
  );
}
