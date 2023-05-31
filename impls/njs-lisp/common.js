const partition = (args) => {
  const g = [];
  for (let i = 0; i < args.length - 1; i += 2) {
    g[i] = [args[i], args[i + 1]];
  }
  return g.filter((x) => x?.length > 0);
};

module.exports = { partition };
