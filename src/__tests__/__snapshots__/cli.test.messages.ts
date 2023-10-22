export type MessageArguments<TArgumentType = number | string, TArgumentTagType = (children: TArgumentType) => TArgumentType> = {
  "fn": {
    "currentTime": Date | number | string;
  },
  "number": {
    "numCats": number;
  },
  "plural": {
    "count": number;
  },
  "select": {
    "friend": TArgumentType;
    "gender": number | string;
  },
  "selectordinal": {
    "place": number;
  },
  "tags": {
    "b": TArgumentTagType;
    "dynamic": TArgumentType;
  },
  "text": {
    
  },
  "variable": {
    "name": TArgumentType;
  }
};