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
        <div className="flex">
          <RightAsideBar />
        </div>
      </div>
    </div>
  );
}

function MainContent() {
  return (
    <div className="bg-main-elements flex-1 px-3">
      <h1>Where Academia Meets Innovation</h1>
      <StatusContent />
      <LiveDiscussions />
    </div>
  );
}

function LiveDiscussions() {
  return (
    <div>
      {liveDiscussion.map((item, index) => {
        return (
          <div key={index}>
            <h1>{item.title}</h1>
            <p>{item.field}</p>
            <div>
              <p>{item.participations}</p>
              <p>{item.duration}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StatusContent() {
  return (
    <div className="mx-2 flex gap-2">
      {totalCommunityStatus.map((item, index) => {
        return (
          <div
            key={index}
            className="bg-layout-elements-focus rounded-button-round flex w-50 flex-col gap-2 border border-white/20 p-5"
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
