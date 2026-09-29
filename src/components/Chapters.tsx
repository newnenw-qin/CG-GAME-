"use client";

import { expeditions, type SceneId } from "@/data/content";
import { asset } from "@/lib/asset";
import { sound } from "@/lib/sound";

type Origin = { x: number; y: number };
type Go = (id: SceneId, origin?: Origin) => void;

const nextStop: Partial<Record<SceneId, { id: SceneId; label: string }>> = {
  profile: { id: "education", label: "EDUCATION" },
  education: { id: "experience", label: "EXPERIENCE" },
  experience: { id: "fabrique", label: "EXPEDITION 01" },
  fabrique: { id: "tencent", label: "TENCENT ESPORTS" },
  tencent: { id: "coca", label: "COCA-COLA" },
  coca: { id: "tme", label: "TME" },
  tme: { id: "guardian", label: "CHINA GUARDIAN" },
  guardian: { id: "museum", label: "ARTS & CRAFTS MUSEUM" },
  museum: { id: "alipay", label: "ALIPAY" },
  alipay: { id: "content", label: "CONTENT" },
  content: { id: "aigc", label: "AIGC" },
  aigc: { id: "research", label: "RESEARCH" },
  research: { id: "skills", label: "SKILLS" },
  skills: { id: "contact", label: "CONTACT" },
};

function Chapter({
  index,
  kicker,
  title,
  subtitle,
  meta,
  children,
}: {
  index: string;
  kicker: string;
  title: string;
  subtitle?: string;
  meta?: string;
  children: React.ReactNode;
}) {
  return (
    <article className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-8 pt-28 md:px-14 md:pt-32">
      <header>
        <p className="text-[10px] tracking-[0.46em] text-[#d4b483]">
          {index} / {kicker}
        </p>
        <h1 className="mt-5 max-w-5xl text-[clamp(2.4rem,6.4vw,5.6rem)] font-extralight leading-[0.96] tracking-[0.12em] text-[#f7f1e7]">
          {title}
        </h1>
        {subtitle && <p className="mt-6 text-[12px] tracking-[0.34em] text-[#f4ecdf]/72">{subtitle}</p>}
        {meta && <p className="mt-4 text-[12px] tracking-[0.18em] text-[#cbbfaa]">{meta}</p>}
        <span className="rule" />
      </header>
      <div className="mt-12 md:mt-16">{children}</div>
    </article>
  );
}

function Stats({ items }: { items: { value: string; label: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 md:gap-x-12">
      {items.map((item) => (
        <div key={item.label} className="border-t border-[#d4b483]/30 pt-4">
          <div className="text-[clamp(2.5rem,5.4vw,4.8rem)] font-extralight leading-none tracking-tight text-[#f7f1e6]">
            {item.value}
          </div>
          <div className="mt-3 text-[10px] leading-relaxed tracking-[0.26em] text-[#d4b483]">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

function Lines({ items }: { items: string[] }) {
  return (
    <ul className="mt-12 max-w-2xl space-y-3">
      {items.map((line) => (
        <li key={line} className="text-[15px] font-light leading-8 text-[#eadfce]/80">
          {line}
        </li>
      ))}
    </ul>
  );
}

function Continue({ scene, go }: { scene: SceneId; go: Go }) {
  const next = nextStop[scene];
  if (!next) return null;
  const back = expeditions.some((item) => item.id === scene);
  return (
    <div className="mt-16 flex flex-wrap items-end justify-between gap-8">
      {back ? (
        <button
          className="text-[10px] tracking-[0.36em] text-[#cbbfaa] transition-colors hover:text-[#f4ecdf]"
          onMouseEnter={() => sound().hover()}
          onClick={(event) => go("experience", { x: event.clientX, y: event.clientY })}
        >
          ALL EXPEDITIONS
        </button>
      ) : (
        <span />
      )}
      <button
        className="group inline-flex items-center gap-4 text-left"
        onMouseEnter={() => sound().hover()}
        onClick={(event) => go(next.id, { x: event.clientX, y: event.clientY })}
      >
        <span className="flame flame-sm" />
        <span>
          <span className="block text-[10px] tracking-[0.4em] text-[#d4b483]">CONTINUE</span>
          <span className="mt-1 block text-[12px] tracking-[0.22em] text-[#f4ecdf]/80 group-hover:text-white">
            {next.label}
          </span>
        </span>
      </button>
    </div>
  );
}

function Profile() {
  return (
    <article className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-8 pt-24 md:px-14 md:pt-28">
      <figure className="pointer-events-none absolute right-[-6vw] top-0 hidden h-[92vh] w-[58vw] md:block">
        <img
          src={asset("/cover.jpg")}
          alt="秦子雯"
          className="h-full w-full object-cover"
          style={{
            objectPosition: "70% 24%",
            maskImage: "radial-gradient(ellipse 72% 68% at 62% 42%, #000 16%, transparent 72%)",
            WebkitMaskImage: "radial-gradient(ellipse 72% 68% at 62% 42%, #000 16%, transparent 72%)",
          }}
        />
      </figure>
      <div className="relative h-[42vh] min-h-[240px] overflow-hidden md:hidden">
        <img
          src={asset("/cover.jpg")}
          alt="秦子雯"
          className="h-full w-full object-cover"
          style={{
            objectPosition: "72% 22%",
            maskImage: "linear-gradient(#000 50%, transparent)",
            WebkitMaskImage: "linear-gradient(#000 50%, transparent)",
          }}
        />
      </div>
      <div className="relative z-10 max-w-xl md:min-h-[62vh] md:pt-6">
          <p className="text-[10px] tracking-[0.46em] text-[#d4b483]">01 / PROFILE</p>
          <h1 className="mt-5 text-[clamp(2.8rem,6vw,5.2rem)] font-extralight leading-none tracking-[0.16em]">
            QIN ZIWEN
          </h1>
          <p className="mt-4 text-[15px] tracking-[0.28em] text-[#f4ecdf]/75">秦子雯</p>
          <span className="rule" />
          <p className="mt-8 text-[11px] tracking-[0.28em] text-[#d4b483]">2027 应届</p>
          <ul className="mt-8 space-y-3">
            {["ART MARKET", "BRAND", "CONTENT", "AIGC"].map((item, index) => (
              <li key={item} className="flex items-baseline gap-4 text-[13px] tracking-[0.28em] text-[#f6f1e8]">
                <span className="text-[10px] text-[#d4b483]">0{index + 1}</span>
                {item}
              </li>
            ))}
          </ul>
      </div>
      <div className="relative z-10 mt-10 max-w-2xl space-y-6 text-[15px] font-light leading-8 text-[#eadfce]/84">
        <p>
          秦子雯，华东师范大学艺术市场专业硕士研究生，美术学院全日制；本科毕业于长安大学材料成型及控制技术专业。
        </p>
        <p>
          她的工作落在艺术判断与商业落地之间：品牌策划、内容运营、活动执行，以及 AIGC 视觉生产。判断要能被看见，也要能被传播和转化。
        </p>
        <p>
          实践经过 Fabrique 品牌市场、腾竞体育 LPL 赛事现场、可口可乐商品供应、腾讯音乐校园推广、中国嘉德文创、中国工艺美术馆文创经营，以及支付宝校园渠道。内容侧独立运营小红书与微博娱乐垂类账号。研究侧曾以项目负责人完成国家级大学生创新创业项目，相关论文发表于《材料保护》。
        </p>
      </div>
    </article>
  );
}

function Education() {
  const places = [
    {
      city: "SHANGHAI",
      school: "华东师范大学",
      degree: "艺术市场 · 硕士",
      detail: "美术学院 · 全日制",
      date: "2024.09 — 2027.06",
      mark: "Double 1st-Class · 211 · 985",
    },
    {
      city: "XI'AN",
      school: "长安大学",
      degree: "材料成型及控制技术 · 本科",
      detail: "材料学院 · 全日制",
      date: "2019.09 — 2023.06",
      mark: "Double 1st-Class · 211",
    },
  ];
  return (
    <Chapter index="02" kicker="COORDINATES" title="EDUCATION" subtitle="两个坐标。研究，与成长。">
      <div className="grid gap-16 md:grid-cols-2 md:gap-20">
        {places.map((place, index) => (
          <section key={place.city} className="border-t border-[#d4b483]/25 pt-8">
            <p className="text-[10px] tracking-[0.4em] text-[#d4b483]">0{index + 1}</p>
            <h2 className="mt-4 text-[clamp(2.8rem,5vw,4.6rem)] font-extralight tracking-[0.16em]">{place.city}</h2>
            <p className="mt-6 text-lg font-light text-[#f6f1e8]">{place.school}</p>
            <p className="mt-2 text-[15px] text-[#eadfce]/85">{place.degree}</p>
            <p className="mt-1 text-[13px] tracking-[0.12em] text-[#cbbfaa]">{place.detail}</p>
            <p className="mt-6 text-[12px] tracking-[0.22em] text-[#d4b483]">{place.date}</p>
            <p className="mt-2 text-[11px] tracking-[0.18em] text-[#b7ab9a]">{place.mark}</p>
          </section>
        ))}
      </div>
    </Chapter>
  );
}

function Experience({ go }: { go: Go }) {
  return (
    <Chapter index="03" kicker="EXPEDITION LOG" title="EXPERIENCE" subtitle="七次进入。每家机构，都是一段探索。">
      <ol>
        {expeditions.map((item) => (
          <li key={item.id} className="border-t border-[#d4b483]/18">
            <button
              className="group grid w-full grid-cols-1 gap-3 py-7 text-left md:grid-cols-[72px_1.4fr_1fr_auto] md:items-end md:gap-6"
              onMouseEnter={() => sound().hover()}
              onClick={(event) => go(item.id, { x: event.clientX, y: event.clientY })}
            >
              <span className="text-[12px] tracking-[0.28em] text-[#d4b483]">{item.no}</span>
              <span>
                <span className="block text-[clamp(1.35rem,2.2vw,1.9rem)] font-extralight tracking-[0.14em] text-[#f7f1e6] transition-colors group-hover:text-[#f0c98a]">
                  {item.title}
                </span>
                <span className="mt-2 block text-[12px] leading-6 tracking-[0.06em] text-[#b7ab9a]">{item.org}</span>
              </span>
              <span className="text-[14px] font-light text-[#eadfce]/88">
                {item.roleZh}
                {item.roleEn && <span className="mt-1 block text-[11px] tracking-[0.16em] text-[#cbbfaa]">{item.roleEn}</span>}
                {item.dept && <span className="mt-1 block text-[11px] tracking-[0.14em] text-[#9c9184]">{item.dept}</span>}
              </span>
              <span className="text-[11px] tracking-[0.16em] text-[#d4b483] md:text-right">
                {item.date}
                <span className="mt-1 block text-[#b7ab9a]">{item.city}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </Chapter>
  );
}

function Fabrique() {
  return (
    <Chapter
      index="04"
      kicker="BRAND PLANNING"
      title="FABRIQUE"
      subtitle="北京纷布科技有限公司 · 品牌市场部"
      meta="2026.05 — 2026.09  /  BEIJING  /  品牌策划"
    >
      <p className="max-w-xl text-[clamp(1.4rem,2.5vw,2rem)] font-extralight leading-snug tracking-[0.04em] text-[#f7f1e6]">
        La Bella Estate
      </p>
      <p className="mt-3 text-[13px] tracking-[0.22em] text-[#d4b483]">北京 520 品牌快闪</p>
      <div className="mt-12">
        <Stats
          items={[
            { value: "2000+", label: "DAILY TRAFFIC" },
            { value: "1W+", label: "XHS NEW FOLLOWERS" },
            { value: "2.6W", label: "MAX VIDEO VIEWS" },
            { value: "1W+", label: "GMV INCREASE" },
            { value: "200+", label: "ARTIST CONTENT PIECES" },
            { value: "9W+", label: "MAX CONTENT READS" },
          ]}
        />
      </div>
      <Lines
        items={[
          "协助策划并执行北京 520 品牌快闪 La Bella Estate。",
          "协助策划上海、深圳等城市门店的品牌内容呈现。",
          "参与品牌创意视频策划拍摄，以及 AIGC 视频策划制作。",
          "品牌合作艺人内容制作与文案撰写。",
          "与数据中台合作搭建平面视觉内容 AI 数据库与 AI 工作流，应用于国内品牌账号矩阵。",
          "协助 2026 H1 国内与海外媒体平台——小红书、微博、Instagram——账号矩阵数据分析，为品牌宣传策略与市场投放提供数据支持。",
        ]}
      />
    </Chapter>
  );
}

function Tencent() {
  return (
    <Chapter
      index="03"
      kicker="EXPEDITION 02"
      title="TENCENT ESPORTS"
      subtitle="腾竞体育文化发展（上海）有限公司 · 赛事部"
      meta="2026.02 — 2026.04  /  SHANGHAI  /  现场执行制作人"
    >
      <div className="beams" />
      <p className="text-[12px] tracking-[0.42em] text-[#d4b483]">LPL 2026</p>
      <div className="relative mt-10">
        <Stats
          items={[
            { value: "24", label: "LIVE EVENT PRODUCTIONS" },
            { value: "10", label: "REMOTE LIVE BROADCASTS" },
          ]}
        />
      </div>
      <Lines
        items={[
          "负责 LPL 2026 英雄联盟职业联赛现场执行与制作统筹。",
          "完成线下赛事执行制作 24 场、远程赛事直播 10 场，全程零失误、零事故。",
          "对接参赛战队，负责赛前沟通、流程确认、现场协调及需求落地。",
          "赛后与美国拳头游戏 Riot Games 同步赛事全流程细节，提供执行反馈与数据支持。",
          "联动英雄联盟全球各大赛区，完成技术复盘、问题排查与经验共享。",
        ]}
      />
    </Chapter>
  );
}

function Coca() {
  return (
    <Chapter
      index="03"
      kicker="EXPEDITION 03"
      title="THE COCA-COLA COMPANY"
      subtitle="卓越运营 · 商品供应部"
      meta="2025.11 — 2026.02  /  SHANGHAI"
    >
      <Lines
        items={[
          "协助团队进行 CPS CHINA 全年出勤数据统计与对比分析，提出三条优化建议，为管理层提供数据支持。",
          "负责 CPS CHINA 视频剪辑，并发布于 Coca-Cola CPS Global 企业全球内网。",
          "负责 Coca-Cola Great China & Mongolia 公司内部培训视频的拍摄与剪辑。",
        ]}
      />
    </Chapter>
  );
}

function Tme() {
  return (
    <Chapter
      index="03"
      kicker="EXPEDITION 04"
      title="TME"
      subtitle="TENCENT MUSIC ENTERTAINMENT"
      meta="2025.10 — 2026.11  /  SHANGHAI  /  校园大使"
    >
      <svg className="pointer-events-none absolute right-0 top-28 hidden h-64 w-[42vw] md:block" viewBox="0 0 400 180" fill="none" aria-hidden>
        {[0, 1, 2].map((index) => (
          <path
            key={index}
            className="wave"
            d="M0 90 C 40 40, 80 140, 130 90 S 210 30, 260 90 S 340 150, 400 90"
            stroke="#d4b483"
            strokeWidth={0.7 + index * 0.25}
            style={{ animationDelay: `${index * 0.7}s`, opacity: 0.25 + index * 0.15 }}
          />
        ))}
      </svg>
      <Lines
        items={[
          "波点音乐 APP 校园推广。",
          "与音乐节、艺人粉丝站合作，策划并执行线下波点音乐 APP 推广。",
        ]}
      />
    </Chapter>
  );
}

function Guardian() {
  return (
    <Chapter
      index="03"
      kicker="EXPEDITION 05"
      title="CHINA GUARDIAN"
      subtitle="中国嘉德国际拍卖有限公司 · 嘉德文创"
      meta="2025.07 — 2025.09  /  BEIJING  /  策略运营"
    >
      <p className="pointer-events-none absolute right-4 top-24 select-none text-[16vw] font-extralight leading-none text-[#f4ecdf]/[0.045]">
        嘉德
      </p>
      <p className="max-w-xl text-[15px] leading-8 text-[#eadfce]/80">2026 第五届嘉德国际艺术书展暨文创嘉年华</p>
      <div className="mt-10">
        <Stats
          items={[
            { value: "30+", label: "BRAND SELECTION" },
            { value: "4000+", label: "SKU" },
            { value: "18%", label: "SALES GROWTH" },
            { value: "30%", label: "LIVE CONVERSION" },
          ]}
        />
      </div>
      <Lines
        items={[
          "品牌选品 30+，SKU 4000+。",
          "负责 3 个核心竞品商业活动的全流程分析，输出活动策略、玩法与转化数据对比报告。",
          "展览支持项目运营：「风雅物境:明清文人艺术生活展」「达古今之宜--清代宫廷设计潮流」。协调系统、供应商与门店的数据对接和销售数据分析，销售额环比增长 18%。",
          "嘉德文创电商平台运营：商品上下架、详情页优化、价格体系维护、库存统筹、页面视觉打理。",
          "配合直播全流程运营，通过选品、卖点提炼与场控配合，直播间转化率达 30%。",
        ]}
      />
    </Chapter>
  );
}

function Museum() {
  return (
    <Chapter
      index="03"
      kicker="EXPEDITION 06"
      title="CHINA ARTS & CRAFTS MUSEUM"
      subtitle="中国工艺美术馆 · 经营部"
      meta="2025.01 — 2025.03  /  BEIJING  /  文创产品"
    >
      <Stats
        items={[
          { value: "2W+", label: "SINGLE-DAY SALES" },
          { value: "2", label: "CONSIGNMENT PARTNERS" },
        ]}
      />
      <Lines
        items={[
          "文创产品布展销售及销存管理。单日销售额破 2 万，突破同期新高。",
          "协助对接代销文创品牌，建立 2 段稳定合作关系。",
        ]}
      />
    </Chapter>
  );
}

function Alipay() {
  return (
    <Chapter
      index="03"
      kicker="EXPEDITION 07"
      title="ALIPAY"
      subtitle="支付宝（中国）网络技术有限公司"
      meta="2021.08 — 2022.08  /  XI'AN  /  校园大使"
    >
      <Stats
        items={[
          { value: "2000+", label: "TARGET STUDENTS REACHED" },
          { value: "800+", label: "USER ACTIVATIONS" },
          { value: "2", label: "OFFLINE CAMPAIGNS" },
        ]}
      />
      <Lines
        items={[
          "渠道运营。",
          "策划并落地 2 场「支付宝校园派」线下宣传活动，直接触达目标学生群体 2000+。",
          "与校内业务部建立关系，拉新激活用户 800+。",
        ]}
      />
    </Chapter>
  );
}

function ContentScene() {
  const fragments = ["艺人 IP", "内容策划", "视觉制作", "流量运营", "用户互动", "粉丝社群", "舆情维护", "海报", "原创漫画", "文案"];
  return (
    <Chapter index="05" kicker="THE STORYTELLING ENGINE" title="CONTENT" subtitle="娱乐垂类。小红书，与微博。">
      <div className="mb-14 hidden flex-wrap gap-x-8 gap-y-4 md:flex">
        {fragments.map((item, index) => (
          <span
            key={item}
            className="fragment text-[12px] tracking-[0.28em] text-[#d4b483]/70"
            style={{ animationDelay: `${index * 0.4}s` }}
          >
            {item}
          </span>
        ))}
      </div>
      <section>
        <h2 className="text-[12px] tracking-[0.4em] text-[#d4b483]">XIAOHONGSHU</h2>
        <div className="mt-8">
          <Stats
            items={[
              { value: "305K", label: "3-MONTH TOTAL EXPOSURE" },
              { value: "649.6H", label: "WATCH TIME" },
              { value: "99%+", label: "ABOVE SAME-TYPE CREATORS" },
            ]}
          />
        </div>
        <Lines
          items={[
            "以艺人 IP 为核心，独立完成内容策划、视觉制作到流量运营的全链路。",
            "三个月总曝光 30.5 万，观看时长 649.6 小时，观看数超过 99% 同频内容。",
            "搭建用户互动体系，维护粉丝社群与舆情。互动数据超过 99% 同类型创作者。",
          ]}
        />
      </section>
      <section className="mt-20">
        <h2 className="text-[12px] tracking-[0.4em] text-[#d4b483]">WEIBO</h2>
        <div className="mt-8 max-w-sm">
          <Stats items={[{ value: "88K", label: "MAX POST READS" }]} />
        </div>
        <Lines
          items={[
            "独立完成艺人相关海报设计、原创漫画、文案撰写与内容发布。",
            "单帖最高阅读量 8.8 万。",
          ]}
        />
      </section>
    </Chapter>
  );
}

function Aigc() {
  const tools = ["即梦", "可灵", "Nano Banana", "Image-2", "Canva"];
  return (
    <Chapter index="06" kicker="AI × CREATIVE PRODUCTION" title="AIGC" subtitle="一间安静的数字档案室。">
      <div className="grid gap-14 md:grid-cols-2">
        <ol>
          {tools.map((tool, index) => (
            <li key={tool} className="flex items-baseline gap-6 border-t border-[#d4b483]/20 py-5">
              <span className="text-[10px] tracking-[0.28em] text-[#d4b483]">0{index + 1}</span>
              <span className="text-[clamp(1.4rem,2vw,1.8rem)] font-extralight tracking-[0.12em]">{tool}</span>
            </li>
          ))}
        </ol>
        <Lines
          items={[
            "AIGC 视频创作。熟悉从指令到成片的生产链路。",
            "通过 AI 指令优化画面质感，统一视觉风格，批量产出标准化短视频。",
            "脚本创意策划、场景生成、人物形象制作。",
          ]}
        />
      </div>
    </Chapter>
  );
}

function Research() {
  return (
    <article className="relative z-10 overflow-hidden">
      <div className="micro-grid" />
      <div className="relative mx-auto w-full max-w-[1440px] px-5 pb-28 pt-28 md:px-14 md:pt-32">
        <p className="text-[10px] tracking-[0.46em] text-[#d4b483]">07 / RESEARCH</p>
        <h1 className="mt-5 text-[clamp(2.6rem,6vw,5.4rem)] font-extralight tracking-[0.16em]">RESEARCH</h1>
        <p className="mt-4 text-[12px] tracking-[0.28em] text-[#cbbfaa]">DATA · MATERIALS · ANALYSIS</p>
        <span className="rule" />
        <h2 className="mt-12 max-w-3xl text-[clamp(1.35rem,2.4vw,2rem)] font-light leading-snug text-[#f7f1e6]">
          电镀法制备 SOFCs 合金连接体 Cu/Y2O3 复合涂层研究
        </h2>
        <p className="mt-6 text-[12px] tracking-[0.16em] text-[#d4b483]">
          大学生创新创业国家级项目 / 项目负责人 / 2021.10 — 2022.06 / 西安
        </p>
        <Lines
          items={["负责主要实验工作，以及实验数据记录与分析。", "相关论文发表于《材料保护》。"]}
        />
      </div>
    </article>
  );
}

function Skills() {
  const groups = [
    {
      title: "CREATIVE",
      items: ["Photoshop", "Premiere Pro", "剪映", "Canva", "即时设计", "Procreate"],
    },
    {
      title: "AI",
      items: ["即梦", "可灵", "Nano Banana", "Image-2"],
    },
    {
      title: "BUSINESS",
      items: ["Brand Planning", "Content Operations", "Campaign Planning", "Data Analysis", "E-commerce Operations", "Event Execution"],
    },
    {
      title: "LANGUAGE",
      items: ["普通话", "CET-6"],
    },
  ];
  return (
    <Chapter index="08" kicker="TOOL MAP" title="SKILLS">
      <div className="grid gap-12 md:grid-cols-2 xl:grid-cols-4">
        {groups.map((group) => (
          <section key={group.title}>
            <h2 className="text-[11px] tracking-[0.38em] text-[#d4b483]">{group.title}</h2>
            <ul className="mt-6 space-y-3">
              {group.items.map((item) => (
                <li key={item} className="text-[17px] font-light text-[#f6f1e8]">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <section className="mt-16 border-t border-[#d4b483]/20 pt-8">
        <h2 className="text-[11px] tracking-[0.38em] text-[#d4b483]">CERTIFICATE</h2>
        <p className="mt-4 text-[17px] font-light">全国演出经纪人资格证</p>
      </section>
      <section className="mt-16 max-w-3xl border-t border-[#d4b483]/20 pt-10">
        <p className="text-[10px] tracking-[0.4em] text-[#d4b483]">CAMPUS</p>
        <h2 className="mt-4 text-[clamp(1.6rem,3vw,2.2rem)] font-extralight tracking-[0.08em]">长安大学青年传媒中心</h2>
        <p className="mt-3 text-[12px] tracking-[0.16em] text-[#cbbfaa]">
          视频编辑制作 · 视频创作部门 · 2019.09 — 2020.09 · 西安
        </p>
        <div className="mt-8 max-w-xs">
          <Stats items={[{ value: "20+", label: "CAMPUS FILMS" }]} />
        </div>
        <Lines
          items={[
            "参与校园宣传片、校园晚会、校级会议等 20+ 项视频制作，从脚本策划到后期剪辑。",
            "参与电影《吹哨人》校园路演活动支持与拍摄，相关物料被校方作为官方宣传素材使用。",
          ]}
        />
      </section>
    </Chapter>
  );
}

function Contact() {
  return (
    <Chapter index="09" kicker="CONTACT" title="QIN ZIWEN" subtitle="ART MARKET  /  BRAND  /  CONTENT  /  AIGC">
      <div className="grid gap-10 md:grid-cols-2">
        <a
          className="block border-t border-[#d4b483]/30 pt-5 transition-colors hover:text-[#f0c98a]"
          href="mailto:1472432840@qq.com"
          onMouseEnter={() => sound().hover()}
        >
          <span className="block text-[10px] tracking-[0.36em] text-[#d4b483]">EMAIL</span>
          <span className="mt-3 block text-[clamp(1.1rem,2vw,1.5rem)] font-light tracking-wide">1472432840@qq.com</span>
        </a>
        <a
          className="block border-t border-[#d4b483]/30 pt-5 transition-colors hover:text-[#f0c98a]"
          href="tel:+8618210872809"
          onMouseEnter={() => sound().hover()}
        >
          <span className="block text-[10px] tracking-[0.36em] text-[#d4b483]">PHONE</span>
          <span className="mt-3 block text-[clamp(1.1rem,2vw,1.5rem)] font-light tracking-wide">18210872809</span>
        </a>
      </div>
      <a
        className="mt-14 inline-flex items-center gap-4 border-t border-[#d4b483]/30 pt-6 text-[12px] tracking-[0.36em] text-[#f6f1e8] hover:text-[#f0c98a]"
        href={asset("/秦子雯--2027应届.pdf")}
        download="秦子雯--2027应届.pdf"
        onMouseEnter={() => sound().hover()}
      >
        <span className="flame flame-sm" />
        DOWNLOAD CV
      </a>
    </Chapter>
  );
}

export default function Chapters({ scene, go }: { scene: SceneId; go: Go }) {
  let body: React.ReactNode = null;
  if (scene === "profile") body = <Profile />;
  else if (scene === "education") body = <Education />;
  else if (scene === "experience") body = <Experience go={go} />;
  else if (scene === "fabrique") body = <Fabrique />;
  else if (scene === "tencent") body = <Tencent />;
  else if (scene === "coca") body = <Coca />;
  else if (scene === "tme") body = <Tme />;
  else if (scene === "guardian") body = <Guardian />;
  else if (scene === "museum") body = <Museum />;
  else if (scene === "alipay") body = <Alipay />;
  else if (scene === "content") body = <ContentScene />;
  else if (scene === "aigc") body = <Aigc />;
  else if (scene === "research") body = <Research />;
  else if (scene === "skills") body = <Skills />;
  else if (scene === "contact") body = <Contact />;

  return (
    <>
      {body}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 md:px-14">
        <Continue scene={scene} go={go} />
      </div>
    </>
  );
}
