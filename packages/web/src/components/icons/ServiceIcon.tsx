import {
  FaDiscord,
  FaGithub,
  FaGoogle,
  FaSpotify,
  FaGitlab,
  FaClock,
  FaCloud,
  FaCalendar,
  FaBook,
  FaSlack,
  FaTwitter,
  FaYoutube,
  FaTwitch,
  FaEnvelope,
  FaCog,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';

interface ServiceIconProps {
  service: string;
  size?: number;
  color?: string;
  className?: string;
}

export const ServiceIcon = ({
  service,
  size = 24,
  color = 'currentColor',
  className = '',
}: ServiceIconProps) => {
  const serviceLower = service.toLowerCase();

  const iconMap: Record<string, IconType> = {
    discord: FaDiscord,
    github: FaGithub,
    google: FaGoogle,
    gmail: FaEnvelope,
    spotify: FaSpotify,
    gitlab: FaGitlab,
    time: FaClock,
    weather: FaCloud,
    calendar: FaCalendar,
    notion: FaBook,
    slack: FaSlack,
    twitter: FaTwitter,
    youtube: FaYoutube,
    twitch: FaTwitch,
  };

  const Icon = iconMap[serviceLower] || FaCog;

  return <Icon size={size} color={color} className={className} />;
};
