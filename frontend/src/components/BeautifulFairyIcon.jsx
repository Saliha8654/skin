const BeautifulFairyIcon = ({ className = "" }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" fill="#FFEBD8" stroke="#E8A87C" strokeWidth="2"/>
      <path 
        d="M12 7C12 7 9 9 9 12C9 15 12 17 12 17C12 17 15 15 15 12C15 9 12 7 12 7Z" 
        fill="#E8A87C"
      />
      <circle cx="10.5" cy="11.5" r="1.5" fill="#fff"/>
      <circle cx="13.5" cy="11.5" r="1.5" fill="#fff"/>
      <path 
        d="M9 15C10 16 11 16 12 16C13 16 14 16 15 15" 
        stroke="#fff" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
      <path 
        d="M12 3L13 6M12 3L11 6M12 21L13 18M12 21L11 18M3 12L6 13M3 12L6 11M21 12L18 13M21 12L18 11" 
        stroke="#E8A87C" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
    </svg>
  );
};

export default BeautifulFairyIcon;