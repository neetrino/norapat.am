import Footer from '@/components/Footer'
import Link from 'next/link'

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-16" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 mb-20 lg:mb-16">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">Վերադարձի քաղաքականություն</h1>
            <p className="text-gray-600">Վերջին թարմացում. {new Date().toLocaleDateString('hy-AM')}</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">1. Ընդհանուր դրույթներ</h2>
              <p className="text-gray-700 mb-4">
                Այս քաղաքականությունը սահմանում է պատվերների վերադարձի և փոխարինման կարգը։
                Պատվեր տալով՝ դուք համաձայնում եք այս պայմաններին։
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">2. Սննդի ապրանքների վերադարձ</h2>
              <p className="text-gray-700 mb-4">
                Սանիտարական նորմերի համաձայն՝ պատրաստված սննդի ապրանքների վերադարձ ընդունվում է միայն այն դեպքում,
                եթե ապրանքը ստացվել է անորակ, վնասված կամ չի համապատասխանում պատվերին։
              </p>
              <p className="text-gray-700 mb-4">
                Խնդրում ենք կապ հաստատել պատվերը ստանալուց ոչ ուշ քան 30 րոպեի ընթացքում։
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">3. Դրամի վերադարձ</h2>
              <p className="text-gray-700 mb-4">
                Վերադարձն իրականացվում է նույն ձևով, որով կատարվել է վճարում.
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Կանխիկ վճարում — վերադարձ կանխիկ կամ բանկային փոխանցում</li>
                <li>Քարտով/Idram — վերադարձ նույն քարտին/հաշվին 5–10 աշխատանքային օրվա ընթացքում</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">4. Կապ</h2>
              <p className="text-gray-700 mb-4">
                Վերադարձի կամ փոխարինման հարցերով դիմեք.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Հեռ.</strong> +374 95-044-888</p>
                <p className="text-gray-700"><strong>Էլ. փոստ.</strong> info@pideh.am</p>
              </div>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link href="/" className="text-orange-500 hover:text-orange-600 font-medium">
              ← Գլխավոր
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
  )
}
