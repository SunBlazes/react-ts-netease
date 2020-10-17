type commentType = "music" | "playlist" | "mv" | "album";

interface CommentsProps {
  type: commentType;
  id: string;
  setMoreCommentsAttr: (attr: MoreCommentsAttrType) => void;
  changeShow: (type: showOfType) => void;
  userState: boolean;
  ChangeSignInShow: () => void;
}
