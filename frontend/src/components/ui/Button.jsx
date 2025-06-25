function Button({ label, isActive, onClick, activeColor }) {
  const baseClass =
    'text-font text-title hover:bg-layout-elements-focus rounded-button-round mr-2 w-[18rem] cursor-pointer px-3 py-2';
  const finalClass = `${isActive ? activeColor : ''} ${baseClass} `;

  return (
    <button className={`${finalClass}`} onClick={onClick}>
      {label}
    </button>
  );
}
export default Button;
