import Header from '../components/common/Header';
import { totalCommunityStatus } from '../utils/fetchCommnityStatus';

function LandingPage() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <MainContent />
      </div>
    </div>
  );
}

function MainContent() {
  return (
    <div className="bg-main-elements flex flex-1 flex-col px-8 py-6">
      <h1 className="text-font text-hero my-2 font-semibold">Where Academia Meets Innovation</h1>
      <p className="text-font-light text-title mb-4">
        Join the next generation of academic discourse
      </p>
      <StatusContent />
    </div>
  );
}

function StatusContent() {
  return (
    <div className="my-8 flex w-full gap-4">
      {totalCommunityStatus.map((item, index) => {
        return (
          <div
            key={index}
            className="bg-layout-elements-focus rounded-button-round flex w-1/5 cursor-pointer flex-col gap-4 border border-white/20 p-5"
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
