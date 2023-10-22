export type MessageArguments<TArgumentTypes = number | string> = {
  "fn": {
    "currentTime": TArgumentTypes;
  },
  "plural": {
    "count": TArgumentTypes;
  },
  "select": {
    "friend": TArgumentTypes;
    "gender": TArgumentTypes;
  },
  "selectordinal": {
    "place": TArgumentTypes;
  },
  "tags": {
    "b": TArgumentTypes;
    "dynamic": TArgumentTypes;
  },
  "text": {
    
  },
  "variable": {
    "name": TArgumentTypes;
  }
};