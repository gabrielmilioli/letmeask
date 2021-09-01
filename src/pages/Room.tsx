import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import '../assets/styles/room.scss';
import { RoomCode } from '../components/RoomCode';
import { useParams } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { database, push, ref, remove } from '../services/firebase';
import { Question } from '../components/Question';
import useRoom from '../hooks/useRoom';
import { IconButton } from '../components/IconButton';

type RoomParams = {
  id: string;
}

export function Room() {
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { user } = useAuth();
  const { questions, title } = useRoom(roomId);
  const [newQuestion, setNewQuestion] = useState('');

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

  const handleLikeQuestion = async (questionId: string, likeId: string | undefined) => {
    if (likeId) {
      const likeRef = ref(database, `rooms/${roomId}/questions/${questionId}/likes/${likeId}`);
      await remove(likeRef);

      return;
    }

    const likeRef = ref(database, `rooms/${roomId}/questions/${questionId}/likes`);
    await push(likeRef, {
      authorId: user?.id
    });

  };

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

        <div className="question-list">
          {questions.map((question, index) => {
            return (
              <Question
                key={index}
                content={question.content}
                author={question.author}
                isHighlighted={question.isHighlighted}
                isAnswered={question.isAnswered}>
                {!question.isAnswered &&
                  <IconButton
                    className={`like-button ${question.likeId ? 'liked' : ''}`}
                    icon="like"
                    title="Mark as liked"
                    onClick={() => handleLikeQuestion(question.id, question.likeId)}
                    preLabel={question.likeCount > 0 ? question.likeCount : ''}
                  />}
              </Question>
            )
          })}
        </div>

      </main>
    </div>
  );
}