import logoImg from '../assets/images/logo.svg';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';

import { useAuht } from '../hooks/useAuth';

import { useParams } from 'react-router-dom';
import { FormEvent, useState } from 'react';

import { database } from '../services/firebase';

import '../styles/room.scss';

type RoomParams = {
  id: string;
}

export function Room() {
  const params = useParams<RoomParams>();
  const roomID = params.id;

  const [newQuestion, setNewQuestion] = useState(''); 
  const { user } = useAuht();

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if(newQuestion.trim() === '') {
      return;
    }

    if(!user) {
      throw new Error('You must be logged in');
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false
    };

    await database.ref(`rooms/${ roomID }/questions`).push(question);

    setNewQuestion('');
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={ logoImg } alt="logo" />
          <RoomCode code={ roomID } />
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala React</h1>
          <span>4 perguntas</span>
        </div>
        <form onSubmit={ handleSendQuestion }>
          <textarea placeholder="O que você quer perguntar ?"
          onChange={ event => setNewQuestion(event.target.value) } value={ newQuestion } />
          <div className="form-footer">
            { user ? (
              <div className="user-info">
                <img src={ user.avatar } alt={ user.name } />
                <span>{ user.name }</span>
              </div>
            ) : (
              <span>Para enviar uma pergunta, <button>faça o seu login</button></span>
            ) }
            <Button type="submit" disabled={ !user }>Enviar pergunta</Button>
          </div>
        </form>
      </main>
    </div>
  );
}