
import './App.css';
import React, {useState , useEffect} from 'react';
import Axios from "axios"
import socketIOClient from "socket.io-client";



const ENDPOINT = "http://127.0.0.1:3001";


function App() {
  const [response, setResponse] = useState("");
  const [pseudo, setPseudo] = useState('');

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("FromAPI", data => {
      setResponse(data);
    });
  }, []);

  const submitReview = ()=>{

      Axios.post('http://localhost:3001/insert', {
          pseudo:pseudo
       })
       
      //  .then(()=>{
      //   alert('successfull insert');
      // });

  };
  return (
    <div className="App">
     <h1>Inscription</h1>
      <div className="form">
        <label for="">Pseudo:</label>
          <input type="text" name="pseudo" onChange={(e)=>{
            setPseudo(e.target.value)
          }}/>
          <button onClick={submitReview} >Submit</button>
      </div>

          <h1>Message</h1>
        <div id="messages">

      </div>
      <form action="">
          <input id="msg" autocomplete="off"/> <button >Envoyer</button>
      </form>
      <p>
      It's <time dateTime={response}>{response}</time>
    </p>

    </div>
  );
}

export default App;
