const expenseForm =  document.querySelector('.expense-form');
const incomeForm = document.querySelector('.income-form');
const payButton = document.getElementById('pay-button');
const selectChoice = document.querySelector('span');
const token = localStorage.getItem('token');
const dateCalendar = document.getElementById('date-calendar');
const monthCalendar = document.getElementById('month-calendar');
const yearCalendar = document.getElementById('year-calendar');

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

    await axios.post('http://localhost:3000/expense/addExpense',expenseDetails,{ headers: {"Authorization" : token} });

    if(expenseDetails.date === dateCalendar.value){
        addNewExpensetoUI(expenseDetails);
    }
    if(dateCalendar.value === '' && yearCalendar.value === '' && expenseDetails.date.startsWith(monthCalendar.value)){
        addNewExpensetoUI(expenseDetails);
    }
    if(dateCalendar.value === '' && monthCalendar.value === '' && expenseDetails.date.startsWith(yearCalendar.value))
        addNewExpensetoUI(expenseDetails);
    
    console.log(1);
    }
    catch(e)
    {
        console.log(e);
    }
}

function addNewExpensetoUI(expense){
    const parentElement = document.getElementById('listOfExpenses');
    const expenseElemId = `expense-${expense.id}`;
    parentElement.innerHTML += `
        <li id=${expenseElemId}>
            ${expense.amount} - ${expense.category} - ${expense.description} - ${expense.date}
            <button onclick='deleteExpense(event, ${expense.id})'>
                Delete Expense
            </button>
        </li>`
}

async function getExpenseByDate(e){
    try{
    e.preventDefault();
    const date = e.target.date.value;
    monthCalendar.value = '';
    yearCalendar.value = '';
    const parentElement = document.getElementById('listOfExpenses');
    const response = await axios.get(`http://localhost:3000/expense?date=${date}`,{ headers: {"Authorization" : token} });
    const expenseList  = response.data.expenseList;
    parentElement.innerHTML = "";
    expenseList.forEach((expense)=> addNewExpensetoUI(expense));
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
    const parentElement = document.getElementById('listOfExpenses');
    const response = await axios.get(`http://localhost:3000/expense?date=${date}`,{ headers: {"Authorization" : token} });
    const expenseList  = response.data.expenseList;
    parentElement.innerHTML = "";
    expenseList.forEach((expense)=> addNewExpensetoUI(expense));
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
    const parentElement = document.getElementById('listOfExpenses');
    const response = await axios.get(`http://localhost:3000/expense?date=${date}`,{ headers: {"Authorization" : token} });
    const expenseList  = response.data.expenseList;
    parentElement.innerHTML = "";
    expenseList.forEach((expense)=> addNewExpensetoUI(expense));
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

    const order = await axios.get('http://localhost:3000/payment', {headers: {'Authorization': token}});

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
         axios.post('http://localhost:3000/payment/verify',{
             orderId: options.order_id,
             paymentId: response.razorpay_payment_id,
         }, { headers: {"Authorization" : token} }).then(() => {
             alert('You are a Premium User Now');
             document.body.classList.add('dark-mode');
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
})

window.addEventListener('DOMContentLoaded', domContentLoad);

async function domContentLoad(){
    dateCalendar.value = today();

    try{
        const response = await axios.get(`http://localhost:3000/expense?date=${today()}`, {headers: {'Authorization': token}});
        const expenseList = response.data.expenseList;
        expenseList.forEach((expense)=> addNewExpensetoUI(expense));
        if(response.data.isPremium){
          document.body.classList.add('dark-mode');
          payButton.innerText = 'Premium Subscription is Active';
          payButton.disabled = true;
        }
    }catch(e){
        window.location.href = "http://localhost:3000";
        console.log(e);
    }
}