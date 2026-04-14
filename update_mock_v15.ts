import fs from 'fs';
import path from 'path';

const mockDir = path.join(process.cwd(), 'src', 'data', 'mock');
const files = ['skus_software.ts', 'skus_software_pro.ts', 'skus_hardware.ts', 'skus_services.ts', 'skus_bundles.ts'];

for (const file of files) {
  const filePath = path.join(mockDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Add assetStatus based on file type
    let assetStatus = "'buyout'";
    if (file.includes('software')) {
      assetStatus = "'subscription'";
    } else if (file.includes('hardware')) {
      assetStatus = "'buyout'"; // Could be lease, but default to buyout
    } else if (file.includes('services')) {
      assetStatus = "'buyout'"; // Services are usually one-time buyout
    } else if (file.includes('bundles')) {
      assetStatus = "'buyout'"; // Mixed, but let's say buyout
    }

    // Replace lifecycleStatus: '...', with lifecycleStatus: '...', \n    assetStatus: ...,
    content = content.replace(/(lifecycleStatus:\s*'[^']+',)/g, `$1\n    assetStatus: ${assetStatus},`);
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
}

const priceBookFiles = ['price_book_entries_recurring.ts', 'price_book_entries_one_time.ts', 'price_book_entries_international.ts'];

for (const file of priceBookFiles) {
  const filePath = path.join(mockDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Add sspPrice and penaltyStrategy
    content = content.replace(/(listPrice:\s*[^,]+,)/g, `$1\n    sspPrice: 0,\n    penaltyStrategy: null,`);
    
    // Fix sspPrice to be same as listPrice for mock data
    content = content.replace(/sspPrice: 0/g, (match, offset, str) => {
      const listPriceMatch = str.substring(0, offset).match(/listPrice:\s*([^,]+),$/m);
      if (listPriceMatch) {
        return `sspPrice: ${listPriceMatch[1]}`;
      }
      return match;
    });

    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
}
