import Image from 'next/image'

export default function TestImagesPage() {
  const categories = [
    { name: 'Պիդե', image: '/categories/pide.png' },
    { name: 'Կոմբո', image: '/categories/combo.png' },
    { name: 'Սնաք', image: '/categories/snack.png' },
    { name: 'Սոուսներ', image: '/categories/sauce.png' },
    { name: 'Ըմպելիքներ', image: '/categories/drinks.png' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">Тест изображений категорий</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Next.js Image (unoptimized)</h2>
          <div className="flex gap-4">
            {categories.map((cat) => (
              <div key={cat.name} className="text-center">
                <div className="relative w-24 h-24 bg-white rounded-lg border border-gray-300 mb-2">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="96px"
                    className="object-contain p-2"
                    unoptimized
                  />
                </div>
                <p className="text-sm">{cat.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">HTML img tag</h2>
          <div className="flex gap-4">
            {categories.map((cat) => (
              <div key={cat.name} className="text-center">
                <div className="w-24 h-24 bg-white rounded-lg border border-gray-300 mb-2 flex items-center justify-center p-2">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <p className="text-sm">{cat.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Прямые ссылки</h2>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat.name}>
                <a 
                  href={cat.image} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {cat.name}: {cat.image}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
