import { createSelector } from 'reselect';

const getPortfolio = (state) => state.modelPortfolio;
const getAuthenticated = (state) => state.user.authenticated;
const getInvestmentAmount = (state) => state.investmentAmount.investmentAmount;

const getSymbolSelect = (symbol) => {
  let valid = true;
  let hintText = '';
  let errorText = '';
  if (!symbol.value) {
    valid = false;
    errorText = 'Required';
  }
  if (!symbol.setOnce) {
    hintText = 'AAPL';
  }
  return {
    valid,
    hintText,
    errorText
  };
};

const getAllocationSelect = (allocation) => {
  let valid = true;
  const number = Number(allocation.value);
  let hintText = '';
  let errorText = '';
  if (allocation.value === '') {
    errorText = 'Required';
    valid = false;
  } else if (typeof number !== 'number' || isNaN(number) || !isFinite(number)) {
    errorText = 'Number required';
    valid = false;
  } else if (number < 0) {
    errorText = '0 minimum';
    valid = false;
  } else if (number > 100) {
    errorText = '100 maximum';
    valid = false;
  }
  if (!allocation.setOnce) {
    hintText = '0';
  }
  return {
    valid,
    number,
    hintText,
    errorText
  };
};

const getPriceSelect = (price) => {
  let valid = true;
  const number = Number(price.value);
  let hintText = '';
  let errorText = '';
  if (price.value === '') {
    errorText = 'Required';
    valid = false;
  } else if (typeof number !== 'number' || isNaN(number) || !isFinite(number)) {
    errorText = 'Number required';
    valid = false;
  } else if (number < 0.01) {
    errorText = '0.01 minimum';
    valid = false;
  }
  if (!price.setOnce) {
    hintText = '1.00';
  }
  return {
    valid,
    number,
    hintText,
    errorText
  };
};

const getUnitsSelect = (units) => {
  let valid = true;
  const number = Number(units.value);
  let hintText = '';
  let errorText = '';
  if (units.value === '') {
    errorText = 'Required';
    valid = false;
  } else if (typeof number !== 'number' || isNaN(number) || !isFinite(number)) {
    errorText = 'Number required';
    valid = false;
  } else if (number < 0) {
    errorText = '0 minimum';
    valid = false;
  }
  if (!units.setOnce) {
    hintText = '0';
  }
  return {
    valid,
    number,
    hintText,
    errorText
  };
};

const getSecuritySelect = (security) => {
  return {
    symbolSelect: getSymbolSelect(security.symbol),
    allocationSelect: getAllocationSelect(security.allocation),
    priceSelect: getPriceSelect(security.price),
    unitsSelect: getUnitsSelect(security.units)
  };
};

const getSecuritiesSelect = (portfolio) => {
  const securitiesSelect = [];
  for (const security of portfolio) {
    securitiesSelect.push(getSecuritySelect(security));
  }
  return securitiesSelect;
};

const getSecuritiesAreValid = (securitiesSelect) => {
  for (const securitySelect of securitiesSelect) {
    if (!securitySelect.symbolSelect.valid || !securitySelect.allocationSelect.valid || !securitySelect.priceSelect.valid || !securitySelect.unitsSelect.valid) {
      return false;
    }
  }
  return true;
};

const getInvestmentAmountSelect = (investmentAmount) => {
  let valid = true;
  const number = Number(investmentAmount.value);
  let hintText = '';
  let errorText = '';
  if (investmentAmount.value === '') {
      errorText = 'Required';
      valid = false;
  } else if (typeof number !== 'number' || isNaN(number) || !isFinite(number)) {
      errorText = 'Number required';
      valid = false;
  }
  if (!investmentAmount.setOnce) {
    hintText = '0';
  }
  return {
    valid,
    number,
    hintText,
    errorText
  };
  return true;
};

const getSaveModelPortfolioButtonVisibility = (authenticated, selectedModelPortfolio, securitiesAreValid) => {
  if (!authenticated) {
    return 'hidden';
  }
  if (selectedModelPortfolio.valid === 0) {
    return 'disabled';
  }
  if (!securitiesAreValid) {
    return 'disabled';
  }
  return 'visible';
};

const getDeleteModelPortfolioButtonVisibility = (authenticated, selectedModelPortfolio) => {
  if (!authenticated) {
    return 'hidden';
  }
  if (!selectedModelPortfolio.email) {
    return 'disabled';
  }
  return 'visible';
};

const getGenerateStepsButtonVisibility = (investmentAmountSelect, securitiesAreValid) => {
  if (!investmentAmountSelect.valid || !securitiesAreValid) {
    return 'disabled';
  }
  return 'visible';
};


export default getPortfolioSelect = createSelector([
  getPortfolio,
  getAuthenticated,
  getInvestmentAmount
], (portfolio, authenticated, investmentAmount) => {
  const securitiesSelect = getSecuritiesSelect(portfolio.portfolio);
  const securitiesAreValid = getSecuritiesAreValid(securitiesSelect);
  const investmentAmountSelect = getInvestmentAmountSelect(investmentAmount);
  const saveModelPortfolioButtonVisibility = getSaveModelPortfolioButtonVisibility(authenticated, portfolio.selectedModelPortfolio, securitiesAreValid);
  const deleteModelPortfolioButtonVisibility = getDeleteModelPortfolioButtonVisibility(authenticated, portfolio.selectedModelPortfolio);
  const generateStepsButtonVisibility = getGenerateStepsButtonVisibility(investmentAmountSelect, securitiesAreValid);
  return {
    securitiesSelect,
    investmentAmountSelect,
    saveModelPortfolioButtonVisibility,
    deleteModelPortfolioButtonVisibility,
    generateStepsButtonVisibility
  };
});