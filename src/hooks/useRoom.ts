import { useEffect, useState } from "react";
import { database, ref, onValue, off } from 'services/firebase';
import useAuth from "./useAuth";

type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likeId: string | undefined;
}

type FirebaseQuestionsType = Record<string, {
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likes: Record<string, { authorId: string; }>;
}>;

const useRoom = (roomId: string) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<QuestionType[]>([]);

  useEffect(() => {
    const roomRef = ref(database, `rooms/${roomId}`);

    onValue(roomRef, (snapshot) => {
      const databaseRoom = snapshot.val();
      const firebaseQuestions: FirebaseQuestionsType = databaseRoom.questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestions)
        .map(([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            isHighlighted: value.isHighlighted,
            isAnswered: value.isAnswered,
            likeCount: Object.values(value.likes ?? {}).length,
            likeId: Object.entries(value.likes ?? {}).find(([key, value]) => value.authorId === user?.id)?.[0],
          }
        });

      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    });

    return () => {
      off(roomRef);
    };

  }, [roomId, user?.id]);

  return {
    questions,
    title
  }
}

export default useRoom;