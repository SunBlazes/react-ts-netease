import React, { useContext } from "react";
import { Menu } from "antd";
import { useHistory } from "react-router-dom";
import { SetHistoryStackContext } from "../Home";

interface MainTabsProps {
  name: string;
}

type currentType = "recommend" | "totalPlaylist" | "rank";

const MainTabs: React.FC<MainTabsProps> = (props) => {
  const { name } = props;
  const history = useHistory();
  const context = useContext(SetHistoryStackContext);

  function handleItemClick(e: any) {
    const key = e.key as currentType;
    history.push(`/${key === "recommend" ? "" : key}`);
    context.setHistoryStack("push", key);
  }

  return (
    <div className="main-tabs-nav">
      <Menu mode="horizontal" selectedKeys={[name]} onClick={handleItemClick}>
        <Menu.Item title="个性推荐" key="recommend">
          个性推荐
        </Menu.Item>
        <Menu.Item title="歌单" key="totalPlaylist">
          歌单
        </Menu.Item>
        <Menu.Item title="排行榜" key="rank">
          排行榜
        </Menu.Item>
      </Menu>
    </div>
  );
};
export default React.memo(MainTabs);
