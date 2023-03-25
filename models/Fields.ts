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

Fields.hasMany(Sources, {
  foreignKey: {
    name: 'fieldId',
    allowNull: false
  }
})
