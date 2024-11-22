const baseController = (model) => {
  return {
    // Создание записи
    create: async (data) => {
      try {
        const result = await model.create(data);
        return result;
      } catch (error) {
        throw new Error(`Ошибка создания записи: ${error.message}`);
      }
    },

    // Получение всех записей
    getAll: async () => {
      try {
        const results = await model.findAll();
        return results;
      } catch (error) {
        throw new Error(`Ошибка получения всех записей: ${error.message}`);
      }
    },

    // Получение записи по ID
    getById: async (id) => {
      try {
        const result = await model.findByPk(id);
        if (!result) throw new Error('Запись не найдена');
        return result;
      } catch (error) {
        throw new Error(`Ошибка получения записи по ID: ${error.message}`);
      }
    },

    // Обновление записи
    update: async (id, data) => {
      try {
        const primaryKey = model.primaryKeyAttribute; // Универсальный способ получить имя первичного ключа
        const result = await model.update(data, { where: { [primaryKey]: id } });
        if (result[0] === 0) throw new Error('Запись для обновления не найдена');
        return await model.findByPk(id); // Возвращаем обновлённую запись
      } catch (error) {
        throw new Error(`Ошибка обновления записи: ${error.message}`);
      }
    },

    // Удаление записи
    delete: async (id) => {
      try {
        const primaryKey = model.primaryKeyAttribute;
        const result = await model.destroy({ where: { [primaryKey]: id } });
        if (result === 0) throw new Error('Запись для удаления не найдена');
      } catch (error) {
        throw new Error(`Ошибка удаления записи: ${error.message}`);
      }
    },
  };
};

export default baseController;


  