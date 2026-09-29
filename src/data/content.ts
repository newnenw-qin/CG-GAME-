export type SceneId =
  | "intro"
  | "world"
  | "profile"
  | "education"
  | "experience"
  | "fabrique"
  | "tencent"
  | "coca"
  | "tme"
  | "guardian"
  | "museum"
  | "alipay"
  | "content"
  | "aigc"
  | "research"
  | "skills"
  | "contact";

export type Portal = {
  id: SceneId;
  label: string;
  index: string;
  x: string;
  y: string;
};

export const portals: Portal[] = [
  { id: "profile", label: "PROFILE", index: "01", x: "18%", y: "64%" },
  { id: "education", label: "EDUCATION", index: "02", x: "33%", y: "76%" },
  { id: "experience", label: "EXPERIENCE", index: "03", x: "50%", y: "70%" },
  { id: "fabrique", label: "BRAND", index: "04", x: "66%", y: "78%" },
  { id: "content", label: "CONTENT", index: "05", x: "82%", y: "64%" },
  { id: "aigc", label: "AIGC", index: "06", x: "10%", y: "40%" },
  { id: "research", label: "RESEARCH", index: "07", x: "36%", y: "54%" },
  { id: "skills", label: "SKILLS", index: "08", x: "58%", y: "56%" },
  { id: "contact", label: "CONTACT", index: "09", x: "76%", y: "50%" },
];

export const expeditions: {
  id: SceneId;
  no: string;
  title: string;
  org: string;
  roleZh: string;
  roleEn?: string;
  dept?: string;
  date: string;
  city: string;
}[] = [
  {
    id: "fabrique",
    no: "01",
    title: "FABRIQUE",
    org: "北京纷布科技有限公司",
    roleZh: "品牌策划",
    roleEn: "Brand Planning",
    dept: "品牌市场部",
    date: "2026.05 — 2026.09",
    city: "BEIJING",
  },
  {
    id: "tencent",
    no: "02",
    title: "TENCENT ESPORTS",
    org: "腾竞体育文化发展（上海）有限公司",
    roleZh: "现场执行制作人",
    dept: "赛事部",
    date: "2026.02 — 2026.04",
    city: "SHANGHAI",
  },
  {
    id: "coca",
    no: "03",
    title: "THE COCA-COLA COMPANY",
    org: "The Coca-Cola Company",
    roleZh: "卓越运营",
    roleEn: "Excellence in Operations",
    dept: "商品供应部",
    date: "2025.11 — 2026.02",
    city: "SHANGHAI",
  },
  {
    id: "tme",
    no: "04",
    title: "TME",
    org: "腾讯音乐娱乐集团",
    roleZh: "校园大使",
    date: "2025.10 — 2026.11",
    city: "SHANGHAI",
  },
  {
    id: "guardian",
    no: "05",
    title: "CHINA GUARDIAN",
    org: "中国嘉德国际拍卖有限公司",
    roleZh: "策略运营",
    dept: "嘉德文创",
    date: "2025.07 — 2025.09",
    city: "BEIJING",
  },
  {
    id: "museum",
    no: "06",
    title: "CHINA ARTS & CRAFTS MUSEUM",
    org: "中国工艺美术馆",
    roleZh: "文创产品",
    dept: "经营部",
    date: "2025.01 — 2025.03",
    city: "BEIJING",
  },
  {
    id: "alipay",
    no: "07",
    title: "ALIPAY",
    org: "支付宝（中国）网络技术有限公司",
    roleZh: "校园大使",
    date: "2021.08 — 2022.08",
    city: "XI'AN",
  },
];

export function sceneMark(id: SceneId): { index: string; label: string } {
  const found = portals.find((item) => item.id === id);
  if (found) return { index: found.index, label: found.label };
  const expedition = expeditions.find((item) => item.id === id);
  if (expedition) return { index: expedition.no, label: expedition.title };
  if (id === "world") return { index: "00", label: "THE UNKNOWN" };
  return { index: "00", label: "ENTER" };
}
