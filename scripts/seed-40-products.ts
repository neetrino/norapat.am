/**
 * Ս크րիպտ: ջնջել բոլոր արտադրանքները և ստեղծել 40 նոր ամբողջական տվյալներով։
 * Գործարկում: pnpm exec tsx scripts/seed-40-products.ts
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type ProductStatus = 'REGULAR' | 'HIT' | 'NEW' | 'CLASSIC' | 'BANNER'

interface ProductInput {
  name: string
  shortDescription: string
  description: string
  price: number
  originalPrice?: number
  image: string
  images: string[]
  category: string
  ingredients: string[]
  status: ProductStatus
  isAvailable: boolean
}

const PRODUCTS: ProductInput[] = [
  // Պիդե (1-15)
  {
    name: 'Երկու մսային պիդե',
    shortDescription: 'Հյութալի պիդե երկու տեսակի մսով և թարմ բանջարեղենով։',
    description: 'Ավանդական հայկական պիդե ընտիր երկու տեսակի մսից, կանաչ պղպեղից և չերրի լոլիկից։ Իդեալական համադրություն պանրի և թարմ կանաչու հետ։ Թխվում է փայտով բուխարում ոսկեգույն փխրուն կեղևով։ Մատուցում 2-3 հոգու համար։',
    price: 950,
    originalPrice: 1100,
    image: '/images/2-myasa-pide-Photoroom.png',
    images: ['/images/2-myasa-pide-Photoroom.png', '/images/pepperoni-pide-Photoroom.png', '/images/pide-s-basturmoj-Photoroom.png'],
    category: 'Պիդե',
    ingredients: ['Խմոր', '2 տեսակ միս', 'Կանաչ պղպեղ', 'Չերրի լոլիկ', 'Պանիր'],
    status: 'HIT',
    isAvailable: true,
  },
  {
    name: 'Պեպերոնի պիդե',
    shortDescription: 'Կծու պիդե պեպերոնիով և պանրով։',
    description: 'Դասական պիդե կծու պեպերոնիով, հալված պանրով և կանաչ պղպեղով։ Կրակ և նրբություն յուրաքանչյուր պատառի մեջ։ Կատարյալ կծու ճաշատեսակների սիրահարների համար։ Թխվում է ավանդական փայտով բուխարում։',
    price: 950,
    image: '/images/pepperoni-pide-Photoroom.png',
    images: ['/images/pepperoni-pide-Photoroom.png', '/images/2-myasa-pide-Photoroom.png', '/images/pide-s-bekonom-Photoroom.png'],
    category: 'Պիդե',
    ingredients: ['Խմոր', 'Պեպերոնի', 'Պանիր', 'Կանաչ պղպեղ'],
    status: 'HIT',
    isAvailable: true,
  },
  {
    name: 'Պիդե բաստուրմայով',
    shortDescription: 'Հեղինակային պիդե հայկական բաստուրմայով։',
    description: 'Անհատական համադրություն ավանդական պիդեի և հայտնի հայկական բաստուրմայի։ Չորացած միսն արցունոտ համեմունքներով, պանիրը և կանաչ պղպեղը ստեղծում են անմոռանալի համ։ Մեր ֆիրմային ճաշատեսակը։',
    price: 950,
    image: '/images/pide-s-basturmoj-Photoroom.png',
    images: ['/images/pide-s-basturmoj-Photoroom.png', '/images/pepperoni-pide-Photoroom.png', '/images/pide-s-govyadinoj-Photoroom.png'],
    category: 'Պիդե',
    ingredients: ['Խմոր', 'Բաստուրմա', 'Պանիր', 'Կանաչ պղպեղ'],
    status: 'CLASSIC',
    isAvailable: true,
  },
  {
    name: 'Պիդե բեկոնով',
    shortDescription: 'Խճճված բեկոն պանրով և վարունգով։',
    description: 'Պիդե խճճված բեկոնով, հալված պանրով և թթու վարունգով։ Թեթև քաղցր-աղի համադրություն բեկոնի ծխահամով։ Գերազանց ընտրություն սննդատար ճաշի կամ ընթրիքի համար։',
    price: 950,
    originalPrice: 1050,
    image: '/images/pide-s-bekonom-Photoroom.png',
    images: ['/images/pide-s-bekonom-Photoroom.png', '/images/pide-hot-dog-Photoroom.png', '/images/2-myasa-pide-Photoroom.png'],
    category: 'Պիդե',
    ingredients: ['Խմոր', 'Բեկոն', 'Պանիր', 'Թթու վարունգ'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Պիդե տավարի մսով',
    shortDescription: 'Իսկական մսային պիդե տավարի ֆարշով։',
    description: 'Պիդե ընտիր տավարի ֆարշով, թարմ կանաչիով և չերրի լոլիկով։ Դասական մսային համադրություն, որը կհամոզի բոլոր մսասիրողներին։ Պատրաստվում է թարմ բաղադրիչներից՝ առանց կոնսերվանտների։',
    price: 950,
    image: '/images/pide-s-govyadinoj-Photoroom.png',
    images: ['/images/pide-s-govyadinoj-Photoroom.png', '/images/pide-s-basturmoj-Photoroom.png', '/images/pepperoni-pide-Photoroom.png'],
    category: 'Պիդե',
    ingredients: ['Խմոր', 'Տավարի ֆարշ', 'Կանաչի', 'Չերրի լոլիկ', 'Պանիր'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Դասական պանրով պիդե',
    shortDescription: 'Ավանդական պիդե պանրով և լոլիկով։',
    description: 'Ավանդական պիդե հալված պանրով և չերրի լոլիկով։ Մինիմալիզմ և համի կատարելություն։ Իդեալական բուսակերների և նրբագույն պանրային ճաշատեսակների սիրահարների համար։ Պարզ և նրբագեղ դասականություն։',
    price: 700,
    image: '/images/classic-chees-Photoroom.png',
    images: ['/images/classic-chees-Photoroom.png', '/images/caucasus-cheese-Photoroom.png', '/images/ovoshchnoe-pide-Photoroom.png'],
    category: 'Պիդե',
    ingredients: ['Խմոր', 'Պանիր', 'Չերրի լոլիկ'],
    status: 'CLASSIC',
    isAvailable: true,
  },
  {
    name: 'Կովկասյան պիդե',
    shortDescription: 'Պիդե սպիտակ պանրով և չերրի լոլիկով։',
    description: 'Պիդե կովկասյան ոճով սպիտակ աղաջրային պանրով, թարմ կանաչիով և չերրի լոլիկով։ Թեթև և զովացնող համ։ Գերազանց հարմար տաք օրվա համար։',
    price: 750,
    image: '/images/caucasus-cheese-Photoroom.png',
    images: ['/images/caucasus-cheese-Photoroom.png', '/images/classic-chees-Photoroom.png', '/images/pide-s-phali-Photoroom.png'],
    category: 'Պիդե',
    ingredients: ['Խմոր', 'Սպիտակ պանիր', 'Կանաչի', 'Չերրի լոլիկ'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Սնկով պիդե',
    shortDescription: 'Պիդե տապակած սնկով և կանաչիով։',
    description: 'Պիդե արցունոտ տապակած սնկով, թարմ կանաչիով և պանրով։ Բուսակերական տարբերակ հագեցած անտառային համով։ Սնկերը տապակվում են ոսկեգույն խորշոմի մինչև թխելը։',
    price: 750,
    image: '/images/gribnoe-pide-Photoroom.png',
    images: ['/images/gribnoe-pide-Photoroom.png', '/images/ovoshchnoe-pide-Photoroom.png', '/images/shpinat-Photoroom.png'],
    category: 'Պիդե',
    ingredients: ['Խմոր', 'Տապակած սունկ', 'Կանաչի', 'Պանիր'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Բանջարեղենով պիդե',
    shortDescription: 'Պիդե սնկով, սոխով և լոլիկով։',
    description: 'Թարմ բանջարեղենով պիդե սնկով, կանաչ սոխով և չերրի լոլիկով։ Թեթև բուսակերական տարբերակ։ Իդեալական առողջ սննդի համար։',
    price: 800,
    image: '/images/ovoshchnoe-pide-Photoroom.png',
    images: ['/images/ovoshchnoe-pide-Photoroom.png', '/images/gribnoe-pide-Photoroom.png', '/images/pide-s-phali-Photoroom.png'],
    category: 'Պիդե',
    ingredients: ['Խմոր', 'Սունկ', 'Կանաչ սոխ', 'Չերրի լոլիկ', 'Պանիր'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Սպանախով պիդե',
    shortDescription: 'Պիդե սպանախով, պանրով և լոլիկով։',
    description: 'Պիդե թարմ սպանախով, պանրով և չերրի լոլիկով։ Օգտակար և համեղ։ Սպանախը հարուստ է երկաթով և վիտամիններով։ Հարմար առողջ ապրելակերպի համար։',
    price: 900,
    image: '/images/shpinat-Photoroom.png',
    images: ['/images/shpinat-Photoroom.png', '/images/ovoshchnoe-pide-Photoroom.png', '/images/gribnoe-pide-Photoroom.png'],
    category: 'Պիդե',
    ingredients: ['Խմոր', 'Սպանախ', 'Պանիր', 'Չերրի լոլիկ'],
    status: 'NEW',
    isAvailable: true,
  },
  {
    name: 'Հավի թեթև պիդե',
    shortDescription: 'Թեթև պիդե հավով և բանջարեղենով։',
    description: 'Պիդե նրբագույն հավով, քաղցր պղպեղով և չերրի լոլիկով։ Թեթև և դիետիկ տարբերակ։ Գերազանց հարմար այն մարդկանց համար, ովքեր հսկում են իրենց կազմվածքը։',
    price: 800,
    image: '/images/kurinye-legkie-pide-Photoroom.png',
    images: ['/images/kurinye-legkie-pide-Photoroom.png', '/images/pide-s-govyadinoj-Photoroom.png', '/images/pepperoni-pide-Photoroom.png'],
    category: 'Պիդե',
    ingredients: ['Խմոր', 'Հավ', 'Քաղցր պղպեղ', 'Չերրի լոլիկ', 'Պանիր'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Պիդե փխալիով',
    shortDescription: 'Պիդե վրացական բանջարեղենային փխալի մածուկով։',
    description: 'Պիդե վրացական փխալի բանջարեղենային մածուկով և արցունոտ ղանձլակով։ Անհատական համադրություն հայկական և վրացական խոհանոցների։ Անսովոր համերի սիրահարների համար։',
    price: 700,
    image: '/images/pide-s-phali-Photoroom.png',
    images: ['/images/pide-s-phali-Photoroom.png', '/images/caucasus-cheese-Photoroom.png', '/images/ovoshchnoe-pide-Photoroom.png'],
    category: 'Պիդե',
    ingredients: ['Խմոր', 'Փխալի', 'Ղանձլակ', 'Պանիր'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Պիդե Հոթ Դոգ',
    shortDescription: 'Պիդե եռլիկով և պանրով։',
    description: 'Պիդե հյութալի եռլիկով, պանրով և թթու վարունգով։ Մանկական ֆավորիտ և արագ նախաճաշ։ Իդեալական պիկնիկի համար։',
    price: 700,
    image: '/images/pide-hot-dog-Photoroom.png',
    images: ['/images/pide-hot-dog-Photoroom.png', '/images/pide-s-bekonom-Photoroom.png', '/images/classic-chees-Photoroom.png'],
    category: 'Պիդե',
    ingredients: ['Խմոր', 'Եռլիկ', 'Պանիր', 'Թթու վարունգ'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Պիդե Blue Pear',
    shortDescription: 'Աղանդերային պիդե տանձով։',
    description: 'Պիդե տանձով և թեթև սոուսով։ Անսովոր աղանդերային տարբերակ։ Քաղցր և ճաշատեսակային համադրություն փորձարկումների սիրահարների համար։',
    price: 700,
    image: '/images/pide-blue-pear-Photoroom.png',
    images: ['/images/pide-blue-pear-Photoroom.png', '/images/sladkiy-pide-Photoroom.png', '/images/classic-chees-Photoroom.png'],
    category: 'Պիդե',
    ingredients: ['Խմոր', 'Տանձ', 'Թեթև սոուս', 'Պանիր'],
    status: 'NEW',
    isAvailable: true,
  },
  {
    name: 'Քաղցր պիդե',
    shortDescription: 'Աղանդերային պիդե շոկոլադով։',
    description: 'Աղանդերային պիդե շոկոլադե քաղցրավենիքով և քաղցր սոուսով։ Իդեալական ավարտում է ճաշը։ Սիրելի քաղցրուտ մանկանց և քաղցրասերների համար։',
    price: 750,
    image: '/images/sladkiy-pide-Photoroom.png',
    images: ['/images/sladkiy-pide-Photoroom.png', '/images/pide-blue-pear-Photoroom.png', '/images/classic-chees-Photoroom.png'],
    category: 'Պիդե',
    ingredients: ['Խմոր', 'Շոկոլադե քաղցրավենիք', 'Քաղցր սոուս'],
    status: 'REGULAR',
    isAvailable: true,
  },
  // Կոմբո (16-20)
  {
    name: 'Կոմբո «Ես մենակ»',
    shortDescription: 'Պիդե բեկոնով, ֆրի և ըմպելիքով։',
    description: 'Իդեալական ճաշ մեկի համար՝ պիդե բեկոնով, կարտոֆիլ ֆրիի չափաբաժին և ընտրված Թան ըմպելիք։ Ամեն ինչ անհրաժեշտ սննդատար նախաճաշի համար։',
    price: 1700,
    image: '/images/kombo-ya-odin-Photoroom.png',
    images: ['/images/kombo-ya-odin-Photoroom.png', '/images/kombo-my-vdvoyom-Photoroom.png', '/images/pide-s-bekonom-Photoroom.png'],
    category: 'Կոմբո',
    ingredients: ['Պիդե բեկոնով', 'Կարտոֆիլ ֆրի', 'Թան ըմպելիք'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Կոմբո «Երկուսով»',
    shortDescription: '2 պիդե և 2 ըմպելիք երկուսի համար։',
    description: 'Կոմբո երկուսի համար՝ երկու պիդե (պեպերոնի և 2 միս) և երկու Թան ըմպելիք։ Իդեալական ռոմանտիկ ընթրիքի կամ ընկերական հանդիպման համար։',
    price: 2900,
    originalPrice: 3200,
    image: '/images/kombo-my-vdvoyom-Photoroom.png',
    images: ['/images/kombo-my-vdvoyom-Photoroom.png', '/images/kombo-my-golodny-Photoroom.png', '/images/pepperoni-pide-Photoroom.png'],
    category: 'Կոմբո',
    ingredients: ['Պեպերոնի պիդե', 'Երկու մսային պիդե', '2 Թան ըմպելիք'],
    status: 'HIT',
    isAvailable: true,
  },
  {
    name: 'Կոմբո «Սոված ենք»',
    shortDescription: 'Մեծ կոմբո ընկերության համար։',
    description: 'Խոշոր կոմբո՝ 2 պիդե բաստուրմայով, 2 հավի թեթև պիդե, կարտոֆիլ ֆրի և Կոկա-Կոլա։ Նրանց համար, ովքեր իսկապես սոված են։ Բավական 3–4 անձի համար։',
    price: 4900,
    image: '/images/kombo-my-golodny-Photoroom.png',
    images: ['/images/kombo-my-golodny-Photoroom.png', '/images/kombo-my-ochen-golodny-Photoroom.png', '/images/kombo-my-vdvoyom-Photoroom.png'],
    category: 'Կոմբո',
    ingredients: ['2 պիդե բաստուրմայով', '2 հավի թեթև պիդե', 'Կարտոֆիլ ֆրի', 'Կոկա-Կոլա'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Կոմբո «Շատ սոված ենք»',
    shortDescription: 'Առավելագույն կոմբո մեծ ընկերության համար։',
    description: 'Առավելագույն կոմբո՝ 4 պեպերոնի պիդե, 4 դասական պանրով պիդե, կարտոֆիլ ֆրի և հավի փոփքորն։ Խնջույքի կամ մեծ ընտանեկան ընթրիքի համար։ 6–8 չափաբաժին։',
    price: 7900,
    originalPrice: 8500,
    image: '/images/kombo-my-ochen-golodny-Photoroom.png',
    images: ['/images/kombo-my-ochen-golodny-Photoroom.png', '/images/kombo-my-golodny-Photoroom.png', '/images/kurinyy-popkorn-Photoroom.png'],
    category: 'Կոմբո',
    ingredients: ['4 պեպերոնի պիդե', '4 դասական պանրով պիդե', 'Կարտոֆիլ ֆրի', 'Հավի փոփքորն'],
    status: 'HIT',
    isAvailable: true,
  },
  // Սնաք (21-24)
  {
    name: 'Կարտոֆիլ ֆրի',
    shortDescription: 'Խճճված կարտոֆիլ ֆրի։',
    description: 'Դասական խճճված կարտոֆիլ ֆրի, պատրաստված ընտիր կարտոֆիլից։ Ոսկեգույն խորշոմ դրսից և նրբագույն միջուկ ներսից։ Իդեալական լրացում պիդեի համար։',
    price: 500,
    image: '/images/kartofel-fri-Photoroom.png',
    images: ['/images/kartofel-fri-Photoroom.png', '/images/kurinyy-popkorn-Photoroom.png', '/images/kombo-ya-odin-Photoroom.png'],
    category: 'Սնաք',
    ingredients: ['Կարտոֆիլ', 'Յուղ', 'Աղ'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Հավի նագեթս',
    shortDescription: 'Հավի նագեթս 6 հատ։',
    description: 'Խճճված հավի նագեթս հացի փշրանքով, 6 հատ։ Իդեալական նախուտեստ մանկանց և մեծահասակների համար։ Մատուցվում է ընտրված սոուսով։',
    price: 550,
    image: '/images/kurinyy-popkorn-Photoroom.png',
    images: ['/images/kurinyy-popkorn-Photoroom.png', '/images/kartofel-fri-Photoroom.png', '/images/BBQ-sauce-Pideh-Photoroom.png'],
    category: 'Սնաք',
    ingredients: ['Հավ', 'Հացի փշրանք', 'Յուղ'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Հավի փոփքորն',
    shortDescription: 'Խճճված հավի նագեթս։',
    description: 'Խճճված հավի կտորներ հացի փշրանքով։ Իդեալական նախուտեստ գարեջրի կամ ըմպելիքների հետ։ Պատրաստվում է ֆրիտյուրում մինչև ոսկեգույն խորշոմ։',
    price: 600,
    image: '/images/kurinyy-popkorn-Photoroom.png',
    images: ['/images/kurinyy-popkorn-Photoroom.png', '/images/kartofel-fri-Photoroom.png', '/images/kombo-my-ochen-golodny-Photoroom.png'],
    category: 'Սնաք',
    ingredients: ['Հավ', 'Հացի փշրանք', 'Համեմունքներ'],
    status: 'REGULAR',
    isAvailable: true,
  },
  // Սոուսներ (25-34)
  {
    name: 'Կետչուպ',
    shortDescription: 'Դասական լոլիկի կետչուպ։',
    description: 'Դասական լոլիկի կետչուպ քաղցրության և թթվության իդեալական հավասարակշռությամբ։ Գերազանց լրացնում է պիդեն, կարտոֆիլ ֆրին և նագեթսները։ Մատուցվում է չափաբաժնային փաթեթում։',
    price: 300,
    image: '/images/Ketchup-Pideh-Photoroom.png',
    images: ['/images/Ketchup-Pideh-Photoroom.png', '/images/BBQ-sauce-Pideh-Photoroom.png', '/images/Mayonnaise-Pideh-Photoroom.png'],
    category: 'Սոուսներ',
    ingredients: ['Լոլիկի մածուկ', 'Շաքար', 'Քացախ', 'Համեմունքներ'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Մայոնեզ',
    shortDescription: 'Դասական մայոնեզ։',
    description: 'Դասական տնային մայոնեզ։ Նրբագույն և օդային։ Իդեալական պիդեի, կարտոֆիլ ֆրիի և աղցանների համար։',
    price: 300,
    image: '/images/Mayonnaise-Pideh-Photoroom.png',
    images: ['/images/Mayonnaise-Pideh-Photoroom.png', '/images/Garlic-sauce-Pideh-Photoroom.png', '/images/Cocktail-sauce-Pideh-Photoroom.png'],
    category: 'Սոուսներ',
    ingredients: ['Ձվի դեղնուց', 'Յուղ', 'Քացախ', 'Մոստարդ'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Սխտորով սոուս',
    shortDescription: 'Արցունոտ սխտորով սոուս։',
    description: 'Արցունոտ սխտորով սոուս կանաչիով և կիտրոնի հյութով։ Իդեալական պիդեի և մսի համար։ Պատրաստված թարմ սխտորից։',
    price: 300,
    image: '/images/Garlic-sauce-Pideh-Photoroom.png',
    images: ['/images/Garlic-sauce-Pideh-Photoroom.png', '/images/Mayonnaise-Pideh-Photoroom.png', '/images/Mustard-sauce-Pideh-Photoroom.png'],
    category: 'Սոուսներ',
    ingredients: ['Սխտոր', 'Մայոնեզ', 'Կանաչի', 'Կիտրոնի հյութ'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Բարբեքյու սոուս',
    shortDescription: 'Ճաշատեսակային բարբեքյու սոուս։',
    description: 'Ճաշատեսակային բարբեքյու սոուս ծխահամով։ Իդեալական մսի, պիդեի և կարտոֆիլ ֆրիի համար։ Թեթև քաղցր-կծու համ։',
    price: 300,
    image: '/images/BBQ-sauce-Pideh-Photoroom.png',
    images: ['/images/BBQ-sauce-Pideh-Photoroom.png', '/images/Ketchup-Pideh-Photoroom.png', '/images/Cocktail-sauce-Pideh-Photoroom.png'],
    category: 'Սոուսներ',
    ingredients: ['Լոլիկի մածուկ', 'Շաքար', 'Քացախ', 'Համեմունքներ'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Մոստարդ',
    shortDescription: 'Կծու մոստարդ։',
    description: 'Կծու մոստարդ ընտիր հատիկներից։ Կավելացնի ճաշատեսակայնություն ցանկացած ճաշատեսակի։ Դասական զուգորդում մսի և պիդեի հետ։',
    price: 300,
    image: '/images/Mustard-sauce-Pideh-Photoroom.png',
    images: ['/images/Mustard-sauce-Pideh-Photoroom.png', '/images/Garlic-sauce-Pideh-Photoroom.png', '/images/Ketchup-Pideh-Photoroom.png'],
    category: 'Սոուսներ',
    ingredients: ['Մոստարդի հատիկներ', 'Քացախ', 'Աղ', 'Համեմունքներ'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Կոկտեյլ սոուս',
    shortDescription: 'Դասական կոկտեյլ սոուս։',
    description: 'Դասական կոկտեյլ սոուս մայոնեզի և կետչուպի հիմքով։ Նրբագույն համ կոնյակի նոտայով։ Իդեալական ծովամթերքի և հավի համար։',
    price: 300,
    image: '/images/Cocktail-sauce-Pideh-Photoroom.png',
    images: ['/images/Cocktail-sauce-Pideh-Photoroom.png', '/images/Mayonnaise-Pideh-Photoroom.png', '/images/BBQ-sauce-Pideh-Photoroom.png'],
    category: 'Սոուսներ',
    ingredients: ['Մայոնեզ', 'Կետչուպ', 'Կոնյակ', 'Համեմունքներ'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Պիդե ձվածրով',
    shortDescription: 'Պիդե ձվածրով, պանրով և բանջարեղենով։',
    description: 'Պիդե նրբագույն ձվածրով, հալված պանրով և թարմ բանջարեղենով։ Դասական համադրություն ամբողջ ընտանիքի համար։ Պատրաստվում է փայտով բուխարում։',
    price: 850,
    image: '/images/pide-s-bekonom-Photoroom.png',
    images: ['/images/pide-s-bekonom-Photoroom.png', '/images/classic-chees-Photoroom.png', '/images/pepperoni-pide-Photoroom.png'],
    category: 'Պիդե',
    ingredients: ['Խմոր', 'Ձվածիր', 'Պանիր', 'Բանջարեղեն'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Մսային ասսորտի պիդե',
    shortDescription: 'Պիդե երեք տեսակի մսով։',
    description: 'Տոնական պիդե երեք տեսակի մսի ասսորտիով՝ տավարի միս, ոչխարի միս և հավ։ Իսկական մսասիրողների համար։ Առատ չափաբաժին պանրով և կանաչիով։',
    price: 1200,
    originalPrice: 1350,
    image: '/images/2-myasa-pide-Photoroom.png',
    images: ['/images/2-myasa-pide-Photoroom.png', '/images/pide-s-govyadinoj-Photoroom.png', '/images/pide-s-basturmoj-Photoroom.png'],
    category: 'Պիդե',
    ingredients: ['Խմոր', 'Տավարի միս', 'Ոչխարի միս', 'Հավ', 'Պանիր', 'Կանաչի'],
    status: 'HIT',
    isAvailable: true,
  },
  {
    name: 'Գյուղական կարտոֆիլ',
    shortDescription: 'Չափաբաժնային կարտոֆիլ կեղևով։',
    description: 'Կարտոֆիլ, թխված կեղևով և համեմունքներով։ Խճճված խորշոմ դրսից, նրբագույն միջուկ ներսից։ Չափաբաժին 200գ։',
    price: 450,
    image: '/images/kartofel-fri-Photoroom.png',
    images: ['/images/kartofel-fri-Photoroom.png', '/images/kurinyy-popkorn-Photoroom.png', '/images/BBQ-sauce-Pideh-Photoroom.png'],
    category: 'Սնաք',
    ingredients: ['Կարտոֆիլ', 'Համեմունքներ', 'Յուղ'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Մեղր-մոստարդ սոուս',
    shortDescription: 'Սոուս մեղրով և մոստարդով։',
    description: 'Թեթև քաղցր-կծու սոուս մեղրից և մոստարդից։ Իդեալական հավի, մսի և պիդեի համար։ Անհատական համերի համադրություն։',
    price: 350,
    image: '/images/Mustard-sauce-Pideh-Photoroom.png',
    images: ['/images/Mustard-sauce-Pideh-Photoroom.png', '/images/BBQ-sauce-Pideh-Photoroom.png', '/images/Mayonnaise-Pideh-Photoroom.png'],
    category: 'Սոուսներ',
    ingredients: ['Մեղր', 'Մոստարդ', 'Յուղ', 'Համեմունքներ'],
    status: 'NEW',
    isAvailable: true,
  },
  {
    name: 'Պանրային սոուս',
    shortDescription: 'Սերուցքային պանրային սոուս։',
    description: 'Սերուցքային պանրային սոուս հագեցած համով։ Իդեալական պիդեի, կարտոֆիլ ֆրիի և բանջարեղենի համար։ Պատրաստված բնական պանրից և սերից։',
    price: 300,
    image: '/images/caucasus-cheese-Photoroom.png',
    images: ['/images/caucasus-cheese-Photoroom.png', '/images/Garlic-sauce-Pideh-Photoroom.png', '/images/Mayonnaise-Pideh-Photoroom.png'],
    category: 'Սոուսներ',
    ingredients: ['Պանիր', 'Սեր', 'Յուղ', 'Համեմունքներ'],
    status: 'REGULAR',
    isAvailable: true,
  },
  // Ըմպելիքներ (35-40)
  {
    name: 'Կոկա-Կոլա',
    shortDescription: 'Գազավորված Կոկա-Կոլա ըմպելիք։',
    description: 'Դասական գազավորված Կոկա-Կոլա 0.5լ։ Զովացնող համ, իդեալական լրացնում է պիդեն և կոմբոն։ Մատուցվում է սառեցված։',
    price: 500,
    image: '/images/cola-sprite-fanta-Photoroom.png',
    images: ['/images/cola-sprite-fanta-Photoroom.png', '/images/tan-Photoroom.png', '/images/juice-Photoroom.png'],
    category: 'Ըմպելիքներ',
    ingredients: ['Ջուր', 'Շաքար', 'Կոֆեին'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Սփրայթ',
    shortDescription: 'Գազավորված Սփրայթ ըմպելիք։',
    description: 'Զովացնող կիտրոն-լայմ Սփրայթ 0.5լ։ Առանց կոֆեինի։ Իդեալական ծարավի համար տաք օրվա։',
    price: 500,
    image: '/images/cola-sprite-fanta-Photoroom.png',
    images: ['/images/cola-sprite-fanta-Photoroom.png', '/images/juice-Photoroom.png', '/images/jur0000-Photoroom.png'],
    category: 'Ըմպելիքներ',
    ingredients: ['Ջուր', 'Շաքար', 'Կիտրոնի հյութ'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Ֆանտա',
    shortDescription: 'Գազավորված Ֆանտա ըմպելիք։',
    description: 'Նարնջի գազավորված Ֆանտա 0.5լ։ Թարմ ցիտրուսային համ։ Մատուցվում է սառեցված։',
    price: 500,
    image: '/images/cola-sprite-fanta-Photoroom.png',
    images: ['/images/cola-sprite-fanta-Photoroom.png', '/images/juice-Photoroom.png', '/images/tan-Photoroom.png'],
    category: 'Ըմպելիքներ',
    ingredients: ['Ջուր', 'Շաքար', 'Նարնջի հյութ'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Թան',
    shortDescription: 'Ավանդական հայկական Թան ըմպելիք։',
    description: 'Ավանդական հայկական թթու կաթնային Թան ըմպելիք։ Հագեցնում է ծարավը և զովացնում։ Բնական արտադրանք մածունից։ Իդեալական պիդեի հետ։',
    price: 400,
    image: '/images/tan-Photoroom.png',
    images: ['/images/tan-Photoroom.png', '/images/jur0000-Photoroom.png', '/images/juice-Photoroom.png'],
    category: 'Ըմպելիքներ',
    ingredients: ['Մածուն', 'Ջուր', 'Աղ'],
    status: 'CLASSIC',
    isAvailable: true,
  },
  {
    name: 'Հյութ (ընտրանի)',
    shortDescription: 'Հյութ համերի ընտրությամբ։',
    description: 'Մրգային հյութ ընտրությամբ՝ նարինջ, խնձոր, բալ, մուլտիֆրուտ։ Բնական համ։ Չափաբաժին 0.3լ։',
    price: 600,
    image: '/images/juice-Photoroom.png',
    images: ['/images/juice-Photoroom.png', '/images/cola-sprite-fanta-Photoroom.png', '/images/tan-Photoroom.png'],
    category: 'Ըմպելիքներ',
    ingredients: ['Մրգային հյութ'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Տնային լիմոնադ',
    shortDescription: 'Թարմ լիմոնադ դաղձով։',
    description: 'Տնային լիմոնադ թարմ կիտրոններից դաղձով և սառույցով։ Զովացնող և բնական։ Առանց արհեստական հավելումների։ Չափաբաժին 0.4լ։',
    price: 550,
    image: '/images/juice-Photoroom.png',
    images: ['/images/juice-Photoroom.png', '/images/tan-Photoroom.png', '/images/jur0000-Photoroom.png'],
    category: 'Ըմպելիքներ',
    ingredients: ['Կիտրոն', 'Դաղձ', 'Շաքար', 'Ջուր'],
    status: 'NEW',
    isAvailable: true,
  },
  {
    name: 'Միներալ ջուր',
    shortDescription: 'Շշով միներալ ջուր։',
    description: 'Մաքուր շշով միներալ ջուր 0.5լ։ Առանց գազի։ Իդեալական ծարավի հագեցման համար։ Հարմար բոլոր տարիքային խմբերի համար։',
    price: 300,
    image: '/images/jur0000-Photoroom.png',
    images: ['/images/jur0000-Photoroom.png', '/images/tan-Photoroom.png', '/images/juice-Photoroom.png'],
    category: 'Ըմպելիքներ',
    ingredients: ['Միներալ ջուր'],
    status: 'REGULAR',
    isAvailable: true,
  },
]

async function main() {
  console.log('🗑️ Ջնջում ենք արդեն գոյություն ունեցող արտադրանքները և կապված տվյալները...')

  await prisma.wishlistItem.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.product.deleteMany()

  console.log('✅ Արտադրանքները ջնջված են')

  const categories = await prisma.category.findMany()
  const categoryMap = new Map(categories.map((c) => [c.name, c.id]))

  const toCreate = [...new Set(PRODUCTS.map((p) => p.category))].filter((name) => !categoryMap.has(name))
  for (const name of toCreate) {
    const cat = await prisma.category.create({
      data: { name, description: name, isActive: true },
    })
    categoryMap.set(name, cat.id)
    console.log(`✅ Ստեղծված կատեգորիա: ${cat.name}`)
  }

  console.log('📦 Ստեղծում ենք 40 արտադրանք ամբողջական տվյալներով...')

  for (const p of PRODUCTS) {
    const categoryId = categoryMap.get(p.category)
    if (!categoryId) {
      console.warn(`⚠️ Կատեգորիան չի գտնվել: ${p.category} ապրանքի համար ${p.name}`)
      continue
    }

    await prisma.product.create({
      data: {
        name: p.name,
        shortDescription: p.shortDescription,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice ?? null,
        image: p.image,
        images: p.images,
        categoryId,
        ingredients: p.ingredients,
        isAvailable: p.isAvailable,
        status: p.status,
      },
    })
    console.log(`   ✅ ${p.name}`)
  }

  const count = await prisma.product.count()
  console.log(`\n🎉 Պատրաստ է: Ստեղծվել է ${count} արտադրանք։`)
}

main()
  .catch((e) => {
    console.error('❌ Սխալ:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
