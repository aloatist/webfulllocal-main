export default function Template1HomePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Welcome to Template 1
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300">
          A modern theme with gradient designs
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-xl text-white">
          <h3 className="text-2xl font-bold mb-3">Feature 1</h3>
          <p>Beautiful gradient cards</p>
        </div>
        
        <div className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-xl text-white">
          <h3 className="text-2xl font-bold mb-3">Feature 2</h3>
          <p>Modern design</p>
        </div>
        
        <div className="p-6 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl shadow-xl text-white">
          <h3 className="text-2xl font-bold mb-3">Feature 3</h3>
          <p>Responsive layout</p>
        </div>
      </div>
      
      <div className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <p className="text-gray-600 dark:text-gray-300">
          This theme demonstrates a different design style. Edit it in:
          <code className="block mt-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            templates/template1/pages/index.tsx
          </code>
        </p>
      </div>
    </div>
  );
}

