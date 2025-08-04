import { useNavigate } from 'react-router-dom';
import CalenderIcon from '../../assets/icons/calendar.svg';
function SingleEvent({ event, isAdmin }) {
  console.log(event.end_date);
  const [date, time] = event.end_date.split(', ');

  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/upcommingevents/${encodeURIComponent(event._id)}`, {
      state: {
        event,
        isAdmin,
      },
    });
  };

  return (
    <div
      onClick={handleClick}
      className="individual-upcoming-event hover:bg-layout-elements-focus rounded-button-round mb-4 flex cursor-pointer items-center gap-2 pl-1"
    >
      <img src={CalenderIcon} alt="Calendar Icon" width="20px" height="20px" />
      <div className="upcoming-event-info">
        <h2 className="text-body text-font">{event.title}</h2>
        <p className="text-small text-font-light/50">
          {date} at {time}
        </p>
      </div>
    </div>
  );
}
export default SingleEvent;
