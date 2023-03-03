import React, { useEffect, useState} from 'react'
import './App.css';
import Login from './components/Login';
import SignUp from './components/SignUp';
import JoinGame from './components/JoinGame';
import { StreamChat } from 'stream-chat';
import {Chat} from 'stream-chat-react';
import Cookies from "universal-cookie";
import { generateWordSet } from './components/Words';




function App() {


  //wordle gen word

  const [selectedWord, setSelectedWord] = useState("");
  const [wordSet, setWordSet] = useState(new Set());

  useEffect(() => {
    generateWordSet().then((words) => {
      setWordSet(words.wordSet);
      setSelectedWord(words.todaysWords);
    });
  }, []);





  const api_key = "cy5uuk3773vq";
  const cookies = new Cookies();
  const token = cookies.get("token");
  const client = StreamChat.getInstance(api_key);
  const [isAuth, setIsAuth] = useState(false);


  const logOut = () => {
    cookies.remove("token");
    cookies.remove("userId");
    cookies.remove("firstName");
    cookies.remove("lastName");
    cookies.remove("hashedPassword");
    cookies.remove("channelName");
    cookies.remove("username");
    client.disconnectUser();
    setIsAuth(false);
  };

  if (token){
    client.connectUser({
      id: cookies.get("userId"),
      name: cookies.get("username"),
      firstname: cookies.get("firstName"),
      lastName: cookies.get("lastName"),
      hashedPassword: cookies.get("hashedPassword"),
    },
    token
    ).then((user) => {
      setIsAuth(true);
    });
  }
  return (
    <div className="App">
        {isAuth ? ( 
          <Chat client={client}>
          <JoinGame wordSet={wordSet}  selectedWord={selectedWord}/>
          <button onClick={logOut}>Log Out</button>
          </Chat>
        ) : (
          <>
        <SignUp setIsAuth={setIsAuth} />
        <Login setIsAuth={setIsAuth} />
          </>
        )}
    </div>
  );
}

export default App;
