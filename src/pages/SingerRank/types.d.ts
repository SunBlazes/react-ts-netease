interface SingerRank {}

interface ISingerItemInfo {
  name: string;
  picUrl: string;
  id: string;
  score: number;
  lastRank: number;
}

interface SingerRankItemProps extends ISingerItemInfo {
  index: number;
  totalScore: number;
  onClick: () => void;
}
