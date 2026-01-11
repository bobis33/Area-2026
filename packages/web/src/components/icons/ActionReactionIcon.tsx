import {
  FaComments,
  FaPlus,
  FaTrash,
  FaEnvelope,
  FaBug,
  FaCodeBranch,
  FaStar,
  FaCode,
  FaArrowUp,
  FaPaperPlane,
  FaInbox,
  FaEnvelopeOpen,
  FaPlay,
  FaPause,
  FaStepForward,
  FaMusic,
  FaClock,
  FaHourglassHalf,
  FaCalendarAlt,
  FaCalendarDay,
  FaThermometerHalf,
  FaCloudRain,
  FaCloudSun,
  FaBolt,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';

interface ActionReactionIconProps {
  type: string;
  size?: number;
  color?: string;
  className?: string;
}

export const ActionReactionIcon = ({
  type,
  size = 20,
  color = 'currentColor',
  className = '',
}: ActionReactionIconProps) => {
  const typeLower = type.toLowerCase();

  // Check for keywords in the type string
  const getIconByKeyword = (): IconType => {
    // Discord
    if (typeLower.includes('message') || typeLower.includes('send-message'))
      return FaComments;
    if (typeLower.includes('channel') && typeLower.includes('create'))
      return FaPlus;
    if (typeLower.includes('channel') && typeLower.includes('delete'))
      return FaTrash;
    if (typeLower.includes('dm')) return FaEnvelope;

    // GitHub
    if (typeLower.includes('issue')) return FaBug;
    if (typeLower.includes('pr') || typeLower.includes('pull'))
      return FaCodeBranch;
    if (typeLower.includes('star')) return FaStar;
    if (typeLower.includes('fork')) return FaCode;
    if (typeLower.includes('push')) return FaArrowUp;

    // Gmail/Email
    if (typeLower.includes('email') && typeLower.includes('send'))
      return FaPaperPlane;
    if (typeLower.includes('email') && typeLower.includes('read'))
      return FaEnvelopeOpen;
    if (typeLower.includes('email') && typeLower.includes('new'))
      return FaInbox;
    if (typeLower.includes('email')) return FaEnvelope;

    // Spotify
    if (typeLower.includes('play')) return FaPlay;
    if (typeLower.includes('pause')) return FaPause;
    if (typeLower.includes('skip') || typeLower.includes('next'))
      return FaStepForward;
    if (typeLower.includes('song') || typeLower.includes('track'))
      return FaMusic;

    // Time
    if (typeLower.includes('minute')) return FaClock;
    if (typeLower.includes('hour')) return FaHourglassHalf;
    if (typeLower.includes('day')) return FaCalendarDay;
    if (typeLower.includes('cron') || typeLower.includes('schedule'))
      return FaCalendarAlt;

    // Weather
    if (typeLower.includes('temperature') || typeLower.includes('temp'))
      return FaThermometerHalf;
    if (typeLower.includes('rain')) return FaCloudRain;
    if (typeLower.includes('forecast') || typeLower.includes('weather'))
      return FaCloudSun;

    // Default
    return FaBolt;
  };

  const Icon = getIconByKeyword();

  return <Icon size={size} color={color} className={className} />;
};
