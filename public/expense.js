const expenseForm =  document.querySelector('.expense-form');
const incomeForm = document.querySelector('.income-form');
const payButton = document.getElementById('pay-button');
const selectChoice = document.querySelector('span');
const token = localStorage.getItem('token');
const dateCalendar = document.getElementById('date-calendar');
const monthCalendar = document.getElementById('month-calendar');
const yearCalendar = document.getElementById('year-calendar');
const totalExpenseSpan = document.getElementById('totalExpense');
const pages = document.getElementById('pages');
const listOfExpenses = document.getElementById('listOfExpenses');

let totalExpense = 0;

function showPageButtons(currentPage,lastPage,totalItems){
    pages.innerHTML = '';

    try{
    const hasNextPage = (currentPage < lastPage)? true: false;
    const firstPageButton = document.createElement('button');
    firstPageButton.setAttribute('type','button');
    const currentPageButton = document.createElement('button');
    currentPageButton.setAttribute('type','button');
    const lastPageButton = document.createElement('button');
    lastPageButton.setAttribute('type','button');
  
    firstPageButton.innerText = '1';
    lastPageButton.innerText = `${lastPage}`;
    currentPageButton.innerText = `${currentPage}`;
    firstPageButton.classList.add('pageItems');
    lastPageButton.classList.add('pageItems');
    currentPageButton.classList.add('pageItems');
    currentPageButton.classList.add('active');
  
    if(currentPage === 1){
    firstPageButton.classList.add('active');
    }
  
    pages.appendChild(firstPageButton);
  
    if(totalItems<=1) return;
  
    if(currentPage > 2)
    {
      const previousPageButton = document.createElement('button');
      previousPageButton.setAttribute('type','button');
      previousPageButton.innerText = currentPage - 1;
      previousPageButton.classList.add('pageItems');
      pages.appendChild(previousPageButton);
    }
  
    if(currentPage!=1 && currentPage!=lastPage){
      pages.appendChild(currentPageButton);
    }
  
    if(hasNextPage && currentPage+1 != lastPage){
      const nextPageButton = document.createElement('button');
      nextPageButton.setAttribute('type','button');
      nextPageButton.innerText = currentPage + 1;
      nextPageButton.classList.add('pageItems');
      pages.appendChild(nextPageButton);
    }
    
    if(currentPage == lastPage){
    lastPageButton.classList.add('active');
    }
  
    if(lastPage !== 1){
    lastPageButton.setAttribute('type','button');
    pages.appendChild(lastPageButton);
    }
   }
   catch(e){
    console.log(e);
   }
}

async function showPage(e){

    try{
    
    if(e.target.className !== 'pageItems')
     return;

    const targetPage = +e.target.innerText;
    console.log(targetPage);
    const date = yearCalendar.value || monthCalendar.value || dateCalendar.value;
    const response = await axios.get(`http://18.237.99.237:3000/expense?date=${date}&page=${targetPage}`, {headers: {'Authorization': token}});
    const expenseList = response.data.expenseList;
    const totalPages = response.data.totalPages;
    const totalItems = response.data.totalItems;
    totalExpense = 0;
    listOfExpenses.innerHTML = '';
    expenseList.forEach((expense)=> addNewExpensetoUI(expense));
    showPageButtons(targetPage,totalPages,totalItems);
    totalExpenseSpan.innerHTML = `<b>${totalExpense}</b>`;
    }
    catch(e){
        console.log(e);
    }
}

function today(){
    let dateObj = new Date();
    let month = dateObj.getUTCMonth() + 1;
    let day = dateObj.getUTCDate();
    let year = dateObj.getUTCFullYear();

    if(day<10)
    day = '0'+day;

    if(month<10)
    month = '0'+month;

    newdate = year + "-" + month + "-" + day;
    return newdate;
}

async function addNewExpense(e){

    try{
    e.preventDefault();
    const form = new FormData(e.target);

    const expenseDetails = {
        amount: form.get("expense"),
        description: form.get("description"),
        category: form.get("category"),
        date: form.get("date")
    }

    await axios.post('http://18.237.99.237:3000/expense/addExpense',expenseDetails,{ headers: {"Authorization" : token} });

    if(expenseDetails.date === dateCalendar.value){
        addNewExpensetoUI(expenseDetails);
    }
    if(dateCalendar.value === '' && yearCalendar.value === '' && expenseDetails.date.startsWith(monthCalendar.value)){
        addNewExpensetoUI(expenseDetails);
    }
    if(dateCalendar.value === '' && monthCalendar.value === '' && expenseDetails.date.startsWith(yearCalendar.value))
        addNewExpensetoUI(expenseDetails);
    }
    catch(e)
    {
        console.log(e);
    }
}

function addNewExpensetoUI(expense){
    const expenseElemId = `expense-${expense.id}`;
    totalExpense = totalExpense + +expense.amount;

    listOfExpenses.innerHTML += `
    <tr id=${expenseElemId}>
        <td style="color:rgb(196,0,0)">${expense.amount} </td>
        <td>${expense.category}</td>
        <td>${expense.description}</td>
        <td>${expense.date}</td>
    </tr>`
}

async function getExpenseByDate(e){
    try{
    e.preventDefault();
    const date = e.target.date.value;
    monthCalendar.value = '';
    yearCalendar.value = '';
    const response = await axios.get(`http://18.237.99.237:3000/expense?date=${date}`,{ headers: {"Authorization" : token} });
    const expenseList  = response.data.expenseList;
    const totalPages = response.data.totalPages;
    const totalItems = response.data.totalItems;
    listOfExpenses.innerHTML = "";
    totalExpense = 0;
    expenseList.forEach((expense)=> addNewExpensetoUI(expense));
    totalExpenseSpan.innerHTML = `<b>${totalExpense}</b>`;
    showPageButtons(1,totalPages,totalItems);
    }
    catch(e)
    {
        console.log(e);
    }
}

async function getExpenseByMonth(e){
    try{
    e.preventDefault();
    const date = e.target.month.value;
    dateCalendar.value = '';
    yearCalendar.value = '';
    const response = await axios.get(`http://18.237.99.237:3000/expense?date=${date}`,{ headers: {"Authorization" : token} });
    const expenseList  = response.data.expenseList;
    const totalPages = response.data.totalPages;
    const totalItems = response.data.totalItems;
    listOfExpenses.innerHTML = "";
    totalExpense = 0;
    expenseList.forEach((expense)=> addNewExpensetoUI(expense));
    totalExpenseSpan.innerHTML = `<b>${totalExpense}</b>`;
    showPageButtons(1,totalPages,totalItems);
    }
    catch(e)
    {
        console.log(e);
    }
}

async function getExpenseByYear(e){
    try{
    e.preventDefault();
    const date = e.target.year.value;
    monthCalendar.value = '';
    dateCalendar.value = '';
    const response = await axios.get(`http://18.237.99.237:3000/expense?date=${date}`,{ headers: {"Authorization" : token} });
    const expenseList  = response.data.expenseList;
    const totalPages = response.data.totalPages;
    const totalItems = response.data.totalItems;
    listOfExpenses.innerHTML = '';
    totalExpense = 0;
    expenseList.forEach((expense)=> addNewExpensetoUI(expense));
    totalExpenseSpan.innerHTML = `<b>${totalExpense}</b>`;
    showPageButtons(1,totalPages,totalItems);
    }
    catch(e)
    {
        console.log(e);
    }
}

payButton.addEventListener('click',async(e)=>{

    try{
    const paymentDetails = {
        amount: 2000,
        currency: "INR",
        receipt: "rcp123"
    }

    const order = await axios.get('http://18.237.99.237:3000/payment', {headers: {'Authorization': token}});

    var options =
    {
     "amount": paymentDetails.amount,
     "current": paymentDetails.currency,
     "key": order.data.key_id, // Enter the Key ID generated from the Dashboard
     "name": "Buy Premium",
     "order_id": order.data.order.id, // For one time payment
     "prefill": {
       "name": "Sutirtha Dey",
       "email": "deysutirtha1997@gmail.com",
       "contact": "95934157XX"
     },
     "theme": {
      "color": "#3399cc"
     },
    //  This handler function will handle the success payment
     "handler": function (response) {
         axios.post('http://18.237.99.237:3000/payment/verify',{
             orderId: options.order_id,
             paymentId: response.razorpay_payment_id,
         }, { headers: {"Authorization" : token} }).then(() => {
             alert('You are a Premium User Now');
             document.body.classList.add('dark-mode');
             payButton.innerText = 'Premium Subscription is Active';
             payButton.disabled = true;
         }).catch(() => {
             alert('Something went wrong. Try Again!!!')
         })
     },
  };
        const rzp1 = new Razorpay(options);
        rzp1.open();
        e.preventDefault();

        rzp1.on('payment.failed', function (response){
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
        });
    }
    catch(e)
    {
        console.log(e);
    }
});

expenseForm.addEventListener('submit',(e)=>{
    e.preventDefault();
});

pages.addEventListener('click', showPage);

window.addEventListener('DOMContentLoaded', domContentLoad);

async function domContentLoad(){
    dateCalendar.value = today();

    try{
        const response = await axios.get(`http://18.237.99.237:3000/expense?date=${today()}`, {headers: {'Authorization': token}});
        const expenseList = response.data.expenseList;
        const totalPages = response.data.totalPages;
        const totalItems = response.data.totalItems;
        totalExpense = 0;
        expenseList.forEach((expense)=> addNewExpensetoUI(expense));
        totalExpenseSpan.innerHTML = `<b>${totalExpense}</b>`;
        if(response.data.isPremium){
          document.body.classList.add('dark-mode');
          payButton.innerText = 'Premium Subscription is Active';
          payButton.disabled = true;
        }
        showPageButtons(1,totalPages,totalItems);
    }catch(e){
        window.location.href = "http://18.237.99.237:3000";
        console.log(e);
    }
}