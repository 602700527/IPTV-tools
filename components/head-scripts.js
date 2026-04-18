// Google Analytics / Google tag (gtag.js)
// 放在 <head> 最前面，紧跟在 <head> 之后
export const HEAD_SCRIPTS = `
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-MB15P52H01"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-MB15P52H01');
  </script>
`;
