import Footer from '@/components/Footer'
import Link from 'next/link'

export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-16" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 mb-20 lg:mb-16">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">Առաքման քաղաքականություն</h1>
            <p className="text-gray-600">Վերջին թարմացում. {new Date().toLocaleDateString('hy-AM')}</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">1. Առաքման տարածք և ժամանակ</h2>
              <p className="text-gray-700 mb-4">
                Առաքումը կատարվում է Երևան և մերձակա տարածքներ։ Առաքման ժամանակը նշվում է պատվերի ձևակերպման ժամանակ
                և կախված է բեռնվածությունից (սովորաբար 30–60 րոպե)։
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">2. Առաքման արժեք</h2>
              <p className="text-gray-700 mb-4">
                Առաքման արժեքը հաշվարկվում է checkout-ի ժամանակ՝ կախված հասցեից և ընտրված առաքման տարբերակից։
                Անվճար առաքում կարող է տրամադրվել խոշոր պատվերների կամ ակցիաների ժամանակ։
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">3. Ինքնաառաքում</h2>
              <p className="text-gray-700 mb-4">
                Հնարավոր է պատվերը ստանալ մեր կետից (ինքնաառաքում)։ Այդ դեպքում առաքման արժեքը չի գանձվում,
                պատվերի ժամը նշվում է checkout-ում։
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">4. Պատվերի հետևում</h2>
              <p className="text-gray-700 mb-4">
                Պատվերը հաստատելուց հետո կարող եք հետևել դրա կարգավիճակին ձեր անձնական էջում (Պատվերների պատմություն)։
                Անհրաժեշտության դեպքում մենք կկապնվենք ձեզ հեռախոսով։
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">5. Կապ</h2>
              <p className="text-gray-700 mb-4">
                Առաքման հարցերով.
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
