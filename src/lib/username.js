const MAX_USERNAME_LENGTH = 30;

const normalizeName = (name) => {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .trim();
};

const createUsernameBase = (name) => {
  const normalized = normalizeName(name);

  if (normalized.length >= 3) {
    return normalized.slice(0, MAX_USERNAME_LENGTH);
  }

  return `user${normalized || "account"}`.slice(0, MAX_USERNAME_LENGTH);
};

export const generateUniqueUsername = async (name, db) => {
  const base = createUsernameBase(name);

  const users = db.collection("user");

  // Check base username first
  const exactMatch = await users.findOne(
    {
      username: base,
    },
    {
      projection: {
        _id: 1,
      },
    },
  );

  if (!exactMatch) {
    return base;
  }

  // Generate username with numeric suffix
  let counter = 1;

  while (counter <= 999999) {
    const suffix = String(counter).padStart(2, "0");

    const availableLength = MAX_USERNAME_LENGTH - suffix.length;

    const candidate = `${base.slice(0, availableLength)}${suffix}`;

    const exists = await users.findOne(
      {
        username: candidate,
      },
      {
        projection: {
          _id: 1,
        },
      },
    );

    if (!exists) {
      return candidate;
    }

    counter += 1;
  }

  throw new Error("Unable to generate a unique username.");
};
