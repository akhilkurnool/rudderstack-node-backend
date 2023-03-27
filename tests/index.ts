import assert from 'assert';
import { after, before, describe, it } from 'node:test';
import dotenv from 'dotenv';

import { Fields, Sources, Templates, TemplatesFieldsAssoc } from '../models';
import { sequelize } from '../database/index';
import { validateAllRequiredFields, validateRegex, validateRequest, validateSelectOptions } from '../validators';

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config();
}

const template = {
  id: undefined,
  name: 'Test template 1'
}

const field = {
  id: undefined,
  "name": "apiKey",
  "input_type": "text",
  "label": "API key",
  "regexErrorMessage": "Invalid api key",
  "placeholder": "e.g: 1234asdf",
  "regex": "[a-z0-9]",
  "required": true
}

const source = {
  id: undefined,
  name: 'Test source 1'
}

describe('DB Setup', () => {
  before(async () => {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
  });
})

it('Should create new template', async () => {
  const data = await Templates.create(template);
  template.id = data.id;
  assert.strictEqual(data.name, template.name);
});

it('Should Fail because of duplicate name', async () => {
  try {
    const data = await Templates.create(template);
    assert.fail('Duplicate template name')
  } catch (e) {
    assert.ok(true);
  }
});

it('Should create new Field', async () => {
  const data = await Fields.create(field);
  field.id = data.id;
  assert.strictEqual(data.name, field.name);
});

it('Should Fail due to duplicate name Field', async () => {
  try {
    const data = await Fields.create(field);
    assert.fail('Duplicate field name')
  } catch (e) {
    assert.ok(true);
  }
});

it('Associate Template with field', async () => {
  const tfa = await TemplatesFieldsAssoc.create({ templateId: template.id, fieldId: field.id });
  assert.strictEqual(tfa.templateId, template.id)
})

it('Should create a new Source', async () => {
  const data = await Sources.create(source)
  source.id = data.id
  assert.strictEqual(data.name, source.name)
});

it('Should Fail due to duplicate source name', async () => {
  try {
    await Sources.create(source);
    assert.fail('Duplicate source name')
  } catch (e) {
    assert.ok(true);
  }
});

it('validateRegex, valid regex: [a-z0-9]', () => {
  const res = validateRegex('[a-z0-9]');
  assert.strictEqual(true, res)
});

it('validateRegex, valid regex A+bcd*', () => {
  const res = validateRegex('A+bcd*');
  assert.strictEqual(true, res)
});

it('validateRegex, invalid regex: [a-z0-9', () => {
  const res = validateRegex('[a-z0-9');
  assert.strictEqual(false, res)
});

it('validateRegex, invalid regex: A+bcd*)', () => {
  const res = validateRegex('A+bcd*)');
  assert.strictEqual(false, res)
});

it('validateSelectOptions, valid options', () => {
  const res = validateSelectOptions([{ label: 'HI', value: 'hi' }]);
  assert.strictEqual(true, res)
});

it('validateSelectOptions, invalid options: empty', () => {
  const res = validateSelectOptions([]);
  assert.strictEqual(false, res)
});

it('validateSelectOptions, invalid options: no label and value', () => {
  // @ts-ignore
  const res = validateSelectOptions([{ somerandomkey: 'hi' }]);
  assert.strictEqual(false, res)
});

it('validateSelectOptions, invalid options: dublicate value', () => {
  const res = validateSelectOptions([{ label: 'hi', value: 'hi' }, { label: 'hi', value: 'hi' }]);
  assert.strictEqual(false, res)
});

it('validateRequest, valid request', () => {
  const [res, message] = validateRequest({ name: 'Hi' }, { name: 'string' });
  assert.strictEqual(true, res)
});

it('validateRequest, invalid request', () => {
  const [res, message] = validateRequest({ key: 'Hi' }, { name: 'string' });
  assert.strictEqual(false, res)
  assert.strictEqual(message, "Some required keys are missing -> name")
});

it('validateRequest, invalid request: incorrect type', () => {
  const [res, message] = validateRequest({ name: 1 }, { name: 'string' });
  assert.strictEqual(false, res)
  assert.strictEqual(message,  `The expected value type for key: name is string`)
});

const fields = [{
  id: 1,
  name: 'apiKey',
  input_type: 'text',
  required: true
}, {
  id: 2,
  name: 'useHttp',
  input_type: 'checkbox',
  required: true
}, {
  id: 3,
  name: 'category',
  input_type: 'singleSelect',
  required: false
}]

it('validateAllRequiredFields, valid', () => {
  const [res, message] = validateAllRequiredFields(fields, [{ id: 1, value: 'apikey'}, { id:2, value: true }])
  assert.strictEqual(res, true);
});

it('validateAllRequiredFields, invalid: missing required ', () => {
  const [res, message] = validateAllRequiredFields(fields, [{ id: 1, value: 'apikey'}])
  assert.strictEqual(res, false);
});

it('validateAllRequiredFields, invalid: value type mismatch ', () => {
  const [res, message] = validateAllRequiredFields(fields, [{ id: 1, value: 'apikey'}, { id:2, value: 'true' }])
  assert.strictEqual(res, false);
});