// This is mapping for translating a work into an icon.
// We associate anytime to a particular icon.
import {
  CircleCheckBig,
  CircleDashed,
  SendHorizonal,
  SquareX,
} from "lucide-react";
import { ComponentType } from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaGithub,
  FaDiscord,
  FaSlack,
  FaReddit,
  FaTiktok,
  FaWhatsapp,
  FaSnapchat,
  FaPinterest,
  FaTwitch,
  FaMedium,
  FaDribbble,
  FaBehance,
  FaVimeo,
  FaSpotify,
  FaSoundcloud,
  FaTelegram,
  FaSkype,
  FaVideo,
} from "react-icons/fa";

const icons: Record<string, ComponentType> = {
  facebook: FaFacebook,
  twitter: FaTwitter,
  x: FaTwitter,
  instagram: FaInstagram,
  linkedin: FaLinkedin,
  youtube: FaYoutube,
  github: FaGithub,
  discord: FaDiscord,
  slack: FaSlack,
  reddit: FaReddit,
  tiktok: FaTiktok,
  whatsapp: FaWhatsapp,
  snapchat: FaSnapchat,
  pinterest: FaPinterest,
  twitch: FaTwitch,
  medium: FaMedium,
  dribbble: FaDribbble,
  behance: FaBehance,
  vimeo: FaVimeo,
  spotify: FaSpotify,
  soundcloud: FaSoundcloud,
  telegram: FaTelegram,
  skype: FaSkype,
  zoom: FaVideo,
 
};

export default icons;
