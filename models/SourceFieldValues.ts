import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database';

import { Templates } from './Templates';
import { Fields } from './Fields';
import { Sources } from './Sources';

export class SourceFieldValues extends Model {}

SourceFieldValues.init({
  sourceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Sources,
      key: 'id'
    },
    primaryKey: true
  },
  templateId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Templates,
      key: 'id'
    },
    primaryKey: true
  },
  fieldId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Fields,
      key: 'id'
    },
    primaryKey: true
  },
  value: {
    type: DataTypes.STRING,
    allowNull: true,
    set(value) {
      if (typeof value === 'boolean') {
        this.setDataValue('value', `${value}`)
      } else {
        this.setDataValue('value', value)
      }
    },
    get() {
      const val = this.getDataValue('value');
      if (val === 'true' || val == 'false') {
        return val === 'true' ? true : false;
      }
      return val;
    }
  }
}, {
  sequelize,
  modelName: 'source_field_values',
  tableName: 'source_field_values'
});

