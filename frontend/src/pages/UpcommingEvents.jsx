import { event, speakers } from '../utils/fetchInfoEvent';
import Header from '../components/common/Header';
import LeftAsideBar from '../components/common/LeftAsideBar';
import CalenderIcon from '../assets/icons/calendar.svg';

function UpcommingEventInfo() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="bg-main-elements flex flex-1">
        <LeftAsideBar />
        <section className="w-[70%] p-6">
          <EventHeader />
          <FeaturedSpeaker />
        </section>
      </main>
    </div>
  );
}

function EventHeader() {
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
      <div className="mb-5 flex">
        {event.tags.map((item, index) => (
          <span
            key={index}
            className="text-font bg-layout-elements-focus text-body rounded-button-round mr-3 px-2 py-1"
          >
            {item}
          </span>
        ))}
      </div>
      <div className="text-font text-title mb-4 font-bold">About the Event</div>
      <span className="text-font text-body">{event.description}</span>
    </section>
  );
}
function FeaturedSpeaker() {
  return (
    <section className="mb-5">
      <div className="text-font text-title mb-4 font-bold">Featured Speakers</div>

      <div className="grid grid-cols-1">
        {speakers.map(item => (
          <div
            key={item.id}
            className="text-font text-body rounded-button-round bg-layout-elements-focus m-2 flex w-1/3 gap-4 p-2"
          >
            <img
              src={item.image}
              className="h-25 w-25 cursor-pointer rounded-full object-cover object-center"
            />
            <div className="flex flex-col">
              <span className="text-body font-semibold">{item.name}</span>
              <span className="text-font-light/80">{item.role}</span>
              <span className="text-font-light/80">{item.division}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default UpcommingEventInfo;
