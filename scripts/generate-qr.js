import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

const DOMAIN = 'https://game2026.com'; // Pas dit aan naar je uiteindelijke domein
const MISSIONS = [
    { name: 'nebula-post', slug: 'x7-alpha-92' },
    { name: 'vortex-hub', slug: 'delta-vortex-11' },
    { name: 'nexus-core', slug: 'sigma-nexus-4' },
    { name: 'omega-rift', slug: 'omega-rift-55' },
    { name: 'gamma-prime', slug: 'gamma-prime-8' },
    { name: 'zeta-flux', slug: 'zeta-flux-33' },
    { name: 'theta-pulse', slug: 'theta-pulse-19' },
    { name: 'kappa-grid', slug: 'kappa-grid-27' },
    { name: 'iota-stream', slug: 'iota-stream-6' },
    { name: 'rho-system', slug: 'rho-system-88' }
];

const outputDir = path.join(process.cwd(), 'static', 'qr-codes');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function generateQRs() {
    console.log('🚀 Start genereren van QR codes...');

    for (const mission of MISSIONS) {
        const url = `${DOMAIN}/game/${mission.slug}`;
        const filePath = path.join(outputDir, `${mission.name}.png`);

        try {
            await QRCode.toFile(filePath, url, {
                color: {
                    dark: '#0f172a', // Donkerblauw (passend bij thema)
                    light: '#f8fafc' // Bijna wit
                },
                width: 600,
                margin: 2
            });
            console.log(`✅ Gegenereerd: ${mission.name} -> ${filePath}`);
        } catch (err) {
            console.error(`❌ Fout bij ${mission.name}:`, err);
        }
    }

    console.log('\n🎉 Klaar! Alle QR codes staan in static/qr-codes/');
}

generateQRs();
