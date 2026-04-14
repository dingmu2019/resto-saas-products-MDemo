import * as fs from 'fs';

const filePath = 'src/data/mock/products.ts';
let content = fs.readFileSync(filePath, 'utf-8');

const regex = /export const mockCategories: Category\[\] = \[([\s\S]*?)\];/;
const match = regex.exec(content);

if (match) {
  let arrayStr = '[' + match[1] + ']';
  
  // Need to parse it. Since it's JS, we can use eval or new Function
  const getArray = new Function(`return ${arrayStr}`);
  const categories = getArray();
  
  categories.forEach((cat: any) => {
    cat.translations = {
      en: {
        name: cat.description || cat.name,
        description: cat.description || cat.name
      },
      zh: {
        name: cat.name,
        description: cat.name
      }
    };
  });
  
  const newArrayStr = JSON.stringify(categories, null, 2)
    .replace(/"([^"]+)":/g, '$1:')
    .replace(/"/g, '\'');
    
  content = content.replace(regex, `export const mockCategories: Category[] = ${newArrayStr};`);
  fs.writeFileSync(filePath, content);
  console.log('Updated mockCategories with translations');
}
