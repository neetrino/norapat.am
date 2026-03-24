/**
 * Скрипт: удалить все продукты и создать 40 новых с полными данными.
 * Запуск: pnpm exec tsx scripts/seed-40-products.ts
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
  // Пиде (1-15)
  {
    name: '2 мяса пиде',
    shortDescription: 'Сочное пиде с двумя видами мяса и свежими овощами.',
    description: 'Традиционное армянское пиде, приготовленное из двух сортов отборного мяса, зелёного перца и томатов черри. Идеально сочетается с сыром и свежей зеленью. Выпекается в дровяной печи до золотистой корочки. Порция рассчитана на 2-3 персоны.',
    price: 950,
    originalPrice: 1100,
    image: '/images/2-myasa-pide-Photoroom.png',
    images: ['/images/2-myasa-pide-Photoroom.png', '/images/pepperoni-pide-Photoroom.png', '/images/pide-s-basturmoj-Photoroom.png'],
    category: 'Пиде',
    ingredients: ['Тесто', '2 вида мяса', 'Зеленый перец', 'Помидоры черри', 'Сыр'],
    status: 'HIT',
    isAvailable: true,
  },
  {
    name: 'Пепперони пиде',
    shortDescription: 'Пикантное пиде с пепперони и сыром.',
    description: 'Классическое пиде с острой пепперони, расплавленным сыром и зелёным перцем. Огонь и нежность в каждом кусочке. Идеально для любителей пряных блюд. Готовится в традиционной печи на дровах.',
    price: 950,
    image: '/images/pepperoni-pide-Photoroom.png',
    images: ['/images/pepperoni-pide-Photoroom.png', '/images/2-myasa-pide-Photoroom.png', '/images/pide-s-bekonom-Photoroom.png'],
    category: 'Пиде',
    ingredients: ['Тесто', 'Пепперони', 'Сыр', 'Зеленый перец'],
    status: 'HIT',
    isAvailable: true,
  },
  {
    name: 'Пиде с бастурмой',
    shortDescription: 'Авторское пиде с армянской бастурмой.',
    description: 'Уникальное сочетание традиционного пиде и знаменитой армянской бастурмы. Вяленое мясо с ароматными специями, сыр и зелёный перец создают незабываемый вкус. Наше фирменное блюдо.',
    price: 950,
    image: '/images/pide-s-basturmoj-Photoroom.png',
    images: ['/images/pide-s-basturmoj-Photoroom.png', '/images/pepperoni-pide-Photoroom.png', '/images/pide-s-govyadinoj-Photoroom.png'],
    category: 'Пиде',
    ingredients: ['Тесто', 'Бастурма', 'Сыр', 'Зеленый перец'],
    status: 'CLASSIC',
    isAvailable: true,
  },
  {
    name: 'Пиде с беконом',
    shortDescription: 'Хрустящий бекон с сыром и огурцами.',
    description: 'Пиде с хрустящим беконом, расплавленным сыром и маринованными огурцами. Сладковато-солёное сочетание с дымным ароматом бекона. Отличный выбор для сытного обеда или ужина.',
    price: 950,
    originalPrice: 1050,
    image: '/images/pide-s-bekonom-Photoroom.png',
    images: ['/images/pide-s-bekonom-Photoroom.png', '/images/pide-hot-dog-Photoroom.png', '/images/2-myasa-pide-Photoroom.png'],
    category: 'Пиде',
    ingredients: ['Тесто', 'Бекон', 'Сыр', 'Маринованные огурцы'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Пиде с говядиной',
    shortDescription: 'Настоящее мясное пиде с говяжьим фаршем.',
    description: 'Пиде с фаршем из отборной говядины, свежей зеленью и томатами черри. Классическое мясное сочетание, которое понравится всем любителям мяса. Готовится из свежих ингредиентов без консервантов.',
    price: 950,
    image: '/images/pide-s-govyadinoj-Photoroom.png',
    images: ['/images/pide-s-govyadinoj-Photoroom.png', '/images/pide-s-basturmoj-Photoroom.png', '/images/pepperoni-pide-Photoroom.png'],
    category: 'Пиде',
    ingredients: ['Тесто', 'Говяжий фарш', 'Зелень', 'Помидоры черри', 'Сыр'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Классическое сырное пиде',
    shortDescription: 'Традиционное пиде с сыром и томатами.',
    description: 'Традиционное пиде с расплавленным сыром и томатами черри. Минимализм и совершенство вкуса. Идеально для вегетарианцев и любителей нежных сырных блюд. Простая и изысканная классика.',
    price: 700,
    image: '/images/classic-chees-Photoroom.png',
    images: ['/images/classic-chees-Photoroom.png', '/images/caucasus-cheese-Photoroom.png', '/images/ovoshchnoe-pide-Photoroom.png'],
    category: 'Пиде',
    ingredients: ['Тесто', 'Сыр', 'Помидоры черри'],
    status: 'CLASSIC',
    isAvailable: true,
  },
  {
    name: 'Кавказский пиде',
    shortDescription: 'Пиде с белым сыром и помидорами черри.',
    description: 'Пиде в кавказском стиле с белым рассольным сыром, свежей зеленью и томатами черри. Лёгкий и освежающий вкус. Отлично подходит для жаркого дня.',
    price: 750,
    image: '/images/caucasus-cheese-Photoroom.png',
    images: ['/images/caucasus-cheese-Photoroom.png', '/images/classic-chees-Photoroom.png', '/images/pide-s-phali-Photoroom.png'],
    category: 'Пиде',
    ingredients: ['Тесто', 'Белый сыр', 'Зелень', 'Помидоры черри'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Грибное пиде',
    shortDescription: 'Пиде с жареными грибами и зеленью.',
    description: 'Пиде с ароматными жареными грибами, свежей зеленью и сыром. Вегетарианский вариант с насыщенным лесным вкусом. Грибы обжариваются до золотистой корочки перед запеканием.',
    price: 750,
    image: '/images/gribnoe-pide-Photoroom.png',
    images: ['/images/gribnoe-pide-Photoroom.png', '/images/ovoshchnoe-pide-Photoroom.png', '/images/shpinat-Photoroom.png'],
    category: 'Пиде',
    ingredients: ['Тесто', 'Жареные грибы', 'Зелень', 'Сыр'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Овощное пиде',
    shortDescription: 'Пиде с грибами, луком и томатами.',
    description: 'Свежее овощное пиде с грибами, зелёным луком и томатами черри. Лёгкий вегетарианский вариант. Идеально для здорового питания.',
    price: 800,
    image: '/images/ovoshchnoe-pide-Photoroom.png',
    images: ['/images/ovoshchnoe-pide-Photoroom.png', '/images/gribnoe-pide-Photoroom.png', '/images/pide-s-phali-Photoroom.png'],
    category: 'Пиде',
    ingredients: ['Тесто', 'Грибы', 'Зеленый лук', 'Помидоры черри', 'Сыр'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Шпинат пиде',
    shortDescription: 'Пиде со шпинатом, сыром и томатами.',
    description: 'Пиде со свежим шпинатом, сыром и томатами черри. Полезно и вкусно. Шпинат богат железом и витаминами. Подходит для здорового образа жизни.',
    price: 900,
    image: '/images/shpinat-Photoroom.png',
    images: ['/images/shpinat-Photoroom.png', '/images/ovoshchnoe-pide-Photoroom.png', '/images/gribnoe-pide-Photoroom.png'],
    category: 'Пиде',
    ingredients: ['Тесто', 'Шпинат', 'Сыр', 'Помидоры черри'],
    status: 'NEW',
    isAvailable: true,
  },
  {
    name: 'Куриные легкие пиде',
    shortDescription: 'Лёгкое пиде с курицей и овощами.',
    description: 'Пиде с нежной курицей, сладким перцем и томатами черри. Лёгкий и диетический вариант. Отлично подходит для тех, кто следит за фигурой.',
    price: 800,
    image: '/images/kurinye-legkie-pide-Photoroom.png',
    images: ['/images/kurinye-legkie-pide-Photoroom.png', '/images/pide-s-govyadinoj-Photoroom.png', '/images/pepperoni-pide-Photoroom.png'],
    category: 'Пиде',
    ingredients: ['Тесто', 'Курица', 'Сладкий перец', 'Помидоры черри', 'Сыр'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Пиде с пхали',
    shortDescription: 'Пиде с грузинской овощной пастой пхали.',
    description: 'Пиде с грузинской овощной пастой пхали и ароматной кинзой. Уникальное сочетание армянской и грузинской кухонь. Для любителей необычных вкусов.',
    price: 700,
    image: '/images/pide-s-phali-Photoroom.png',
    images: ['/images/pide-s-phali-Photoroom.png', '/images/caucasus-cheese-Photoroom.png', '/images/ovoshchnoe-pide-Photoroom.png'],
    category: 'Пиде',
    ingredients: ['Тесто', 'Пхали', 'Кинза', 'Сыр'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Пиде Хот Дог',
    shortDescription: 'Пиде с сосисками и сыром.',
    description: 'Пиде с сочными сосисками, сыром и маринованными огурцами. Детский фаворит и быстрый перекус. Идеально для пикника.',
    price: 700,
    image: '/images/pide-hot-dog-Photoroom.png',
    images: ['/images/pide-hot-dog-Photoroom.png', '/images/pide-s-bekonom-Photoroom.png', '/images/classic-chees-Photoroom.png'],
    category: 'Пиде',
    ingredients: ['Тесто', 'Сосиски', 'Сыр', 'Маринованные огурцы'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Пиде Blue Pear',
    shortDescription: 'Десертное пиде с грушами.',
    description: 'Пиде с грушами и лёгким соусом. Необычный десертный вариант. Сладкое и пикантное сочетание для любителей экспериментов.',
    price: 700,
    image: '/images/pide-blue-pear-Photoroom.png',
    images: ['/images/pide-blue-pear-Photoroom.png', '/images/sladkiy-pide-Photoroom.png', '/images/classic-chees-Photoroom.png'],
    category: 'Пиде',
    ingredients: ['Тесто', 'Груши', 'Легкий соус', 'Сыр'],
    status: 'NEW',
    isAvailable: true,
  },
  {
    name: 'Сладкий пиде',
    shortDescription: 'Десертное пиде с шоколадом.',
    description: 'Десертное пиде с шоколадными конфетами и сладким соусом. Идеально завершит трапезу. Любимое лакомство детей и сладкоежек.',
    price: 750,
    image: '/images/sladkiy-pide-Photoroom.png',
    images: ['/images/sladkiy-pide-Photoroom.png', '/images/pide-blue-pear-Photoroom.png', '/images/classic-chees-Photoroom.png'],
    category: 'Пиде',
    ingredients: ['Тесто', 'Шоколадные конфеты', 'Сладкий соус'],
    status: 'REGULAR',
    isAvailable: true,
  },
  // Комбо (16-20)
  {
    name: 'Комбо «Я один»',
    shortDescription: 'Пиде с беконом, фри и напитком.',
    description: 'Идеальный обед для одного: пиде с беконом, порция картофеля фри и напиток Tan на выбор. Всё необходимое для сытного перекуса.',
    price: 1700,
    image: '/images/kombo-ya-odin-Photoroom.png',
    images: ['/images/kombo-ya-odin-Photoroom.png', '/images/kombo-my-vdvoyom-Photoroom.png', '/images/pide-s-bekonom-Photoroom.png'],
    category: 'Комбо',
    ingredients: ['Пиде с беконом', 'Картофель фри', 'Напиток Tan'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Комбо «Мы вдвоем»',
    shortDescription: '2 пиде и 2 напитка для двоих.',
    description: 'Комбо для двоих: два пиде (пепперони и 2 мяса) и два напитка Tan. Идеально для романтического ужина или дружеской встречи.',
    price: 2900,
    originalPrice: 3200,
    image: '/images/kombo-my-vdvoyom-Photoroom.png',
    images: ['/images/kombo-my-vdvoyom-Photoroom.png', '/images/kombo-my-golodny-Photoroom.png', '/images/pepperoni-pide-Photoroom.png'],
    category: 'Комбо',
    ingredients: ['Пиде пепперони', 'Пиде 2 мяса', '2 напитка Tan'],
    status: 'HIT',
    isAvailable: true,
  },
  {
    name: 'Комбо «Мы голодны»',
    shortDescription: 'Большое комбо для компании.',
    description: 'Масштабное комбо: 2 пиде с бастурмой, 2 куриных пиде, картофель фри и Кока-кола. Для тех, кто по-настоящему голоден. Хватит на 3-4 персоны.',
    price: 4900,
    image: '/images/kombo-my-golodny-Photoroom.png',
    images: ['/images/kombo-my-golodny-Photoroom.png', '/images/kombo-my-ochen-golodny-Photoroom.png', '/images/kombo-my-vdvoyom-Photoroom.png'],
    category: 'Комбо',
    ingredients: ['2 пиде с бастурмой', '2 куриные легкие пиде', 'Картофель фри', 'Кока-кола'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Комбо «Мы очень голодны»',
    shortDescription: 'Максимальное комбо для большой компании.',
    description: 'Максимальное комбо: 4 пиде пепперони, 4 сырных пиде, картофель фри и куриный попкорн. Для вечеринки или большого семейного ужина. 6-8 порций.',
    price: 7900,
    originalPrice: 8500,
    image: '/images/kombo-my-ochen-golodny-Photoroom.png',
    images: ['/images/kombo-my-ochen-golodny-Photoroom.png', '/images/kombo-my-golodny-Photoroom.png', '/images/kurinyy-popkorn-Photoroom.png'],
    category: 'Комбо',
    ingredients: ['4 пиде пепперони', '4 классических сырных пиде', 'Картофель фри', 'Куриный попкорн'],
    status: 'HIT',
    isAvailable: true,
  },
  // Снэк (21-24)
  {
    name: 'Картофель фри',
    shortDescription: 'Хрустящий картофель фри.',
    description: 'Классический хрустящий картофель фри, приготовленный из отборного картофеля. Золотистая корочка снаружи и нежная мякоть внутри. Идеальное дополнение к пиде.',
    price: 500,
    image: '/images/kartofel-fri-Photoroom.png',
    images: ['/images/kartofel-fri-Photoroom.png', '/images/kurinyy-popkorn-Photoroom.png', '/images/kombo-ya-odin-Photoroom.png'],
    category: 'Снэк',
    ingredients: ['Картофель', 'Масло', 'Соль'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Наггетсы куриные',
    shortDescription: 'Куриные наггетсы 6 штук.',
    description: 'Хрустящие куриные наггетсы в панировке, 6 штук. Идеальная закуска для детей и взрослых. Подаются с соусом на выбор.',
    price: 550,
    image: '/images/kurinyy-popkorn-Photoroom.png',
    images: ['/images/kurinyy-popkorn-Photoroom.png', '/images/kartofel-fri-Photoroom.png', '/images/BBQ-sauce-Pideh-Photoroom.png'],
    category: 'Снэк',
    ingredients: ['Курица', 'Панировка', 'Масло'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Куриный попкорн',
    shortDescription: 'Хрустящие куриные наггетсы.',
    description: 'Хрустящие кусочки курицы в панировке. Идеальная закуска к пиве или напиткам. Готовится во фритюре до золотистой корочки.',
    price: 600,
    image: '/images/kurinyy-popkorn-Photoroom.png',
    images: ['/images/kurinyy-popkorn-Photoroom.png', '/images/kartofel-fri-Photoroom.png', '/images/kombo-my-ochen-golodny-Photoroom.png'],
    category: 'Снэк',
    ingredients: ['Курица', 'Панировка', 'Специи'],
    status: 'REGULAR',
    isAvailable: true,
  },
  // Соусы (25-34)
  {
    name: 'Кетчуп',
    shortDescription: 'Классический томатный кетчуп.',
    description: 'Классический томатный кетчуп с идеальным балансом сладости и кислотности. Отлично дополняет пиде, картофель фри и наггетсы. Подаётся в порционной упаковке.',
    price: 300,
    image: '/images/Ketchup-Pideh-Photoroom.png',
    images: ['/images/Ketchup-Pideh-Photoroom.png', '/images/BBQ-sauce-Pideh-Photoroom.png', '/images/Mayonnaise-Pideh-Photoroom.png'],
    category: 'Соусы',
    ingredients: ['Томатная паста', 'Сахар', 'Уксус', 'Специи'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Майонез',
    shortDescription: 'Классический майонез.',
    description: 'Классический майонез домашнего приготовления. Нежный и воздушный. Идеален для пиде, картофеля фри и салатов.',
    price: 300,
    image: '/images/Mayonnaise-Pideh-Photoroom.png',
    images: ['/images/Mayonnaise-Pideh-Photoroom.png', '/images/Garlic-sauce-Pideh-Photoroom.png', '/images/Cocktail-sauce-Pideh-Photoroom.png'],
    category: 'Соусы',
    ingredients: ['Яичный желток', 'Масло', 'Уксус', 'Горчица'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Чесночный соус',
    shortDescription: 'Ароматный чесночный соус.',
    description: 'Ароматный чесночный соус с зеленью и лимонным соком. Идеален для пиде и мяса. Приготовлен из свежего чеснока.',
    price: 300,
    image: '/images/Garlic-sauce-Pideh-Photoroom.png',
    images: ['/images/Garlic-sauce-Pideh-Photoroom.png', '/images/Mayonnaise-Pideh-Photoroom.png', '/images/Mustard-sauce-Pideh-Photoroom.png'],
    category: 'Соусы',
    ingredients: ['Чеснок', 'Майонез', 'Зелень', 'Лимонный сок'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Барбекю соус',
    shortDescription: 'Пикантный соус барбекю.',
    description: 'Пикантный соус барбекю с дымным ароматом. Идеален для мяса, пиде и картофеля фри. Сладковато-острый вкус.',
    price: 300,
    image: '/images/BBQ-sauce-Pideh-Photoroom.png',
    images: ['/images/BBQ-sauce-Pideh-Photoroom.png', '/images/Ketchup-Pideh-Photoroom.png', '/images/Cocktail-sauce-Pideh-Photoroom.png'],
    category: 'Соусы',
    ingredients: ['Томатная паста', 'Сахар', 'Уксус', 'Специи'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Горчица',
    shortDescription: 'Острая горчица.',
    description: 'Острая горчица из отборных зерён. Добавит пикантности любому блюду. Классический accompaniment к мясу и пиде.',
    price: 300,
    image: '/images/Mustard-sauce-Pideh-Photoroom.png',
    images: ['/images/Mustard-sauce-Pideh-Photoroom.png', '/images/Garlic-sauce-Pideh-Photoroom.png', '/images/Ketchup-Pideh-Photoroom.png'],
    category: 'Соусы',
    ingredients: ['Горчичные зерна', 'Уксус', 'Соль', 'Специи'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Коктейль соус',
    shortDescription: 'Классический коктейльный соус.',
    description: 'Классический коктейльный соус на основе майонеза и кетчупа. Нежный вкус с ноткой коньяка. Идеален для морепродуктов и курицы.',
    price: 300,
    image: '/images/Cocktail-sauce-Pideh-Photoroom.png',
    images: ['/images/Cocktail-sauce-Pideh-Photoroom.png', '/images/Mayonnaise-Pideh-Photoroom.png', '/images/BBQ-sauce-Pideh-Photoroom.png'],
    category: 'Соусы',
    ingredients: ['Майонез', 'Кетчуп', 'Коньяк', 'Специи'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Пиде с ветчиной',
    shortDescription: 'Пиде с ветчиной, сыром и овощами.',
    description: 'Пиде с нежной ветчиной, расплавленным сыром и свежими овощами. Классическое сочетание для всей семьи. Готовится в печи на дровах.',
    price: 850,
    image: '/images/pide-s-bekonom-Photoroom.png',
    images: ['/images/pide-s-bekonom-Photoroom.png', '/images/classic-chees-Photoroom.png', '/images/pepperoni-pide-Photoroom.png'],
    category: 'Пиде',
    ingredients: ['Тесто', 'Ветчина', 'Сыр', 'Овощи'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Пиде мясное ассорти',
    shortDescription: 'Пиде с тремя видами мяса.',
    description: 'Праздничное пиде с ассорти из трёх видов мяса: говядина, баранина и курица. Для настоящих мясоедов. Щедрая порция с сыром и зеленью.',
    price: 1200,
    originalPrice: 1350,
    image: '/images/2-myasa-pide-Photoroom.png',
    images: ['/images/2-myasa-pide-Photoroom.png', '/images/pide-s-govyadinoj-Photoroom.png', '/images/pide-s-basturmoj-Photoroom.png'],
    category: 'Пиде',
    ingredients: ['Тесто', 'Говядина', 'Баранина', 'Курица', 'Сыр', 'Зелень'],
    status: 'HIT',
    isAvailable: true,
  },
  {
    name: 'Картофель по-деревенски',
    shortDescription: 'Порционный картофель с кожурой.',
    description: 'Картофель, запечённый с кожурой и специями. Хрустящая корочка снаружи, нежная мякоть внутри. Порция 200г.',
    price: 450,
    image: '/images/kartofel-fri-Photoroom.png',
    images: ['/images/kartofel-fri-Photoroom.png', '/images/kurinyy-popkorn-Photoroom.png', '/images/BBQ-sauce-Pideh-Photoroom.png'],
    category: 'Снэк',
    ingredients: ['Картофель', 'Специи', 'Масло'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Медово-горчичный соус',
    shortDescription: 'Соус с мёдом и горчицей.',
    description: 'Сладковато-острый соус из мёда и горчицы. Идеален для курицы, мяса и пиде. Уникальное сочетание вкусов.',
    price: 350,
    image: '/images/Mustard-sauce-Pideh-Photoroom.png',
    images: ['/images/Mustard-sauce-Pideh-Photoroom.png', '/images/BBQ-sauce-Pideh-Photoroom.png', '/images/Mayonnaise-Pideh-Photoroom.png'],
    category: 'Соусы',
    ingredients: ['Мёд', 'Горчица', 'Масло', 'Специи'],
    status: 'NEW',
    isAvailable: true,
  },
  {
    name: 'Сырный соус',
    shortDescription: 'Сливочный сырный соус.',
    description: 'Сливочный сырный соус с насыщенным вкусом. Идеален для пиде, картофеля фри и овощей. Готовится из натурального сыра и сливок.',
    price: 300,
    image: '/images/caucasus-cheese-Photoroom.png',
    images: ['/images/caucasus-cheese-Photoroom.png', '/images/Garlic-sauce-Pideh-Photoroom.png', '/images/Mayonnaise-Pideh-Photoroom.png'],
    category: 'Соусы',
    ingredients: ['Сыр', 'Сливки', 'Масло', 'Специи'],
    status: 'REGULAR',
    isAvailable: true,
  },
  // Напитки (35-40)
  {
    name: 'Кока-Кола',
    shortDescription: 'Газированный напиток Кока-Кола.',
    description: 'Классическая газировка Кока-Кола 0.5л. Освежающий вкус, идеально дополняющий пиде и комбо. Подаётся охлаждённой.',
    price: 500,
    image: '/images/cola-sprite-fanta-Photoroom.png',
    images: ['/images/cola-sprite-fanta-Photoroom.png', '/images/tan-Photoroom.png', '/images/juice-Photoroom.png'],
    category: 'Напитки',
    ingredients: ['Вода', 'Сахар', 'Кофеин'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Спрайт',
    shortDescription: 'Газированный напиток Спрайт.',
    description: 'Освежающий лимонно-лаймовый Спрайт 0.5л. Без кофеина. Идеален для жажды в жаркий день.',
    price: 500,
    image: '/images/cola-sprite-fanta-Photoroom.png',
    images: ['/images/cola-sprite-fanta-Photoroom.png', '/images/juice-Photoroom.png', '/images/jur0000-Photoroom.png'],
    category: 'Напитки',
    ingredients: ['Вода', 'Сахар', 'Лимонный сок'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Фанта',
    shortDescription: 'Газированный напиток Фанта.',
    description: 'Апельсиновая газировка Фанта 0.5л. Свежий цитрусовый вкус. Подаётся охлаждённой.',
    price: 500,
    image: '/images/cola-sprite-fanta-Photoroom.png',
    images: ['/images/cola-sprite-fanta-Photoroom.png', '/images/juice-Photoroom.png', '/images/tan-Photoroom.png'],
    category: 'Напитки',
    ingredients: ['Вода', 'Сахар', 'Апельсиновый сок'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Тан',
    shortDescription: 'Традиционный армянский напиток Тан.',
    description: 'Традиционный армянский кисломолочный напиток Тан. Утоляет жажду и освежает. Натуральный продукт из мацони. Идеален к пиде.',
    price: 400,
    image: '/images/tan-Photoroom.png',
    images: ['/images/tan-Photoroom.png', '/images/jur0000-Photoroom.png', '/images/juice-Photoroom.png'],
    category: 'Напитки',
    ingredients: ['Мацони', 'Вода', 'Соль'],
    status: 'CLASSIC',
    isAvailable: true,
  },
  {
    name: 'Сок (ассорти)',
    shortDescription: 'Сок в ассортименте вкусов.',
    description: 'Фруктовый сок в ассортименте: апельсин, яблоко, вишня, мультифрукт. Натуральный вкус. Порция 0.3л.',
    price: 600,
    image: '/images/juice-Photoroom.png',
    images: ['/images/juice-Photoroom.png', '/images/cola-sprite-fanta-Photoroom.png', '/images/tan-Photoroom.png'],
    category: 'Напитки',
    ingredients: ['Фруктовый сок'],
    status: 'REGULAR',
    isAvailable: true,
  },
  {
    name: 'Лимонад домашний',
    shortDescription: 'Свежий лимонад с мятой.',
    description: 'Домашний лимонад из свежих лимонов с мятой и льдом. Освежающий и натуральный. Без искусственных добавок. Порция 0.4л.',
    price: 550,
    image: '/images/juice-Photoroom.png',
    images: ['/images/juice-Photoroom.png', '/images/tan-Photoroom.png', '/images/jur0000-Photoroom.png'],
    category: 'Напитки',
    ingredients: ['Лимоны', 'Мята', 'Сахар', 'Вода'],
    status: 'NEW',
    isAvailable: true,
  },
  {
    name: 'Минеральная вода',
    shortDescription: 'Бутилированная минеральная вода.',
    description: 'Чистая бутилированная минеральная вода 0.5л. Без газа. Идеальна для утоления жажды. Подходит для всех возрастов.',
    price: 300,
    image: '/images/jur0000-Photoroom.png',
    images: ['/images/jur0000-Photoroom.png', '/images/tan-Photoroom.png', '/images/juice-Photoroom.png'],
    category: 'Напитки',
    ingredients: ['Минеральная вода'],
    status: 'REGULAR',
    isAvailable: true,
  },
]

async function main() {
  console.log('🗑️ Удаляем существующие продукты и связанные данные...')

  await prisma.wishlistItem.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.product.deleteMany()

  console.log('✅ Продукты удалены')

  const categories = await prisma.category.findMany()
  const categoryMap = new Map(categories.map((c) => [c.name, c.id]))

  const toCreate = [...new Set(PRODUCTS.map((p) => p.category))].filter((name) => !categoryMap.has(name))
  for (const name of toCreate) {
    const cat = await prisma.category.create({
      data: { name, description: `Категория ${name}`, isActive: true },
    })
    categoryMap.set(name, cat.id)
    console.log(`✅ Создана категория: ${cat.name}`)
  }

  console.log('📦 Создаём 40 продуктов с полными данными...')

  for (const p of PRODUCTS) {
    const categoryId = categoryMap.get(p.category)
    if (!categoryId) {
      console.warn(`⚠️ Категория не найдена: ${p.category} для товара ${p.name}`)
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
  console.log(`\n🎉 Готово! Создано ${count} продуктов.`)
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
