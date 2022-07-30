const expenseForm =  document.querySelector('.expense-form');
const payButton = document.getElementById('pay-button');
const token = localStorage.getItem('token');


payButton.addEventListener('click',async(e)=>{

    try{
    const paymentDetails = {
        amount: 2000,
        currency: "INR",
        receipt: "rcp123"
    }

    const order = await axios.post('http://localhost:3000/payment',paymentDetails);
    console.log(order);
    }
    catch(error)
    {
        console.log(error);
    }
});


expenseForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    console.log(e.target.amount.value);
    console.log(e.target.description.value);
    console.log(e.target.category.value);
})

window.addEventListener('load', async()=>{
    try{
        const response = await axios.get('http://localhost:3000/expense', {headers: {'Authorization': token}});
    }catch(e){
        window.location.href = "http://localhost:3000";
        console.log(e);
    }
})