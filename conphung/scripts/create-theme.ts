#!/usr/bin/env node
/**
 * Theme Creation Script
 * 
 * Usage: npx tsx scripts/create-theme.ts <themeName> [--parent=parentTheme]
 * 
 * Creates a new theme with scaffold structure:
 * - templates/<themeName>/
 *   - theme.json
 *   - pages/
 *   - layout/
 *   - components/
 *   - public/
 */

import * as fs from 'fs/promises';
import * as path from 'path';

const THEMES_DIR = process.env.THEMES_DIR || 'templates';

interface ThemeOptions {
  name: string;
  version?: string;
  author?: string;
  description?: string;
  parent?: string;
}

async function createTheme(options: ThemeOptions) {
  const { name, version = '1.0.0', author, description, parent } = options;
  
  // Validate theme name
  if (!/^[a-z0-9-]+$/.test(name)) {
    throw new Error('Theme name must contain only lowercase letters, numbers, and hyphens');
  }
  
  const themePath = path.join(process.cwd(), THEMES_DIR, name);
  
  // Check if theme already exists
  try {
    await fs.access(themePath);
    throw new Error(`Theme "${name}" already exists`);
  } catch (error: any) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
  
  // Create theme directory structure
  const dirs = [
    themePath,
    path.join(themePath, 'pages'),
    path.join(themePath, 'layout'),
    path.join(themePath, 'components'),
    path.join(themePath, 'public'),
  ];
  
  for (const dir of dirs) {
    await fs.mkdir(dir, { recursive: true });
  }
  
  // Create theme.json
  const themeJson = {
    name: name.charAt(0).toUpperCase() + name.slice(1),
    version,
    author: author || 'Your Name',
    description: description || `Theme: ${name}`,
    ...(parent && { parent }),
  };
  
  await fs.writeFile(
    path.join(themePath, 'theme.json'),
    JSON.stringify(themeJson, null, 2)
  );
  
  // Create default layout
  const defaultLayout = `import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function DefaultLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
`;
  
  await fs.writeFile(
    path.join(themePath, 'layout', 'default.tsx'),
    defaultLayout
  );
  
  // Create index page
  const indexPage = `export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to ${themeJson.name} Theme</h1>
      <p className="text-lg text-gray-600">
        This is your custom theme. Edit this page in:
        <code className="block mt-2 bg-gray-100 p-2 rounded">
          templates/${name}/pages/index.tsx
        </code>
      </p>
    </div>
  );
}
`;
  
  await fs.writeFile(
    path.join(themePath, 'pages', 'index.tsx'),
    indexPage
  );
  
  // Create example about page
  const aboutPage = `export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">About</h1>
      <p className="text-lg text-gray-600">
        This is the about page. Edit it in:
        <code className="block mt-2 bg-gray-100 p-2 rounded">
          templates/${name}/pages/about.tsx
        </code>
      </p>
    </div>
  );
}
`;
  
  await fs.writeFile(
    path.join(themePath, 'pages', 'about.tsx'),
    aboutPage
  );
  
  // Create .gitkeep files for empty directories
  await fs.writeFile(path.join(themePath, 'components', '.gitkeep'), '');
  await fs.writeFile(path.join(themePath, 'public', '.gitkeep'), '');
  
  // Create README
  const readme = `# ${themeJson.name} Theme

Version: ${version}
${author ? `Author: ${author}` : ''}

## Structure

\`\`\`
${name}/
├── theme.json          # Theme metadata
├── pages/              # Theme pages
│   ├── index.tsx      # Homepage
│   └── about.tsx       # About page
├── layout/             # Theme layouts
│   └── default.tsx    # Default layout
├── components/         # Theme-specific components
└── public/             # Public assets (accessible at /themes/${name}/...)
\`\`\`

## Usage

Pages in the \`pages/\` directory will be automatically mapped to routes:
- \`pages/index.tsx\` → \`/\`
- \`pages/about.tsx\` → \`/about\`
- \`pages/blog/[slug].tsx\` → \`/blog/:slug\`

## Features

- ✅ Full Next.js support (getServerSideProps, getStaticProps, getStaticPaths)
- ✅ Tailwind CSS support
- ✅ Theme-specific components
- ✅ Public assets support
${parent ? `- ✅ Parent theme: ${parent}` : ''}

## Development

Edit files in this directory to customize your theme.

When ready, activate this theme via API or admin panel.
`;
  
  await fs.writeFile(path.join(themePath, 'README.md'), readme);
  
  console.log(`✅ Theme "${name}" created successfully!`);
  console.log(`📁 Location: ${themePath}`);
  console.log(`\n📝 Next steps:`);
  console.log(`   1. Edit files in templates/${name}/`);
  console.log(`   2. Activate theme via API: POST /api/themes { "theme": "${name}" }`);
  console.log(`   3. Or use the admin panel to activate`);
}

// Parse command line arguments
const args = process.argv.slice(2);
const themeName = args.find(arg => !arg.startsWith('--'));
const parentMatch = args.find(arg => arg.startsWith('--parent='));
const parent = parentMatch ? parentMatch.split('=')[1] : undefined;

if (!themeName) {
  console.error('Usage: npx tsx scripts/create-theme.ts <themeName> [--parent=parentTheme]');
  process.exit(1);
}

createTheme({
  name: themeName,
  parent,
})
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error creating theme:', error.message);
    process.exit(1);
  });

