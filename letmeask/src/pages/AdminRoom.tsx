import logoImg from '../assets/images/logo.svg';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';

import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';

import { useParams } from 'react-router-dom';
import { FormEvent, useState } from 'react';

import { database } from '../services/firebase';

import '../styles/room.scss';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const params = useParams<RoomParams>();
  const roomID = params.id;

  const [newQuestion, setNewQuestion] = useState(''); 

  const { user } = useAuth();
  const { questions, title } = useRoom(roomID);

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
          <div>
            <RoomCode code={ roomID } />
            <Button isOutlined>Encerrar sala</Button>
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala { title }</h1>
          { questions.length > 0 && <span>{ questions.length } pergunta(s)</span> }
        </div>
        <div className="question-list">
          { questions.map(question => {
            return (
              <Question key={ question.id } content={ question.content } author={ question.author } />
            );
          }) }
        </div>
      </main>
    </div>
  );
}