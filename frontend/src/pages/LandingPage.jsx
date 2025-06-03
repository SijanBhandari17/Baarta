import Header from '../components/common/Header';
import RightAsideBar from '../components/common/RightAsideBar';
import { totalCommunityStatus } from '../utils/fetchCommnityStatus';
import liveDiscussion from '../utils/fetchLiveDiscussions';

function LandingPage() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <div className="flex flex-1">
          <MainContent />
        </div>
        <div className="flex max-w-80">
          <RightAsideBar />
        </div>
      </div>
    </div>
  );
}

function MainContent() {
  return (
    <div className="bg-main-elements flex-1 px-8 py-6">
      <h1 className="text-font text-hero mx-2 my-2 font-semibold">
        Where Academia Meets Innovation
      </h1>
      <p className="text-font-light text-font-light text-title m-2 mb-4">
        Join the next generation of academic discourse
      </p>
      <StatusContent />
      <LiveDiscussions />
    </div>
  );
}

function LiveDiscussions() {
  return (
    <div>
      <h1 className="text-font mx-2 my-2 text-[28px]">Live Discussions</h1>
      <div className="flex flex-wrap gap-2">
        {liveDiscussion.map((item, index) => {
          return (
            <div
              key={index}
              className="bg-layout-elements-focus rounded-button-round m-2 flex w-[45%] flex-col gap-3 px-4 py-6"
            >
              <h1 className="text-font text-title font-semibold">{item.title}</h1>
              <p className="text-font-light/60">{item.genre}</p>
              <div className="flex gap-4">
                <p className="text-font before:content-[' '] before:mr-1 before:inline-block before:size-[10px] before:rounded-full before:bg-green-500">
                  {item.participations} participants
                </p>
                <p className="text-font-light before:mr-4 before:inline-block before:size-[10px] before:content-['🕛']">
                  {item.duration}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatusContent() {
  return (
    <div className="mx-2 my-8 flex w-full gap-4">
      {totalCommunityStatus.map((item, index) => {
        return (
          <div
            key={index}
            className="bg-layout-elements-focus rounded-button-round flex w-1/5 flex-col gap-2 border border-white/20 p-5"
          >
            <img src={item.imgSrc} height="30px" width="30px" />
            <p className="text-font font-semibold">{item.title}</p>
            <p className="text-font-light">{item.membersCount} members</p>
          </div>
        );
      })}
    </div>
  );
}

export default LandingPage;
