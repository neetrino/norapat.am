import Footer from '@/components/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Отступ для fixed хедера */}
      <div className="h-16"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 mb-20 lg:mb-16">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">Политика конфиденциальности</h1>
            <p className="text-gray-600">Последнее обновление: {new Date().toLocaleDateString('ru-RU')}</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">1. Общие положения</h2>
              <p className="text-gray-700 mb-4">
                Настоящая Политика конфиденциальности определяет порядок обработки персональных данных 
                пользователей данного сайта (далее — «Сайт»).
              </p>
              <p className="text-gray-700 mb-4">
                Используя данный сайт, вы соглашаетесь с условиями данной Политики конфиденциальности.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">2. Сбор персональных данных</h2>
              <p className="text-gray-700 mb-4">
                Мы собираем следующие персональные данные:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Имя и фамилия</li>
                <li>Адрес электронной почты</li>
                <li>Номер телефона</li>
                <li>Адрес доставки</li>
                <li>Информация о заказах</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">3. Цели обработки данных</h2>
              <p className="text-gray-700 mb-4">
                Персональные данные используются для:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Обработки и выполнения заказов</li>
                <li>Связи с клиентами</li>
                <li>Доставки товаров</li>
                <li>Улучшения качества обслуживания</li>
                <li>Информирования о новых товарах и акциях</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">4. Защита данных</h2>
              <p className="text-gray-700 mb-4">
                Мы принимаем все необходимые меры для защиты ваших персональных данных от 
                несанкционированного доступа, изменения, раскрытия или уничтожения.
              </p>
              <p className="text-gray-700 mb-4">
                Все данные передаются по защищенному соединению (HTTPS) и хранятся на 
                защищенных серверах.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">5. Передача данных третьим лицам</h2>
              <p className="text-gray-700 mb-4">
                Мы не передаем ваши персональные данные третьим лицам, за исключением случаев:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Когда это необходимо для выполнения заказа (службы доставки)</li>
                <li>Когда это требуется по закону</li>
                <li>С вашего явного согласия</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">6. Ваши права</h2>
              <p className="text-gray-700 mb-4">
                Вы имеете право:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Получать информацию о ваших персональных данных</li>
                <li>Требовать исправления неточных данных</li>
                <li>Требовать удаления ваших данных</li>
                <li>Отозвать согласие на обработку данных</li>
                <li>Ограничить обработку ваших данных</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">7. Cookies</h2>
              <p className="text-gray-700 mb-4">
                Наш Сайт использует файлы cookie для улучшения пользовательского опыта. 
                Вы можете отключить cookies в настройках вашего браузера.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">8. Изменения в политике</h2>
              <p className="text-gray-700 mb-4">
                Мы можем обновлять данную Политику конфиденциальности. О любых изменениях 
                мы уведомим вас через Сайт или по электронной почте.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">9. Контактная информация</h2>
              <p className="text-gray-700 mb-4">
                Если у вас есть вопросы по данной Политике конфиденциальности, 
                обращайтесь к нам:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> support@neetrino.com
                </p>
                <p className="text-gray-700">
                  <strong>Телефон:</strong> +374 44 343 000
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
      
      {/* Hide Footer on Mobile and Tablet */}
      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
  )
}
