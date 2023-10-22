import { date, time, numberFmt as number } from "@messageformat/runtime/lib/formatters";
export const formatters = { date, time, number };
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
  "time": {
    "start": Date | number | string;
  },
  "variable": {
    "name": TArgumentType;
  }
};