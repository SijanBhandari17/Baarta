import { useState } from 'react';
import { dashboardContentNavbar } from '../../utils/navLists';
import Button from '../ui/Button';
import LiveDiscussions from './LiveDiscussions';

function DashBoardContent() {
  return (
    <div className="bg-main-elements flex flex-1 flex-col gap-4 p-6">
      <div className="flex gap-2">
        <DashBoardNav />
      </div>
      <div className="">
        <LiveDiscussions />
      </div>
    </div>
  );
}
function DashBoardNav() {
  const [activeButton, setActiveButton] = useState(0);
  const activeColor = 'bg-[#2F77FF]';

  return (
    <>
      {dashboardContentNavbar.map((item, index) => {
        return (
          <Button
            label={item.label}
            key={index}
            onClick={() => setActiveButton(index)}
            isActive={index == activeButton}
            activeColor={activeColor}
          />
        );
      })}
    </>
  );
}
export default DashBoardContent;
