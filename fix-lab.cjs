const fs = require('fs');
const path = require('path');

const dir = 'f:/quawaco-ioc-web/src/pages/Lab';
function traverse(d) {
  const files = fs.readdirSync(d);
  files.forEach(f => {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) {
      traverse(p);
    } else if (p.endsWith('.tsx')) {
      let content = fs.readFileSync(p, 'utf8');
      
      content = content.replace(/bg-white\/5/g, 'bg-[var(--bg-hover)]');
      content = content.replace(/bg-white\/10/g, 'bg-[var(--bg-hover)]');
      content = content.replace(/bg-white\/20/g, 'bg-[var(--border)]');
      content = content.replace(/border-white\/[0-9]+/g, 'border-[var(--border-active)]');
      content = content.replace(/hover:bg-white\/[0-9]+/g, 'hover:bg-[var(--bg-hover)]');
      content = content.replace(/hover:border-white\/[0-9]+/g, 'hover:border-[var(--border-active)]');
      content = content.replace(/text-white/g, 'text-[var(--text)]');
      content = content.replace(/bg-black\/20/g, 'bg-[var(--bg-surface)]');
      content = content.replace(/bg-black\/30/g, 'bg-[var(--bg-header)]');
      content = content.replace(/bg-black\/40/g, 'bg-[var(--bg-surface)]');
      
      // also fix tooltips or buttons
      // <button className="... bg-[var(--cyan)] text-black ...">
      content = content.replace(/bg-\[var\(--cyan\)\] text-black/g, 'btn-primary');
      // For some gradients:
      content = content.replace(/bg-gradient-to-br from-\[#[a-f0-9]+\] to-\[#[a-f0-9]+\]/g, '');
      content = content.replace(/shadow-\[0_4px_15px_rgba\(0,80,204,0\.3\)\]/g, '');

      fs.writeFileSync(p, content);
      console.log('Fixed', p);
    }
  });
}

traverse(dir);
