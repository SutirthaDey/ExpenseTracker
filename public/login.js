const loginForm =  document.querySelector('.login-form');

async function logIn(e){
    try{
        e.preventDefault();

        const userData = {
            email: e.target.email.value,
            password: e.target.password.value
        }

        console.log(userData);
        alert('Successfully Logged In!')
        }
        catch(error)
        {
            userDoesNotExists();
        }      
}

function userDoesNotExists(){
    alert('User does not exists!');
}

loginForm.addEventListener('submit', logIn);