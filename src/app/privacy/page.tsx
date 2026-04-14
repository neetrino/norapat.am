import Footer from '@/components/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Գաղտնիության քաղաքականություն | norapat.am',
  description:
    'norapat.am կայքի գաղտնիության քաղաքականությունը — ինչպես ենք հավաքում, պահում և օգտագործում ձեր տվյալները։',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <div className="h-16" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="px-4 pb-4 pt-6 sm:px-8 sm:pb-8 sm:pt-10 mb-20 lg:mb-16">
          <header className="mb-6 text-center">
            <h1 className="inline-block text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 pb-2.5 border-b-2 border-orange-500 max-w-full">
              <span className="block leading-snug">Գաղտնիության</span>
              <span className="block leading-snug">Քաղաքականություն</span>
            </h1>
          </header>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <p className="text-gray-700 mb-4">
                Այցելելով norapat.am (այսուհետ՝ «Կայք») և կատարելով գնումներ, Դուք
                ավտոմատ կերպով տալիս եք Ձեր համաձայնությունը Ձեր անձնական
                տվյալների հավաքագրման, մշակման և օգտագործման համար։
              </p>
              <p className="text-gray-700 mb-4">
                «Անձնական տվյալներ» ասելով, մենք նկատի ունենք Ձեզ վերաբերող
                ցանկացած տեղեկություն, որը թույլ է տալիս կամ կարող է թույլ տալ
                ուղղակի կամ անուղղակի կերպով նույնականացնել Ձեր ինքնությունը,
                օրինակ՝ անուն, ազգանուն, հասցե, էլ. հասցե, հեռախոսահամար և այլ
                տվյալներ (այսուհետ՝ «Տվյալներ»)։
              </p>
              <p className="text-gray-700 mb-4">
                Սույն Գաղտնիության քաղաքականության համատեքստում «մենք», «մեզ»,
                «մեր» դերանունները վերաբերում են Կայքին (մեր մասին առավել
                մանրամասն տեղեկության համար կարող եք այցելել{' '}
                <Link href="/about" className="text-orange-600 hover:text-orange-700 underline">
                  «Մեր մասին»
                </Link>{' '}
                բաժին), իսկ «Դուք», «Ձեզ», «Ձեր» դերանունները վերաբերում են
                ցանկացած անձի, որն այցելել է Կայք կամ օգտվում է մեր
                ծառայություններից։
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                1. Հավաքագրվող Տվյալները
              </h2>
              <p className="text-gray-700 mb-4">
                Մենք կարող ենք հավաքագրել հետևյալ տեղեկությունները.
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>
                  Կոնտակտային տվյալներ – անուն, ազգանուն, հասցե, հեռախոսահամար,
                  էլ. հասցե
                </li>
                <li>
                  Գնումների մասին տվյալներ – գնվող ապրանքներ, վճարման մեթոդներ
                </li>
                <li>
                  Տեխնիկական տվյալներ – սարքի տեսակը, բրաուզեր, օպերացիոն
                  համակարգ
                </li>
                <li>
                  Քուքիներ և թրեքինգ տեխնոլոգիաներ – կայքի օգտագործման
                  վերլուծության համար
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                2. Տվյալների Օգտագործում
              </h2>
              <p className="text-gray-700 mb-4">
                Հավաքագրված տվյալները երբեք չեն վաճառվում կամ տրամադրվում
                երրորդ կողմերի մարքեթինգային նպատակներով։ Դրանք օգտագործվում են
                միայն՝
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Պատվերների մշակման և առաքման նպատակով,</li>
                <li>Օգտատերերին աջակցություն տրամադրելու համար,</li>
                <li>Կայքի ֆունկցիոնալությունը բարելավելու համար,</li>
                <li>Օրենքի պահանջներին համապատասխանելու համար։</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                3. Տվյալների Պահպանման Ժամկետներ
              </h2>
              <p className="text-gray-700 mb-4">
                Ձեր անձնական տվյալները պահվում են հետևյալ կերպ՝
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>
                  Օգտատերերի հաշվի տվյալները՝ հաշվի ակտիվ լինելու ողջ
                  ընթացքում,
                </li>
                <li>
                  Գնումների պատմությունը՝ 5 տարի (հարկային ու հաշվապահական
                  պահանջներին համապատասխանելու համար),
                </li>
                <li>
                  Մարկետինգային նպատակների համար պահվող տվյալները՝ 2 տարի կամ
                  մինչև օգտատերը հրաժարվի։
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                4. Տվյալների Ապահովություն
              </h2>
              <p className="text-gray-700 mb-4">
                Մենք կիրառում ենք համապատասխան տեխնիկական և կազմակերպչական
                միջոցառումներ Ձեր տվյալների պաշտպանությունն ապահովելու համար,
                այդ թվում՝
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>
                  SSL կոդավորում՝ վճարային և անձնական տվյալների պաշտպանված
                  փոխանցման համար
                </li>
                <li>
                  Մուտքի վերահսկում՝ սահմանափակ հասանելիություն անձնական
                  տվյալներին
                </li>
                <li>
                  Կանոնավոր ստուգումներ՝ անվտանգության հնարավոր խոցելիությունների
                  հայտնաբերման համար
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                5. Տվյալների Կիսում Երրորդ Կողմերի Հետ
              </h2>
              <p className="text-gray-700 mb-4">
                Մենք չենք վաճառում կամ տրամադրում Ձեր տվյալները երրորդ
                կողմերին, բացառությամբ՝
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>
                  Առաքման ծառայություններ – որպեսզի պատվերը տեղ հասնի ճիշտ
                  հասցեով
                </li>
                <li>
                  Վճարային համակարգեր – վճարումների անվտանգ մշակման համար
                </li>
                <li>
                  Իրավապահ մարմիններ – օրենքով սահմանված պահանջների դեպքում
                </li>
              </ul>
              <p className="text-gray-700 mb-4">
                Բոլոր երրորդ կողմերը պարտավորվում են պաշտպանել Ձեր տվյալները և
                չեն կարող դրանք օգտագործել այլ նպատակների համար։
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                6. Օգտատերերի Իրավունքներ
              </h2>
              <p className="text-gray-700 mb-4">Դուք իրավունք ունեք՝</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Ստանալ Ձեր անձնական տվյալների պատճենը,</li>
                <li>
                  Խմբագրել կամ հեռացնել Ձեր տվյալները (մեր կայքի կարգավորումների
                  կամ մեր հաճախորդների սպասարկման միջոցով),
                </li>
                <li>
                  Հրաժարվել շուկայավարման նամակներից՝ օգտագործելով յուրաքանչյուր
                  նամակի մեջ առկա &apos;unsubscribe&apos; հղումը,
                </li>
                <li>
                  Պահանջել, որ Ձեր տվյալները չմշակվեն որոշակի նպատակներով,
                  բացառությամբ օրենսդրությամբ պահանջվող դեպքերի։
                </li>
              </ul>
            </section>

            <section className="mb-8" id="cookies">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                7. Քուքիների (Cookies) Օգտագործում
              </h2>
              <p className="text-gray-700 mb-4">
                Մեր կայքը օգտագործում է քուքիներ՝ օգտատերերի փորձն
                օպտիմալացնելու համար։ Մենք օգտագործում ենք՝
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Ֆունկցիոնալ քուքիներ՝ կայքի ճիշտ աշխատելու համար,</li>
                <li>
                  Վերլուծական քուքիներ՝ օգտատերերի վարքագիծը հասկանալու և կայքի
                  բարելավման նպատակով,
                </li>
                <li>
                  Մարքեթինգային քուքիներ (միայն ձեր համաձայնությամբ)՝ ավելի
                  համապատասխան գովազդներ տրամադրելու համար։
                </li>
              </ul>
              <p className="text-gray-700 mb-4">
                Դուք կարող եք ցանկացած պահի փոխել ձեր նախընտրությունները՝
                կարգավորելով քուքիները ձեր բրաուզերի միջոցով կամ այցելելով մեր
                Քուքիների կառավարման կենտրոն (եթե ունեք հատուկ էջ քուքիները
                կառավարելու համար)։
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                8. Քաղաքականության Փոփոխություններ
              </h2>
              <p className="text-gray-700 mb-4">
                Մենք իրավասու ենք, օրենքով թույլատրելի, փոփոխություններ կատարել
                այս էջում և վերոհիշյալ կետերում, որի փոփոխությունների մասին
                կտեղեկացնենք Կայքում։
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
