const parseType = (type) => {
  const isString = typeof type === 'string';

  if (!isString) return;

  const isType = (type) => ['work', 'home', 'personal'].includes(type);

  if (isType(type)) return type;
};

const parseIsFavourite = (value) => {
  if (value === 'true') return true;
  if (value === 'false') return false;

  return;
};

export const parseFilterParams = (query) => {
  const { contactType, isFavourite } = query;

  const parsedType = parseType(contactType);
  const parsedBoollen = parseIsFavourite(isFavourite);

  return {
    contactType: parsedType,
    isFavourite: parsedBoollen,
  };
};
