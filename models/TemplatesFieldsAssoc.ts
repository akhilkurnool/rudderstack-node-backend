import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database/index';

import { Templates } from './Templates';
import { Fields } from './Fields';

export class TemplatesFieldsAssoc extends Model {
  templateId: unknown;
}

TemplatesFieldsAssoc.init({
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
  }
}, {
  sequelize,
  modelName: 'template_field_assoc',
  tableName: 'template_field_assoc',
});

