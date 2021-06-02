const Modal = {
  modalOverlay: document.querySelector(".modal-overlay"),

  openOrClose() {
    this.modalOverlay.classList.toggle("active")
  },
}

const Storage = {
  get(){
    return JSON.parse(localStorage.getItem("dev.finances:transactions")) || [];
  },

  set(transactions){
    localStorage.setItem(`dev.finances:transactions`, JSON.stringify(transactions));
  }
}

const Transaction = {
  all: Storage.get(),

  add(transaction){
    Transaction.all.push(transaction);

    App.reload()
  },

  remove(index){
    this.all.splice(index, 1);

    App.reload();
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
}

const DOM = {
  transactionsContainer: document.querySelector("#data-table tbody"),
  income: document.querySelector("#incomeDisplay"),
  outcome: document.querySelector("#expenseDisplay"),
  total: document.querySelector("#totalDisplay"),

  addTransaction(transaction, index){
    const tr = document.createElement("tr");
    tr.innerHTML = DOM.innnerHTMLTransaction(transaction, index);
    tr.dataset.index = index;

    DOM.transactionsContainer.appendChild(tr);
  },

  innnerHTMLTransaction(transaction,index){
    const isIncomeOrOutcome = transaction.amount > 0 ? "income" : "expense"; 
    const formatedAmount = Utils.formatCurrency(transaction.amount);

    const trContent = `
      <td class="description">${transaction.description}</td>
      <td class="${isIncomeOrOutcome}">${formatedAmount}</td>
      <td class="date">${transaction.date}</td>
      <td>
        <img onclick="Transaction.remove(${index})" src="assets/minus.svg" alt="">
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
    const signal = Number(value) < 0 ? "-" : "";

    // /\D/g irá remover qualquer coisa que não seja numero do valor
    value = String(value).replace(/\D/g, "");

    value = Number(value) / 100;

    value = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value);

    const valueFormated = signal + value;
    return valueFormated;
  },

  formatAmount(amount){
    amount = amount * 100;
    return Math.round(amount);
  },

  formatDate(date){
    const splittedDate = date.split("-");
    // const dateFormatted = `${newDate[2]}/${newDate[1]}/${newDate[0]}`;
    const dateFormatted = splittedDate.reverse().join("/");
    return dateFormatted;
  }
}

const Form = {
  description: document.querySelector("input#description"),
  amount: document.querySelector("input#amount"),
  date: document.querySelector("input#date"),

  getValues(){
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }
  },

  validateFields(){
    const { description, date, amount } = Form.getValues();

    if(!description || !date || !amount){
      throw new Error("Por favor, preencha todos os campos")
    }
  },

  formatValue(){
    let { description, date, amount } = Form.getValues();
    amount = Utils.formatAmount(amount);
    date = Utils.formatDate(date);

    return {
      description,
      amount,
      date
    }
  },

  saveTransaction(transaction){
    Transaction.add(transaction)
  },

  clearFields(){
    Form.description.value = "";
    Form.date.value = "";
    Form.amount.value = "";
  },

  submit(event){
    event.preventDefault();

    try {
      Form.validateFields();
      const transaction = Form.formatValue();
      Form.saveTransaction(transaction);
      Form.clearFields();
      Modal.openOrClose();
    } catch(error) {
      alert(error.message);
    }
  }
} 

const App = {
  //Está gerando os dados
  init(){
    Transaction.all.forEach( DOM.addTransaction);
    
    DOM.updateBalance();

    Storage.set(Transaction.all);
  },

  //Está recriando os dados novamente
  reload(){
    DOM.clearTransactions();
    App.init();
  }
}

App.init();