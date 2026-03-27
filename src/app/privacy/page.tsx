import Footer from '@/components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Գաղտնիության քաղաքականություն | Pideh Armenia',
  description:
    'Pideh Armenia-ի գաղտնիության քաղաքականությունը — ինչպես ենք հավաքում և օգտագործում ձեր տվյալները։',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-16" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 mb-20 lg:mb-16">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
              Գաղտնիության քաղաքականություն
            </h1>
            <p className="text-gray-600">
              Վերջին թարմացում. {new Date().toLocaleDateString('hy-AM')}
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                1. Ընդհանուր դրույթներ
              </h2>
              <p className="text-gray-700 mb-4">
                Այս Գաղտնիության քաղաքականությունը որոշում է այս կայքի (այսուհետև — «Կայք») 
                օգտվողների անձնական տվյալների մշակման կարգը։
              </p>
              <p className="text-gray-700 mb-4">
                Օգտագործելով այս Կայքը՝ դուք համաձայնում եք այս Գաղտնիության քաղաքականության պայմաններին։
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                2. Անձնական տվյալների հավաքագրում
              </h2>
              <p className="text-gray-700 mb-4">
                Մենք հավաքագրում ենք հետևյալ անձնական տվյալները.
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Անուն և ազգանուն</li>
                <li>Էլ․ փոստի հասցե</li>
                <li>Հեռախոսահամար</li>
                <li>Առաքման հասցե</li>
                <li>Պատվերների մասին տեղեկություն</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                3. Տվյալների մշակման նպատակներ
              </h2>
              <p className="text-gray-700 mb-4">
                Անձնական տվյալները օգտագործվում են.
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Պատվերների մշակման և կատարման համար</li>
                <li>Հաճախորդների հետ կապի համար</li>
                <li>Ապրանքների առաքման համար</li>
                <li>Ծառայության որակի բարելավման համար</li>
                <li>Նոր ապրանքների և ակցիաների մասին տեղեկատվության համար</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                4. Տվյալների պաշտպանություն
              </h2>
              <p className="text-gray-700 mb-4">
                Մենք ձեռնարկում ենք բոլոր անհրաժեշտ միջոցները ձեր անձնական տվյալները 
                անարդյունավետ մուտքից, փոփոխությունից, բացահայտումից կամ ոչնչացումից պաշտպանելու համար։
              </p>
              <p className="text-gray-700 mb-4">
                Բոլոր տվյալները փոխանցվում են ապահով կապով (HTTPS) և պահվում 
                ապահովված սերվերներում։
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                5. Տվյալների փոխանցում երրորդ կողմերին
              </h2>
              <p className="text-gray-700 mb-4">
                Մենք ձեր անձնական տվյալները չենք փոխանցում երրորդ կողմերին, բացառությամբ.
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Երբ դա անհրաժեշտ է պատվերի կատարման համար (առաքման ծառայություններ)</li>
                <li>Երբ դա պահանջվում է օրենքով</li>
                <li>Ձեր հստակ համաձայնությամբ</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                6. Ձեր իրավունքները
              </h2>
              <p className="text-gray-700 mb-4">
                Դուք իրավունք ունեք.
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Ստանալ տեղեկություն ձեր անձնական տվյալների մասին</li>
                <li>Պահանջել սխալ տվյալների ուղղում</li>
                <li>Պահանջել ձեր տվյալների ջնջում</li>
                <li>Ետ վերցնել տվյալների մշակման համաձայնությունը</li>
                <li>Սահմանափակել ձեր տվյալների մշակումը</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                7. Cookies
              </h2>
              <p className="text-gray-700 mb-4">
                Մեր Կայքը օգտագործում է cookie ֆայլեր օգտվողի փորձը բարելավելու համար։ 
                Դուք կարող եք անջատել cookies-ը ձեր զննարկչի կարգավորումներում։
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                8. Քաղաքականության փոփոխություններ
              </h2>
              <p className="text-gray-700 mb-4">
                Մենք կարող ենք թարմացնել այս Գաղտնիության քաղաքականությունը։ 
                Ցանկացած փոփոխության մասին մենք ձեզ կտեղեկացնենք Կայքի կամ էլ․ փոստով։
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                9. Կապի տվյալներ
              </h2>
              <p className="text-gray-700 mb-4">
                Այս Գաղտնիության քաղաքականության հետ կապված հարցերի դեպքում 
                դիմեք մեզ.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>Էլ․ փոստ.</strong> info@pideh.am
                </p>
                <p className="text-gray-700">
                  <strong>Հեռ.</strong> +374 95-044-888
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
  )
}
