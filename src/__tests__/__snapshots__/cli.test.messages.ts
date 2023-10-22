export type MessageArguments<TArgumentTypes = number | string, TArgumentTagType = (children: TArgumentTypes) => TArgumentTypes> = {
  "fn": {
    "currentTime": Date | number | string;
  },
  "plural": {
    "count": number;
  },
  "select": {
    "friend": TArgumentTypes;
    "gender": TArgumentTypes;
  },
  "selectordinal": {
    "place": number;
  },
  "tags": {
    "b": TArgumentTagType;
    "dynamic": TArgumentTypes;
  },
  "text": {
    
  },
  "variable": {
    "name": TArgumentTypes;
  }
};