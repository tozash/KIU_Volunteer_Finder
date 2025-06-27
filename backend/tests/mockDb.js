export function createMockDb({ users = [], applications = [], events = [] } = {}) {
  // Normalize IDs so every entry has `id`
  const normalize = (arr, key) => arr.map((item) => ({ ...item, id: item[key] }));

  const dbData = {
    users: normalize(users, 'user_id'),
    applications: normalize(applications, 'application_id'),
    events: normalize(events, 'event_id'),
  };

  return {
    collection(name) {
      if (!dbData[name]) {
        throw new Error(`Unexpected collection: ${name}`);
      }

      return {
        get: async () => ({
          docs: dbData[name].map((doc) => ({
            data: () => doc,
            id: doc.id,
          })),
        }),

        doc: (id) => ({
          set: async (data) => {
            const entry = { ...data, id };
            const existingIndex = dbData[name].findIndex((d) => d.id === id);
            if (existingIndex !== -1) {
              dbData[name][existingIndex] = entry;
            } else {
              dbData[name].push(entry);
            }
          },

          get: async () => {
            const entry = dbData[name].find((d) => d.id === id);
            return {
              exists: !!entry,
              data: () => entry,
            };
          },

          update: async (updates) => {
            const index = dbData[name].findIndex((d) => d.id === id);
            if (index !== -1) {
              dbData[name][index] = { ...dbData[name][index], ...updates };
            } else {
              throw new Error(`Document ${id} not found in collection ${name}`);
            }
          },
        }),
      };
    },
  };
}
