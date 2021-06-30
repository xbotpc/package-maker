type ValueType = string | number | null | undefined;

const isEmpty = (value: ValueType): boolean => value === '' || value === 0 || value === null || value === undefined;


export default isEmpty;