export const experimentKeys = {
  all: ["experiment-runner"] as const,
  runSql: () => [...experimentKeys.all, "run-sql"] as const,
};
