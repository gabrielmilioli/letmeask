import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import '../assets/styles/room.scss';
import { RoomCode } from '../components/RoomCode';
import { useParams } from 'react-router-dom';
import { FormEvent, useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { database, push, ref, get } from '../services/firebase';

type FirebaseQuestionsType = Record<string, {
  author: {
    nome: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
}>;

type QuestionType = {
  id: string;
  author: {
    nome: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
}

type RoomParams = {
  id: string;
}

export function Room() {

  const { user } = useAuth();
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState('');
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const roomId = params.id;

  useEffect(() => {
    const roomRef = ref(database, `rooms/${roomId}`);

    get(roomRef).then((snapshot) => {
      const databaseRoom = snapshot.val();
      const firebaseQuestions: FirebaseQuestionsType = databaseRoom.questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestions)
        .map(([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            isAnswered: value.isAnswered,
            isHighlighted: value.isHighlighted
          }
        });

      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    }).catch((error) => {
      console.error(error);
    });

  }, [roomId]);

  const handleSendQuestion = async (e: FormEvent) => {
    e.preventDefault();

    if (newQuestion.trim() === '') {
      return;
    }

    if (!user) {
      throw new Error('You must be logged in');
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    const roomRef = ref(database, `rooms/${roomId}/questions`);

    await push(roomRef, question);

    setNewQuestion('');
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask logo" />
          <RoomCode code={roomId} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length && <span>{questions.length} pergunta(s)</span>}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            onChange={e => setNewQuestion(e.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">
            {!user && <span>Para enviar uma pergunta, <button>faça seu login.</button></span>}

            {user &&
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            }
            <Button type="submit">Enviar pergunta</Button>
          </div>
        </form>
      </main>
    </div>
  );
}