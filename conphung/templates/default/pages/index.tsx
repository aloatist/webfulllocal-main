export default function DefaultHomePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">
        Welcome to Default Theme
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
        This is the default theme. You can customize this page in:
        <code className="block mt-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          templates/default/pages/index.tsx
        </code>
      </p>
      
      <div className="grid md:grid-cols-2 gap-6 mt-12">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-3">Features</h2>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li>✅ Clean and simple design</li>
            <li>✅ Dark mode support</li>
            <li>✅ Responsive layout</li>
            <li>✅ Tailwind CSS ready</li>
          </ul>
        </div>
        
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-3">Getting Started</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Edit the files in <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">templates/default/</code> to customize this theme.
          </p>
        </div>
      </div>
    </div>
  );
}

