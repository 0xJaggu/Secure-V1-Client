import './App.css';
import {useState,useEffect} from 'react';
import Axios from "axios";

function App(){

const [acc,setAcc]=useState("")
const [pass,setPass]=useState("")
const [listAcc,setList]=useState([])

const addDetails=()=>
{
  Axios.post("https://secure-v1.herokuapp.com/insert",{account:acc,password:pass})
  .then((res)=>{
    setList([...listAcc,{_id:res.data._id,account:acc,password:res.data.password,iv:res.data.iv}])
  })
  .catch((err)=>{
    console.log(err)
  })
}


const updatePass=(id)=>
{
  const newPass=prompt("Enter the new password : ")
  Axios.put("https://secure-v1.herokuapp.com/update",{id:id,password:newPass})
  .then((res)=>{
    console.log(res)
    setList(listAcc.map((val)=>{
      return val._id==id?{_id:id,account:val.account,password:res.data.password,iv:res.data.iv}:val;
    }))
  })
}

const deleteAcc =(id)=>{
  Axios.delete(`https://secure-v1.herokuapp.com/delete/${id}`)
  .then((res)=>{
    setList(listAcc.filter((val)=>{
      return val._id!=id
    }))
  })

}
useEffect(()=>{
  Axios.get("https://secure-v1.herokuapp.com/getUser")
  .then((res)=>{
  setList(res.data)})
},[]);  

const decrypt=async(val)=>{
  console.log(val.iv)
  await axios.post("https://secure-v1.herokuapp.com/getPass",{password:val.password,iv:val.iv})
  .then((res)=>{
    setList(listAcc.map((value)=>{
      return value._id==val._id?{_id:val._id,account:val.account,password:res.data,iv:val.iv}:value;
    }))

  })
}

  return (
    <div className="App">
     <div classname ="input">
       Account : <input type="text" onChange={(event)=>{setAcc(event.target.value)}} /><br/>
       Password : <input type="password" onChange={(event)=>{setPass(event.target.value)}} /><br/>
       <button onClick={addDetails}>ADD</button>
     </div>
     {listAcc.map((val)=>{
       return <div classname="display">
         <br/>
         ACC : {val.account}<br/>
         <div onClick={()=>{
           
           decrypt(val)
         }}>
         Password : {val.password}
         </div>
         <br/>
         <button onClick={ () => {
            updatePass(val._id)
            }}>Update</button>
            <button onClick={()=>{
              deleteAcc(val._id)
            }}>Delete</button>
         <br/>
       </div>
     })}
     
    </div>
  );
}

export default App;
