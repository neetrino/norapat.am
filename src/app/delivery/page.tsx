import Footer from '@/components/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Առաքման և մատակարարման պայմաններ | Pideh Armenia',
  description:
    'Pideh Armenia — առաքման ժամկետներ, տարբերակներ, վճարներ Նորապատում, Արմավիրի մարզում և հնարավոր ուշացումների մասին։',
}

export default function DeliveryPage() {
  return (
    <div className="min-h-screen">
      <div className="h-16" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="px-4 pb-4 pt-6 sm:px-8 sm:pb-8 sm:pt-10 mb-20 lg:mb-16">
          <header className="mb-6 text-center">
            <h1 className="inline-block text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 pb-2.5 border-b-2 border-orange-500 max-w-full">
              <span className="block leading-snug">Առաքման և Մատակարարման</span>
              <span className="block leading-snug">Պայմաններ</span>
            </h1>
          </header>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <p className="text-gray-700 mb-4">
                Մենք պարտավորվում ենք մատակարարել ձեր պատվերը արագ, ապահով և
                հարմարավետ կերպով։ Ստորև ներկայացված են առաքման հիմնական
                պայմանները։
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                1. Առաքման Ժամկետներ
              </h2>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>
                  Առաքումը կատարվում է տարածքում, ինչպես նաև մոտակա բոլոր
                  շրջաններում՝ հաճախորդի պատվերի հաստատումից հետո։
                </li>
                <li>
                  Առաքման ժամկետը կապված է պատվերի ծավալից և հեռավորությունից,
                  սովորաբար կազմում է 30–40 րոպե։
                </li>
                <li>
                  Հնարավոր ուշացումների դեպքում մեր թիմը կապ կհաստատի ձեզ հետ։
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                2. Առաքման Տարբերակներ
              </h2>
              <p className="text-gray-700 mb-4">
                Մենք առաջարկում ենք հետևյալ առաքման տարբերակները՝
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>
                  Ստանդարտ առաքում – իրականացվում է արագ և անվտանգ՝ պահպանելով
                  սննդի որակը և հիգիենիկ պայմանները։
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                3. Առաքման Վճարներ
              </h2>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>
                  Առաքումը Նորապատում, Արմավիրում, Մրգաշատում և Սարդարապատում
                  անվճար է 5000 դրամ և ավել գնումներ կատարելու դեպքում, իսկ 15000
                  դրամ և ավել գնումներ կատարելու դեպքում՝ ողջ Արմավիրի մարզում։
                </li>
                <li>
                  5000 դրամից ցածր գնումներ կատարելու դեպքում առաքումը Նորապատում
                  300 դրամ է, իսկ մնացած տարածքներում առաքման արժեքները տարբեր
                  են՝ կախված հեռավորությունից։
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                4. Հնարավոր Ուշացումներ
              </h2>
              <p className="text-gray-700 mb-4">
                Չնայած մեր ջանքերին, որոշ դեպքերում առաքումը կարող է ուշանալ՝
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Եղանակային պայմանների,</li>
                <li>Տրանսպորտային խնդիրների,</li>
                <li>Տոնական և աշխատանքային ծանրաբեռնվածության պատճառով։</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Մենք ձեզ կտեղեկացնենք հնարավոր ուշացումների մասին՝ պահպանելով
                թափանցիկ հաղորդակցություն։
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                5. Կապ
              </h2>
              <p className="text-gray-700 mb-4">Առաքման հարցերով դիմեք.</p>
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
