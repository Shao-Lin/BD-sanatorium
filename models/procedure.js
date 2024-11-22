// models/procedure.js
import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Procedure extends Model {
    static associate(models) {
      Procedure.hasMany(models.ProcedureTicket, { foreignKey: 'procedure_id' });
    }
  }
  Procedure.init({
    procedure_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    price: DataTypes.NUMERIC,
  }, {
    sequelize,
    modelName: 'Procedure',
    tableName: 'procedure',
    timestamps: false, // Отключение временных меток
  });
  return Procedure;
};
