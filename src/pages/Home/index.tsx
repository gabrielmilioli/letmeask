import { useHistory } from 'react-router-dom';
import illustrationImg from 'assets/images/illustration.svg';
import logoImg from 'assets/images/logo.svg';
import googleIconImg from 'assets/images/google-icon.svg';

import 'assets/styles/auth.scss';
import { Button } from 'components/Button';

import useAuth from 'hooks/useAuth';
import { FormEvent, useState } from 'react';
import { database, ref, get } from 'services/firebase';

export function Home() {
  const { user, signInWithGoogle } = useAuth();
  const history = useHistory();
  const [roomCode, setRoomCode] = useState('');

  const handleCreateRoom = async () => {
    if (!user) {
      await signInWithGoogle();
    }

    history.push('/rooms/new');
  }

  const handleJoinRoom = async (e: FormEvent) => {
    e.preventDefault();

    if (roomCode.trim() === '') {
      return;
    }

    const roomRef = ref(database, `rooms/${roomCode}`);

    const roomResponse = await get(roomRef);

    if (!roomResponse.exists()) {
      alert('Room does not exists');
      return;
    }

    if (roomResponse.val().closedAt) {
      alert('Room is already closed');
      return;
    }

    history.push(`/rooms/${roomCode}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Illustration symbolizing questions and answers" />
        <strong>Create live Q&amp;A rooms</strong>
        <p>Ask your audience questions in real time</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask logo" />

          <button className="create-room" onClick={handleCreateRoom}>
            <img src={googleIconImg} alt="Google logo" />
            Create your room with Google
          </button>

          <div className="separator">or enter a room</div>

          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Enter room code"
              onChange={e => setRoomCode(e.target.value)}
              value={roomCode}
            />

            <Button type="submit">Enter the room</Button>
          </form>
        </div>
      </main>
    </div>
  );
}