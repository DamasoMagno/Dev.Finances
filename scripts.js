const Modal = {
  modaOverlay: document.querySelector(".modal-overlay"),

  openOrClose() {
    this.modaOverlay.classList.toggle("active")
  },
};

const transactions = [
  { id: 1, description: "Luz", amount: -50000, date: "23/01/2021" },
  { id: 2, description: "Criação de Website", amount: 500000, date: "23/01/2021" }, 
  { id: 3, description: "Inertnet", amount: -20013, date: "23/01/2021" },
  { id: 3, description: "Inertnet", amount: 200000, date: "23/01/2021" },
];

const Transaction = {
  all: transactions,
  add(transaction){
    this.all.push(transaction);
  },
  
  incomes(){
    let income = this.all.reduce((acc, currentValue) => {
      if(currentValue.amount > 0) {
        acc += currentValue.amount
      };
      return acc;
    }, 0);

    return income;
  },

  expenses(){
    let expense = this.all.reduce((acc, currentValue) => {
      if(currentValue.amount < 0) acc += currentValue.amount;
      return acc;
    }, 0);
    
    return expense;
  },

  total(){
    //Expense retorna um numero negativo, e quando colocamos - ele irá somar o expense com income
    return this.incomes() + this.expenses();
  }
};

const DOM = {
  transactionsContainer: document.querySelector("#data-table tbody"),
  income: document.querySelector("#incomeDisplay"),
  outcome: document.querySelector("#expenseDisplay"),
  total: document.querySelector("#totalDisplay"),

  addTransaction(transaction, index){
    const tr = document.createElement("tr");
    tr.innerHTML = this.innnerHTMLTransaction(transaction);

    this.transactionsContainer.appendChild(tr);
  },

  innnerHTMLTransaction(transaction){
    const isIncomeOrOutcome = transaction.amount > 0 ? "income" : "expense"; 
    const formatedAmount = Utils.formatCurrency(transaction.amount);

    const trContent = `
      <td class="description">${transaction.description}</td>
      <td class="${isIncomeOrOutcome}">${formatedAmount}</td>
      <td class="date">${transaction.date}</td>
      <td>
        <img src="assets/minus.svg" alt="">
      </td>
    `

    return trContent;
  },

  updateBalance(){
    this.income.innerHTML = Utils.formatCurrency(Transaction.incomes());
    this.outcome.innerHTML = Utils.formatCurrency(Transaction.expenses());
    this.total.innerHTML = Utils.formatCurrency(Transaction.total());
  },

  clearTransactions(){
    this.transactionsContainer.innerHTML = "";
  }
}

const Utils = {
  formatCurrency(value){ 
    /*
      const signal = Number(value) < 0 ? "-" : "";
      value = String(value).replace(/\D/g, "");
    */

    value = Number(value) / 100;

    value = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value);

    const valueFormated = value;
    return valueFormated;
  }
}

transactions.forEach( transaction =>  {
  DOM.addTransaction(transaction);
});

DOM.updateBalance();

Transaction.add({
  id: 200,
  description: "Terminar o discovery",
  amount: 23000,
  date: "02/04/2021"
}); 