import { useState } from 'react';
import { dashboardContentNavbar } from '../../utils/navLists';
import Button from '../ui/Button';
import LiveDiscussions from './LiveDiscussions';

function DashBoardContent() {
  const [activeButton, setActiveButton] = useState(0);
  function handleClick(event) {
    const targetedEvent = event.target;
    const index = targetedEvent.dataset.index;
    setActiveButton(index);
  }

  return (
    <div className="bg-main-elements flex w-[70%] flex-col gap-4 p-6">
      <div className="flex gap-2" onClick={event => handleClick(event)}>
        <DashBoardNav activeButton={activeButton} />
      </div>
      <div>
        <LiveDiscussions />
      </div>
    </div>
  );
}
function DashBoardNav({ activeButton }) {
  const activeColor = 'bg-[#2F77FF] hover:bg-[#255FCC]';
  return (
    <>
      {dashboardContentNavbar.map((item, index) => {
        return (
          <Button
            label={item.label}
            key={index}
            index={index}
            isActive={index == activeButton}
            activeColor={activeColor}
          />
        );
      })}
    </>
  );
}
export default DashBoardContent;
