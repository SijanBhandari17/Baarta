import Header from '../components/common/Header';
import LeftAsideBar from '../components/common/LeftAsideBar';
import CalenderIcon from '../assets/icons/calendar.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import socket from '../sockets/socket';
import { goLive } from '../sockets/handleGoLive';

function UpcommingEventInfo() {
  const location = useLocation();
  const { event } = location.state;
  const { user } = useAuth();
  const navigate = useNavigate();
  const handleGoLiveClick = () => {
    navigate(`/livediscussions/${event._id}`);
  };

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="bg-main-elements flex flex-1">
        <LeftAsideBar />
        <section className="w-[70%] p-6">
          <EventHeader event={event} />
          {user?.info?.userId === event.author_id ? (
            <button
              className="text-royalpurple-dark p-button-padding border-royalpurple-dark rounded-button-round hover:bg-royalpurple-dark cursor-pointer border-2 px-6 font-medium transition-all duration-300 ease-in hover:text-gray-50"
              onClick={() => {
                socket.emit('host-connect', { msg: 'hello' }, 'fuckyou');
                handleGoLiveClick();
              }}
            >
              Go Live
            </button>
          ) : (
            <button
              className="text-royalpurple-dark p-button-padding border-royalpurple-dark rounded-button-round hover:bg-royalpurple-dark cursor-pointer border-2 px-6 font-medium transition-all duration-300 ease-in hover:text-gray-50"
              onClick={() => {
                // handle Join Now logic here
                socket.emit('participant-connect', { msg: 'hi' }, 'fuckyou');
              }}
            >
              Join Now
            </button>
          )}
          <FeaturedSpeaker event={event} />
        </section>
      </main>
    </div>
  );
}

function EventHeader({ event }) {
  const [date, time] = event.end_date.split(', ');
  return (
    <section className="mb-5">
      <div className="text-font text-hero font-semibold">{event.title}</div>
      <div className="mb-4 flex items-center gap-2">
        <img src={CalenderIcon} alt="Calender Icon" width="20px" height="20px" />
        <p className="text-font-light/80 text-body">{date}</p>
        <p className="text-font-light/80 text-body before:mr-2 before:content-['🕛']">{time}</p>
      </div>
      <div className="text-font text-title mb-4 font-bold">About the Event</div>
      <span className="text-font text-body">{event.description}</span>
    </section>
  );
}

function FeaturedSpeaker({ event }) {
  return (
    <section className="mb-5">
      <div className="text-font text-title mb-4 font-bold">Featured Speaker</div>
      <div className="grid grid-cols-1">
        <div
          key={event.author_id}
          className="text-font text-body rounded-button-round bg-layout-elements-focus m-2 flex w-1/3 items-center gap-4 p-2"
        >
          <img
            src={event.authorProfilePicLink}
            className="h-25 w-25 cursor-pointer rounded-full object-cover object-center"
          />
          <div className="flex flex-col">
            <span className="text-body font-semibold">{event.authorName}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UpcommingEventInfo;
