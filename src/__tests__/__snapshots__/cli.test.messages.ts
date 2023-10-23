import type { Locale } from "icu-to-json";
import { date, time, numberFmt } from "@messageformat/runtime/lib/formatters";
import { af as afPlural, am as amPlural, an as anPlural, ar as arPlural, as as asPlural, ast as astPlural, az as azPlural, bal as balPlural, be as bePlural, bg as bgPlural, bn as bnPlural, bs as bsPlural, ca as caPlural, ce as cePlural, cs as csPlural, cy as cyPlural, da as daPlural, de as dePlural, dsb as dsbPlural, el as elPlural, en as enPlural, es as esPlural, et as etPlural, eu as euPlural, fa as faPlural, fi as fiPlural, fil as filPlural, fr as frPlural, fy as fyPlural, ga as gaPlural, gd as gdPlural, gl as glPlural, gsw as gswPlural, gu as guPlural, he as hePlural, hi as hiPlural, hr as hrPlural, hsb as hsbPlural, hu as huPlural, hy as hyPlural, ia as iaPlural, id as idPlural, is as isPlural, it as itPlural, ja as jaPlural, ka as kaPlural, kk as kkPlural, km as kmPlural, kn as knPlural, ko as koPlural, kw as kwPlural, ky as kyPlural, lij as lijPlural, lo as loPlural, lt as ltPlural, lv as lvPlural, mk as mkPlural, ml as mlPlural, mn as mnPlural, mo as moPlural, mr as mrPlural, ms as msPlural, my as myPlural, nb as nbPlural, ne as nePlural, nl as nlPlural, no as noPlural, or as orPlural, pa as paPlural, pl as plPlural, prg as prgPlural, ps as psPlural, pt as ptPlural, ro as roPlural, ru as ruPlural, sc as scPlural, scn as scnPlural, sd as sdPlural, sh as shPlural, si as siPlural, sk as skPlural, sl as slPlural, sq as sqPlural, sr as srPlural, sv as svPlural, sw as swPlural, ta as taPlural, te as tePlural, th as thPlural, tk as tkPlural, tl as tlPlural, tpi as tpiPlural, tr as trPlural, uk as ukPlural, und as undPlural, ur as urPlural, uz as uzPlural, vec as vecPlural, vi as viPlural, yue as yuePlural, zh as zhPlural, zu as zuPlural } from "make-plural/plurals";
import { af as afOrdinal, am as amOrdinal, an as anOrdinal, ar as arOrdinal, as as asOrdinal, ast as astOrdinal, az as azOrdinal, bal as balOrdinal, be as beOrdinal, bg as bgOrdinal, bn as bnOrdinal, bs as bsOrdinal, ca as caOrdinal, ce as ceOrdinal, cs as csOrdinal, cy as cyOrdinal, da as daOrdinal, de as deOrdinal, dsb as dsbOrdinal, el as elOrdinal, en as enOrdinal, es as esOrdinal, et as etOrdinal, eu as euOrdinal, fa as faOrdinal, fi as fiOrdinal, fil as filOrdinal, fr as frOrdinal, fy as fyOrdinal, ga as gaOrdinal, gd as gdOrdinal, gl as glOrdinal, gsw as gswOrdinal, gu as guOrdinal, he as heOrdinal, hi as hiOrdinal, hr as hrOrdinal, hsb as hsbOrdinal, hu as huOrdinal, hy as hyOrdinal, ia as iaOrdinal, id as idOrdinal, is as isOrdinal, it as itOrdinal, ja as jaOrdinal, ka as kaOrdinal, kk as kkOrdinal, km as kmOrdinal, kn as knOrdinal, ko as koOrdinal, kw as kwOrdinal, ky as kyOrdinal, lij as lijOrdinal, lo as loOrdinal, lt as ltOrdinal, lv as lvOrdinal, mk as mkOrdinal, ml as mlOrdinal, mn as mnOrdinal, mo as moOrdinal, mr as mrOrdinal, ms as msOrdinal, my as myOrdinal, nb as nbOrdinal, ne as neOrdinal, nl as nlOrdinal, no as noOrdinal, or as orOrdinal, pa as paOrdinal, pl as plOrdinal, prg as prgOrdinal, ps as psOrdinal, pt as ptOrdinal, ro as roOrdinal, ru as ruOrdinal, sc as scOrdinal, scn as scnOrdinal, sd as sdOrdinal, sh as shOrdinal, si as siOrdinal, sk as skOrdinal, sl as slOrdinal, sq as sqOrdinal, sr as srOrdinal, sv as svOrdinal, sw as swOrdinal, ta as taOrdinal, te as teOrdinal, th as thOrdinal, tk as tkOrdinal, tl as tlOrdinal, tpi as tpiOrdinal, tr as trOrdinal, uk as ukOrdinal, und as undOrdinal, ur as urOrdinal, uz as uzOrdinal, vec as vecOrdinal, vi as viOrdinal, yue as yueOrdinal, zh as zhOrdinal, zu as zuOrdinal } from "@messageformat/runtime/lib/cardinals";
export const formatters = { date, time, numberFmt };
export type MessageArguments<TArgumentType = number | string, TArgumentTagType = (children: TArgumentType) => TArgumentType> = {
  "fn": {
    "currentTime": Date | number | string;
  },
  "integer": {
    "amount": number;
  },
  "money": {
    "amount": number;
  },
  "number": {
    "numCats": number;
  },
  "percentage": {
    "value": number;
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
  "text"?: never | Record<string, never>,
  "time": {
    "start": Date | number | string;
  },
  "variable": {
    "name": TArgumentType;
  }
};
export const af: Locale = ["af", afPlural, afOrdinal];
export const am: Locale = ["am", amPlural, amOrdinal];
export const an: Locale = ["an", anPlural, anOrdinal];
export const ar: Locale = ["ar", arPlural, arOrdinal];
export const as: Locale = ["as", asPlural, asOrdinal];
export const ast: Locale = ["ast", astPlural, astOrdinal];
export const az: Locale = ["az", azPlural, azOrdinal];
export const bal: Locale = ["bal", balPlural, balOrdinal];
export const be: Locale = ["be", bePlural, beOrdinal];
export const bg: Locale = ["bg", bgPlural, bgOrdinal];
export const bn: Locale = ["bn", bnPlural, bnOrdinal];
export const bs: Locale = ["bs", bsPlural, bsOrdinal];
export const ca: Locale = ["ca", caPlural, caOrdinal];
export const ce: Locale = ["ce", cePlural, ceOrdinal];
export const cs: Locale = ["cs", csPlural, csOrdinal];
export const cy: Locale = ["cy", cyPlural, cyOrdinal];
export const da: Locale = ["da", daPlural, daOrdinal];
export const de: Locale = ["de", dePlural, deOrdinal];
export const dsb: Locale = ["dsb", dsbPlural, dsbOrdinal];
export const el: Locale = ["el", elPlural, elOrdinal];
export const en: Locale = ["en", enPlural, enOrdinal];
export const es: Locale = ["es", esPlural, esOrdinal];
export const et: Locale = ["et", etPlural, etOrdinal];
export const eu: Locale = ["eu", euPlural, euOrdinal];
export const fa: Locale = ["fa", faPlural, faOrdinal];
export const fi: Locale = ["fi", fiPlural, fiOrdinal];
export const fil: Locale = ["fil", filPlural, filOrdinal];
export const fr: Locale = ["fr", frPlural, frOrdinal];
export const fy: Locale = ["fy", fyPlural, fyOrdinal];
export const ga: Locale = ["ga", gaPlural, gaOrdinal];
export const gd: Locale = ["gd", gdPlural, gdOrdinal];
export const gl: Locale = ["gl", glPlural, glOrdinal];
export const gsw: Locale = ["gsw", gswPlural, gswOrdinal];
export const gu: Locale = ["gu", guPlural, guOrdinal];
export const he: Locale = ["he", hePlural, heOrdinal];
export const hi: Locale = ["hi", hiPlural, hiOrdinal];
export const hr: Locale = ["hr", hrPlural, hrOrdinal];
export const hsb: Locale = ["hsb", hsbPlural, hsbOrdinal];
export const hu: Locale = ["hu", huPlural, huOrdinal];
export const hy: Locale = ["hy", hyPlural, hyOrdinal];
export const ia: Locale = ["ia", iaPlural, iaOrdinal];
export const id: Locale = ["id", idPlural, idOrdinal];
export const is: Locale = ["is", isPlural, isOrdinal];
export const it: Locale = ["it", itPlural, itOrdinal];
export const ja: Locale = ["ja", jaPlural, jaOrdinal];
export const ka: Locale = ["ka", kaPlural, kaOrdinal];
export const kk: Locale = ["kk", kkPlural, kkOrdinal];
export const km: Locale = ["km", kmPlural, kmOrdinal];
export const kn: Locale = ["kn", knPlural, knOrdinal];
export const ko: Locale = ["ko", koPlural, koOrdinal];
export const kw: Locale = ["kw", kwPlural, kwOrdinal];
export const ky: Locale = ["ky", kyPlural, kyOrdinal];
export const lij: Locale = ["lij", lijPlural, lijOrdinal];
export const lo: Locale = ["lo", loPlural, loOrdinal];
export const lt: Locale = ["lt", ltPlural, ltOrdinal];
export const lv: Locale = ["lv", lvPlural, lvOrdinal];
export const mk: Locale = ["mk", mkPlural, mkOrdinal];
export const ml: Locale = ["ml", mlPlural, mlOrdinal];
export const mn: Locale = ["mn", mnPlural, mnOrdinal];
export const mo: Locale = ["mo", moPlural, moOrdinal];
export const mr: Locale = ["mr", mrPlural, mrOrdinal];
export const ms: Locale = ["ms", msPlural, msOrdinal];
export const my: Locale = ["my", myPlural, myOrdinal];
export const nb: Locale = ["nb", nbPlural, nbOrdinal];
export const ne: Locale = ["ne", nePlural, neOrdinal];
export const nl: Locale = ["nl", nlPlural, nlOrdinal];
export const no: Locale = ["no", noPlural, noOrdinal];
export const or: Locale = ["or", orPlural, orOrdinal];
export const pa: Locale = ["pa", paPlural, paOrdinal];
export const pl: Locale = ["pl", plPlural, plOrdinal];
export const prg: Locale = ["prg", prgPlural, prgOrdinal];
export const ps: Locale = ["ps", psPlural, psOrdinal];
export const pt: Locale = ["pt", ptPlural, ptOrdinal];
export const ro: Locale = ["ro", roPlural, roOrdinal];
export const ru: Locale = ["ru", ruPlural, ruOrdinal];
export const sc: Locale = ["sc", scPlural, scOrdinal];
export const scn: Locale = ["scn", scnPlural, scnOrdinal];
export const sd: Locale = ["sd", sdPlural, sdOrdinal];
export const sh: Locale = ["sh", shPlural, shOrdinal];
export const si: Locale = ["si", siPlural, siOrdinal];
export const sk: Locale = ["sk", skPlural, skOrdinal];
export const sl: Locale = ["sl", slPlural, slOrdinal];
export const sq: Locale = ["sq", sqPlural, sqOrdinal];
export const sr: Locale = ["sr", srPlural, srOrdinal];
export const sv: Locale = ["sv", svPlural, svOrdinal];
export const sw: Locale = ["sw", swPlural, swOrdinal];
export const ta: Locale = ["ta", taPlural, taOrdinal];
export const te: Locale = ["te", tePlural, teOrdinal];
export const th: Locale = ["th", thPlural, thOrdinal];
export const tk: Locale = ["tk", tkPlural, tkOrdinal];
export const tl: Locale = ["tl", tlPlural, tlOrdinal];
export const tpi: Locale = ["tpi", tpiPlural, tpiOrdinal];
export const tr: Locale = ["tr", trPlural, trOrdinal];
export const uk: Locale = ["uk", ukPlural, ukOrdinal];
export const und: Locale = ["und", undPlural, undOrdinal];
export const ur: Locale = ["ur", urPlural, urOrdinal];
export const uz: Locale = ["uz", uzPlural, uzOrdinal];
export const vec: Locale = ["vec", vecPlural, vecOrdinal];
export const vi: Locale = ["vi", viPlural, viOrdinal];
export const yue: Locale = ["yue", yuePlural, yueOrdinal];
export const zh: Locale = ["zh", zhPlural, zhOrdinal];
export const zu: Locale = ["zu", zuPlural, zuOrdinal];