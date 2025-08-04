import Header from '../components/common/Header';
import LeftAsideBar from '../components/common/LeftAsideBar';
import CalenderIcon from '../assets/icons/calendar.svg';
import { useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function UpcommingEventInfo() {
  const { eventId } = useParams();
  const location = useLocation();
  const { event } = location.state;
  const { user } = useAuth();

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="bg-main-elements flex flex-1">
        <LeftAsideBar />
        <section className="w-[70%] p-6">
          <EventHeader event={event} />
          {user?.info?.userId === event.author_id ? (
            <button
              className="bg-primary hover:bg-primary-dark mb-4 cursor-pointer rounded px-6 py-2 text-white transition"
              onClick={() => {
                // handle Go Live logic here
              }}
            >
              Go Live
            </button>
          ) : (
            <button
              className="bg-secondary hover:bg-secondary-dark mb-4 cursor-pointer rounded px-6 py-2 text-white transition"
              onClick={() => {
                // handle Join Now logic here
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
  return (
    <section className="mb-5">
      <div className="text-font text-hero font-semibold">{event.title}</div>
      <div className="mb-4 flex items-center gap-2">
        <img src={CalenderIcon} alt="Calender Icon" width="20px" height="20px" />
        <p className="text-font-light/80 text-body">{event.date}</p>
        <p className="text-font-light/80 text-body before:mr-2 before:content-['🕛']">
          {event.time}
        </p>
      </div>
      <div className="text-font text-title mb-4 font-bold">About the Event</div>
      <span className="text-font text-body">{event.description}</span>
    </section>
  );
}

function FeaturedSpeaker({ event }) {
  return (
    <section className="mb-5">
      <div className="text-font text-title mb-4 font-bold">Featured Speakers</div>

      <div className="grid grid-cols-1">
        {/* {event.speakers && */}
        {/*   event.speakers.map(speaker => ( */}
        {/*     <div */}
        {/*       key={speaker.id} */}
        {/*       className="text-font text-body rounded-button-round bg-layout-elements-focus m-2 flex w-1/3 gap-4 p-2" */}
        {/*     > */}
        {/*       <img */}
        {/*         src={speaker.image} */}
        {/*         className="h-25 w-25 cursor-pointer rounded-full object-cover object-center" */}
        {/*       /> */}
        {/*       <div className="flex flex-col"> */}
        {/*         <span className="text-body font-semibold">{speaker.name}</span> */}
        {/*         <span className="text-font-light/80">{speaker.role}</span> */}
        {/*         <span className="text-font-light/80">{speaker.division}</span> */}
        {/*       </div> */}
        {/*     </div> */}
        {/*   ))} */}
      </div>
    </section>
  );
}

export default UpcommingEventInfo;
