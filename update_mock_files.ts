import * as fs from 'fs';

const generatedProducts = JSON.parse(fs.readFileSync('generated_products.json', 'utf-8'));
const generatedBundles = JSON.parse(fs.readFileSync('generated_bundles.json', 'utf-8'));
const generatedPricing = JSON.parse(fs.readFileSync('generated_pricing.json', 'utf-8'));
const generatedFeatures = JSON.parse(fs.readFileSync('generated_features.json', 'utf-8'));
const generatedRules = JSON.parse(fs.readFileSync('generated_rules.json', 'utf-8'));

function replaceArrayInFile(filePath: string, arrayName: string, newArray: any[]) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Find the start of the array export
  const regex = new RegExp(`export const ${arrayName}(?:\\s*:\\s*[a-zA-Z\\[\\]]+)?\\s*=\\s*\\[`, 'g');
  const match = regex.exec(content);
  
  if (!match) {
    console.error(`Could not find array ${arrayName} in ${filePath}`);
    return;
  }
  
  const startIndex = match.index;
  
  // Find the end of the array
  let openBrackets = 0;
  let endIndex = -1;
  let inString = false;
  let stringChar = '';
  
  for (let i = startIndex + match[0].length - 1; i < content.length; i++) {
    const char = content[i];
    
    if (inString) {
      if (char === stringChar && content[i-1] !== '\\') {
        inString = false;
      }
      continue;
    }
    
    if (char === '"' || char === '\'' || char === '\`') {
      inString = true;
      stringChar = char;
      continue;
    }
    
    if (char === '[') openBrackets++;
    if (char === ']') {
      openBrackets--;
      if (openBrackets === 0) {
        endIndex = i + 1;
        break;
      }
    }
  }
  
  if (endIndex === -1) {
    console.error(`Could not find end of array ${arrayName} in ${filePath}`);
    return;
  }
  
  // Format the new array
  const newArrayString = JSON.stringify(newArray, null, 2)
    .replace(/"([^"]+)":/g, '$1:') // Remove quotes from keys
    .replace(/"/g, '\''); // Use single quotes
    
  // Replace the array in the content
  const newContent = content.substring(0, startIndex) + 
    match[0] + '\n  ' + newArrayString.substring(2) + 
    content.substring(endIndex);
    
  fs.writeFileSync(filePath, newContent);
  console.log(`Updated ${arrayName} in ${filePath}`);
}

replaceArrayInFile('src/data/mock/products.ts', 'mockProducts', generatedProducts.products);
replaceArrayInFile('src/data/mock/products.ts', 'mockSkus', generatedProducts.skus);
replaceArrayInFile('src/data/mock/bundles.ts', 'mockBundleGroups', generatedBundles.bundleGroups);
replaceArrayInFile('src/data/mock/bundles.ts', 'mockBundleOptions', generatedBundles.bundleOptions);
replaceArrayInFile('src/data/mock/pricing.ts', 'mockPriceBookEntries', generatedPricing.priceBookEntries);
replaceArrayInFile('src/data/mock/features.ts', 'mockEntitlements', generatedFeatures.entitlements);
replaceArrayInFile('src/data/mock/rules.ts', 'mockRules', generatedRules.rules);

console.log('Done!');
