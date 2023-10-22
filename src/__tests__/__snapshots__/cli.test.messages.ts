import type { Locale } from "icu-to-json";
import { date, time, numberFmt as number } from "@messageformat/runtime/lib/formatters";
import { af as afPlural, am as amPlural, an as anPlural, ar as arPlural, as as asPlural, ast as astPlural, az as azPlural, bal as balPlural, be as bePlural, bg as bgPlural, bn as bnPlural, bs as bsPlural, ca as caPlural, ce as cePlural, cs as csPlural, cy as cyPlural, da as daPlural, de as dePlural, dsb as dsbPlural, el as elPlural, en as enPlural, es as esPlural, et as etPlural, eu as euPlural, fa as faPlural, fi as fiPlural, fil as filPlural, fr as frPlural, fy as fyPlural, ga as gaPlural, gd as gdPlural, gl as glPlural, gsw as gswPlural, gu as guPlural, he as hePlural, hi as hiPlural, hr as hrPlural, hsb as hsbPlural, hu as huPlural, hy as hyPlural, ia as iaPlural, id as idPlural, is as isPlural, it as itPlural, ja as jaPlural, ka as kaPlural, kk as kkPlural, km as kmPlural, kn as knPlural, ko as koPlural, kw as kwPlural, ky as kyPlural, lij as lijPlural, lo as loPlural, lt as ltPlural, lv as lvPlural, mk as mkPlural, ml as mlPlural, mn as mnPlural, mo as moPlural, mr as mrPlural, ms as msPlural, my as myPlural, nb as nbPlural, ne as nePlural, nl as nlPlural, no as noPlural, or as orPlural, pa as paPlural, pl as plPlural, prg as prgPlural, ps as psPlural, pt as ptPlural, ro as roPlural, ru as ruPlural, sc as scPlural, scn as scnPlural, sd as sdPlural, sh as shPlural, si as siPlural, sk as skPlural, sl as slPlural, sq as sqPlural, sr as srPlural, sv as svPlural, sw as swPlural, ta as taPlural, te as tePlural, th as thPlural, tk as tkPlural, tl as tlPlural, tpi as tpiPlural, tr as trPlural, uk as ukPlural, und as undPlural, ur as urPlural, uz as uzPlural, vec as vecPlural, vi as viPlural, yue as yuePlural, zh as zhPlural, zu as zuPlural } from "make-plural/plurals";
import { af as afOrdinal, am as amOrdinal, an as anOrdinal, ar as arOrdinal, as as asOrdinal, ast as astOrdinal, az as azOrdinal, bal as balOrdinal, be as beOrdinal, bg as bgOrdinal, bn as bnOrdinal, bs as bsOrdinal, ca as caOrdinal, ce as ceOrdinal, cs as csOrdinal, cy as cyOrdinal, da as daOrdinal, de as deOrdinal, dsb as dsbOrdinal, el as elOrdinal, en as enOrdinal, es as esOrdinal, et as etOrdinal, eu as euOrdinal, fa as faOrdinal, fi as fiOrdinal, fil as filOrdinal, fr as frOrdinal, fy as fyOrdinal, ga as gaOrdinal, gd as gdOrdinal, gl as glOrdinal, gsw as gswOrdinal, gu as guOrdinal, he as heOrdinal, hi as hiOrdinal, hr as hrOrdinal, hsb as hsbOrdinal, hu as huOrdinal, hy as hyOrdinal, ia as iaOrdinal, id as idOrdinal, is as isOrdinal, it as itOrdinal, ja as jaOrdinal, ka as kaOrdinal, kk as kkOrdinal, km as kmOrdinal, kn as knOrdinal, ko as koOrdinal, kw as kwOrdinal, ky as kyOrdinal, lij as lijOrdinal, lo as loOrdinal, lt as ltOrdinal, lv as lvOrdinal, mk as mkOrdinal, ml as mlOrdinal, mn as mnOrdinal, mo as moOrdinal, mr as mrOrdinal, ms as msOrdinal, my as myOrdinal, nb as nbOrdinal, ne as neOrdinal, nl as nlOrdinal, no as noOrdinal, or as orOrdinal, pa as paOrdinal, pl as plOrdinal, prg as prgOrdinal, ps as psOrdinal, pt as ptOrdinal, ro as roOrdinal, ru as ruOrdinal, sc as scOrdinal, scn as scnOrdinal, sd as sdOrdinal, sh as shOrdinal, si as siOrdinal, sk as skOrdinal, sl as slOrdinal, sq as sqOrdinal, sr as srOrdinal, sv as svOrdinal, sw as swOrdinal, ta as taOrdinal, te as teOrdinal, th as thOrdinal, tk as tkOrdinal, tl as tlOrdinal, tpi as tpiOrdinal, tr as trOrdinal, uk as ukOrdinal, und as undOrdinal, ur as urOrdinal, uz as uzOrdinal, vec as vecOrdinal, vi as viOrdinal, yue as yueOrdinal, zh as zhOrdinal, zu as zuOrdinal } from "@messageformat/runtime/lib/cardinals";
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
export const af = ["af", afPlural, afOrdinal] as any as Locale;
export const am = ["am", amPlural, amOrdinal] as any as Locale;
export const an = ["an", anPlural, anOrdinal] as any as Locale;
export const ar = ["ar", arPlural, arOrdinal] as any as Locale;
export const as = ["as", asPlural, asOrdinal] as any as Locale;
export const ast = ["ast", astPlural, astOrdinal] as any as Locale;
export const az = ["az", azPlural, azOrdinal] as any as Locale;
export const bal = ["bal", balPlural, balOrdinal] as any as Locale;
export const be = ["be", bePlural, beOrdinal] as any as Locale;
export const bg = ["bg", bgPlural, bgOrdinal] as any as Locale;
export const bn = ["bn", bnPlural, bnOrdinal] as any as Locale;
export const bs = ["bs", bsPlural, bsOrdinal] as any as Locale;
export const ca = ["ca", caPlural, caOrdinal] as any as Locale;
export const ce = ["ce", cePlural, ceOrdinal] as any as Locale;
export const cs = ["cs", csPlural, csOrdinal] as any as Locale;
export const cy = ["cy", cyPlural, cyOrdinal] as any as Locale;
export const da = ["da", daPlural, daOrdinal] as any as Locale;
export const de = ["de", dePlural, deOrdinal] as any as Locale;
export const dsb = ["dsb", dsbPlural, dsbOrdinal] as any as Locale;
export const el = ["el", elPlural, elOrdinal] as any as Locale;
export const en = ["en", enPlural, enOrdinal] as any as Locale;
export const es = ["es", esPlural, esOrdinal] as any as Locale;
export const et = ["et", etPlural, etOrdinal] as any as Locale;
export const eu = ["eu", euPlural, euOrdinal] as any as Locale;
export const fa = ["fa", faPlural, faOrdinal] as any as Locale;
export const fi = ["fi", fiPlural, fiOrdinal] as any as Locale;
export const fil = ["fil", filPlural, filOrdinal] as any as Locale;
export const fr = ["fr", frPlural, frOrdinal] as any as Locale;
export const fy = ["fy", fyPlural, fyOrdinal] as any as Locale;
export const ga = ["ga", gaPlural, gaOrdinal] as any as Locale;
export const gd = ["gd", gdPlural, gdOrdinal] as any as Locale;
export const gl = ["gl", glPlural, glOrdinal] as any as Locale;
export const gsw = ["gsw", gswPlural, gswOrdinal] as any as Locale;
export const gu = ["gu", guPlural, guOrdinal] as any as Locale;
export const he = ["he", hePlural, heOrdinal] as any as Locale;
export const hi = ["hi", hiPlural, hiOrdinal] as any as Locale;
export const hr = ["hr", hrPlural, hrOrdinal] as any as Locale;
export const hsb = ["hsb", hsbPlural, hsbOrdinal] as any as Locale;
export const hu = ["hu", huPlural, huOrdinal] as any as Locale;
export const hy = ["hy", hyPlural, hyOrdinal] as any as Locale;
export const ia = ["ia", iaPlural, iaOrdinal] as any as Locale;
export const id = ["id", idPlural, idOrdinal] as any as Locale;
export const is = ["is", isPlural, isOrdinal] as any as Locale;
export const it = ["it", itPlural, itOrdinal] as any as Locale;
export const ja = ["ja", jaPlural, jaOrdinal] as any as Locale;
export const ka = ["ka", kaPlural, kaOrdinal] as any as Locale;
export const kk = ["kk", kkPlural, kkOrdinal] as any as Locale;
export const km = ["km", kmPlural, kmOrdinal] as any as Locale;
export const kn = ["kn", knPlural, knOrdinal] as any as Locale;
export const ko = ["ko", koPlural, koOrdinal] as any as Locale;
export const kw = ["kw", kwPlural, kwOrdinal] as any as Locale;
export const ky = ["ky", kyPlural, kyOrdinal] as any as Locale;
export const lij = ["lij", lijPlural, lijOrdinal] as any as Locale;
export const lo = ["lo", loPlural, loOrdinal] as any as Locale;
export const lt = ["lt", ltPlural, ltOrdinal] as any as Locale;
export const lv = ["lv", lvPlural, lvOrdinal] as any as Locale;
export const mk = ["mk", mkPlural, mkOrdinal] as any as Locale;
export const ml = ["ml", mlPlural, mlOrdinal] as any as Locale;
export const mn = ["mn", mnPlural, mnOrdinal] as any as Locale;
export const mo = ["mo", moPlural, moOrdinal] as any as Locale;
export const mr = ["mr", mrPlural, mrOrdinal] as any as Locale;
export const ms = ["ms", msPlural, msOrdinal] as any as Locale;
export const my = ["my", myPlural, myOrdinal] as any as Locale;
export const nb = ["nb", nbPlural, nbOrdinal] as any as Locale;
export const ne = ["ne", nePlural, neOrdinal] as any as Locale;
export const nl = ["nl", nlPlural, nlOrdinal] as any as Locale;
export const no = ["no", noPlural, noOrdinal] as any as Locale;
export const or = ["or", orPlural, orOrdinal] as any as Locale;
export const pa = ["pa", paPlural, paOrdinal] as any as Locale;
export const pl = ["pl", plPlural, plOrdinal] as any as Locale;
export const prg = ["prg", prgPlural, prgOrdinal] as any as Locale;
export const ps = ["ps", psPlural, psOrdinal] as any as Locale;
export const pt = ["pt", ptPlural, ptOrdinal] as any as Locale;
export const ro = ["ro", roPlural, roOrdinal] as any as Locale;
export const ru = ["ru", ruPlural, ruOrdinal] as any as Locale;
export const sc = ["sc", scPlural, scOrdinal] as any as Locale;
export const scn = ["scn", scnPlural, scnOrdinal] as any as Locale;
export const sd = ["sd", sdPlural, sdOrdinal] as any as Locale;
export const sh = ["sh", shPlural, shOrdinal] as any as Locale;
export const si = ["si", siPlural, siOrdinal] as any as Locale;
export const sk = ["sk", skPlural, skOrdinal] as any as Locale;
export const sl = ["sl", slPlural, slOrdinal] as any as Locale;
export const sq = ["sq", sqPlural, sqOrdinal] as any as Locale;
export const sr = ["sr", srPlural, srOrdinal] as any as Locale;
export const sv = ["sv", svPlural, svOrdinal] as any as Locale;
export const sw = ["sw", swPlural, swOrdinal] as any as Locale;
export const ta = ["ta", taPlural, taOrdinal] as any as Locale;
export const te = ["te", tePlural, teOrdinal] as any as Locale;
export const th = ["th", thPlural, thOrdinal] as any as Locale;
export const tk = ["tk", tkPlural, tkOrdinal] as any as Locale;
export const tl = ["tl", tlPlural, tlOrdinal] as any as Locale;
export const tpi = ["tpi", tpiPlural, tpiOrdinal] as any as Locale;
export const tr = ["tr", trPlural, trOrdinal] as any as Locale;
export const uk = ["uk", ukPlural, ukOrdinal] as any as Locale;
export const und = ["und", undPlural, undOrdinal] as any as Locale;
export const ur = ["ur", urPlural, urOrdinal] as any as Locale;
export const uz = ["uz", uzPlural, uzOrdinal] as any as Locale;
export const vec = ["vec", vecPlural, vecOrdinal] as any as Locale;
export const vi = ["vi", viPlural, viOrdinal] as any as Locale;
export const yue = ["yue", yuePlural, yueOrdinal] as any as Locale;
export const zh = ["zh", zhPlural, zhOrdinal] as any as Locale;
export const zu = ["zu", zuPlural, zuOrdinal] as any as Locale;