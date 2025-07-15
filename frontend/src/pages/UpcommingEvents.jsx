import {
  event,
  speakers,
  schedule,
  location,
  similarEvents,
  discussion,
  userOptions,
} from '../utils/fetchInfoEvent';
import Header from '../components/common/Header';
import LeftAsideBar from '../components/common/LeftAsideBar';
import CalenderIcon from '../assets/icons/calendar.svg';

function UpcommingEventInfo() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="bg-main-elements flex flex-1">
        <LeftAsideBar />
        <section className="ml-8 w-[70%]">
          <EventHeader />
          <FeaturedSpeaker />
          <EventSchedule />
        </section>
      </main>
    </div>
  );
}

function EventHeader() {
  return (
    <section className="mb-5">
      <div className="text-font text-hero my-2 font-semibold">{event.title}</div>
      <div className="mb-4 flex items-center gap-2">
        <img src={CalenderIcon} alt="Calender Icon" width="20px" height="20px" />
        <p className="text-font-light/80 text-font-light text-body">{event.date}</p>
        <p className="text-font-light/80 text-font-light text-body before:mr-2 before:content-['🕛']">
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
function EventSchedule() {
  return (
    <section className="mb-5">
      <div className="text-font text-title mb-4 font-bold">Event Schedule</div>
      <div className="space-y-4">
        {schedule.map((item, index) => {
          return (
            <div
              key={index}
              className="bg-layout-elements-focus rounded-button-round mb-2 flex w-1/3 items-start space-x-4 p-4"
            >
              <p className="text-lg font-bold text-[#4968F4]">{item.time}</p>
              <div className="flex-1">
                <p className="text-font text-body font-semibold">{item.title}</p>
                {item.speaker && <p className="text-sm text-gray-400">{item.speaker}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default UpcommingEventInfo;
