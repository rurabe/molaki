'use strict';

const _sumSparseList = (list) => {
  if(!list){ return 0 }
  return list.reduce((agg,l) => {
    if( l && l.get('amount') && parseFloat(l.get('amount')) ){
      return agg + parseFloat(l.get('amount'));
    } else {
      return agg;
    }
  },0);
};

const present = n => { if(n || n === '0' || n === 0){ return true; } };

const calculateDownPaymentCash = (down_payment,down_payment_unit,purchase_price) => {
  if(present(down_payment)){
    if(down_payment_unit === '$'){
      return parseFloat(down_payment)
    } else if(down_payment_unit === '%' && present(purchase_price)){
      return (down_payment/100) * purchase_price;
    }
  }
};

const calculateLoanAmount = (purchase_price,down_payment_cash) => {
  if(present(purchase_price) && present(down_payment_cash)){
    return purchase_price - down_payment_cash;
  } else { return 100000; }
};

const calculatePayment = (loan_term,loan_amount,interest_rate) => {
  if(present(loan_term) && present(loan_amount) && present(interest_rate)){
    let i = interest_rate / 1200;
    let amt = (i * loan_amount) / (1 - Math.pow(1 + i,loan_term * -1));
    return parseFloat(amt.toFixed(2));
  }
};

const calculatePointsCash = (loan_amount,points) => {
  if(present(loan_amount) && present(points)){
    return parseFloat((loan_amount * (points / 100)).toFixed(2));
  }
};

const calculateTotalFees = (fees,points_cash) => {
  return _sumSparseList(fees) + (points_cash || 0);
};

const calculateTotalCredits = (credits) => {
  return _sumSparseList(credits);
};

const calculateNetFees = (total_fees,total_credits) => {
  return total_fees - total_credits;
};

const calculateDueUpFrontCash = (down_payment_cash,points_cash,net_fees) => {
  if(present(down_payment_cash) && present(points_cash)){
    return down_payment_cash + net_fees;
  } 
};

const pv = (loan_term,payment,interest_rate) => {
  let i = parseFloat(interest_rate) / 1200;
  return (payment / i) * (1 - (1 / Math.pow(1+i,loan_term)))
};

const calculatePayments = (m,baselineRate) => {
  const term = m.term;
  const downPaymentCash = calculateDownPaymentCash(m.down_payment,m.down_payment_unit,m.purchase_price);
  const loanAmount = calculateLoanAmount(m.purchase_price,calculateDownPaymentCash());
  const pointsCash = calculatePointsCash(loanAmount,m.points);
  const totalFees = calculateTotalFees(m.fees,pointsCash);
  const totalCredits = calculateTotalCredits(m.credits);
  return {
    payment: calculatePayment(term,loanAmount,m.rate),
    netFees: calculateNetFees(totalFees,totalCredits),
    loanAmount: loanAmount,
  };
};

const calculateScore = (npv,baselineNpv) => {
  const profitMargin = ((Math.max(npv,baselineNpv) / baselineNpv) - 1);
  return Math.max(1 - (profitMargin * 5),0);
};

const score = (m,baselineRate) => {
  if(present(m.term) && present(m.rate) && present(m.points)){
    const {payment,netFees,loanAmount} = calculatePayments(m,baselineRate);
    const pvPayments = pv(m.term,payment,baselineRate);
    const npv = pvPayments + netFees;
    return calculateScore(npv,loanAmount);
  }
};

const scores = (m,baselineRate) => {
  if(present(m.term) && present(m.rate) && present(m.points)){
    const {payment,netFees,loanAmount} = calculatePayments(m,baselineRate);
    const baselinePayment = calculatePayment(m.term,loanAmount,baselineRate);
    return [12,36,72,108,144,180,216,252,288,324,360].map(t => {
      const pvPayments = pv(t,payment,baselineRate);
      const npv = pvPayments + netFees;
      const baseline = pv(t,baselinePayment,baselineRate);
      return calculateScore(npv,baseline);
    });
  }
};

const _gradeMins = [
  ['A+',(96 + (2/3))/100],
  ['A', (93 + (1/3))/100],
  ['A-',(90        )/100],
  ['B+',(86 + (2/3))/100],
  ['B', (83 + (1/3))/100],
  ['B-',(80        )/100],
  ['C+',(76 + (2/3))/100],
  ['C', (73 + (1/3))/100],
  ['C-',(70        )/100],
  ['D+',(66 + (2/3))/100],
  ['D', (63 + (1/3))/100],
  ['D-',(60        )/100]
];

const grade = function(score){
  for(let i=0;i<_gradeMins.length;i++){
    if(score >= _gradeMins[i][1]){ return _gradeMins[i][0] }
  }
  return 'F';
};

module.exports = {
  score,
  scores,
  grade,
  calculateDownPaymentCash,
  calculateLoanAmount,
  calculatePayment,
  calculatePointsCash,
  calculateTotalFees,
  calculateTotalCredits,
  calculateNetFees,
  calculateDueUpFrontCash,
  calculatePayments,
};
