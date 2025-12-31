import fs from 'fs';
import path from 'path';

const routesDir = path.join(process.cwd(), 'src', 'routes', 'game');
const missions = [
    { slug: 'x7-alpha-92', qr: 'nebula-post' },
    { slug: 'delta-vortex-11', qr: 'vortex-hub' },
    { slug: 'sigma-nexus-4', qr: 'nexus-core' },
    { slug: 'omega-rift-55', qr: 'omega-rift' },
    { slug: 'gamma-prime-8', qr: 'gamma-prime' },
    { slug: 'zeta-flux-33', qr: 'zeta-flux' },
    { slug: 'theta-pulse-19', qr: 'theta-pulse' },
    { slug: 'kappa-grid-27', qr: 'kappa-grid' },
    { slug: 'iota-stream-6', qr: 'iota-stream' },
    { slug: 'rho-system-88', qr: 'rho-system' }
];

missions.forEach(mission => {
    const filePath = path.join(routesDir, mission.slug, '+page.svelte');
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf-8');
        if (!content.includes('qrName=')) {
            content = content.replace('/>', `    qrName="${mission.qr}"\n/>`);
            fs.writeFileSync(filePath, content);
            console.log(`Updated ${mission.slug}`);
        }
    }
});
