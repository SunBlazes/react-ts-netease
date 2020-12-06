interface RankProps {}

interface OfficialRankItemProps {
  picUrl: string;
  tracks: Array<any>;
  updateTime: number;
  id: string;
  type?: string;
  onClick?: () => void;
}
