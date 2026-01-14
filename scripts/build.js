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

// Copy public folder (icons, etc.)
const publicDir = path.resolve(__dirname, '../public');
const distPublicDir = distDir;

if (fs.existsSync(publicDir)) {
    const files = fs.readdirSync(publicDir, { recursive: true, withFileTypes: true });
    for (const file of files) {
        if (file.isFile()) {
            const relativePath = path.relative(publicDir, path.resolve(file.path, file.name));
            const destPath = path.resolve(distPublicDir, relativePath);
            const destDir = path.dirname(destPath);

            if (!fs.existsSync(destDir)) {
                fs.mkdirSync(destDir, { recursive: true });
            }

            fs.copyFileSync(path.resolve(file.path, file.name), destPath);
        }
    }
    console.log('Copied public assets to dist');
}

console.log('Build complete.');
