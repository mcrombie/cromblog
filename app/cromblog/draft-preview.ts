type DraftPreviewSearchParams = {
  preview?: string;
};

export function canPreviewDrafts() {
  return process.env.NODE_ENV !== "production";
}

export function isDraftPreviewRequest(
  searchParams: DraftPreviewSearchParams | undefined
) {
  return canPreviewDrafts() && searchParams?.preview === "draft";
}

export function draftPreviewHref(href: string) {
  return `${href}?preview=draft`;
}
