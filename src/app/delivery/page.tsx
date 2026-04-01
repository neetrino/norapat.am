import Footer from '@/components/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Առաքման քաղաքականություն | Pideh Armenia',
  description:
    'Pideh Armenia-ի առաքման պայմանները — տարածք, ժամանակ, արժեք, ինքնաառաքում և այլ կարևոր տեղեկություններ։',
}

export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-16" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 mb-20 lg:mb-16">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
              Առաքման քաղաքականություն
            </h1>
            <p className="text-gray-600">
              Վերջին թարմացում. {new Date().toLocaleDateString('hy-AM')}
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                1. Առաքման տարածք և ժամանակ
              </h2>
              <p className="text-gray-700 mb-4">
                Առաքումը կատարվում է Երևան և մերձակա տարածքներ (արվարձաններ)։
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Առաքման ժամանակ՝ 20–30 րոպե (պատվեր 21:00-ից առաջ)</li>
                <li>Ժամը նշվում է պատվերի ձևակերպման ժամանակ</li>
                <li>Ժամը կախված է բեռնվածությունից — սովորաբար 30–60 րոպե</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                2. Պատվերի նվազագույն գումար
              </h2>
              <p className="text-gray-700 mb-4">
                Առաքման պատվերների նվազագույն գումարը՝ 2000 դրամ։
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                3. Առաքման արժեք
              </h2>
              <p className="text-gray-700 mb-4">
                Առաքման արժեքը հաշվարկվում է checkout-ի ժամանակ՝ կախված հասցեից և 
                ընտրված առաքման տարբերակից։
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Ստանդարտ առաքում՝ 500 դրամ</li>
                <li>Անվճար առաքում 5000 դրամից բարձր պատվերների դեպքում</li>
                <li>Անվճար առաքում կարող է տրամադրվել խոշոր պատվերների կամ ակցիաների ժամանակ</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                4. Ինքնաառաքում
              </h2>
              <p className="text-gray-700 mb-4">
                Հնարավոր է պատվերը ստանալ մեր կետից (ինքնաառաքում)։ Այդ դեպքում.
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Առաքման արժեքը չի գանձվում</li>
                <li>Պատվերի ստացման ժամը նշվում է checkout-ում</li>
                <li>Ստացման կետի հասցեն ցուցադրվում է checkout-ի ժամանակ</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                5. Պատվերի հետևում
              </h2>
              <p className="text-gray-700 mb-4">
                Պատվերը հաստատելուց հետո կարող եք հետևել դրա կարգավիճակին ձեր 
                անձնական էջում («Պատվերների պատմություն»)։
              </p>
              <p className="text-gray-700 mb-4">
                Անհրաժեշտության դեպքում մենք կկապնվենք ձեզ հեռախոսով։
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                6. Կապ
              </h2>
              <p className="text-gray-700 mb-4">
                Առաքման հարցերով դիմեք.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>Հեռ.</strong> +374 95-044-888
                </p>
                <p className="text-gray-700">
                  <strong>Էլ. փոստ.</strong> info@pideh.am
                </p>
              </div>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 flex gap-4 flex-wrap">
            <Link href="/" className="text-orange-500 hover:text-orange-600 font-medium">
              ← Գլխավոր
            </Link>
            <Link href="/refund" className="text-orange-500 hover:text-orange-600 font-medium">
              Վերադարձի և փոխանակման քաղաքականություն →
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
