function Button({ label, isActive, activeColor, index }) {
  const baseClass =
    'text-font text-title rounded-button-round mr-2 w-[18rem] cursor-pointer px-3 py-2';
  const finalClass = isActive
    ? `${activeColor} ${baseClass}`
    : ` ${baseClass} hover:bg-layout-elements-focus`;

  return (
    <button className={`${finalClass}`} data-index={index}>
      {label}
    </button>
  );
}
export default Button;
