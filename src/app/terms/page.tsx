import Footer from '@/components/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Отступ для fixed хедера */}
      <div className="h-16"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 mb-20 lg:mb-16">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">Условия использования</h1>
            <p className="text-gray-600">Последнее обновление: {new Date().toLocaleDateString('ru-RU')}</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">1. Общие положения</h2>
              <p className="text-gray-700 mb-4">
                Настоящие Условия использования регулируют отношения между администрацией данного сайта 
                (далее — «Компания») и пользователями сайта (далее — «Пользователь»).
              </p>
              <p className="text-gray-700 mb-4">
                Используя данный сайт, вы соглашаетесь с данными условиями. Если вы не согласны 
                с какими-либо условиями, пожалуйста, не используйте данный сайт.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">2. Описание услуг</h2>
              <p className="text-gray-700 mb-4">
                Данный сайт предоставляет следующие услуги:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Интернет-магазин товаров</li>
                <li>Онлайн заказ и оплата товаров</li>
                <li>Доставка заказов по указанному адресу</li>
                <li>Информационные услуги о товарах и акциях</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">3. Регистрация и аккаунт</h2>
              <p className="text-gray-700 mb-4">
                Для оформления заказов необходимо создать аккаунт. При регистрации вы обязуетесь:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Предоставлять достоверную информацию</li>
                <li>Поддерживать актуальность данных</li>
                <li>Нести ответственность за безопасность аккаунта</li>
                <li>Немедленно уведомлять о несанкционированном доступе</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">4. Заказы и оплата</h2>
              <p className="text-gray-700 mb-4">
                При оформлении заказа вы соглашаетесь:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Оплатить заказ в полном объеме</li>
                <li>Предоставить корректный адрес доставки</li>
                <li>Быть доступным для связи в указанное время</li>
                <li>Принять заказ при доставке</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Оплата производится наличными при получении или банковской картой онлайн.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">5. Доставка</h2>
              <p className="text-gray-700 mb-4">
                Условия доставки:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Время доставки: 20-30 минут (при заказе до 21:00)</li>
                <li>Минимальная сумма заказа: 2000 драмов</li>
                <li>Стоимость доставки: 500 драмов</li>
                <li>Бесплатная доставка при заказе от 5000 драмов</li>
                <li>Зона доставки: Ереван и пригороды</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">6. Возврат и обмен</h2>
              <p className="text-gray-700 mb-4">
                Возврат товара возможен в следующих случаях:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Товар не соответствует заказу</li>
                <li>Товар поврежден при транспортировке</li>
                <li>Качество товара не соответствует заявленному</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Возврат должен быть произведен в течение 1 часа с момента получения заказа.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">7. Ответственность</h2>
              <p className="text-gray-700 mb-4">
                Компания не несет ответственности за:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Задержки доставки по причинам, не зависящим от компании</li>
                <li>Изменения в меню или временное отсутствие товаров</li>
                <li>Технические сбои на сайте</li>
                <li>Действия третьих лиц</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">8. Интеллектуальная собственность</h2>
              <p className="text-gray-700 mb-4">
                Все материалы сайта (тексты, изображения, дизайн) являются интеллектуальной 
                собственностью компании и защищены авторским правом.
              </p>
              <p className="text-gray-700 mb-4">
                Запрещается копирование, распространение или использование материалов 
                без письменного разрешения компании.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">9. Изменения условий</h2>
              <p className="text-gray-700 mb-4">
                Компания оставляет за собой право изменять данные условия в любое время. 
                О существенных изменениях пользователи будут уведомлены через сайт или 
                по электронной почте.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">10. Контактная информация</h2>
              <p className="text-gray-700 mb-4">
                По вопросам, связанным с условиями использования, обращайтесь:
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
