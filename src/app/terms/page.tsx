import Footer from '@/components/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Օգտագործման պայմաններ | Pideh Armenia',
  description:
    'Pideh Armenia-ի օգտագործման պայմանները — պատվերներ, առաքում, վճարումներ և այլ կարևոր տեղեկություններ։',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-16" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 mb-20 lg:mb-16">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
              Օգտագործման պայմաններ
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
                Այս Օգտագործման պայմանները կարգավորում են այս կայքի ադմինիստրացիայի (այսուհետև — «Կազմակերպություն») 
                և կայքի օգտվողների (այսուհետև — «Օգտվող») միջև հարաբերությունները։
              </p>
              <p className="text-gray-700 mb-4">
                Օգտագործելով այս կայքը՝ դուք համաձայնում եք այս պայմաններին։ Եթե դուք 
                չեք համաձայն որևէ պայմանի հետ, խնդրում ենք չօգտագործել այս կայքը։
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                2. Ծառայությունների նկարագրություն
              </h2>
              <p className="text-gray-700 mb-4">
                Այս կայքը տրամադրում է հետևյալ ծառայությունները.
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Ապրանքների ինտերնետ-խանութ</li>
                <li>Ապրանքների առցանց պատվերում և վճարում</li>
                <li>Պատվերների առաքում նշված հասցեով</li>
                <li>Տեղեկատվական ծառայություններ ապրանքների և ակցիաների մասին</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                3. Գրանցում և հաշիվ
              </h2>
              <p className="text-gray-700 mb-4">
                Պատվերներ ձևակերպելու համար անհրաժեշտ է հաշիվ ստեղծել։ Գրանցվելիս դուք 
                պարտավորվում եք.
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Տրամադրել ճշմարիտ տեղեկություն</li>
                <li>Պահպանել տվյալների արդիականությունը</li>
                <li>Հաշվի անվտանգության համար պատասխանատվություն կրել</li>
                <li>Անմիջապես տեղեկացնել անարդյունավետ մուտքի մասին</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                4. Պատվերներ և վճարում
              </h2>
              <p className="text-gray-700 mb-4">
                Պատվեր ձևակերպելիս դուք համաձայնում եք.
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Վճարել պատվերը ամբողջությամբ</li>
                <li>Տրամադրել ճիշտ առաքման հասցե</li>
                <li>Հասանելի լինել կապի համար նշված ժամանակին</li>
                <li>Ընդունել պատվերը առաքման ժամանակ</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Վճարումն իրականացվում է կանխիկ ստացման ժամանակ կամ բանկային քարտով (ArCa, Visa, Mastercard)։
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                5. Առաքում
              </h2>
              <p className="text-gray-700 mb-4">
                Առաքման պայմաններ.
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Առաքման ժամանակ՝ 20–30 րոպե (պատվեր 21:00-ից առաջ)</li>
                <li>Պատվերի նվազագույն գումար՝ 2000 դրամ</li>
                <li>Առաքման արժեք՝ 500 դրամ</li>
                <li>Անվճար առաքում 5000 դրամից բարձր պատվերների դեպքում</li>
                <li>Առաքման տարածք՝ Երևան և արվարձաններ</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Մանրամասների համար տե՛ս <Link href="/delivery" className="text-orange-500 hover:text-orange-600 font-medium">Առաքման քաղաքականություն</Link>։
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                6. Վերադարձ և փոխարինում
              </h2>
              <p className="text-gray-700 mb-4">
                Ապրանքի վերադարձ հնարավոր է հետևյալ դեպքերում.
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Ապրանքը չի համապատասխանում պատվերին</li>
                <li>Ապրանքը վնասվել է տեղափոխման ընթացքում</li>
                <li>Ապրանքի որակը չի համապատասխանում հայտարարվածին</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Վերադարձը պետք է իրականացվի պատվերը ստանալուց ոչ ուշ քան 1 ժամ հետո։
              </p>
              <p className="text-gray-700 mb-4">
                Մանրամասների համար տե՛ս <Link href="/refund" className="text-orange-500 hover:text-orange-600 font-medium">Վերադարձի քաղաքականություն</Link>։
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                7. Պատասխանատվություն
              </h2>
              <p className="text-gray-700 mb-4">
                Կազմակերպությունը պատասխանատվություն չի կրում.
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Առաքման ուշացումների համար՝ Կազմակերպությունից անկախ պատճառներով</li>
                <li>Մենյուի կամ ապրանքների ժամանակավոր բացակայության փոփոխությունների համար</li>
                <li>Կայքի տեխնիկական խափանումների համար</li>
                <li>Երրորդ կողմերի գործողությունների համար</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                8. Մտավոր սեփականություն
              </h2>
              <p className="text-gray-700 mb-4">
                Կայքի բոլոր նյութերը (տեքստեր, պատկերներ, դիզայն) կազմակերպության 
                մտավոր սեփականություն են և պաշտպանված են հեղինակային իրավունքով։
              </p>
              <p className="text-gray-700 mb-4">
                Անթույլ է նյութերի պատճենումը, բաշխումը կամ օգտագործումը 
                Կազմակերպության գրավոր թույլտվությունից առանց։
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                9. Պայմանների փոփոխություններ
              </h2>
              <p className="text-gray-700 mb-4">
                Կազմակերպությունը իրավունք է պահպանում փոփոխել այս պայմանները ցանկացած ժամանակ։ 
                Կարևոր փոփոխությունների մասին օգտվողներին կտեղեկացվեն կայքի կամ 
                էլ․ փոստի միջոցով։
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                10. Կապի տվյալներ
              </h2>
              <p className="text-gray-700 mb-4">
                Օգտագործման պայմանների հետ կապված հարցերի համար դիմեք.
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
