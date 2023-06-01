const pr_str = (malValue) => {
  if (malValue instanceof Function) {
    return '#<function>';
  }

  return malValue?.toString();
};

exports.pr_str = pr_str;
