"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";

import { SouvenirLanyard } from "@/components/souvenir-lanyard";

import styles from "./profile.module.css";

type Section = "overview" | "experiences" | "souvenir" | "settings";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "experiences", label: "Experiences" },
  { id: "souvenir", label: "Souvenir" },
  { id: "settings", label: "Settings" },
] as const;

const HEADINGS: Record<Section, { kicker: string; title: string; subtitle: string }> = {
  overview: {
    kicker: "Welcome back",
    title: "Hello, Alex.",
    subtitle: "A calm little summary of your OnceMore profile.",
  },
  experiences: {
    kicker: "Your library",
    title: "Experiences",
    subtitle: "Worlds you have joined, saved, or created.",
  },
  souvenir: {
    kicker: "Keepsake",
    title: "Souvenir",
    subtitle: "A little piece of OnceMore, made to keep.",
  },
  settings: {
    kicker: "Preferences",
    title: "Settings",
    subtitle: "The little details that make your account yours.",
  },
};

const BARS = [
  22, 30, 25, 38, 28, 44, 33, 50, 36, 54, 41, 60, 46, 64, 50, 70, 55, 74, 58, 80, 62, 84, 57, 76,
  48, 66, 52, 72, 44, 60, 38, 56, 42, 68, 50, 78, 54, 82, 46, 70, 40, 62, 36, 52,
];

const ACTIVE_BAR = 21;

const METERS = [
  { label: "Name", value: 100 },
  { label: "Email", value: 100 },
  { label: "Avatar", value: 100 },
  { label: "Experiences", value: 0 },
];

function Buddy() {
  return (
    <span className={styles.buddy} aria-hidden>
      <span className={styles.buddyFace}>
        <span className={styles.buddyEyes}>
          <span className={styles.buddyEye} />
          <span className={styles.buddyEye} />
        </span>
        <span className={styles.buddySmile} />
      </span>
    </span>
  );
}

export default function ProfileTwoPage() {
  const [section, setSection] = useState<Section>("overview");
  const heading = HEADINGS[section];

  return (
    <div className={styles.frame}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandMark} aria-hidden />
          OnceMore
        </div>

        <div className={styles.identity}>
          <div className={styles.avatarMain} aria-hidden>
            AR
            <span className={styles.statusDot} />
          </div>
          <div>
            <div className={styles.sideName}>Alex Rivera</div>
            <div className={styles.sideEmail}>alex@example.com</div>
          </div>
        </div>

        <nav className={styles.nav} aria-label="Profile sections">
          {SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={`${styles.navItem} ${section === id ? styles.navItemActive : ""}`}
              aria-current={section === id ? "page" : undefined}
              onClick={() => setSection(id)}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className={styles.sideFoot}>
          <span className={styles.dot} aria-hidden />
          Profile is up to date
        </div>
      </aside>

      <div className={styles.panel}>
        <div className={styles.panelGrid}>
          <div className={styles.mainCol}>
            <header className={styles.panelHead}>
              <div>
                <p className={styles.kicker}>{heading.kicker}</p>
                <h1 className={styles.title}>
                  {section === "overview" ? (
                    <>
                      Hello, <span className={styles.titleAccent}>Alex.</span>
                    </>
                  ) : (
                    heading.title
                  )}
                </h1>
                <p className={styles.subtitle}>{heading.subtitle}</p>
              </div>
              {section === "overview" ? (
                <button type="button" className={styles.buttonSoft}>
                  Edit profile
                </button>
              ) : null}
            </header>

            {section === "overview" ? (
              <>
                <div className={styles.chartStrip} aria-hidden>
                  <div className={styles.chart}>
                    {BARS.map((height, index) => (
                      <span
                        key={index}
                        className={`${styles.bar} ${index % 4 === 0 ? styles.barQuad : ""} ${
                          index === ACTIVE_BAR ? styles.barActive : ""
                        }`}
                        style={{ height }}
                      />
                    ))}
                  </div>
                  <div className={styles.chartFoot}>
                    <span className={styles.chartTitle}>This week</span>
                    <span>No activity yet</span>
                  </div>
                </div>

                <div className={styles.showcase}>
                  <section className={styles.souvenirPanel}>
                    <div className={styles.panelHeadRow}>
                      <div>
                        <h2 className={styles.sectionTitle}>Souvenir</h2>
                        <p className={styles.panelHint}>A keepsake from your first chapter.</p>
                      </div>
                      <span className={styles.countChip}>No. 001</span>
                    </div>
                    <div className={styles.lanyardStage}>
                      <SouvenirLanyard size={0.66} className={styles.lanyardFill} />
                      <span className={styles.stagePin} aria-hidden />
                      <span className={styles.stageLabel}>Souvenir No. 001</span>
                      <span className={styles.stageHint}>Drag · flip</span>
                    </div>
                  </section>

                  <section className={styles.experiencePanel}>
                    <div className={styles.panelHeadRow}>
                      <div>
                        <h2 className={styles.sectionTitle}>Experiences</h2>
                        <p className={styles.panelHint}>Worlds you join will appear here.</p>
                      </div>
                      <span className={styles.countChip}>0 total</span>
                    </div>
                    <div className={styles.emptyInner}>
                      <Buddy />
                      <div className={styles.emptyBody}>
                        <h2 className={styles.emptyTitle}>No experiences yet</h2>
                        <p className={styles.emptyText}>
                          Once you join a world, it will settle in here — ready whenever you are.
                        </p>
                      </div>
                    </div>
                  </section>
                </div>
              </>
            ) : null}

            {section === "experiences" ? (
              <>
                <div className={styles.sectionHead}>
                  <h2 className={styles.sectionTitle}>All experiences</h2>
                  <span className={styles.countChip}>0 total</span>
                </div>
                <div className={styles.empty}>
                  <Buddy />
                  <div className={styles.emptyBody}>
                    <h2 className={styles.emptyTitle}>No experiences yet</h2>
                    <p className={styles.emptyText}>
                      Joined, saved, and created worlds will gather here. There is no rush.
                    </p>
                  </div>
                </div>
              </>
            ) : null}

            {section === "souvenir" ? (
              <div className={styles.souvenirTab}>
                <div className={styles.souvenirStageLarge}>
                  <SouvenirLanyard size={0.64} className={styles.lanyardFill} />
                  <span className={styles.stagePin} aria-hidden />
                  <span className={styles.stageLabel}>Souvenir No. 001</span>
                  <span className={styles.stageHint}>Drag to swing · click to flip</span>
                </div>
                <div className={styles.souvenirInfo}>
                  <p className={styles.kicker}>Member keepsake</p>
                  <h2 className={styles.souvenirHeading}>A pass for your first chapter.</h2>
                  <p className={styles.souvenirSub}>
                    A soft-touch member pass, made to swing, flip, and stay with you. Every world
                    leaves a little something.
                  </p>
                  <div className={styles.detailRows}>
                    <div className={styles.detailRow}>
                      <span>Owner</span>
                      <strong>Alex Rivera</strong>
                    </div>
                    <div className={styles.detailRow}>
                      <span>Issued</span>
                      <strong>2026</strong>
                    </div>
                    <div className={styles.detailRow}>
                      <span>Finish</span>
                      <strong>Soft-touch</strong>
                    </div>
                  </div>
                  <p className={styles.souvenirHint}>
                    Drag the pass to swing it. Click the card to flip it over.
                  </p>
                </div>
              </div>
            ) : null}

            {section === "settings" ? (
              <div className={styles.rows}>
                <div className={styles.row}>
                  <div>
                    <div className={styles.rowLabel}>Email</div>
                    <div className={styles.rowHint}>Used for sign-in and receipts.</div>
                  </div>
                  <span className={styles.rowValue}>alex@example.com</span>
                </div>
                <div className={styles.row}>
                  <div>
                    <div className={styles.rowLabel}>Email updates</div>
                    <div className={styles.rowHint}>Product news and new worlds.</div>
                  </div>
                  <span className={styles.rowValue}>On</span>
                </div>
              </div>
            ) : null}
          </div>

          <aside className={styles.rail}>
            <h2 className={styles.railTitle}>Profile setup</h2>
            <p className={styles.railSub}>The little details, all in order.</p>

            <div className={styles.meters}>
              {METERS.map(({ label, value }) => (
                <div key={label}>
                  <div className={styles.meterHead}>
                    <span>{label}</span>
                    <span className={styles.meterValue}>{value}%</span>
                  </div>
                  <div className={styles.track}>
                    <div className={styles.fill} style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.promo}>
              <div className={styles.promoArt} aria-hidden>
                <span className={styles.promoSquare} />
                <span className={styles.promoSquareAlt} />
                <span className={styles.promoBlob} />
              </div>
              <h3 className={styles.promoTitle}>Find your first world</h3>
              <p className={styles.promoText}>
                A quiet little corner of OnceMore is waiting for you.
              </p>
              <button
                type="button"
                className={styles.promoButton}
                onClick={() => setSection("experiences")}
              >
                Browse experiences
                <ArrowRight size={13} strokeWidth={2.2} />
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
