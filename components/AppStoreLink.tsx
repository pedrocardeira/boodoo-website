"use client";

import type { ComponentPropsWithoutRef, MouseEvent } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type AppStoreLinkProps = ComponentPropsWithoutRef<"a"> & {
  location: string;
};

export const appStoreUrl = "https://apps.apple.com/us/app/boodoo/id6784456363";

export default function AppStoreLink({
  location,
  onClick,
  href = appStoreUrl,
  ...props
}: AppStoreLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    window.gtag?.("event", "app_store_click", {
      link_url: href,
      link_location: location
    });
    onClick?.(event);
  }

  return <a {...props} href={href} onClick={handleClick} />;
}
