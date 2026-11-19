"use client";

import { type RefObject, useCallback, useEffect, useState } from "react";

import type { SceneController, SceneState } from "@/floating-worlds/scene-types";

import { Companion } from "./companion";
import { type Fan, loadFan } from "./register";
import { Vault } from "./vault";

/**
 * "Fetch": the wordless signup quest over the Floating Worlds. A dog chases a
 * golden ticket from island to island; past the last island the ticket waits
 * behind three panes of glass that the fan helps the dog howl through.
 */
export function FetchQuest({
  scene,
  controller,
  endHandler,
  hidden,
  displayClassName,
  onOpenChange,
}: {
  scene: SceneState;
  controller: RefObject<SceneController | null>;
  /** Set to the handler the scene calls when the fan scrolls past the last island. */
  endHandler: RefObject<(() => boolean) | null>;
  /** Hide everything (Look panel open, scene failed). */
  hidden: boolean;
  displayClassName: string;
  onOpenChange: (open: boolean) => void;
}) {
  const [fan, setFan] = useState<Fan | null>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setFan(loadFan()), []);

  const openVault = useCallback(() => {
    setMounted(true);
    setOpen(true);
    onOpenChange(true);
  }, [onOpenChange]);

  const closeVault = useCallback(() => {
    setOpen(false);
    onOpenChange(false);
  }, [onOpenChange]);

  useEffect(() => {
    endHandler.current = () => {
      if (hidden) return false;
      openVault();
      return true;
    };
    return () => {
      endHandler.current = null;
    };
  }, [endHandler, hidden, openVault]);

  const atLastIsland = scene.stop === scene.worlds.length && scene.worlds.length > 0;

  return (
    <>
      <Companion
        scene={scene}
        controller={controller}
        visible={scene.ready && !scene.diving && !hidden && !open}
        carrying={Boolean(fan)}
        onVault={() => {
          if (atLastIsland) openVault();
        }}
      />
      {mounted && (
        <Vault
          open={open && !hidden}
          fan={fan}
          displayClassName={displayClassName}
          onClose={closeVault}
          onRegistered={setFan}
        />
      )}
    </>
  );
}
