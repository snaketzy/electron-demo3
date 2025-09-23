import React from "react";
import "./Index.less";
import { Images } from '../../../utils/images';

interface OwnProp {
  goBack: () => void;
  isShowLine?: boolean;
  title: string;
  hideBack?: boolean;
}

/** 通用header */
const Header = (props: OwnProp) => {
  const { goBack, isShowLine, title, hideBack } = props;
  return (
    <div className="containerHeader">
      <div className="topHeader"></div>
      <div className="Header">
        <div className="headerLeft" onClick={ () => goBack() }>
          {
            !hideBack && <img src={Images.icon_back_black} />
          }
        </div>
        <div className='headerTitle'>{title}</div>
        <div className="headerRight"></div>
      </div>
    </div>
  )
}

export default Header;