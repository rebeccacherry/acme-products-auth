
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAuth } from './store';
import { useNavigate } from 'react-router-dom';

const Profile = ()=> {
  const [luckyNumber, setLuckyNumber] = useState(7);
  const { auth } = useSelector(state => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(()=> {
    console.log(user)
    if(auth.id){
        setLuckyNumber(auth.luckyNumber) // has the update field show the current lucky number
    }
  }, [auth]);

  const _update = async(ev)=> {
    ev.preventDefault();
    dispatch(updateAuth( {luckyNumber })) // allows the dispatch from store to happen
  
  };
  return (
    <form onSubmit={ _update }>
      <input placeholder='luckyNumber' value={ luckyNumber } onChange={ ev => setLuckyNumber(ev.target.value)}/>
      <button disabled = { luckyNumber === auth.luckyNumber }>Update</button>
    </form>
  );
};

export default Profile;