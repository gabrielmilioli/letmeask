import logoImg from 'assets/images/logo.svg';
import 'assets/styles/room.scss';
import { useHistory, useParams } from 'react-router-dom';
import { Question } from '../../components/Question';
import useRoom from '../../hooks/useRoom';
import { RoomCode } from '../../components/RoomCode';
import { Button } from '../../components/Button';
import deleteImg from 'assets/images/delete.svg';
import { database, ref, remove, update } from '../../services/firebase';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { questions, title } = useRoom(roomId);
  const history = useHistory();

  const handleEndRoom = async () => {
    const roomRef = ref(database, `rooms/${roomId}`);
    await update(roomRef, {
      closedAt: new Date()
    });
    history.push('/');
  }

  const handleDeleteQuestion = async (questionId: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      const questionRef = ref(database, `rooms/${roomId}/questions/${questionId}`);
      await remove(questionRef);
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask logo" />
          <div>
            <RoomCode code={roomId} />
            <Button
              isOutlined
              onClick={handleEndRoom}>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map((question, index) => {
            return (
              <Question
                key={index}
                content={question.content}
                author={question.author}>
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Delete question" />
                </button>
              </Question>
            )
          })}
        </div>

      </main>
    </div>
  );
}