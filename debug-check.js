var fs = require('fs');
var c = fs.readFileSync('C:/Users/60270/Desktop/cfworker2/admin-page.js', 'utf8');
console.log('indexOf("<scr"):', c.indexOf('<scr'));
console.log('indexOf("</scr"):', c.indexOf('</scr'));
console.log('indexOf("</script"):', c.indexOf('</script'));
console.log('indexOf("<\\/script"):', c.indexOf('<\/script'));
console.log('indexOf("script>"):', c.indexOf('script>'));
console.log('Has CRLF:', c.includes('\r\n'));
console.log('Has lone CR:', c.includes('\r'));
console.log('Has lone LF:', c.includes('\n'));
console.log('Total lines:', c.split('\n').length);
console.log('File length:', c.length);

// Find line 3923
var lines = c.split('\n');
console.log('\nLine 3923:', JSON.stringify(lines[3922]));
console.log('Line 3924:', JSON.stringify(lines[3923]));
console.log('Line 3925:', JSON.stringify(lines[3924]));

// Check around line 3923 for any ick
for (var i = 3920; i <= 3930; i++) {
  var line = lines[i-1];
  if (line.includes('<scr') || line.includes('</')) {
    console.log('Line ' + i + ' has script-related content:', JSON.stringify(line));
  }
}