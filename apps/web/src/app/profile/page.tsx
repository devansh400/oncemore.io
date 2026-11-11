"use client";

import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  Settings,
  SlidersHorizontal,
  Sparkles,
  Ticket,
  UserRound,
} from "lucide-react";
import { useState } from "react";

import { SouvenirLanyard } from "@/components/souvenir-lanyard";

import styles from "./profile.module.css";

type Section = "overview" | "experiences" | "souvenir" | "settings";

const SECTIONS = [
  { id: "overview", label: "Overview", icon: UserRound },
  { id: "experiences", label: "Experiences", icon: Sparkles },
  { id: "souvenir", label: "Souvenir", icon: Ticket },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

const HEADINGS: Record<Section, { kicker: string; title: string; subtitle: string }> = {
  overview: {
    kicker: "Welcome back",
    title: "Hello, Alex.",
    subtitle: "Take a breath — this is your little corner of OnceMore.",
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

function EmptyExperiences({
  action,
  centered = false,
}: {
  action?: () => void;
  centered?: boolean;
}) {
  return (
    <div className={`${styles.empty} ${centered ? styles.emptyCentered : ""}`}>
      <Buddy />
      <div className={styles.emptyBody}>
        <h2 className={styles.emptyTitle}>No experiences yet</h2>
        <p className={styles.emptyText}>
          Once you join a world, it will settle in here — ready whenever you are.
        </p>
        {action ? (
          <button type="button" className={styles.buttonPrimary} onClick={action}>
            Browse experiences
            <ArrowRight size={15} strokeWidth={2.2} />
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [section, setSection] = useState<Section>("overview");
  const heading = HEADINGS[section];

  return (
    <>
      <div className={styles.topbar}>
        <div className={styles.brand}>
          <span className={styles.mark} aria-hidden />
          <span>OnceMore</span>
          <span className={styles.brandMuted}>Profile</span>
        </div>
        <div className={styles.topRight}>
          <span className={`${styles.iconBubble} ${styles.iconWarm}`} aria-hidden>
            <Bell size={17} strokeWidth={1.9} />
          </span>
          <span className={`${styles.iconBubble} ${styles.iconCool}`} aria-hidden>
            <SlidersHorizontal size={17} strokeWidth={1.9} />
          </span>
          <div className={styles.avatarMini} aria-hidden>
            AR
          </div>
          <span className={styles.topName}>Alex Rivera</span>
        </div>
      </div>

      <div className={styles.shell}>
        <aside className={styles.sidebar}>
          <div className={styles.sideIdentity}>
            <div className={styles.avatarMedium} aria-hidden>
              AR
            </div>
            <div className={styles.sideIdentityText}>
              <div className={styles.sideName}>Alex Rivera</div>
              <div className={styles.sideEmail}>alex@example.com</div>
            </div>
          </div>

          <nav className={styles.nav} aria-label="Profile sections">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                className={`${styles.navItem} ${section === id ? styles.navItemActive : ""}`}
                aria-current={section === id ? "page" : undefined}
                onClick={() => setSection(id)}
              >
                <Icon size={17} strokeWidth={1.9} />
                {label}
              </button>
            ))}
          </nav>

          <div className={styles.sideFoot}>
            <span className={styles.dot} aria-hidden />
            Profile is up to date
          </div>
        </aside>

        <div className={styles.content}>
          <header className={styles.pageIntro}>
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
          </header>

          {section === "overview" ? (
            <>
              <section className={styles.hero}>
                <span className={styles.heroGlow} aria-hidden />
                <span className={styles.heroBlob} aria-hidden />
                <div className={styles.avatarLarge} aria-hidden>
                  AR
                </div>
                <div className={styles.profileInfo}>
                  <h2 className={styles.profileName}>Alex Rivera</h2>
                  <p className={styles.profileEmail}>alex@example.com</p>
                  <span className={styles.badge}>
                    <span className={styles.badgeDot} aria-hidden />
                    Member
                  </span>
                </div>
                <button type="button" className={styles.buttonLight}>
                  Edit profile
                </button>
              </section>

              <div className={styles.glance}>
                <div className={styles.sectionHead}>
                  <h2 className={styles.sectionTitle}>At a glance</h2>
                  <span className={styles.sectionHint}>Your space in OnceMore</span>
                </div>
                <div className={styles.tiles}>
                  <div className={`${styles.tile} ${styles.tilePeach}`}>
                    <div className={styles.tileHead}>
                      <span className={styles.tileLabel}>Experiences</span>
                      <span className={styles.tileArrow} aria-hidden>
                        <ArrowUpRight size={15} strokeWidth={2.2} />
                      </span>
                    </div>
                    <span className={styles.tileValue}>0</span>
                  </div>
                  <div className={`${styles.tile} ${styles.tileLavender}`}>
                    <div className={styles.tileHead}>
                      <span className={styles.tileLabel}>Saved worlds</span>
                      <span className={styles.tileArrow} aria-hidden>
                        <ArrowUpRight size={15} strokeWidth={2.2} />
                      </span>
                    </div>
                    <span className={styles.tileValue}>0</span>
                  </div>
                </div>
              </div>

              <section className={styles.souvenirCard}>
                <div className={styles.souvenirStage}>
                  <SouvenirLanyard size={0.7} className={styles.lanyardFill} />
                  <span className={styles.stagePin} aria-hidden />
                  <span className={styles.stageLabel}>Souvenir No. 001</span>
                  <span className={styles.stageHint}>Drag · flip</span>
                </div>
                <div className={styles.souvenirCopy}>
                  <p className={styles.souvenirKicker}>Your souvenir</p>
                  <h2 className={styles.souvenirTitle}>A little piece of OnceMore.</h2>
                  <p className={styles.souvenirText}>
                    A soft-touch member pass for your first chapter. Drag it, flip it, keep it
                    close.
                  </p>
                  <button
                    type="button"
                    className={styles.buttonPrimary}
                    onClick={() => setSection("souvenir")}
                  >
                    Visit souvenir
                    <ArrowRight size={15} strokeWidth={2.2} />
                  </button>
                </div>
              </section>

              <section className={styles.card}>
                <div className={styles.cardHead}>
                  <div>
                    <h2 className={styles.cardTitle}>Experiences</h2>
                    <p className={styles.cardText}>Worlds you join will appear here.</p>
                  </div>
                  <span className={styles.countChip}>0 total</span>
                </div>
                <EmptyExperiences action={() => setSection("experiences")} />
              </section>
            </>
          ) : null}

          {section === "experiences" ? (
            <section className={styles.card}>
              <div className={styles.cardHead}>
                <div>
                  <h2 className={styles.cardTitle}>All experiences</h2>
                  <p className={styles.cardText}>Joined, saved, and created worlds.</p>
                </div>
                <span className={styles.countChip}>0 total</span>
              </div>
              <EmptyExperiences centered />
            </section>
          ) : null}

          {section === "souvenir" ? (
            <section className={styles.souvenirShowcase}>
              <div className={styles.souvenirShowcaseStage}>
                <SouvenirLanyard size={0.64} className={styles.lanyardFill} />
                <span className={styles.stagePin} aria-hidden />
                <span className={styles.stageLabel}>Souvenir No. 001</span>
                <span className={styles.stageHint}>Drag to swing · click to flip</span>
              </div>
              <div className={styles.souvenirShowcaseCopy}>
                <p className={styles.souvenirKicker}>Member keepsake</p>
                <h2 className={styles.souvenirHeading}>A pass for your first chapter.</h2>
                <p className={styles.souvenirText}>
                  A soft-touch member pass, made to swing, flip, and stay with you. Every world
                  leaves a little something.
                </p>
                <div className={styles.souvenirDetails}>
                  <div className={styles.souvenirDetail}>
                    <span>Owner</span>
                    <strong>Alex Rivera</strong>
                  </div>
                  <div className={styles.souvenirDetail}>
                    <span>Issued</span>
                    <strong>2026</strong>
                  </div>
                  <div className={styles.souvenirDetail}>
                    <span>Finish</span>
                    <strong>Soft-touch</strong>
                  </div>
                </div>
                <p className={styles.souvenirHint}>
                  Drag the pass to swing it. Click the card to flip it over.
                </p>
              </div>
            </section>
          ) : null}

          {section === "settings" ? (
            <section className={styles.card}>
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
            </section>
          ) : null}
        </div>
      </div>
    </>
  );
}
