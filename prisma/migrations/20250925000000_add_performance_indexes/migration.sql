-- Добавляем индексы для ускорения запросов продуктов
-- Эти индексы значительно ускорят загрузку страниц продуктов

-- Индекс для isAvailable (используется во всех запросах продуктов)
CREATE INDEX IF NOT EXISTS idx_products_is_available ON products ("isAvailable");

-- Индекс для categoryId (используется для фильтрации по категориям)
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products ("categoryId");

-- Индекс для status (используется для featured продуктов)
CREATE INDEX IF NOT EXISTS idx_products_status ON products (status);

-- Составной индекс для основных запросов (isAvailable + status)
CREATE INDEX IF NOT EXISTS idx_products_available_status ON products ("isAvailable", status);

-- Составной индекс для запросов по категории (isAvailable + categoryId)
CREATE INDEX IF NOT EXISTS idx_products_available_category ON products ("isAvailable", "categoryId");

-- Индекс для сортировки по дате создания
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products ("createdAt" DESC);

-- Индекс для категорий (isActive)
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories ("isActive");
