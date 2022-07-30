const expenseForm =  document.querySelector('.expense-form');


expenseForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    console.log(e.target.amount.value);
    console.log(e.target.description.value);
    console.log(e.target.category.value);
})