function FontAwesomeIcon({
  icon,
  prefix = 'fa-solid',
  size = 24,
  color = 'currentColor',
  className = '',
  style,
  ...props
}) {
  return (
    <i
      aria-hidden="true"
      className={`${prefix} ${icon} inline-block leading-none ${className}`}
      style={{
        fontSize: typeof size === 'number' ? `${size}px` : size,
        color,
        ...style,
      }}
      {...props}
    />
  );
}

export const ArrowRight = (props) => <FontAwesomeIcon icon="fa-arrow-right" {...props} />;
export const Bell = (props) => <FontAwesomeIcon icon="fa-bell" {...props} />;
export const CalendarDays = (props) => <FontAwesomeIcon icon="fa-calendar-days" {...props} />;
export const CalendarPlus = (props) => <FontAwesomeIcon icon="fa-calendar-plus" {...props} />;
export const MapPin = (props) => <FontAwesomeIcon icon="fa-location-dot" {...props} />;
export const Search = (props) => <FontAwesomeIcon icon="fa-magnifying-glass" {...props} />;
export const List = (props) => <FontAwesomeIcon icon="fa-list" {...props} />;
export const Map = (props) => <FontAwesomeIcon icon="fa-map" {...props} />;
export const ShieldCheck = (props) => <FontAwesomeIcon icon="fa-shield-halved" {...props} />;
export const Users = (props) => <FontAwesomeIcon icon="fa-users" {...props} />;
export const MessageCircle = (props) => <FontAwesomeIcon icon="fa-comment-dots" {...props} />;
export const Trophy = (props) => <FontAwesomeIcon icon="fa-trophy" {...props} />;
export const Star = (props) => <FontAwesomeIcon icon="fa-star" {...props} />;
export const Home = (props) => <FontAwesomeIcon icon="fa-house" {...props} />;
export const Plus = (props) => <FontAwesomeIcon icon="fa-plus" {...props} />;
export const Heart = (props) => <FontAwesomeIcon icon="fa-heart" {...props} />;
export const Gear = (props) => <FontAwesomeIcon icon="fa-gear" {...props} />;
export const Logout = (props) => <FontAwesomeIcon icon="fa-right-from-bracket" {...props} />;
export const Football = (props) => <FontAwesomeIcon icon="fa-futbol" {...props} />;
export const Basketball = (props) => <FontAwesomeIcon icon="fa-basketball" {...props} />;
export const Clock = (props) => <FontAwesomeIcon icon="fa-clock" {...props} />;
export const Medal = (props) => <FontAwesomeIcon icon="fa-medal" {...props} />;
export const Hand = (props) => <FontAwesomeIcon icon="fa-hand" {...props} />;
export const User = (props) => <FontAwesomeIcon icon="fa-user" {...props} />;
export const EmptyBox = (props) => <FontAwesomeIcon icon="fa-inbox" {...props} />;
export const ChevronDown = (props) => <FontAwesomeIcon icon="fa-chevron-down" {...props} />;
export const Phone = (props) => <FontAwesomeIcon icon="fa-phone" {...props} />;
export const Video = (props) => <FontAwesomeIcon icon="fa-video" {...props} />;
export const Paperclip = (props) => <FontAwesomeIcon icon="fa-paperclip" {...props} />;
export const DoorOpen = (props) => <FontAwesomeIcon icon="fa-door-open" {...props} />;
export const Pen = (props) => <FontAwesomeIcon icon="fa-pen" {...props} />;
export const Lock = (props) => <FontAwesomeIcon icon="fa-lock" {...props} />;
export const Language = (props) => <FontAwesomeIcon icon="fa-language" {...props} />;
export const Eye = (props) => <FontAwesomeIcon icon="fa-eye" {...props} />;
export const CircleInfo = (props) => <FontAwesomeIcon icon="fa-circle-info" {...props} />;
export const CheckCircle = (props) => <FontAwesomeIcon icon="fa-circle-check" {...props} />;

export const Instagram = (props) => <FontAwesomeIcon prefix="fa-brands" icon="fa-instagram" {...props} />;
export const Facebook = (props) => <FontAwesomeIcon prefix="fa-brands" icon="fa-facebook-f" {...props} />;
export const Twitter = (props) => <FontAwesomeIcon prefix="fa-brands" icon="fa-x-twitter" {...props} />;
export const Youtube = (props) => <FontAwesomeIcon prefix="fa-brands" icon="fa-youtube" {...props} />;
