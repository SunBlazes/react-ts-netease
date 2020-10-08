import Swipe, { SwipeProps } from "./swipe";
import SwipeItem, { SwipeItemProps } from "./swipeItem";

type ExportType = React.FC<SwipeProps> & {
  Item: React.FC<SwipeItemProps>;
};

const ExportComponent = Swipe as ExportType;

ExportComponent.Item = SwipeItem;

export default ExportComponent;
