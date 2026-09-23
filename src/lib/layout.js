// Matches the breakpoint in App.css where the list and map sit side by side.
export function isWideScreen() {
  return window.matchMedia('(min-width: 900px)').matches
}
