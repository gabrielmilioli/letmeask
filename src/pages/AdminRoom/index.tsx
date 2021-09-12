import logoImg from 'assets/images/logo.svg';
import 'assets/styles/room.scss';
import { useHistory, useParams } from 'react-router-dom';
import { Question } from 'components/Question';
import useRoom from 'hooks/useRoom';
import { RoomCode } from 'components/RoomCode';
import { Button } from 'components/Button';
import { database, ref, remove, update } from 'services/firebase';
import { IconButton } from 'components/IconButton';

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

  const handleMarkQuestionAsAnswered = async (questionId: string) => {
    const questionRef = ref(database, `rooms/${roomId}/questions/${questionId}`);
    await update(questionRef, {
      isAnswered: true
    });
  }

  const handleHighlightQuestion = async (questionId: string) => {
    const questionRef = ref(database, `rooms/${roomId}/questions/${questionId}`);
    await update(questionRef, {
      isHighlighted: true
    });
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
              Close room
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Room {title}</h1>
          {questions.length > 0 && <span>{questions.length} question(s)</span>}
        </div>

        <div className="question-list">
          {questions.map((question, index) => {
            return (
              <Question
                key={index}
                content={question.content}
                author={question.author}
                isHighlighted={question.isHighlighted}
                isAnswered={question.isAnswered}>
                {!question.isAnswered && <>
                  <IconButton
                    icon="check"
                    title="Mark as answered"
                    onClick={() => handleMarkQuestionAsAnswered(question.id)}
                  />
                  <IconButton
                    icon="answer"
                    title="Highlight question"
                    onClick={() => handleHighlightQuestion(question.id)}
                  />
                </>}
                <IconButton
                  icon="delete"
                  title="Delete question"
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                />
              </Question>
            )
          })}
          {!questions.length &&
            <h1>Oops... no questions have been submitted yet.</h1>
          }
        </div>

      </main>
    </div>
  );
}