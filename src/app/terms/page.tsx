import Footer from '@/components/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Օգտագործման պայմաններ | norapat.am',
  description:
    'norapat.am կայքի օգտագործման պայմանները — ընդհանուր դրույթներ, պատասխանատվություն, մտավոր սեփականություն և վեճերի կարգավորում։',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <div className="h-16" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="px-4 pb-4 pt-6 sm:px-8 sm:pb-8 sm:pt-10 mb-20 lg:mb-16">
          <header className="mb-6 text-center">
            <h1 className="inline-block text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 pb-2.5 border-b-2 border-orange-500 max-w-full">
              <span className="block leading-snug">Օգտագործման</span>
              <span className="block leading-snug">Պայմաններ</span>
            </h1>
          </header>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                1. Ընդհանուր դրույթներ
              </h2>
              <p className="text-gray-700 mb-4">
                <strong>1.1.</strong> Այս Օգտագործման Պայմանները կարգավորում են
                norapat.am կայքի (այսուհետ՝ «Կայք») օգտագործումը։
              </p>
              <p className="text-gray-700 mb-4">
                <strong>1.2.</strong> Կայքը մուտք գործելով կամ օգտվելով Կայքի
                ծառայություններից՝ դուք ընդունում եք սույն պայմանները։
              </p>
              <p className="text-gray-700 mb-4">
                <strong>1.3.</strong> Եթե համաձայն չեք այս պայմաններից որևէ մեկի
                հետ, խնդրում ենք չօգտագործել Կայքը։
              </p>
              <p className="text-gray-700 mb-4">
                <strong>1.4.</strong> Կայքը իրավունք ունի փոփոխել սույն
                պայմանները առանց նախնական ծանուցման։ Փոփոխությունները ուժի մեջ
                են մտնում Կայքում հրապարակվելու պահից։
              </p>
              <p className="text-gray-700 mb-4">
                <strong>1.5.</strong> Օգտատիրոջ կողմից Կայքի շարունակական
                օգտագործումը համարվում է նոր պայմանների ընդունում։
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                2. Հիմնական հասկացություններ
              </h2>
              <p className="text-gray-700 mb-4">
                Այս պայմաններում օգտագործված հիմնական հասկացությունները
                հետևյալ են.
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>
                  Կայք – website url ինտերնետային հարթակը, որը տրամադրում է
                  ծառայություններ, բովանդակություն և այլ հնարավորություններ։
                </li>
                <li>
                  Օգտատեր – ֆիզիկական կամ իրավաբանական անձ, որը մուտք է
                  գործում Կայք կամ օգտվում է նրա ծառայություններից։
                </li>
                <li>
                  Ծառայություններ – Կայքի միջոցով առաջարկվող բոլոր ապրանքները,
                  ծառայությունները, տեղեկատվությունը և գործիքները։
                </li>
                <li>
                  Բովանդակություն – ցանկացած տեքստ, պատկեր, տեսանյութ,
                  ձայնագրություն կամ այլ նյութ, որը հասանելի է Կայքում։
                </li>
                <li>
                  Մտավոր Սեփականություն – Կայքի անվանումը, լոգոն, տեքստերը,
                  ծրագրային ապահովումը և այլ տարրեր, որոնք պաշտպանված են
                  հեղինակային իրավունքով կամ ապրանքանիշային իրավունքով։
                </li>
                <li>
                  Գործարք – Կայքում կատարվող ցանկացած գնում, ծառայության
                  գրանցում կամ այլ պայմանագրային համաձայնություն։
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                3. Օգտատերերի պատասխանատվությունները
              </h2>
              <p className="text-gray-700 mb-4">
                <strong>3.1.</strong> Օգտատերը պարտավորվում է՝
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Կայքն օգտագործել միայն օրինական նպատակներով։</li>
                <li>Չփորձել խափանել Կայքի տեխնիկական աշխատանքը։</li>
                <li>
                  Չփոխանցել վիրուսներ, վնասակար ծրագրեր կամ ցանկացած վնասակար
                  կոդ։
                </li>
                <li>
                  Չփորձել ձեռք բերել անօրինական մուտք Կայքի սերվերներին կամ
                  տվյալներին։
                </li>
                <li>
                  Չհրապարակել կամ տարածել անօրինական, վիրավորական, զրպարտիչ կամ
                  ատելություն պարունակող բովանդակություն։
                </li>
              </ul>
              <p className="text-gray-700 mb-4">
                <strong>3.2.</strong> Կայքը իրավունք ունի արգելափակել ցանկացած
                օգտատիրոջ, եթե նրա գործողությունները խախտում են սույն
                պայմանները։
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                4. Պատասխանատվության սահմանափակում
              </h2>
              <p className="text-gray-700 mb-4">
                <strong>4.1.</strong> Կայքը տրամադրվում է «ինչպես կա» սկզբունքով,
                առանց որևէ երաշխիքի։
              </p>
              <p className="text-gray-700 mb-4">
                <strong>4.2.</strong> Կայքը պատասխանատվություն չի կրում
                հետևյալ դեպքերում՝
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Կայքի հնարավոր սխալներ կամ տեխնիկական խափանումներ։</li>
                <li>
                  Օգտատիրոջ կողմից մուտքագրված սխալ կամ կեղծ տեղեկատվություն։
                </li>
                <li>
                  Երրորդ անձանց կողմից Կայքի օգտագործման արդյունքում առաջացած
                  վնասների համար։
                </li>
                <li>
                  Կայքի միջոցով տրամադրվող բովանդակության ճշգրտության,
                  հուսալիության կամ արդիականության համար։
                </li>
              </ul>
              <p className="text-gray-700 mb-4">
                <strong>4.3.</strong> Կայքը պատասխանատվություն չի կրում
                անկանխատեսելի վնասների, օրինակ՝ եկամուտի կորստի կամ տվյալների
                ոչնչացման համար։
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                5. Մտավոր սեփականություն
              </h2>
              <p className="text-gray-700 mb-4">
                <strong>5.1.</strong> Կայքի բոլոր նյութերը, ներառյալ տեքստերը,
                պատկերները, լոգոները, ծրագրային ապահովումը, պատկանում են
                Կայքին կամ դրա իրավատերերին։
              </p>
              <p className="text-gray-700 mb-4">
                <strong>5.2.</strong> Արգելվում է Կայքի բովանդակության
                պատճենահանումը, տարածումը, վաճառքը կամ օգտագործումը առանց Կայքի
                գրավոր թույլտվության։
              </p>
              <p className="text-gray-700 mb-4">
                <strong>5.3.</strong> Օգտատերը իրավունք չունի օգտագործել Կայքի
                ապրանքանիշը կամ դոմենային անունը առանց գրավոր թույլտվության։
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                6. Վճարումներ և վերադարձներ
              </h2>
              <p className="text-gray-700 mb-4">
                <strong>6.1.</strong> Եթե Կայքը տրամադրում է վճարովի
                ծառայություններ, ապա վճարումները կատարվում են նշված
                պայմաններով։
              </p>
              <p className="text-gray-700 mb-4">
                <strong>6.2.</strong> Կայքը կարող է փոխել գները կամ վճարման
                պայմանները առանց նախնական ծանուցման։
              </p>
              <p className="text-gray-700 mb-4">
                <strong>6.3.</strong> Եթե կիրառելի է, վերադարձի կամ փոխհատուցման
                պայմանները նշվում են Կայքում առանձին էջում։ Դիտե՛ք{' '}
                <Link
                  href="/refund"
                  className="text-orange-600 hover:text-orange-700 underline"
                >
                  Վերադարձի և փոխանակման քաղաքականություն
                </Link>
                ։
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                7. Վեճերի կարգավորում
              </h2>
              <p className="text-gray-700 mb-4">
                <strong>7.1.</strong> Այս պայմանները կարգավորվում են Հայաստանի
                Հանրապետության օրենսդրությամբ։
              </p>
              <p className="text-gray-700 mb-4">
                <strong>7.2.</strong> Բոլոր վեճերը նախ փորձում են լուծվել
                բանակցությունների միջոցով։
              </p>
              <p className="text-gray-700 mb-4">
                <strong>7.3.</strong> Եթե կողմերը չեն կարողանում համաձայնության
                գալ, վեճերը լուծվում են ՀՀ իրավասու դատարաններում։
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                8. Ֆորս-մաժոր
              </h2>
              <p className="text-gray-700 mb-4">
                <strong>8.1.</strong> Կայքը չի կրում պատասխանատվություն իր
                պարտավորությունները չկատարելու կամ ուշացնելու համար, եթե դա
                պայմանավորված է ֆորս-մաժորային հանգամանքներով, այդ թվում՝
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Բնական աղետներ (երկրաշարժ, ջրհեղեղ, հրդեհ և այլն)։</li>
                <li>Պետական մարմինների արգելող որոշումներ։</li>
                <li>
                  Ռազմական գործողություններ, ահաբեկչություն կամ զանգվածային
                  անկարգություններ։
                </li>
                <li>
                  Տեխնիկական խափանումներ, որոնք պայմանավորված չեն Կայքի
                  գործողություններով։
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                9. Գաղտնիություն և տվյալների պաշտպանություն
              </h2>
              <p className="text-gray-700 mb-4">
                <strong>9.1.</strong> Կայքը պարտավորվում է պահպանել
                օգտատերերի տվյալների գաղտնիությունը՝ համաձայն{' '}
                <Link
                  href="/privacy"
                  className="text-orange-600 hover:text-orange-700 underline"
                >
                  Գաղտնիության քաղաքականության
                </Link>
                ։
              </p>
              <p className="text-gray-700 mb-4">
                <strong>9.2.</strong> Կայքը կարող է հավաքել և մշակել
                օգտատերերի անձնական տվյալները օրինական նպատակներով։
              </p>
              <p className="text-gray-700 mb-4">
                <strong>9.3.</strong> Կայքը իրավունք ունի տրամադրել օգտատիրոջ
                տվյալները պետական մարմիններին՝ օրենքով նախատեսված դեպքերում։
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
