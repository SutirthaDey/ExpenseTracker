const expenseForm =  document.querySelector('.expense-form');
const token = localStorage.getItem('token');


expenseForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    console.log(e.target.amount.value);
    console.log(e.target.description.value);
    console.log(e.target.category.value);
})

window.addEventListener('load', async()=>{
    try{
        const response = await axios.get('http://localhost:3000/expense', {headers: {'Authorization': token}});
        console.log(response);
    }catch(e){
        window.location.href = "http://localhost:3000";
        console.log(e);
    }
})