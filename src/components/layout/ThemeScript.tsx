export function ThemeScript() {
  // Set theme before hydration to avoid flash.
  // Supported: light | navy
  // Default: light
  const code = `
(function(){
  try {
    var t = localStorage.getItem('theme');
    if (t === 'light' || t === 'navy') {
      document.documentElement.dataset.theme = t;
      return;
    }
  } catch (e) {}
  document.documentElement.dataset.theme = 'light';
})();
  `.trim()

  return <script dangerouslySetInnerHTML={{ __html: code }} />
}
