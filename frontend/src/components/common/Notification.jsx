import Notifications from '../../utils/fetchNotifications';

function Notification() {
  const baseClass =
    'hover:bg-layout-elements-focus rounded-button-round cursor-pointer mb-2 px-2 py-4';
  return (
    <div className="rounded-button-round absolute top-20 right-5 z-10 flex max-h-[50vh] w-[500px] flex-col overflow-y-auto bg-[#636363] p-4">
      <h1 className="text-font text-title border-b border-b-white/40 font-bold uppercase">
        Notifications
      </h1>
      <div className="my-2">
        {Notifications.map((item, index) => {
          return (
            <div
              className={`${baseClass} ${item.seen === 'false' ? 'bg-layout-elements-focus' : ''}`}
            >
              <p className="text-font text-title">{item.label}</p>
              <p className="text-font-light text-body before:mr-2 before:content-['🕛']">
                {item.durationAfterIncident}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default Notification;
