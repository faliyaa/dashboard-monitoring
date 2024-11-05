import { createSignal, Show } from 'solid-js';
import './Notification.css';

export function useNotification() {
  const [showMessagePopup, setShowMessagePopup] = createSignal(false);
  const [message, setMessage] = createSignal('');
  const [icon, setIcon] = createSignal('');

  const notify = (msg, iconType) => {
    setMessage(msg);
    setIcon(iconType);
    setShowMessagePopup(true);
    setTimeout(() => {
      setShowMessagePopup(false);
      // Reset form logic here if necessary
    }, 3000);
  };

  return { notify, showMessagePopup, message, icon };
}

export default function Notification(props) {
  return (
    <Show when={props.showMessagePopup()}>
      <div class="popup">
        <img src={props.icon()} alt="Notification Icon" class="check-icon" />
        <p>{props.message()}</p>
      </div>
    </Show>
  );
}
