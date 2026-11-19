"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { Dog, isPainted, poseNames } from "@/fetch-quest/dog";
import {
  CollarTag,
  GoldenTicket,
  MessageGlyph,
  NameTagGlyph,
  PawGlyph,
  PhoneGlyph,
} from "@/fetch-quest/props";
import { type Fan, forgetFan, loadFan } from "@/fetch-quest/register";
import { Vault } from "@/fetch-quest/vault";
import { glassEyebrow, glassField, glassPanel, glassPrimary, glassSecondary } from "@/lib/glass";

/** Review surface for the fetch quest's art and the vault, outside the sky. */
export function FetchSandbox({ displayClassName }: { displayClassName: string }) {
  const [name, setName] = useState("Harshini");
  const [fan, setFan] = useState<Fan | null>(null);
  const [open, setOpen] = useState(false);
  const [vaultKey, setVaultKey] = useState(0);

  useEffect(() => setFan(loadFan()), []);

  return (
    <div className="relative min-h-svh bg-neutral-950 text-[#ede6d6]">
      <Image
        src="/brand/floating-worlds.webp"
        alt=""
        fill
        sizes="100vw"
        className="pointer-events-none fixed! inset-0 object-cover"
      />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-8">
        <p className={glassEyebrow}>OnceMore design / Fetch</p>
        <h1 className={`${displayClassName} mt-3 text-5xl font-medium tracking-tight sm:text-7xl`}>
          Fetch.
        </h1>
        <p className="mt-4 max-w-xl text-[rgb(237_230_214/0.82)]">
          The wordless signup quest: every pose, prop and the vault, for review outside the sky.
          Poses are drawn by the vector rig until their painted frames land.
        </p>

        <section className="mt-14" aria-labelledby="poses-title">
          <h2 id="poses-title" className={`${displayClassName} text-3xl font-medium`}>
            Poses
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {poseNames.map((pose) => (
              <li key={pose} className={`${glassPanel} p-3`}>
                <div className="relative aspect-square">
                  <Dog className="absolute inset-0" initialPose={pose} />
                </div>
                <p className="mt-2 flex items-center justify-between font-mono text-xs">
                  {pose}
                  <span className={isPainted(pose) ? "text-[#8fcbff]" : "opacity-50"}>
                    {isPainted(pose) ? "painted" : "vector"}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 grid gap-5 lg:grid-cols-[1.4fr_1fr]" aria-labelledby="props-title">
          <div className={`${glassPanel} p-6`}>
            <h2 id="props-title" className={`${displayClassName} text-3xl font-medium`}>
              Ticket
            </h2>
            <GoldenTicket name={name} className="mx-auto mt-6 w-full max-w-md" />
            <label className="mt-6 block">
              <span className={glassEyebrow}>Etched name</span>
              <input
                className={`${glassField} mt-2`}
                value={name}
                onChange={(event) => setName(event.currentTarget.value)}
              />
            </label>
          </div>
          <div className={`${glassPanel} flex flex-col gap-6 p-6`}>
            <h2 className={`${displayClassName} text-3xl font-medium`}>Tag and glyphs</h2>
            <CollarTag code="482913" className="mx-auto w-32" />
            <div className="flex justify-around text-[rgb(237_230_214/0.7)]">
              <PhoneGlyph className="size-12" />
              <MessageGlyph className="size-12" />
              <NameTagGlyph className="size-12" />
              <PawGlyph className="size-12" />
            </div>
          </div>
        </section>

        <section className={`${glassPanel} mt-16 p-6`} aria-labelledby="vault-title">
          <h2 id="vault-title" className={`${displayClassName} text-3xl font-medium`}>
            The vault
          </h2>
          <p className="mt-2 text-sm text-[rgb(237_230_214/0.75)]">
            The code is mocked: it appears on the dog's collar tag. Registering saves the fan in this
            browser, which the landing page reads too.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" className={glassPrimary} onClick={() => setOpen(true)}>
              Open the vault
            </button>
            <button
              type="button"
              className={glassSecondary}
              onClick={() => {
                forgetFan();
                setFan(null);
                setVaultKey((key) => key + 1);
              }}
            >
              Forget me {fan ? `(${fan.name})` : ""}
            </button>
          </div>
        </section>
      </div>

      {open && (
        <div className="fixed inset-0 z-50">
          <Vault
            key={vaultKey}
            open
            fan={fan}
            displayClassName={displayClassName}
            onClose={() => setOpen(false)}
            onRegistered={setFan}
          />
        </div>
      )}
    </div>
  );
}
