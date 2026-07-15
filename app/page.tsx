"use client";

import {
  Activity,
  ArrowUpRight,
  Bookmark,
  Bot,
  Box,
  ChevronDown,
  CircleHelp,
  Code2,
  Cpu,
  FileText,
  Flame,
  Github,
  Heart,
  History,
  Layers3,
  ListFilter,
  Menu,
  MessageCircle,
  Newspaper,
  PlugZap,
  Radio,
  Search,
  Shapes,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Category = "具身智能" | "仿真" | "控制" | "硬件" | "开源";
type ViewId =
  | "featured"
  | "all"
  | "daily"
  | "topics"
  | "projects"
  | "bookmarks"
  | "agent"
  | "about"
  | "changelog"
  | "feedback";

type FeedItem = {
  id: number;
  time: string;
  source: string;
  sourceType: string;
  title: string;
  summary: string;
  tags: string[];
  category: Category;
  score: number;
  featured?: boolean;
  reason: string;
};

const feedItems: FeedItem[] = [
  {
    id: 1,
    time: "09:42",
    source: "机研社 · 工程实践",
    sourceType: "社区投稿",
    title: "从仿真到真机：一套可复现的双臂装配 Sim2Real 工作流",
    summary:
      "把场景资产、域随机化、策略训练与真机标定拆成四个独立阶段，并给出每一阶段的失败检查点。重点不是堆算力，而是让仿真误差能被测量、定位和回放。",
    tags: ["Isaac Lab", "Sim2Real", "双臂协作"],
    category: "仿真",
    score: 96,
    featured: true,
    reason: "流程完整、验证边界清晰，适合正在把策略从仿真迁移到真实机器人的团队。",
  },
  {
    id: 2,
    time: "09:18",
    source: "ROS 开发者周刊",
    sourceType: "工具链",
    title: "机器人系统的可观测性，不应该等到真机失控后才补",
    summary:
      "用统一时间戳串起感知、规划与控制链路，建立从 rosbag 回放到端到端延迟剖析的最小方案。文中包含日志字段、采样频率和告警阈值的实用清单。",
    tags: ["ROS 2", "可观测性", "工程化"],
    category: "控制",
    score: 91,
    featured: true,
    reason: "把难以复现的偶发故障变成可以搜索、对齐和回放的工程证据。",
  },
  {
    id: 3,
    time: "08:37",
    source: "Embodied Notes",
    sourceType: "论文导读",
    title: "VLA 不是终点：如何把视觉语言动作模型接进实时控制环",
    summary:
      "从决策频率、动作分块、闭环纠偏三个角度解释 VLA 与底层控制器的职责边界，并用移动操作任务对比开环执行和滚动重规划的差异。",
    tags: ["VLA", "闭环控制", "具身智能"],
    category: "具身智能",
    score: 88,
    featured: true,
    reason: "避开模型排行榜，把问题拉回实时性、稳定性和可恢复性。",
  },
  {
    id: 4,
    time: "08:05",
    source: "Open Robot Stack",
    sourceType: "开源项目",
    title: "开源项目：面向多品牌机械臂的统一遥操作数据采集台",
    summary:
      "项目提供设备适配层、数据质量检查、回放工具和统一数据格式，帮助团队在不重写整套采集系统的前提下切换不同机械臂与末端执行器。",
    tags: ["遥操作", "数据采集", "开源"],
    category: "开源",
    score: 84,
    reason: "接口边界清楚，适合作为机器人数据基础设施的起点。",
  },
  {
    id: 5,
    time: "07:26",
    source: "Hardware Bench",
    sourceType: "硬件实测",
    title: "关节模组温升、峰值扭矩与持续负载：三个容易混淆的指标",
    summary:
      "通过相同轨迹下的热平衡实验，说明峰值参数为什么不能直接等同于持续工作能力，并提供选型时需要向供应商确认的测试条件。",
    tags: ["关节模组", "热管理", "选型"],
    category: "硬件",
    score: 81,
    reason: "用可测量条件拆解参数表，减少硬件选型中的错误类比。",
  },
  {
    id: 6,
    time: "昨天 22:14",
    source: "Control Room",
    sourceType: "教程",
    title: "四足机器人落脚点规划：从几何可达域到动态稳定裕度",
    summary:
      "用分层思路把候选落脚点、地形代价和机身状态联系起来，再通过小规模仿真逐步验证约束是否真的提高了复杂地形通过率。",
    tags: ["四足机器人", "运动控制", "规划"],
    category: "控制",
    score: 79,
    reason: "数学约束与物理直觉互相校验，适合用来搭建第一版规划器。",
  },
];

const tabs: Array<"全部" | Category> = [
  "全部",
  "具身智能",
  "仿真",
  "控制",
  "硬件",
  "开源",
];

const primaryNav = [
  { id: "featured" as const, label: "精选", icon: Sparkles },
  { id: "all" as const, label: "全部动态", icon: ListFilter },
  { id: "daily" as const, label: "机器人日报", icon: Newspaper },
  { id: "topics" as const, label: "技术主题", icon: Shapes },
  { id: "projects" as const, label: "开源项目", icon: Github },
  { id: "bookmarks" as const, label: "收藏", icon: Bookmark },
];

const secondaryNav = [
  { id: "agent" as const, label: "Agent 接入", icon: PlugZap },
  { id: "about" as const, label: "关于", icon: Heart },
  { id: "changelog" as const, label: "更新日志", icon: History },
  { id: "feedback" as const, label: "反馈", icon: MessageCircle },
];

const infoContent: Partial<Record<ViewId, { eyebrow: string; title: string; body: string; points: string[] }>> = {
  agent: {
    eyebrow: "ROBOHUB API",
    title: "让你的 Agent 读懂机器人社区",
    body: "通过统一的主题、标签和来源字段，把高价值机器人内容接入团队知识库、日报机器人或研发 Agent。",
    points: ["订阅精选与主题流", "按标签检索工程实践", "保留来源与推荐依据"],
  },
  about: {
    eyebrow: "ABOUT ROBOHUB",
    title: "为真正动手造机器人的人服务",
    body: "机研社聚合工程实践、开源项目和研究解读，强调可复现、可验证与诚实的证据边界。",
    points: ["少一点参数竞赛", "多一点失败复盘", "连接研究、工程与产品"],
  },
  changelog: {
    eyebrow: "CHANGELOG · V0.1",
    title: "机器人开发者社区首版上线",
    body: "首版包含精选时间线、分类筛选、全文搜索、本地收藏和移动端适配。",
    points: ["2026-07-15 · 首版发布", "搜索与分类联动", "收藏保存在当前设备"],
  },
  feedback: {
    eyebrow: "FEEDBACK",
    title: "把真实问题带进来",
    body: "欢迎提交难以复现的故障、缺少基准的选型问题，或值得更多开发者看到的开源项目。",
    points: ["问题请带最小复现", "项目请标明许可证", "评测请公开测试条件"],
  },
};

function Sidebar({
  view,
  onChange,
  mobileOpen,
  onClose,
}: {
  view: ViewId;
  onChange: (view: ViewId) => void;
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const choose = (id: ViewId) => {
    onChange(id);
    onClose();
  };

  return (
    <>
      <button
        className={`sidebar-backdrop ${mobileOpen ? "is-open" : ""}`}
        aria-label="关闭导航"
        onClick={onClose}
      />
      <aside className={`sidebar ${mobileOpen ? "is-open" : ""}`} aria-label="主导航">
        <div className="brand-row">
          <div className="brand-lockup" aria-label="ROBOHUB 机研社">
            <span>ROBO</span>
            <span className="brand-orbit" aria-hidden="true"><i /></span>
            <span>HUB</span>
          </div>
          <button className="mobile-close" onClick={onClose} aria-label="关闭导航">
            <X size={20} />
          </button>
        </div>
        <div className="brand-subtitle"><span />机器人开发者社区</div>

        <nav>
          <p className="nav-kicker">内容</p>
          <div className="nav-list">
            {primaryNav.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={view === id ? "active" : ""}
                onClick={() => choose(id)}
                aria-current={view === id ? "page" : undefined}
              >
                <Icon size={19} strokeWidth={1.9} />
                <span>{label}</span>
                {id === "projects" && <span className="nav-count">12</span>}
              </button>
            ))}
          </div>

          <p className="nav-kicker spaced">接入</p>
          <div className="nav-list">
            {secondaryNav.slice(0, 1).map(({ id, label, icon: Icon }) => (
              <button key={id} className={view === id ? "active" : ""} onClick={() => choose(id)}>
                <Icon size={19} strokeWidth={1.9} />
                <span>{label}</span>
                <span className="beta">BETA</span>
              </button>
            ))}
          </div>

          <p className="nav-kicker spaced">更多</p>
          <div className="nav-list">
            {secondaryNav.slice(1).map(({ id, label, icon: Icon }) => (
              <button key={id} className={view === id ? "active" : ""} onClick={() => choose(id)}>
                <Icon size={19} strokeWidth={1.9} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="online-dot" />
          <div><strong>1,248</strong><span> 位开发者在线</span></div>
        </div>
      </aside>
    </>
  );
}

export default function Home() {
  const [view, setView] = useState<ViewId>("featured");
  const [category, setCategory] = useState<"全部" | Category>("全部");
  const [query, setQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = window.localStorage.getItem("robohub-bookmarks");
      if (saved) setBookmarks(JSON.parse(saved));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return feedItems.filter((item) => {
      if (view === "featured" && !item.featured) return false;
      if (view === "projects" && item.category !== "开源") return false;
      if (view === "bookmarks" && !bookmarks.includes(item.id)) return false;
      if (category !== "全部" && item.category !== category) return false;
      if (!normalized) return true;
      return [item.title, item.summary, item.source, item.category, ...item.tags]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
    });
  }, [bookmarks, category, query, view]);

  const toggleBookmark = (id: number) => {
    setBookmarks((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      window.localStorage.setItem("robohub-bookmarks", JSON.stringify(next));
      return next;
    });
  };

  const changeView = (next: ViewId) => {
    setView(next);
    setQuery("");
    setCategory(next === "projects" ? "开源" : "全部");
  };

  const copyAgentEndpoint = async () => {
    await navigator.clipboard.writeText("https://robohub.community/api/feed");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const info = infoContent[view];
  const viewTitle = view === "bookmarks" ? "我的收藏" : view === "projects" ? "开源项目" : view === "daily" ? "机器人日报" : view === "topics" ? "技术主题" : view === "all" ? "全部动态" : "精选";

  return (
    <div className="site-shell">
      <Sidebar view={view} onChange={changeView} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="main-content">
        <header className="page-header">
          <div className="title-row">
            <button className="menu-button" onClick={() => setMobileOpen(true)} aria-label="打开导航">
              <Menu size={22} />
            </button>
            <div>
              <div className="title-with-pulse">
                <h1>{viewTitle}</h1>
                <span className="live-pill"><Radio size={13} /> LIVE</span>
              </div>
              <p>2026年7月15日星期三 · 机器人开发者自动挑选的高价值内容</p>
            </div>
          </div>
          <a className="contribute-button" href="https://github.com/yixinzhangagent/robot-developer-community" target="_blank" rel="noreferrer">
            <Github size={17} />共建社区<ArrowUpRight size={15} />
          </a>
        </header>

        {!info && (
          <>
            <section className="toolbar" aria-label="内容筛选">
              <div className="tabs" role="tablist" aria-label="主题分类">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    className={category === tab ? "active" : ""}
                    onClick={() => setCategory(tab)}
                    role="tab"
                    aria-selected={category === tab}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <label className="search-box">
                <Search size={18} aria-hidden="true" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="搜索项目、技术或正文…"
                  aria-label="搜索项目、技术或正文"
                />
                {query && <button onClick={() => setQuery("")} aria-label="清空搜索"><X size={16} /></button>}
              </label>
            </section>

            <section className="hotspot-card" aria-label="当前热点">
              <div className="hotspot-head">
                <span><Flame size={18} />当前热点</span>
                <small>社区关注度 · 多来源信号汇总</small>
              </div>
              <button className="hotspot-row" onClick={() => { setQuery("Sim2Real"); setCategory("全部"); }}>
                <strong>1</strong>
                <span className="hotspot-topic">Sim2Real 工程化：从“策略能跑”到“真机可复现”</span>
                <span className="hotspot-meta">近48小时 · 18 个讨论 · 热度 96</span>
                <ArrowUpRight size={17} />
              </button>
            </section>

            <section className="feed-section">
              <div className="date-heading">
                <h2>{view === "bookmarks" ? "已收藏" : "7月15日"}</h2>
                <ChevronDown size={18} />
                <span>星期三 · {filteredItems.length} 条</span>
              </div>

              {filteredItems.length > 0 ? (
                <div className="timeline">
                  {filteredItems.map((item) => (
                    <article className="feed-row" key={item.id}>
                      <time>{item.time}</time>
                      <span className="timeline-dot" aria-hidden="true" />
                      <div className="feed-card">
                        <div className="card-topline">
                          <div className="source-line">
                            <span>{item.source}</span>
                            <small>{item.sourceType}</small>
                            {item.featured && <em><Star size={12} fill="currentColor" />精选</em>}
                          </div>
                          <div className="card-actions">
                            <span className="score"><i />{item.score}</span>
                            <button
                              className={bookmarks.includes(item.id) ? "bookmarked" : ""}
                              onClick={() => toggleBookmark(item.id)}
                              aria-label={bookmarks.includes(item.id) ? "取消收藏" : "收藏"}
                              aria-pressed={bookmarks.includes(item.id)}
                            >
                              <Bookmark size={19} fill={bookmarks.includes(item.id) ? "currentColor" : "none"} />
                            </button>
                          </div>
                        </div>
                        <h3>{item.title}</h3>
                        <p className="summary">{item.summary}</p>
                        <div className="tag-row">
                          {item.tags.map((tag) => <button key={tag} onClick={() => setQuery(tag)}>#{tag}</button>)}
                        </div>
                        <div className="reason"><strong>推荐理由：</strong>{item.reason}</div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Bot size={34} />
                  <h3>暂时没有匹配内容</h3>
                  <p>{view === "bookmarks" ? "收藏一篇内容后，它会出现在这里。" : "换个关键词或主题试试。"}</p>
                  <button onClick={() => { setQuery(""); setCategory("全部"); }}>查看全部动态</button>
                </div>
              )}
            </section>
          </>
        )}

        {info && (
          <section className="info-view">
            <div className="info-orbit" aria-hidden="true"><Bot size={42} /></div>
            <p className="info-eyebrow">{info.eyebrow}</p>
            <h2>{info.title}</h2>
            <p className="info-body">{info.body}</p>
            <div className="info-points">
              {info.points.map((point, index) => {
                const icons = [Code2, Layers3, Activity];
                const Icon = icons[index] ?? CircleHelp;
                return <div key={point}><Icon size={20} /><span>{point}</span></div>;
              })}
            </div>
            {view === "agent" ? (
              <button className="primary-action" onClick={copyAgentEndpoint}><PlugZap size={17} />{copied ? "接入地址已复制" : "复制 Agent 接入地址"}</button>
            ) : view === "feedback" ? (
              <a className="primary-action" href="https://github.com/yixinzhangagent/robot-developer-community/issues" target="_blank" rel="noreferrer"><MessageCircle size={17} />提交反馈</a>
            ) : (
              <button className="primary-action" onClick={() => changeView("featured")}><Sparkles size={17} />返回今日精选</button>
            )}
            <div className="discipline-strip">
              <span><Box size={15} />物理约束</span>
              <span><Cpu size={15} />计算验证</span>
              <span><Users size={15} />社区协作</span>
              <span><FileText size={15} />证据边界</span>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
