import Footer from '@/components/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Վերադարձի և փոխանակման քաղաքականություն | Pideh Armenia',
  description:
    'Pideh Armenia — վերադարձ, փոխանակում, գումարի վերադարձ, պատվերի չեղարկում և անհատական պատվերների պայմաններ։',
}

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-16" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 mb-20 lg:mb-16">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
              Վերադարձի և փոխանակման քաղաքականություն
            </h1>
            <p className="text-gray-600">
              Վերջին թարմացում. {new Date().toLocaleDateString('hy-AM')}
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <p className="text-gray-700 mb-4">
                Մենք ցանկանում ենք, որ դուք լիովին գոհ լինեք ձեր գնումից։ Եթե
                ինչ-որ պատճառով ձեր պատվերը չի համապատասխանում ձեր սպասելիքներին,
                մենք պատրաստ ենք օգնել ձեզ փոխանակման կամ վերադարձի հարցում։
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                1. Փոխանակում
              </h2>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>
                  Գնված սննդամթերքը փոխանակման ենթակա չէ, բացառությամբ այն
                  դեպքերի, երբ առկա է որակի կամ թարմության խնդիր։
                </li>
                <li>
                  Փոխանակման համար անհրաժեշտ է ներկայացնել գնումի ՀԴՄ կտրոնը կամ
                  էլեկտրոնային հաշիվը։
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                2. Վերադարձ
              </h2>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>
                  Վերադարձը հնարավոր է միայն այն դեպքում, եթե հաճախորդը պատվերը
                  ստանալուց անմիջապես հետո տեղեկացրել է, որ հայտնաբերել է սննդի
                  անորակություն կամ ոչ համապատասխան պատվեր է ստացել։
                </li>
                <li>
                  Ապրանքը պետք է լինի չօգտագործված, առանց վնասվածքների և
                  ամբողջական փաթեթավորմամբ։
                </li>
                <li>
                  Վերադարձի համար անհրաժեշտ է ներկայացնել գնումի ՀԴՄ կտրոնը կամ
                  էլեկտրոնային հաշիվը։
                </li>
                <li>
                  Եթե մենք սխալ ապրանք ենք առաքել, հաճախորդը կարող է վերադարձնել
                  ապրանքը կամ փոխանակել այն ճիշտ ապրանքի հետ՝ առանց լրացուցիչ
                  վճարի։
                </li>
                <li>
                  Անվտանգության նկատառումներից ելնելով, վերադարձ չի
                  իրականացվում, եթե հաճախորդը պարզապես փոխել է իր որոշումը։
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                3. Գումարի վերադարձ
              </h2>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>
                  Եթե վերադարձվող ապրանքը համապատասխանի վերոնշյալ պայմաններին,
                  ապա գումարը կվերադարձվի այն նույն եղանակով, որով կատարվել է
                  վճարումը։
                </li>
                <li>
                  Քարտային վճարումների դեպքում գումարը վերադարձվում է մինչև 7
                  աշխատանքային օրվա ընթացքում, կախված բանկի ընթացակարգերից։
                </li>
                <li>
                  Առաքման վճարները չեն վերադարձվում, բացառությամբ այն
                  դեպքերի, երբ մենք սխալ ապրանք ենք առաքել։
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                4. Պատվերի չեղարկում
              </h2>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Պատվերը կարող է չեղարկվել մինչև առաքումը։</li>
                <li>Եթե պատվերն արդեն առաքվել է, այն հնարավոր չէ չեղարկել։</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                5. Անհատականացված պատվերներ
              </h2>
              <p className="text-gray-700 mb-4">
                Անհատականացված պատվերները, ներառյալ փորագրված, հատուկ պատրաստված
                կամ պատվերով արտադրված ապրանքները, վերադարձի կամ փոխանակման
                ենթակա չեն։
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                6. Ապրանքներ, որոնք ընդհանուր առմամբ վերադարձի ենթակա չեն
              </h2>
              <p className="text-gray-700 mb-4">
                Սննդամթերքը, որպես արագ փչացող ապրանք, ընդհանուր առմամբ վերադարձի
                և փոխանակման ենթակա չէ, սակայն բացառություններ կազմում են այն
                դեպքերը, երբ՝
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>ապրանքը անորակ է,</li>
                <li>առկա է թարմության խնդիր,</li>
                <li>պատվերը չի համապատասխանում կատարված պատվերին։</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Վերոնշյալ դեպքերում հաճախորդն իրավունք ունի պահանջելու ապրանքի
                փոխանակում կամ գումարի վերադարձ։
              </p>
            </section>

            <section className="mb-8 rounded-xl bg-amber-50 border border-amber-100 p-4 sm:p-6">
              <p className="text-gray-800 mb-0">
                <strong>Հատուկ նշում.</strong> Եթե ապրանքը վնասված է կամ առաքման
                ընթացքում առաջացած խնդիր կա, խնդրում ենք անհապաղ կապ հաստատել
                մեզ հետ, որպեսզի գտնենք լավագույն լուծումը։
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                Կապ
              </h2>
              <p className="text-gray-700 mb-4">
                Վերադարձի կամ փոխանակման հարցերով դիմեք.
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
            <Link href="/delivery" className="text-orange-500 hover:text-orange-600 font-medium">
              Առաքման քաղաքականություն →
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
