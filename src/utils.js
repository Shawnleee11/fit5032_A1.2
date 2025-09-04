export function clean(s=''){
  // strip tags (very small XSS guard). Good enough for this demo.
  return String(s).replace(/<[^>]*>/g, '').trim()
}
