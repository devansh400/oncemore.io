"use client";

import CrystalizedBall from "@oncemore-landing-page/ui/components/CrystalizedBall.jsx";
import { useEffect, useRef } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, useGSAP } from "@/lib/gsap";

import "./oncemore.css";

const WORD = "nceMore";

export function OnceMoreExperience() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLSpanElement>(null);
  const ballStageRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const body = document.body;
    body.classList.add("om-immersive");
    return () => body.classList.remove("om-immersive");
  }, []);

  useGSAP(
    () => {
      const root = rootRef.current;
      const stage = stageRef.current;
      const wordmark = wordmarkRef.current;
      const ball = ballRef.current;
      const ballStage = ballStageRef.current;
      if (!root || !stage || !wordmark || !ball || !ballStage) return;

      const letters = gsap.utils.toArray<HTMLElement>(".om-letter", wordmark);
      const hud = gsap.utils.toArray<HTMLElement>(".om-hud", root);

      if (reduced) {
        gsap.set([root, ball, ...letters, ...hud], { autoAlpha: 1 });
        return;
      }

      gsap.set(letters, {
        autoAlpha: 0,
        yPercent: 140,
        rotateX: -115,
        filter: "blur(24px)",
      });
      gsap.set(hud, { autoAlpha: 0 });

      const rect = ball.getBoundingClientRect();
      const bigSize = Math.min(window.innerWidth, window.innerHeight);
      const finalScale = rect.width / bigSize;
      const dx = window.innerWidth / 2 - (rect.left + rect.width / 2);
      const dy = window.innerHeight / 2 - (rect.top + rect.height / 2);

      gsap.set(ballStage, {
        width: bigSize,
        height: bigSize,
        marginLeft: -bigSize / 2,
        marginTop: -bigSize / 2,
        x: dx,
        y: dy,
        scale: 1,
        autoAlpha: 1,
        transformOrigin: "50% 50%",
      });

      const float = gsap.to(".om-ball-float", {
        y: -14,
        duration: 3.8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 5,
      });

      let ready = false;

      const intro = gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(root, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45 })
        .to(
          ballStage,
          {
            x: 0,
            y: 0,
            scale: finalScale,
            duration: 2.4,
            ease: "power4.inOut",
          },
          2.3,
        )
        .to(
          letters,
          {
            autoAlpha: 1,
            yPercent: 0,
            rotateX: 0,
            filter: "blur(0px)",
            duration: 1,
            stagger: 0.075,
            ease: "expo.out",
          },
          4.35,
        )
        .to(hud, { autoAlpha: 1, duration: 0.9, stagger: 0.12 }, 4.9);

      intro.eventCallback("onComplete", () => {
        ready = true;
      });

      const fine = window.matchMedia("(pointer: fine)").matches;
      if (!fine) return () => float.kill();

      const rotX = gsap.quickTo(wordmark, "rotationX", { duration: 0.9, ease: "power3.out" });
      const rotY = gsap.quickTo(wordmark, "rotationY", { duration: 0.9, ease: "power3.out" });
      const moveX = gsap.quickTo(wordmark, "x", { duration: 0.9, ease: "power3.out" });
      const moveY = gsap.quickTo(wordmark, "y", { duration: 0.9, ease: "power3.out" });

      const magnets = letters.map((element) => ({
        element,
        x: gsap.quickTo(element, "x", { duration: 0.7, ease: "power3.out" }),
        y: gsap.quickTo(element, "y", { duration: 0.7, ease: "power3.out" }),
      }));

      const RADIUS = 190;
      let pointerX = 0;
      let pointerY = 0;
      let frame = 0;

      const apply = () => {
        frame = 0;
        const nx = (pointerX / window.innerWidth - 0.5) * 2;
        const ny = (pointerY / window.innerHeight - 0.5) * 2;

        rotY(nx * 9);
        rotX(-ny * 7);
        moveX(nx * 18);
        moveY(ny * 13);

        for (const magnet of magnets) {
          const rect = magnet.element.getBoundingClientRect();
          const dx = rect.left + rect.width / 2 - pointerX;
          const dy = rect.top + rect.height / 2 - pointerY;
          const distance = Math.hypot(dx, dy);

          if (distance < RADIUS && distance > 0.01) {
            const force = 1 - distance / RADIUS;
            const push = force * force;
            magnet.x((dx / distance) * push * 20);
            magnet.y((dy / distance) * push * 16);
          } else {
            magnet.x(0);
            magnet.y(0);
          }
        }
      };

      const onPointerMove = (event: PointerEvent) => {
        if (!ready) return;
        pointerX = event.clientX;
        pointerY = event.clientY;
        if (!frame) frame = requestAnimationFrame(apply);
      };

      const onPointerLeave = () => {
        rotX(0);
        rotY(0);
        moveX(0);
        moveY(0);
        for (const magnet of magnets) {
          magnet.x(0);
          magnet.y(0);
        }
      };

      const onPointerDown = () => {
        gsap.fromTo(
          letters,
          { scale: 1 },
          {
            scale: 0.955,
            duration: 0.14,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut",
            stagger: { each: 0.014, from: "center" },
          },
        );
      };

      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerdown", onPointerDown, { passive: true });
      document.documentElement.addEventListener("pointerleave", onPointerLeave);

      return () => {
        float.kill();
        if (frame) cancelAnimationFrame(frame);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerdown", onPointerDown);
        document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      };
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  return (
    <div ref={rootRef} className="oncemore-root">
      <div className="om-hud om-hud--top">
        <span className="om-hud__item">
          <i className="om-dot" />
          OnceMore<sup>®</sup>
        </span>
        <span className="om-hud__item om-hud__item--muted">Crystalized — 001</span>
      </div>

      <div className="om-stage" ref={stageRef}>
        <div className="om-wordmark" ref={wordmarkRef} role="img" aria-label="OnceMore">
          <span className="om-ball-slot" ref={ballRef} aria-hidden>
            <span className="om-ball-float">
              <span className="om-ball-stage" ref={ballStageRef}>
                <span className="om-ball-halo" />
                <span className="om-ball-orbit" />
                <CrystalizedBall
                  preset="plasma"
                  color="#7CC8FF"
                  size={0.84}
                  speed={1}
                  interactive
                  intro
                  className="om-crystal"
                />
              </span>
            </span>
          </span>

          <span className="om-letters" aria-hidden>
            {WORD.split("").map((letter, index) => (
              <span key={`${letter}-${index}`} className="om-letter">
                {letter}
              </span>
            ))}
          </span>
        </div>
      </div>

      <div className="om-hud om-hud--bottom">
        <span className="om-hud__item om-hud__item--muted">Motion study</span>
        <span className="om-hud__item">
          <i className="om-dot" />
          MMXXV
        </span>
      </div>
    </div>
  );
}
