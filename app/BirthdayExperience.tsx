"use client";

import { useEffect, useRef, useState } from "react";
import type { GiftContent } from "../content/giftContent";

type Props = { content: GiftContent };
type DragKind = "flap" | "letter" | null;

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

function Petal({ className }: { className: string }) {
  return <span className={`petal ${className}`} aria-hidden="true" />;
}

export function BirthdayExperience({ content }: Props) {
  const [flapProgress, setFlapProgress] = useState(0);
  const [pullProgress, setPullProgress] = useState(0);
  const [letterOpen, setLetterOpen] = useState(false);
  const [dragKind, setDragKind] = useState<DragKind>(null);
  const dragStart = useRef(0);
  const [codeState, setCodeState] = useState<
    "hidden" | "loading" | "shown" | "error"
  >("hidden");
  const [code, setCode] = useState("");
  const [codeMessage, setCodeMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [secretCount, setSecretCount] = useState(0);

  const flapOpen = flapProgress >= 1;

  useEffect(() => {
    if (!letterOpen) return;
    window.requestAnimationFrame(() => {
      document.querySelector("#letter")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    });
  }, [letterOpen]);

  function beginDrag(kind: Exclude<DragKind, null>, clientY: number) {
    setDragKind(kind);
    dragStart.current = clientY;
  }

  function moveDrag(clientY: number) {
    if (!dragKind) return;
    const distance = dragStart.current - clientY;
    if (dragKind === "flap") setFlapProgress(clamp(distance / 115));
    if (dragKind === "letter") setPullProgress(clamp(distance / 150));
  }

  function endDrag() {
    if (dragKind === "flap") {
      setFlapProgress((value) => (value > 0.38 ? 1 : 0));
    }
    if (dragKind === "letter") {
      setPullProgress((value) => {
        if (value > 0.34) {
          window.setTimeout(() => setLetterOpen(true), 420);
          return 1;
        }
        return 0;
      });
    }
    setDragKind(null);
  }

  async function revealCode() {
    setCodeState("loading");
    setCodeMessage("");
    try {
      const giftToken = new URLSearchParams(window.location.search).get("gift") ?? "";
      const response = await fetch("/api/pokopia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ token: giftToken }),
      });
      const payload = (await response.json()) as { code?: string; message?: string };
      if (!response.ok || !payload.code) {
        throw new Error(payload.message || "This gift is not ready to open yet.");
      }
      setCode(payload.code);
      setCodeState("shown");
    } catch (error) {
      setCodeState("error");
      setCodeMessage(
        error instanceof Error
          ? error.message
          : "This gift is not ready to open yet.",
      );
    }
  }

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function findSecret() {
    setSecretCount((count) => Math.min(3, count + 1));
  }

  return (
    <main className="experience">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <Petal className="petal-one" />
      <Petal className="petal-two" />
      <Petal className="petal-three" />

      <section className={`delivery-stage ${letterOpen ? "is-finished" : ""}`}>
        <p className="stage-kicker">Fae Post · Special delivery</p>
        <h1>A little letter found its way to you</h1>
        <p className="stage-note">Lift the flap, then pull the letter free.</p>

        <div
          className="envelope-scene"
          style={
            {
              "--flap-progress": flapProgress,
              "--pull-progress": pullProgress,
            } as React.CSSProperties
          }
          onPointerMove={(event) => moveDrag(event.clientY)}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={() => dragKind && endDrag()}
        >
          <div className="envelope-shadow" />
          <div className="envelope-back" />

          <button
            className="letter-tab"
            type="button"
            aria-label="Pull the letter from the envelope"
            disabled={!flapOpen}
            onPointerDown={(event) => {
              if (!flapOpen) return;
              event.currentTarget.setPointerCapture(event.pointerId);
              beginDrag("letter", event.clientY);
            }}
            onClick={() => {
              if (!flapOpen || pullProgress > 0) return;
              setPullProgress(1);
              window.setTimeout(() => setLetterOpen(true), 420);
            }}
          >
            <span>for {content.recipientName}</span>
            <small>{flapOpen ? "pull me up" : "waiting inside"}</small>
          </button>

          <div className="envelope-front">
            <span className="postmark">FAE POST<br />08 · 09</span>
            <span className="address">to {content.recipientName}</span>
            <span className="postal-flower" aria-hidden="true">✿</span>
          </div>

          <button
            className="envelope-flap"
            type="button"
            aria-label="Lift the envelope flap"
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              beginDrag("flap", event.clientY);
            }}
            onClick={() => {
              if (flapProgress === 0) setFlapProgress(1);
            }}
          >
            <span className="wax-seal" aria-hidden="true">J</span>
            <span className="flap-hint">lift</span>
          </button>
        </div>

        <p className="interaction-help">
          Drag with a mouse or finger. Tap and keyboard controls work too.
        </p>
      </section>

      {letterOpen && (
        <article id="letter" className="letter" aria-label="Birthday letter">
          <header className="letter-header">
            <div className="sun-stamp" aria-hidden="true">
              <span />
            </div>
            <p>{content.cardSubtitle}</p>
            <h2>{content.cardTitle}</h2>
            <div className="flourish" aria-hidden="true"><span>✦</span></div>
          </header>

          <section className="love-letter paper-section">
            <p className="salutation">My sweetest {content.recipientName},</p>
            <div className="letter-copy">
              {content.letterMessage.split("\n\n").map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <p className="signature">{content.senderName} <span>♡</span></p>
          </section>

          <div className="ribbon-title" aria-hidden="true">
            <span>little birthday surprises</span>
          </div>

          <section className="pokopia-gift gift-section">
            <div className="bubble bubble-one" aria-hidden="true" />
            <div className="bubble bubble-two" aria-hidden="true" />
            <div className="pokopia-visual">
              <img
                className="pokopia-hero"
                src="/assets/pokopia/expansion-pass-hero.jpg"
                alt="Official Pokémon Pokopia Expansion Pass artwork"
              />
              <img
                className="pokopia-logo"
                src="/assets/pokopia/bubbly-basin-logo.png"
                alt="Pokémon Pokopia Expansion Pass, Bubbly Basin"
              />
            </div>
            <div className="pokopia-copy">
              <p className="gift-eyebrow">{content.pokopia.eyebrow}</p>
              <h3>{content.pokopia.title}</h3>
              <p>{content.pokopia.message}</p>

              <div className={`code-parcel ${codeState}`} aria-live="polite">
                {codeState === "shown" ? (
                  <>
                    <span className="code-label">your gift code</span>
                    <strong>{code}</strong>
                    <button type="button" onClick={copyCode} className="copy-button">
                      {copied ? "Copied with love" : "Copy code"}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="reveal-button"
                      onClick={revealCode}
                      disabled={codeState === "loading"}
                    >
                      <span>{codeState === "loading" ? "Opening…" : "Open your Pokopia gift"}</span>
                    </button>
                    {codeState === "error" && <p className="code-error">{codeMessage}</p>}
                  </>
                )}
              </div>
            </div>
          </section>

          <section className="small-gifts" aria-label="More birthday gifts">
            <div className="gift-note spoil-note">
              <div className="coin-purse" aria-hidden="true"><span>♡</span></div>
              <p className="gift-eyebrow">Already on its way</p>
              <h3>{content.spoilingMessage}</h3>
              <span className="sent-stamp">sent with love</span>
            </div>

            <div className="gift-note extension-note">
              <div className="tiny-browser" aria-hidden="true">
                <i /><i /><i /><span>our games</span>
              </div>
              <p className="gift-eyebrow">Something I made for us</p>
              <h3>{content.extension.title}</h3>
              <p>{content.extension.message}</p>
              <a className="download-button" href={content.extension.downloadPath} download>
                Download your extension
              </a>
              <details className="install-help">
                <summary>How to add it to Chrome</summary>
                <ol>
                  <li>Download and unzip the folder.</li>
                  <li>Open <code>chrome://extensions</code>.</li>
                  <li>Turn on Developer mode.</li>
                  <li>Choose Load unpacked and select the unzipped folder.</li>
                </ol>
              </details>
            </div>
          </section>

          <section className="earbuds-note paper-section">
            <div className="music-lines" aria-hidden="true"><span>♪</span><span>♫</span></div>
            <p className="gift-eyebrow">One more little promise</p>
            <h3>If you still need them...</h3>
            <p>{content.earbudsMessage}</p>
          </section>

          {content.couplePfp.enabled ? (
            <section className="pfp-reveal gift-section">
              <img src={content.couplePfp.cardIllustration} alt="Our couple illustration" />
              <div>
                <p className="gift-eyebrow">A tiny piece of us</p>
                <h3>Matching, wherever we go</h3>
                <div className="pfp-actions">
                  <a href={content.couplePfp.herPfp} download>Save yours</a>
                  <a href={content.couplePfp.myPfp} download>Save mine</a>
                </div>
              </div>
            </section>
          ) : (
            <section className="botanical-heart" aria-label="A decorative love note">
              <button className="secret secret-left" type="button" onClick={findSecret} aria-label="Tiny hidden flower">✦</button>
              <div className="heart-sun" aria-hidden="true"><span>you</span><i>+</i><span>me</span></div>
              <div className="stem stem-left" aria-hidden="true"><i /><i /><i /></div>
              <div className="stem stem-right" aria-hidden="true"><i /><i /><i /></div>
              <button className="secret secret-right" type="button" onClick={findSecret} aria-label="Tiny hidden butterfly">✧</button>
              <p>my favorite place is beside you</p>
            </section>
          )}

          <footer className="letter-ending">
            <button className="tiny-frog" type="button" onClick={findSecret} aria-label="A tiny hidden frog">
              <span className="frog-eyes">••</span>
              <span className="frog-smile">⌣</span>
            </button>
            <p>{content.finalMessage}</p>
            {secretCount > 0 && (
              <span className="secret-message" aria-live="polite">
                {secretCount < 3
                  ? `${secretCount} tiny secret${secretCount > 1 ? "s" : ""} found`
                  : "All three tiny secrets found. The fae approve ♡"}
              </span>
            )}
            <button
              className="read-again"
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Read from the beginning
            </button>
          </footer>
        </article>
      )}
    </main>
  );
}
