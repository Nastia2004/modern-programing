export function toPositiveInteger(value, fallback) {
  const number = Number.parseInt(value, 10);
  return Number.isInteger(number) && number > 0 ? number : fallback;
}

export function findById(collection, id) {
  return collection.find((item) => item.id === Number(id));
}

export function findIndexById(collection, id) {
  return collection.findIndex((item) => item.id === Number(id));
}

export function paginate(items, query) {
  const page = toPositiveInteger(query.page, 1);
  const limit = Math.min(toPositiveInteger(query.limit, 10), 100);
  const total = items.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const start = (page - 1) * limit;

  return {
    data: items.slice(start, start + limit),
    meta: {
      page,
      limit,
      total,
      totalPages
    }
  };
}

export function sortItems(items, sortBy = 'id', order = 'asc') {
  const direction = order === 'desc' ? -1 : 1;

  return [...items].sort((a, b) => {
    const first = a[sortBy];
    const second = b[sortBy];

    if (first === undefined || second === undefined) {
      return 0;
    }

    if (typeof first === 'string' && typeof second === 'string') {
      return first.localeCompare(second) * direction;
    }

    if (first > second) {
      return direction;
    }

    if (first < second) {
      return -direction;
    }

    return 0;
  });
}

export function createError(reply, statusCode, message) {
  return reply.code(statusCode).send({
    error: message,
    statusCode
  });
}
