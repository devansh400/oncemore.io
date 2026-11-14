import { useId } from "react";
import styles from "./og-journey.module.css";

const fans = [
  { name: "Harshini", number: "#0001547" },
  { name: "Vishalakshi", number: "#0231097" },
  { name: "Sudeep", number: "#0051646" },
];

// Keep the actual brush lettering from the original card. A live SVG color
// mask isolates red ink, while the clip selects the logo or the fan's name.
function CardInk({ index, part }: { index: number; part: "logo" | "name" }) {
  const id = useId().replace(/:/g, "");
  const logo = part === "logo";
  return (
    <svg
      className={styles.cardInk + " " + (logo ? styles.cardLogo : styles.cardName)}
      data-fan-logo={logo ? "" : undefined}
      data-fan-name={!logo ? "" : undefined}
      viewBox="0 0 339 589"
      aria-hidden="true"
    >
      <defs>
        <filter
          id={id + "ink"}
          colorInterpolationFilters="sRGB"
          x="0"
          y="0"
          width="100%"
          height="100%"
        >
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  5 -5 0 0 -2" />
        </filter>
        <clipPath id={id + "clip"}>
          <rect
            x={logo ? 16 : 5}
            y={logo ? 36 : 477}
            width={logo ? 134 : 325}
            height={logo ? 66 : 65}
          />
        </clipPath>
      </defs>
      <g clipPath={"url(#" + id + "clip)"}>
        <image
          href={"/projects/og/og_card_" + index + ".png"}
          width="339"
          height="589"
          filter={"url(#" + id + "ink)"}
        />
      </g>
    </svg>
  );
}

export function LayeredFanCard({ index }: { index: number }) {
  const fan = fans[index - 1];
  return (
    <figure
      className={styles.fanCard + " " + styles["card" + index]}
      data-fan-card
      aria-label={fan.name + "’s OG fan card, " + fan.number}
    >
      <div className={styles.cardSurface}>
        <img
          className={styles.cardBackground}
          src={"/og2/cards/card-" + index + "-background.webp"}
          alt=""
          width={678}
          height={1178}
        />
        <div className={styles.cardPortrait} data-fan-portrait>
          <img
            src={"/og2/cards/card-" + index + "-portrait.webp"}
            alt=""
            width={678}
            height={1178}
          />
        </div>
        <CardInk index={index} part="logo" />
        <span className={styles.cardNumber} data-fan-number aria-hidden="true">
          {fan.number}
        </span>
        <CardInk index={index} part="name" />
      </div>
    </figure>
  );
}
