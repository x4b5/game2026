import { Jimp } from "jimp";
import fs from 'fs';
import path from 'path';

const HEROES_DIR = './static/heroes';

async function processImage(filename) {
    const filePath = path.join(HEROES_DIR, filename);
    if (!fs.existsSync(filePath)) {
        console.log(`Skipping ${filename} (not found)`);
        return;
    }

    try {
        console.log(`Processing ${filename}...`);
        const image = await Jimp.read(filePath);

        // Scan every pixel
        const width = image.bitmap.width;
        const height = image.bitmap.height;

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const color = image.getPixelColor(x, y);
                // Extract RGBA Manually using bitwise
                const r = (color >>> 24) & 0xFF;
                const g = (color >>> 16) & 0xFF;
                const b = (color >>> 8) & 0xFF;
                const a = color & 0xFF;

                const rgba = { r, g, b, a };

                // Check for Black background (specifically for the new generated images)
                // We use a small threshold because compression might introduce slight noise
                if (rgba.r < 10 && rgba.g < 10 && rgba.b < 10) {
                    image.setPixelColor(0x00000000, x, y); // Set to transparent
                }

                // Also try to catch the checkerboard pattern (light grays and whites)
                // This is risky for the character itself, but we'll try to be specific
                // Standard checkerboard is often pure white and light gray (e.g. #cccccc)
                else if ((rgba.r > 240 && rgba.g > 240 && rgba.b > 240) || // White
                    (rgba.r > 200 && rgba.r < 220 && rgba.g > 200 && rgba.g < 220 && rgba.b > 200 && rgba.b < 220)) { // Gray
                    // Only remove if it's strictly outside the center "hero zone" to be safe?
                    // For now let's just target the black ones primarily as that was the latest strategy
                }
            }
        }

        await image.write(filePath);
        console.log(`Saved transparent version to ${filePath}`);
    } catch (err) {
        console.error(`Error processing ${filename}:`, err);
    }
}

async function run() {
    // Process the known black-background images
    await processImage('lightning-striker-idle.png');
    await processImage('lightning-striker-action.png');
    await processImage('inferno-guardian-idle.png');
    await processImage('inferno-guardian-action.png');

    // Also try to help the others if possible, but mainly focused on the active ones
}

run();
