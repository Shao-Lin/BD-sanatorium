// models/tour.js
import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Tour extends Model {
    static associate(models) {
      Tour.belongsTo(models.Client, { foreignKey: 'client_id' });
      Tour.belongsTo(models.HotelRoom, { foreignKey: 'room_id' });
      Tour.hasMany(models.ProcedureTicket, { foreignKey: 'tour_id' });
    }
  }
  Tour.init({
    tour_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    client_id: DataTypes.INTEGER,
    check_in_date: DataTypes.DATE,
    check_out_date: DataTypes.DATE,
    tour_cost: DataTypes.INTEGER,
    room_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Tour',
    tableName: 'tour',
    timestamps: false, // Отключение временных меток
  });
  return Tour;
};
