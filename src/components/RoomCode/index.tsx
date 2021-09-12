import copyImg from 'assets/images/copy.svg';
import './styles.scss';

type RoomCodeProps = {
  code: string;
};

export function RoomCode(props: RoomCodeProps) {

  const handleCopyRoomCodeToClipboard = () => {
    navigator.clipboard.writeText(props.code);
  }

  return (
    <button className="room-code"
      onClick={handleCopyRoomCodeToClipboard}
      title="Copy to clipboard">
      <div>
        <img src={copyImg} alt="Copy room code" />
      </div>
      <span>Room #{props.code}</span>
    </button>
  );
}