import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Staff extends Model {
    static associate(models) {
      Staff.hasMany(models.ProcedureTicket, { foreignKey: 'staff_id' });
    }
  }
  Staff.init({
    staff_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    full_name: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    position: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Staff',
    tableName: 'staff',
    timestamps: false, // Отключение временных меток
  });
  return Staff;
};
