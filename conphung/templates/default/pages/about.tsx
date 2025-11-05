export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">
        About Us
      </h1>
      <div className="prose prose-lg dark:prose-invert">
        <p className="text-xl text-gray-600 dark:text-gray-400">
          This is the about page using the Default theme. You can customize it in:
          <code className="block mt-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            templates/default/pages/about.tsx
          </code>
        </p>
      </div>
    </div>
  );
}

