export default function Template1AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
        About Us
      </h1>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">
          This is the about page using Template 1 theme.
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          You can customize it in:
          <code className="block mt-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            templates/template1/pages/about.tsx
          </code>
        </p>
      </div>
    </div>
  );
}

