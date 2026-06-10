import React,{useState} from 'react';
import axios from 'axios';
const handleSubmit=(e)=>{
    e.preventDefault();
    try{
        const response = await axios.post('http:localhost:8000/api/login',formData);
        alert('login success');
    }catch{
        alert(error.response.message);
    }
}
const onChange=(e)=>{

}
return (
    <div style="container">
        <table class="table">
        <form onSubmit={handleSubmit}>
            <tr>
                <td>
                <h2>Login Page</h2>
                </td>
            </tr>
            <tr>
                <td><lable>Email</lable></td>
                <td><input type="email" name="email" onChange={handleChange}></input></td>
            </tr>
            <tr>
                <td><lable>Password</lable></td>
                <td><input type="password" name="password" ></input></td>
            </tr>
            <tr>
                <input type="submit" name="login"></input>
            </tr>
        </form>
        </table>
    </div>
);
export default test;