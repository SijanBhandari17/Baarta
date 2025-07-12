import { useState } from 'react';
import { homeContentNavbar } from '../../../../utils/navLists';
import Button from '../../../ui/Button';
import { NavLink, Outlet } from 'react-router-dom';

function HomeContent() {
  const [activeButton, setActiveButton] = useState(0);
  function handleClick(event) {
    const targetedEvent = event.target;
    const index = targetedEvent.dataset.index;
    setActiveButton(index);
  }

  return (
    <div className="bg-main-elements flex w-[70%] flex-col gap-4 p-6">
      <div className="flex gap-1" onClick={event => handleClick(event)}>
        <DashBoardNav activeButton={activeButton} />
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
function DashBoardNav({ activeButton }) {
  const activeColor = 'bg-[#2F77FF] hover:bg-[#255FCC]';
  return (
    <>
      {homeContentNavbar.map((item, index) => {
        return (
          <NavLink key={index} to={item.label.replace(/\s/g, '').toLowerCase()}>
            <Button
              label={item.label}
              index={index}
              isActive={index == activeButton}
              activeColor={activeColor}
            />
          </NavLink>
        );
      })}
    </>
  );
}
export default HomeContent;
