interface RequiredFields {
  [key: string]: 'string' | 'boolean' | 'number';
}

const getSetDifference = (setA: Set<string>, setB: Set<string>) => {
  return [...setA].filter(element => !setB.has(element))
}

export const validateRequest = (req: any, reqiredFields: RequiredFields) => {
  if (typeof req !== 'object') return [false, 'request body expected to be JSON'];
  const requiredFieldKeys = new Set(Object.keys(reqiredFields));
  const foundFieldsSet = new Set<string>();
  for (let key in req) {
    const value = req[key];
    // Extra keys, we simply ignore
    if (!reqiredFields[key]) continue;
    foundFieldsSet.add(key);
    if (typeof value !== reqiredFields[key]) {
      return [false, `The expected value type for key: ${key} is ${reqiredFields[key]}`]
    }
  }
  if (foundFieldsSet.size !== requiredFieldKeys.size) {
    const missingKeysArr = getSetDifference(requiredFieldKeys, foundFieldsSet)
    return [false, `Some required keys are missing -> ${missingKeysArr}`]
  }
  return [true, ''];
}

export const validateRegex = (regex: string) => {
  let isValid = true;
  try {
      new RegExp(regex);
  } catch(e) {
      isValid = false;
  }
  return isValid
}

export const validateSelectOptions = (options: { label: string, value: string }[]) => {
  if (!Array.isArray(options) || options.length === 0) return false;
  const allValueSet = new Set<string>();
  for (let idx in options) {
    if (!options[idx].label || !options[idx].value) return false;
    if (allValueSet.has(options[idx].value)) return false;
    allValueSet.add(options[idx].value);
  }
  return true;
}