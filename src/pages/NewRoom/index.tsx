import { FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import illustrationImg from 'assets/images/illustration.svg';
import logoImg from 'assets/images/logo.svg';

import 'assets/styles/auth.scss';
import { Button } from 'components/Button';
import useAuth from 'hooks/useAuth';
import { database, ref, push } from 'services/firebase';


export function NewRoom() {
  const { user } = useAuth();
  const history = useHistory();

  const [newRoom, setNewRoom] = useState('');

  const handleCreateRoom = async (e: FormEvent) => {
    e.preventDefault();

    if (newRoom.trim() === '') {
      return;
    }

    const roomRef = ref(database, 'rooms');

    const firebaseRoom = await push(roomRef, {
      title: newRoom,
      authorId: user?.id
    });

    history.push(`/rooms/${firebaseRoom.key}`);
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
          <h2>Create a new room</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Enter a name"
              onChange={e => setNewRoom(e.target.value)}
              value={newRoom}
            />

            <Button type="submit">Create</Button>
          </form>
          <p>or <Link to="/">join an existing room</Link>.</p>
        </div>
      </main>
    </div>
  );
}