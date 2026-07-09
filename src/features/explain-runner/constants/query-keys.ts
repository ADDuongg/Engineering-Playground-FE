export const explainKeys = {
  all: ["explain-runner"] as const,
  runSql: () => [...explainKeys.all, "run-sql"] as const,
};
