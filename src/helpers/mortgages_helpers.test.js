'use strict';
const Immutable = require('immutable');

const MortgagesHelpers = require('./mortgages_helpers');


describe('#calculateDownPaymentCash', () => {
  it('returns undefined when down payment is undefined', () => {
    expect(MortgagesHelpers.calculateDownPaymentCash(undefined,'$')).toBe(undefined);
  });
  describe('when down_payment_unit is $', () => {
    it('returns 0 when down payment is 0', () => {
      expect(MortgagesHelpers.calculateDownPaymentCash(0,'$',undefined)).toBe(0);
    });
    it('returns the parsed amount', () => {
      expect(MortgagesHelpers.calculateDownPaymentCash(100,'$')).toBe(100);
    });
  });

  describe('when down_payment_unit is %', () => {
    it('returns undefined when purchase_price is undefined', () => {
      expect(MortgagesHelpers.calculateDownPaymentCash(20,'%',undefined)).toBe(undefined);
    });
    it('returns 0 when down payment is 0', () => {
      expect(MortgagesHelpers.calculateDownPaymentCash(0,'%',100)).toBe(0);
    });
    it('returns the parsed amount', () => {
      expect(MortgagesHelpers.calculateDownPaymentCash(20,'$',100)).toBe(20);
    });
  })
});

describe('#calculateLoanAmount', () => {
  it('returns 80 when down_payment_cash is undefined', () => {
    expect(MortgagesHelpers.calculateLoanAmount(100,undefined)).toBe(100000);
  });
  it('returns 80 when purchase_price is undefined', () => {
    expect(MortgagesHelpers.calculateLoanAmount(undefined,20)).toBe(100000);
  });
  it('returns the difference if both are defined', () => {
    expect(MortgagesHelpers.calculateLoanAmount(100,20)).toBe(80);
  });
  it('returns the difference if down_payment_cash is 0', () => {
    expect(MortgagesHelpers.calculateLoanAmount(100,0)).toBe(100);
  });
});

describe('#calculatePayment',() => {
  it('returns undefined if term is not defined',() => {
    expect(MortgagesHelpers.calculatePayment(undefined,80,4)).toBe(undefined);
  });
  it('returns undefined if loan_amount is not defined',() => {
    expect(MortgagesHelpers.calculatePayment(360,undefined,4)).toBe(undefined);
  });
  it('returns undefined if interest_rate is not defined',() => {
    expect(MortgagesHelpers.calculatePayment(360,80,undefined)).toBe(undefined);
  });
  it('returns the correct amount',() => {
    expect(MortgagesHelpers.calculatePayment(360,80000,4)).toBe(381.93);
  });
  it('returns the correct amount',() => {
    expect(MortgagesHelpers.calculatePayment(180,80000,3)).toBe(552.47);
  });
});

describe('#calculatePointsCash',() => {
  it('returns undefined if loan_amount is not defined',() => {
    expect(MortgagesHelpers.calculatePointsCash(undefined,2)).toBe(undefined);
  });
  it('returns undefined if points is not defined',() => {
    expect(MortgagesHelpers.calculatePointsCash(80,undefined)).toBe(undefined);
  });
  it('returns the correct amount',() => {
    expect(MortgagesHelpers.calculatePointsCash(80,2)).toBe(1.60);
  });
});

describe('#calculateTotalFees',() => {
  const fees = Immutable.fromJS([{amount: 100},{amount: 40}]);
  it('returns the correct amount',() => {
    expect(MortgagesHelpers.calculateTotalFees(fees,1000)).toBe(1140);
  });

  it('returns the correct amount',() => {
    expect(MortgagesHelpers.calculateTotalFees(fees,0)).toBe(140);
  });
});

describe('#calculateTotalCredits',() => {
  const credits = Immutable.fromJS([{amount: 320},{amount: 120}]);
  it('returns the correct amount',() => {
    expect(MortgagesHelpers.calculateTotalCredits(credits)).toBe(440);
  });
});

describe('#calculateNetFees',() => {
  it('returns the difference',() => {
    expect(MortgagesHelpers.calculateNetFees(1000,400)).toBe(600);
  });
  it('returns the difference',() => {
    expect(MortgagesHelpers.calculateNetFees(0,400)).toBe(-400);
  });
});


describe('#calculateDueUpFrontCash',() => {
  it('returns undefined if loan_amount is not defined',() => {
    expect(MortgagesHelpers.calculateDueUpFrontCash(undefined,10,5)).toBe(undefined);
  });
  it('returns undefined if points is not defined',() => {
    expect(MortgagesHelpers.calculateDueUpFrontCash(20,undefined,5)).toBe(undefined);
  });
  it('returns the correct amount',() => {
    expect(MortgagesHelpers.calculateDueUpFrontCash(20,10,5)).toBe(25);
  });
});

describe('#score',() => {
  it('returns undefined if term is not defined',() => {
    expect(MortgagesHelpers.score({term: '', rate: 4.2, points: 1},4.0)).toBe(undefined);
  });
  it('returns undefined if rate is not defined',() => {
    expect(MortgagesHelpers.score({term: 360, rate: '', points: 1},4.0)).toBe(undefined);
  });
  it('returns undefined if points is not defined',() => {
    expect(MortgagesHelpers.score({term: 360, rate: 4.2, points: ''},4.0)).toBe(undefined);
  });
  it('returns the correct amount',() => {
    expect(MortgagesHelpers.score({term: 360, rate: 4.2, points: 1}, 4)).toBeCloseTo(0.82846);
  });
});

