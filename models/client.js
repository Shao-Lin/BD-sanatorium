import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Client extends Model {
    static associate(models) {
      // Устанавливаем связь: Client имеет много Tour
      Client.hasMany(models.Tour, { foreignKey: 'client_id' });
    }
  }

  Client.init(
    {
      client_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      birth_date: DataTypes.DATE,
      phone_number: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Client',
      tableName: 'client',
      timestamps: false, // Отключение временных меток
    }
  );

  return Client;
};

