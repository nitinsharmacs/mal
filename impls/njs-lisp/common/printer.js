const pr_str = (malValue, print_readably) => {
  if (malValue instanceof Function) {
    return '#<function>';
  }

  return malValue?.toString(print_readably);
};

exports.pr_str = pr_str;
