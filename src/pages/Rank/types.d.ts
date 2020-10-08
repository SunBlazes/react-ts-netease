interface RankProps {
  firstRequest: boolean;
  show: boolean;
  displaySingerRank: () => void;
  changeShow: (type: showOfType) => void;
}

interface OfficialRankItemProps {
  picUrl: string;
  tracks: Array<any>;
  updateTime: number;
  id: string;
  type?: string;
  onClick?: () => void;
}
