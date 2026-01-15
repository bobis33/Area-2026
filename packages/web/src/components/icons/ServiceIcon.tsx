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
  color,
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

  const colorMap: Record<string, string> = {
    discord: '#5865F2',
    github: '#181717',
    google: '#4285F4',
    gmail: '#EA4335',
    spotify: '#1DB954',
    gitlab: '#FC6D26',
    time: '#6366F1',
    weather: '#3B82F6',
    calendar: '#8B5CF6',
    notion: '#000000',
    slack: '#4A154B',
    twitter: '#1DA1F2',
    youtube: '#FF0000',
    twitch: '#9146FF',
  };

  const Icon = iconMap[serviceLower] || FaCog;
  const iconColor = color || colorMap[serviceLower] || '#6B7280';

  return <Icon size={size} color={iconColor} className={className} />;
};
