import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const manifestSrc = path.join(rootDir, 'manifest', 'manifest.base.json');
const manifestDest = path.join(distDir, 'manifest.json');

console.log('Building...');
try {
    execSync('tsc && vite build', { stdio: 'inherit', cwd: rootDir });
} catch (e) {
    process.exit(1);
}

console.log('Copying manifest...');
if (fs.existsSync(manifestSrc)) {
    fs.copyFileSync(manifestSrc, manifestDest);
    console.log(`Copied ${manifestSrc} to ${manifestDest}`);
} else {
    console.error(`Manifest not found at ${manifestSrc}`);
    process.exit(1);
}

console.log('Build complete.');
