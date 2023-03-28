import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database/index';

export class Fields extends Model {
  name: unknown;
  id: undefined;
}

Fields.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true 
  },
  input_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  label: {
    type: DataTypes.STRING,
    allowNull: false
  },
  regexErrorMessage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  placeholder: {
    type: DataTypes.STRING,
    allowNull: true
  },
  regex: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // ideally this should be JSON but SQLite doesn't support
  options: {
    type: DataTypes.STRING,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('options');
      return rawValue ? JSON.parse(rawValue) : null;
    },
    set(value) {
      this.setDataValue('options', value ? JSON.stringify(value) : null)
    }
  },
  required: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'fields',
  tableName: 'fields'
});

