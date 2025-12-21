export function ThemeScript() {
  // Set theme before hydration to avoid flash.
  // Defaults to 'dark'.
  const code = `
(function(){
  try {
    var t = localStorage.getItem('theme');
    if (t === 'dark' || t === 'light' || t === 'navy') {
      document.documentElement.dataset.theme = t;
      return;
    }
  } catch (e) {}
  document.documentElement.dataset.theme = 'dark';
})();
  `.trim()

  return <script dangerouslySetInnerHTML={{ __html: code }} />
}
