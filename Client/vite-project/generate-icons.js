// Script para generar iconos PWA
// Ejecutar con: node generate-icons.js

const fs = require('fs');
const path = require('path');

// Crear iconos placeholder como SVG
const createIcon = (size, filename) => {
  const svg = `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4f46e5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="url(#grad)" rx="${size * 0.1}"/>
  
  <!-- Lock Icon -->
  <g transform="translate(${size * 0.25}, ${size * 0.2})">
    <!-- Lock Body -->
    <rect x="0" y="${size * 0.3}" width="${size * 0.5}" height="${size * 0.4}" 
          fill="white" rx="${size * 0.05}" stroke="none"/>
    
    <!-- Lock Shackle -->
    <path d="M ${size * 0.1} ${size * 0.3} 
             Q ${size * 0.1} ${size * 0.15} ${size * 0.25} ${size * 0.15}
             Q ${size * 0.4} ${size * 0.15} ${size * 0.4} ${size * 0.3}"
          fill="none" stroke="white" stroke-width="${size * 0.03}"/>
    
    <!-- Keyhole -->
    <circle cx="${size * 0.25}" cy="${size * 0.45}" r="${size * 0.04}" fill="url(#grad)"/>
    <rect x="${size * 0.235}" y="${size * 0.45}" width="${size * 0.03}" height="${size * 0.08}" fill="url(#grad)"/>
  </g>
  
  <!-- ByteLock Text -->
  <text x="${size * 0.5}" y="${size * 0.85}" 
        font-family="Arial, sans-serif" 
        font-size="${size * 0.08}" 
        font-weight="bold" 
        text-anchor="middle" 
        fill="white">ByteLock</text>
</svg>`;

  const publicPath = path.join(__dirname, 'public', filename);
  fs.writeFileSync(publicPath, svg);
  console.log(`Generated: ${filename}`);
};

// Generar iconos en todos los tamaños necesarios
const sizes = [
  { size: 48, filename: 'logo-48.png' },
  { size: 96, filename: 'logo-96.png' },
  { size: 144, filename: 'logo-144.png' },
  { size: 192, filename: 'logo-192.png' },
  { size: 512, filename: 'logo-512.png' }
];

console.log('Generating PWA icons...');

// Crear directorio public si no existe
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generar iconos SVG (que funcionan como PNG para PWA)
sizes.forEach(({ size, filename }) => {
  const svgFilename = filename.replace('.png', '.svg');
  createIcon(size, svgFilename);
});

console.log('PWA icons generated successfully!');
console.log('Note: These are SVG icons. For better compatibility, convert them to PNG using an online converter or image editor.');
console.log('Recommended: Use your existing logo.png and resize it to the required sizes.'); 