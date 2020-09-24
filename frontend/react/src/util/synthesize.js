import jsonpath from "./jsonpath";

// For the identity case, just return the first target value.
const identity = ([value]) => value;

const percent = ([numerator, denominator], precision = 2) => {
  if (+denominator !== 0) {
    // Exponent. Because Math.round always rounds off all decimals, preemptively
    // multiply by some number of tens to get the right precision.
    const exp = precision > 0 ? Math.pow(10, precision) : 1;
    const pct = (+numerator * exp * 100) / +denominator;

    if (!Number.isNaN(pct)) {
      // Rather than doing additional math to get the decimal precision, since
      // that's just another place we can create Wrong Math™, split the result
      // from above into individual characters and insert a decimal point in
      // the right place.
      const pctNumbers = `${Math.round(pct)}`.split("");
      pctNumbers.splice(pctNumbers.length - precision, 0, ".");

      // If the first character is a decimal, then we're less than 1 percent
      // and we should prepend a 0. We want "0.1%", not ".1%".
      if (pctNumbers[0] === ".") {
        pctNumbers.unshift(0);
      }

      // Now put it all back together.
      return `${pctNumbers.join("")}%`;
    }
  }

  // Denominator is NaN or 0, or the division operation results in NaN
  return null;
};

// Maaaaaaaath.
const sum = (values) => values.reduce((acc, value) => acc + +value, 0);

export const synthesizeValue = (value, state) => {
  if (value.contents) {
    return value;
  }

  if (value.targets) {
    const targets = value.targets.map(
      (target) => jsonpath.query(state, target)[0]
    );

    if (value.actions) {
      // For now, per the documentation, we only handle a single action, but
      // we'll have to solve for the more complicated case too. But not yet.
      const action = value.actions[0];

      switch (action) {
        case "identity":
          return { contents: identity(targets) };
        case "percentage":
          return { contents: percent(targets, value.precision) };
        case "sum":
          return { contents: sum(targets) };

        default:
          return { contents: targets[0] };
      }
    }

    return {
      contents: targets[0],
    };
  }

  // We don't know how to handle this value, so return it unchanged.
  return value;
};
