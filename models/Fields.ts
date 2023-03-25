import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database';
import { Sources } from './Sources';

import { Templates } from './Templates';
import { TemplatesFieldsAssoc } from './TemplatesFieldsAssoc';

export class Fields extends Model {}

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
  // ideally this should be JSON but SQLite doesn't support this
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
  requried: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'fields',
  tableName: 'fields'
});

