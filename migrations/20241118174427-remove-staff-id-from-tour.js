'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Удаляем столбец staff_id
      await queryInterface.removeColumn('tour', 'staff_id');
      console.log('Столбец staff_id успешно удалён.');
    } catch (error) {
      console.log('Ошибка при удалении столбца staff_id: ', error);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('tour', 'staff_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    console.log('Столбец staff_id восстановлен.');
  }
};
