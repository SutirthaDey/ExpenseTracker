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

    const order = await axios.get('http://localhost:3000/payment', {headers: {'Authorization': token}});
    console.log(order);
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
         console.log(response);
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

    console.log(e.target.amount.value);
    console.log(e.target.description.value);
    console.log(e.target.category.value);
})

window.addEventListener('DOMContentLoaded', domContentLoad);

async function domContentLoad(){
    try{
        const response = await axios.get('http://localhost:3000/expense', {headers: {'Authorization': token}});
        if(response.data.isPremium)
        document.body.classList.add('dark-mode'); 
    }catch(e){
        window.location.href = "http://localhost:3000";
        console.log(e);
    }
}