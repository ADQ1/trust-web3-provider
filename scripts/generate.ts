import * as path from 'path';
import { mkdir, rm, readdir } from 'node:fs/promises';
import { execSync } from 'child_process';

const subpackagesDir = path.resolve(__dirname, '../packages');
const chainName = (process.argv[2] || '').toLowerCase();

if (!chainName) {
  throw new Error('Please enter a chain name');
}

async function generate() {
  console.log(`
                    ___           ___           ___                   
      ___          /  /\\         /  /\\         /  /\\          ___     
     /__/\\        /  /::\\       /  /:/        /  /::\\        /__/\\    
     \\  \\:\\      /  /:/\\:\\     /  /:/        /__/:/\\:\\       \\  \\:\\   
      \\__\\:\\    /  /::\\ \\:\\   /  /:/        _\\_ \\:\\ \\:\\       \\__\\:\\  
      /  /::\\  /__/:/\\:\\_\\:\\ /__/:/     /\\ /__/\\ \\:\\ \\:\\      /  /::\\ 
     /  /:/\\:\\ \\__\\/~|::\\/:/ \\  \\:\\    /:/ \\  \\:\\ \\:\\_\\/     /  /:/\\:\\
    /  /:/__\\/    |  |:|::/   \\  \\:\\  /:/   \\  \\:\\_\\:\\      /  /:/__\\/
   /__/:/         |  |:|\\/     \\  \\:\\/:/     \\  \\:\\/:/     /__/:/     
   \\__\\/          |__|:|~       \\  \\::/       \\  \\::/      \\__\\/      
                   \\__\\|         \\__\\/         \\__\\/                  
          
  \n\n
Generating a new chain provider....
  `);

  const base = path.join(subpackagesDir, chainName);
  // check if already exists
  try {
    await readdir(base);
    console.error(`Oops, directory ${base} already exists, aborting`);
    return;
  } catch {}

  try {
    // Generate new dir, fails if already exists
    const folders = ['tests', 'exceptions', 'types'];
    await mkdir(base);
    await Promise.all(
      folders.map((folder) =>
        mkdir(path.join(subpackagesDir, chainName, folder)),
      ),
    );

    // Execute template generation
    execSync(
      `simple-scaffold -q \\
  -t templates \\
  -o packages/${chainName} \\
  ${chainName.slice(0, 1).toUpperCase() + chainName.slice(1)} --log-level none`,
      {
        stdio: 'inherit',
        cwd: path.resolve(__dirname, '../'),
      },
    );

    console.log(`Boilerplate code generated for ${chainName} 🚀 Have Fun!`);
  } catch (e) {
    console.error(e);
    await rm(path.join(subpackagesDir, chainName), {
      recursive: true,
      force: true,
    });
  }
}

generate();
