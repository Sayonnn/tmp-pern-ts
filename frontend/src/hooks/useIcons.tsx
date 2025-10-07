// useIcons.tsx
import { FiHome, FiInfo, FiPhone, FiMail, FiInstagram, FiFacebook, FiMenu, FiUser, FiShoppingBag, FiShoppingCart } from "react-icons/fi";
import { AiOutlineTwitter, AiOutlineGithub, AiOutlineGoogle } from "react-icons/ai";
import type { IconBaseProps } from "react-icons";
import type { JSX } from "react";

const icons: { [key: string]: (props?: IconBaseProps) => JSX.Element } = {
  ihome: (props) => <FiHome {...props} />,
  iinfo: (props) => <FiInfo {...props} />,
  iphone: (props) => <FiPhone {...props} />,
  imail: (props) => <FiMail {...props} />,
  iig: (props) => <FiInstagram {...props} />,
  ifb: (props) => <FiFacebook {...props} />,
  itwitter: (props) => <AiOutlineTwitter {...props} />,
  igh: (props) => <AiOutlineGithub {...props} />,
  igoogle: (props) => <AiOutlineGoogle {...props} />,
  imenu: (props) => <FiMenu {...props} />,
  iuser: (props) => <FiUser {...props} />,
  ishoppingBag: (props) => <FiShoppingBag {...props} />,
  icart: (props) => <FiShoppingCart {...props} />,
};

export default icons;
