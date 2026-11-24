"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { FilledImage as Image } from "./FilledImage";
import { textCases, type TextCase } from "./textCases";
import { studentCases, type StudentCase } from "./studentCases";
import { ideaLinks, virtualIdeaNodes, type IdeaLink } from "./ideaLinks";

type View = "discover" | "challenges" | "graph";
type Evidence = "观察" | "模型实验" | "数据验证";

type Post = {
  id: number;
  author: string;
  initials: string;
  role: string;
  title: string;
  excerpt: string;
  checked?: string;
  explanation?: string;
  peerQuestion?: string;
  attachmentName?: string;
  concept: string;
  evidence: Evidence;
  status: "教师基准" | "同伴已验证" | "待验证";
  visual: "paper" | "cable" | "sensor" | "arch" | "submitted";
  likes: number;
  comments: number;
  saved: number;
  time: string;
};

const initialPosts: Post[] = [
  {
    id: 1,
    author: "林知夏",
    initials: "林",
    role: "结构设计 · 研一",
    title: "同样 6 张纸，为什么卷成圆筒后能承受 16 倍荷载？",
    excerpt:
      "控制材料、跨径与支承不变，只改变截面。我们把平铺、折叠与两种卷筒截面放到同一组加载实验里比较。",
    concept: "截面与刚度",
    evidence: "模型实验",
    status: "同伴已验证",
    visual: "paper",
    likes: 128,
    comments: 26,
    saved: 43,
    time: "2 小时前",
  },
  {
    id: 2,
    author: "周屿",
    initials: "周",
    role: "桥梁工程 · 大四",
    title: "索塔不是简单地“把桥吊起来”：斜拉桥里的部分自平衡",
    excerpt:
      "把边跨锚固、塔柱受压和主梁弯矩放到一张力流图里，才能看见斜拉体系为什么比直觉中更复杂。",
    concept: "较小内力",
    evidence: "观察",
    status: "教师基准",
    visual: "cable",
    likes: 316,
    comments: 48,
    saved: 92,
    time: "昨天",
  },
  {
    id: 3,
    author: "许闻川",
    initials: "许",
    role: "物联网 · 研二",
    title: "手机也能测桥：从一段自由振动识别 2.84 Hz",
    excerpt:
      "用手机加速度计采集模型桥的衰减振动，再让 AI 辅助识别峰值和周期。原始数据、处理步骤与误差说明已附上。",
    concept: "自由振动",
    evidence: "数据验证",
    status: "同伴已验证",
    visual: "sensor",
    likes: 244,
    comments: 39,
    saved: 76,
    time: "3 天前",
  },
  {
    id: 4,
    author: "桥见教研组",
    initials: "桥",
    role: "教师基准案例",
    title: "拱与梁的受力反转：相同跨度，为什么支座反应完全不同？",
    excerpt:
      "先预测水平推力，再用两组低成本模型验证。重点不在算出数值，而在看懂结构形式如何改变内力路径。",
    concept: "直接传力路径",
    evidence: "模型实验",
    status: "教师基准",
    visual: "arch",
    likes: 189,
    comments: 31,
    saved: 58,
    time: "本周精选",
  },
];

const challenges = [
  {
    id: 11,
    concept: "奥利奥 · 扭转",
    title: "换一种夹心厚度，剪切变形还会一样吗？",
    detail: "有人提议先在奶油上压出方格，再扭动不同厚度的夹心。结果可能支持原想法，也可能推翻它。",
    difficulty: "等你复现",
    reward: "从 Sally 的灵光长出",
    spots: "12 人接着做",
  },
  {
    id: 12,
    concept: "冰梁 · 脆性受弯",
    title: "绳子放在冰梁上面、下面或中间，差别有多大？",
    detail: "三根同尺寸冰梁，绳子分别靠近上缘、中间和下缘；记录第一条裂缝出现的位置和破坏荷载。",
    difficulty: "三种位置",
    reward: "接自 Rakhshinda 的冰梁",
    spots: "9 人提交了不同做法",
  },
  {
    id: 13,
    concept: "巧克力 · 弯曲裂缝",
    title: "掰巧克力时，裂缝为什么总从某一面开始？",
    detail: "有人说是受拉，有人说是刻槽造成的应力集中。拍慢动作、换方向、换有无刻槽的巧克力，都能接上这条讨论。",
    difficulty: "需要反例",
    reward: "来自食堂的一次争论",
    spots: "18 条同伴回应",
  },
  {
    id: 14,
    concept: "纸张 · 截面刚度",
    title: "同一张纸，还能折出比圆筒更抗弯的截面吗？",
    detail: "保留每次折法、跨度、砝码和失败样子，把不同截面排在一起，看看哪种形状先局部压皱。",
    difficulty: "开放分叉",
    reward: "来自 27 种纸桥截面",
    spots: "还有 6 个新分支",
  },
];

const graphNodes = [
  { id: "life", label: "生活中的结构", x: 0.5, y: 0.47, r: 32, kind: "root" },
  { id: "torsion", label: "扭转", x: 0.28, y: 0.24, r: 25, kind: "concept" },
  { id: "shear", label: "剪应力", x: 0.64, y: 0.19, r: 23, kind: "concept" },
  { id: "bending", label: "受弯", x: 0.78, y: 0.46, r: 26, kind: "concept" },
  { id: "brittle", label: "脆性断裂", x: 0.28, y: 0.69, r: 23, kind: "concept" },
  { id: "reinforce", label: "复合与增强", x: 0.58, y: 0.77, r: 22, kind: "concept" },
  { id: "oreo", label: "奥利奥", x: 0.09, y: 0.15, r: 18, kind: "case" },
  { id: "ice", label: "绳增强冰梁", x: 0.91, y: 0.29, r: 19, kind: "case" },
  { id: "chocolate", label: "掰巧克力", x: 0.12, y: 0.48, r: 17, kind: "case" },
  { id: "paper", label: "折纸截面", x: 0.12, y: 0.78, r: 17, kind: "case" },
  { id: "concrete", label: "混凝土梁", x: 0.48, y: 0.91, r: 18, kind: "course" },
  { id: "bridge", label: "桥面梁", x: 0.9, y: 0.59, r: 18, kind: "course" },
  { id: "physics", label: "材料力学", x: 0.5, y: 0.07, r: 18, kind: "course" },
  { id: "ai", label: "AI 受力草图", x: 0.78, y: 0.8, r: 17, kind: "sensor" },
];

const graphEdges = [
  { from: "bridge", to: "load", forward: "包含", reverse: "属于", confidence: 99, evidence: 42, why: "课程大纲、教材章节与 18 个案例共同指向该上位概念。" },
  { from: "bridge", to: "stiff", forward: "包含", reverse: "属于", confidence: 99, evidence: 37, why: "在结构响应、截面设计与模型实验材料中反复共现。" },
  { from: "bridge", to: "dynamic", forward: "包含", reverse: "属于", confidence: 98, evidence: 31, why: "由振动课程材料、传感数据与桥梁监测案例交叉确认。" },
  { from: "bridge", to: "stability", forward: "包含", reverse: "属于", confidence: 98, evidence: 28, why: "连接构件稳定、整体稳定及施工阶段失稳三组材料。" },
  { from: "bridge", to: "prestress", forward: "包含", reverse: "属于", confidence: 97, evidence: 24, why: "课程概念与连续梁、斜拉桥案例形成稳定语义簇。" },
  { from: "load", to: "paper", forward: "解释", reverse: "例证", confidence: 94, evidence: 8, why: "实验中的荷载—支承—反力路径与直接传力路径一致。" },
  { from: "load", to: "truss", forward: "用于分析", reverse: "体现", confidence: 96, evidence: 14, why: "杆件轴力与节点传力是桁架案例的核心证据。" },
  { from: "load", to: "arch", forward: "解释", reverse: "对比验证", confidence: 97, evidence: 17, why: "拱桥通过水平推力和压力路径与梁桥形成对照。" },
  { from: "stiff", to: "paper", forward: "决定表现", reverse: "验证", confidence: 95, evidence: 11, why: "控制材料和跨度后，截面形态成为承载差异的主要变量。" },
  { from: "stiff", to: "physics", forward: "迁移到", reverse: "提供基础", confidence: 91, evidence: 9, why: "弹性、弯曲与变形的物理模型支持刚度概念理解。" },
  { from: "dynamic", to: "sensor", forward: "可被测量", reverse: "感知", confidence: 98, evidence: 23, why: "加速度时间序列可提取自振频率、阻尼与响应峰值。" },
  { from: "dynamic", to: "resonance", forward: "预测", reverse: "揭示", confidence: 96, evidence: 16, why: "频率接近与响应放大在实验数据中同时出现。" },
  { from: "dynamic", to: "iot", forward: "驱动应用", reverse: "持续采集", confidence: 92, evidence: 12, why: "物联网课程中的采集、传输与告警链路承接结构动力监测。" },
  { from: "stability", to: "arch", forward: "约束设计", reverse: "提供案例", confidence: 90, evidence: 10, why: "拱肋平面外稳定和施工临时体系在多份材料中关联。" },
  { from: "prestress", to: "cable", forward: "参与形成", reverse: "呈现", confidence: 89, evidence: 7, why: "拉索初张力与成桥线形材料形成概念映射，但仍需教师复核。" },
  { from: "sensor", to: "iot", forward: "接入", reverse: "管理", confidence: 97, evidence: 21, why: "设备标识、采样频率和数据管线在传感实验记录中一致。" },
  { from: "physics", to: "dynamic", forward: "奠定基础", reverse: "应用", confidence: 95, evidence: 19, why: "简谐运动、频谱与能量观点被桥梁振动材料直接调用。" },
];

const sparkGraphEdges = [...graphEdges.slice(0, 0),
  { from: "life", to: "oreo", forward: "被学生看见于", reverse: "打开", confidence: 99, evidence: 2, why: "Sally Hayek 的两页学生作品保留了照片、推导与参考资料。" },
  { from: "life", to: "ice", forward: "被学生看见于", reverse: "打开", confidence: 99, evidence: 2, why: "Rakhshinda Ayub 用两根冰梁和加载照片记录了完整对照。" },
  { from: "oreo", to: "torsion", forward: "像", reverse: "解释", confidence: 96, evidence: 7, why: "两片饼干施加反向力偶，夹心在扭矩下产生可见变形。" },
  { from: "oreo", to: "shear", forward: "显出", reverse: "可在其中观察", confidence: 92, evidence: 5, why: "原作把夹心视为薄层，并讨论剪应变随扭转角与半径变化。" },
  { from: "torsion", to: "physics", forward: "通向", reverse: "解释", confidence: 95, evidence: 9, why: "扭矩、极惯性矩和剪应变构成可追溯的材料力学路径。" },
  { from: "ice", to: "bending", forward: "演示", reverse: "解释", confidence: 98, evidence: 8, why: "跨中集中加载、挠曲形状和弯矩图在学生原作中同时出现。" },
  { from: "ice", to: "brittle", forward: "模拟", reverse: "可通过它感知", confidence: 95, evidence: 6, why: "未增强冰梁在 1.25 kg 下突然断裂，呈现受拉侧脆断。" },
  { from: "ice", to: "reinforce", forward: "验证", reverse: "改变其失效", confidence: 97, evidence: 7, why: "加入绳子的冰梁承载到 11.25 kg，学生把绳子类比为受拉增强材料。" },
  { from: "reinforce", to: "concrete", forward: "迁移到", reverse: "提供工程原型", confidence: 94, evidence: 12, why: "冰—绳与混凝土—钢筋不是同一种材料，但共享脆性基体与受拉增强的思路。" },
  { from: "bending", to: "bridge", forward: "解释", reverse: "提供真实场景", confidence: 96, evidence: 18, why: "桥面梁的受压区、受拉区和裂缝控制可由冰梁类比继续追问。" },
  { from: "chocolate", to: "brittle", forward: "引出", reverse: "解释", confidence: 84, evidence: 4, why: "这是同伴提出的候选连接，仍需用有无刻槽的对照排除应力集中影响。" },
  { from: "paper", to: "bending", forward: "可比较", reverse: "解释", confidence: 91, evidence: 27, why: "27 种折纸截面提供了材料相同、形状不同的横向比较。" },
  { from: "ai", to: "oreo", forward: "把力画在", reverse: "校正", confidence: 82, evidence: 3, why: "AI 草图来自学生文字与原作图像，关系需由学生确认，不等同于结论。" },
  { from: "ai", to: "ice", forward: "把力画在", reverse: "校正", confidence: 86, evidence: 4, why: "AI 标出受压、受拉和裂缝位置；同伴可保留、删去或提出另一种解释。" },
];

const classGraphNodes = [...graphNodes.slice(0, 0),
  { id: "life", label: "生活中的结构", x: 0.50, y: 0.48, r: 31, kind: "root" },
  { id: "stability", label: "稳定与支承", x: 0.25, y: 0.22, r: 23, kind: "concept" },
  { id: "section", label: "截面与刚度", x: 0.52, y: 0.14, r: 23, kind: "concept" },
  { id: "torsion", label: "扭转与剪切", x: 0.77, y: 0.22, r: 23, kind: "concept" },
  { id: "loadpath", label: "传力路径", x: 0.82, y: 0.54, r: 23, kind: "concept" },
  { id: "arch", label: "拱与压力线", x: 0.67, y: 0.80, r: 23, kind: "concept" },
  { id: "detail", label: "连接与细部", x: 0.36, y: 0.83, r: 23, kind: "concept" },
  { id: "corrugated", label: "瓦楞纸", x: 0.43, y: 0.28, r: 16, kind: "case" },
  { id: "clothes-rod", label: "椭圆晾衣杆", x: 0.62, y: 0.27, r: 16, kind: "case" },
  { id: "towel", label: "拧毛巾", x: 0.87, y: 0.34, r: 16, kind: "case" },
  { id: "desk", label: "课桌斜撑", x: 0.72, y: 0.45, r: 16, kind: "case" },
  { id: "chair-base", label: "五星椅脚", x: 0.24, y: 0.43, r: 16, kind: "case" },
  { id: "umbrella", label: "雨伞骨架", x: 0.13, y: 0.28, r: 16, kind: "case" },
  { id: "drying-rack", label: "晾衣架", x: 0.10, y: 0.58, r: 16, kind: "case" },
  { id: "arch-chair", label: "椅背里的拱", x: 0.76, y: 0.70, r: 16, kind: "case" },
  { id: "hose", label: "钢丝软管", x: 0.27, y: 0.71, r: 16, kind: "case" },
  { id: "sharpener", label: "卷笔刀", x: 0.48, y: 0.70, r: 16, kind: "case" },
  { id: "bridge-box", label: "桥梁箱梁", x: 0.63, y: 0.95, r: 18, kind: "course" },
  { id: "bridge-truss", label: "桥梁桁架", x: 0.94, y: 0.67, r: 18, kind: "course" },
  { id: "bridge-wind", label: "桥梁抗风", x: 0.06, y: 0.84, r: 18, kind: "course" },
  { id: "ai", label: "AI 整理层", x: 0.93, y: 0.10, r: 17, kind: "sensor" },
];

const classGraphEdges = [...sparkGraphEdges.slice(0, 0),
  { from: "life", to: "stability", forward: "长出", reverse: "解释", confidence: 98, evidence: 7, why: "五星椅脚、三脚架、晾衣架和折叠家具都在追问：怎样站稳。" },
  { from: "life", to: "section", forward: "长出", reverse: "解释", confidence: 98, evidence: 6, why: "瓦楞纸、球拍杆与椭圆晾衣杆把‘同样材料为什么不一样硬’变成可见问题。" },
  { from: "life", to: "torsion", forward: "长出", reverse: "解释", confidence: 97, evidence: 5, why: "毛巾、瓶盖与软管记录了旋转、剪切和螺旋约束。" },
  { from: "life", to: "loadpath", forward: "长出", reverse: "解释", confidence: 99, evidence: 9, why: "课桌、床架、自行车和折叠桌的照片都可以顺着构件追问力去了哪里。" },
  { from: "corrugated", to: "section", forward: "例证", reverse: "解释", confidence: 96, evidence: 4, why: "马琛籴用平纸与瓦楞纸做了直接对照，形状是最突出的变量。" },
  { from: "clothes-rod", to: "section", forward: "追问方向性", reverse: "解释", confidence: 91, evidence: 3, why: "刘泊言比较了不同杆件截面；椭圆截面的刚度还取决于弯曲方向。" },
  { from: "section", to: "bridge-box", forward: "迁移到", reverse: "汇集", confidence: 95, evidence: 8, why: "日常薄壁截面可继续迁移到箱梁的抗弯、抗扭和局部屈曲。" },
  { from: "towel", to: "torsion", forward: "让变形可见", reverse: "解释", confidence: 94, evidence: 3, why: "黄俊儒记录拧毛巾时纤维方向和形态的变化，可作为扭转的直观入口。" },
  { from: "desk", to: "loadpath", forward: "显出", reverse: "解释", confidence: 95, evidence: 4, why: "陈浩拍到课桌斜撑与节点，三角形让传力路径更容易被追踪。" },
  { from: "loadpath", to: "bridge-truss", forward: "迁移到", reverse: "汇集", confidence: 97, evidence: 10, why: "斜撑、三角形和节点连接可以继续追问到桁架桥的杆件轴力。" },
  { from: "chair-base", to: "stability", forward: "例证", reverse: "解释", confidence: 94, evidence: 3, why: "刘浩然从五星椅脚看到支承范围、重心投影和抗倾覆。" },
  { from: "umbrella", to: "stability", forward: "展开", reverse: "解释", confidence: 92, evidence: 3, why: "刘熙文把雨伞开合骨架画成可变体系，结构状态随约束改变。" },
  { from: "drying-rack", to: "stability", forward: "提出反例", reverse: "解释", confidence: 90, evidence: 3, why: "高悦涵观察轻质晾衣架；受风、偏载和底座尺寸可以把讨论推进到失稳。" },
  { from: "drying-rack", to: "bridge-wind", forward: "迁移到", reverse: "放大", confidence: 88, evidence: 2, why: "轻质物件的风致摇摆不是桥梁结论，却是提出抗风问题的好入口。" },
  { from: "arch-chair", to: "arch", forward: "让人看见", reverse: "解释", confidence: 93, evidence: 3, why: "朱吉晔在上完拱的内容后回看椅背，留下了概念重新照亮生活的第一句话。" },
  { from: "arch", to: "bridge-truss", forward: "对照", reverse: "对照", confidence: 86, evidence: 4, why: "拱与桁架提供两种不同传力策略，适合用同一跨径模型做并列比较。" },
  { from: "hose", to: "detail", forward: "显出", reverse: "解释", confidence: 92, evidence: 4, why: "晋卓凡观察钢丝、软管与卡箍的协同，连接细部决定组合能否工作。" },
  { from: "sharpener", to: "detail", forward: "显出", reverse: "解释", confidence: 93, evidence: 3, why: "王嘉齐从卷笔刀刀片、螺钉与壳体看到局部连接和受力界面。" },
  { from: "detail", to: "bridge-box", forward: "迁移到", reverse: "需要", confidence: 90, evidence: 5, why: "桥梁整体概念最终要落实到连接、加劲、支承与构造细节。" },
  { from: "ai", to: "life", forward: "整理但不替代", reverse: "校正", confidence: 82, evidence: 29, why: "AI 从 29 份原作中提议标签、相似案例与桥梁迁移，学生仍保留原话、署名和删改权。" },
];

const studyCards = [
  {
    id: "forth",
    image: "./cases/forth.jpg",
    place: "苏格兰 · 福斯桥",
    question: "中间那一小段桥面，为什么没有桥墩也不会掉下去？",
    concept: "直接传力路径",
    observe: "两侧巨型悬臂先各自取得平衡，再把中间挂跨的荷载接走。红色杆件不是一团钢，而是一条条可辨认的拉压路径。",
    mechanism: "桥面荷载 → 挂跨 → 悬臂桁架 → 主塔墩。上、下弦和斜杆以轴力为主，把跨中荷载送到基础。",
    relation: "路径越直接，二次弯曲通常越少",
    misconception: "不是“钢材够多所以撑得住”；真正起作用的是三角体系、成对的拉压杆和完整的力路。",
    experiment: "三个人排成一列：两侧同学伸臂并互相支撑，中间同学把一本书放在两人的指尖上，感受荷载怎样向外传。",
    book: "《感知结构概念》· 第 8 章 直接传力路径",
    challenge: "如果删去悬臂最外侧的一根斜杆，哪一段力路会先中断？请在照片上指出来。",
    pin1: { x: "48%", y: "56%", label: "中间挂跨" },
    pin2: { x: "66%", y: "42%", label: "悬臂根部" },
    credit: "MrMasterKeyboard · CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Forth_Bridge_2022.jpg",
  },
  {
    id: "millau",
    image: "./cases/millau.jpg",
    place: "法国 · 米约高架桥",
    question: "桥墩越高越危险，为什么它们不做成从上到下一样粗？",
    concept: "屈曲与稳定",
    observe: "桥墩是中空箱形，沿高度改变截面；材料被放在离截面中心更远的位置，以较少材料换取更大的抗弯刚度。",
    mechanism: "高墩以受压为主，但控制条件可能不是材料压碎，而是细长构件整体侧向失稳。增大惯性矩、优化有效长度可提高临界荷载。",
    relation: "Pcr ∝ EI / L²",
    misconception: "强度验算通过不等于稳定安全；长而细的压杆可能在材料达到强度前先屈曲。",
    experiment: "用两条同样的纸带竖直受压，一条长度减半。比较哪一条先侧弯，并改变纸带截面再试一次。",
    book: "《感知结构概念》· 第 10 章 屈曲",
    challenge: "如果桥墩再增高 20%，保持材料不变，你会优先改变截面还是增加支撑？为什么？",
    pin1: { x: "34%", y: "38%", label: "有效长度很大" },
    pin2: { x: "64%", y: "70%", label: "渐变箱形截面" },
    credit: "FaceMePLS · CC BY 2.0",
    source: "https://commons.wikimedia.org/wiki/File:The_Millau_Viaduct_(2714080736).jpg",
  },
  {
    id: "arch",
    image: "./cases/arch.jpg",
    place: "法国 · 加尔桥",
    question: "这些石块几乎不能受拉，为什么拱顶仍能把水渠举起来？",
    concept: "压力线与水平推力",
    observe: "连续拱券把竖向荷载转成沿拱圈的压力，同时在拱脚产生向外的水平推力；厚重桥墩接住了这股推力。",
    mechanism: "每一块楔形石都把压力传给下一块。只要合力的压力线留在拱圈截面内，石材就主要受压而很少受拉。",
    relation: "压力线留在截面内 → 拱圈以受压为主",
    misconception: "拱不是“弯曲的梁”；如果拱脚不能约束水平推力，再厚的石拱也可能张开失稳。",
    experiment: "把 7—9 块橡皮或书本排成拱形，用两本厚书顶住拱脚；慢慢移开一本厚书，观察拱为何突然散开。",
    book: "《感知结构概念》· 第 8 章 直接传力路径",
    challenge: "同样跨径下，把拱矢高降低一半，拱脚水平推力会增大还是减小？",
    pin1: { x: "51%", y: "53%", label: "压力沿拱圈走" },
    pin2: { x: "78%", y: "72%", label: "拱脚水平推力" },
    credit: "Mimova · Public Domain",
    source: "https://commons.wikimedia.org/wiki/File:Pontdugard.jpg",
  },
  {
    id: "tacoma",
    image: "./cases/tacoma.png",
    place: "美国 · 旧塔科马海峡大桥",
    question: "这不只是“风吹得很大”：桥面为什么会越扭越厉害？",
    concept: "气动弹性颤振",
    observe: "桥面不是简单上下跳动，而是出现明显扭转。桥的运动会反过来改变周围气流，气流又在合适的相位继续向结构输入能量。",
    mechanism: "风力—结构运动形成反馈。当每个周期输入的能量大于结构耗散的能量，等效阻尼变成负值，扭转振幅持续增长。",
    relation: "每周期输入能量 > 耗散能量 → 振幅增长",
    misconception: "它常被简称为“共振”，但更准确的解释是扭转气动弹性颤振，并非单纯外力频率等于固有频率。",
    experiment: "做两条同跨纸桥：一条平板、一条折出侧边。用电扇逐渐加大风速，比较两者何时出现扭转和抖动。",
    book: "《感知结构概念》· 第 16 章共振 / 第 17 章结构阻尼（辨析扩展）",
    challenge: "给桥面开通风孔、增加桁架深度、安装阻尼器，三者分别改变了哪个环节？",
    pin1: { x: "33%", y: "30%", label: "桥面发生扭转" },
    pin2: { x: "68%", y: "60%", label: "风—结构反馈" },
    credit: "Barney Elliot / Prelinger Archives · Public Domain",
    source: "https://commons.wikimedia.org/wiki/File:Tacoma_Narrows_still.png",
  },
  {
    id: "bearing",
    image: "./cases/bearing.jpg",
    place: "桥梁局部 · 滚轴支座",
    question: "这块生锈的“滚轮”为什么不是多余零件？",
    concept: "边界条件与温度变形",
    observe: "上部铰接允许梁端转动，下部滚轴允许桥梁沿纵向微小移动；竖向荷载仍可穿过支座传给桥墩。",
    mechanism: "支座有选择地约束自由度：承受竖向反力，但释放转角和温度伸缩。这样既建立稳定体系，也避免多余约束产生次内力。",
    relation: "ΔL = αLΔT",
    misconception: "把所有桥墩都“锁死”不一定更安全；温度、收缩和徐变受到约束时，会转化为很大的附加内力。",
    experiment: "把长尺一端压住、另一端分别放在桌面和两支圆铅笔上，加热或轻推，比较两种边界条件下尺子的移动。",
    book: "《感知结构概念》· 第 7 章 跨度与变形 / 边界条件",
    challenge: "一座 100 m 钢桥温度升高 30℃，取 α=12×10⁻⁶/℃，大约需要释放多少伸长量？",
    pin1: { x: "46%", y: "58%", label: "允许转动" },
    pin2: { x: "64%", y: "78%", label: "允许纵向移动" },
    credit: "Douglas W. Jones · CC0",
    source: "https://commons.wikimedia.org/wiki/File:BridgeBearing.jpg",
  },
] as const;

const studyConcepts = studyCards.map((card) => card.concept);

function StudyDeck() {
  const [active, setActive] = useState(0);
  const [flipped, setFlipped] = useState<Set<string>>(new Set());
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [showFollowup, setShowFollowup] = useState(false);
  const card = studyCards[active];
  const isFlipped = flipped.has(card.id);
  const selectedMatch = matches[card.id];
  const isCorrect = selectedMatch === card.concept;
  const completed = studyCards.filter((item) => matches[item.id] === item.concept).length;

  const toggleFlip = () => setFlipped((current) => {
    const next = new Set(current);
    if (next.has(card.id)) next.delete(card.id); else next.add(card.id);
    return next;
  });

  const chooseCard = (index: number) => {
    setActive(index);
    setShowFollowup(false);
  };

  return (
    <section className="study-deck">
      <div className="study-deck-head">
        <div><span className="eyebrow">SEE FIRST · EXPLAIN SECOND</span><h1>先看案例，作出判断，再翻面验证。</h1><p>每张卡把一个真实桥梁现象，连到一个结构概念和一条可复现的证据。</p></div>
        <div className="deck-progress"><span><b>{completed}</b> / {studyCards.length}</span><i><b style={{ width: `${completed / studyCards.length * 100}%` }} /></i><small>已正确匹配</small></div>
      </div>

      <div className="study-deck-grid">
        <div className={`flip-learning-card ${isFlipped ? "is-flipped" : ""}`} role="button" tabIndex={0} aria-label={isFlipped ? "翻回案例照片" : "翻面查看概念解释"} onClick={toggleFlip} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); toggleFlip(); } }}>
          <div className="flip-learning-inner">
            <div className="learning-face learning-front" style={{ backgroundImage: `url(${card.image})` }}>
              <div className="learning-shade" />
              <div className="case-index">CASE {String(active + 1).padStart(2, "0")} / {String(studyCards.length).padStart(2, "0")}</div>
              <div className="case-place">● {card.place}</div>
              <span className="photo-pin" style={{ left: card.pin1.x, top: card.pin1.y }}><i />{card.pin1.label}</span>
              <span className="photo-pin second" style={{ left: card.pin2.x, top: card.pin2.y }}><i />{card.pin2.label}</span>
              <div className="case-question"><span>先别看答案</span><h2>{card.question}</h2><p>先用手指沿着你认为的传力路径划一遍。</p></div>
              <div className="flip-cue"><span>↻</span> 点击翻面，看结构解释</div>
              <a className="photo-credit" href={card.source} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>图片：{card.credit}</a>
            </div>

            <div className="learning-face learning-back">
              <div className="back-top"><span>STRUCTURAL CONCEPT</span><button type="button" tabIndex={-1}>↻ 翻回照片</button></div>
              <div className="concept-title"><i>{String(active + 1).padStart(2, "0")}</i><div><span>这张卡讲的是</span><h2>{card.concept}</h2></div></div>
              <p className="concept-observe">{card.observe}</p>
              <div className="concept-mechanism"><span>受力机制</span><p>{card.mechanism}</p></div>
              <div className="concept-grid">
                <div><span>最小关系</span><strong>{card.relation}</strong></div>
                <div><span>容易误判</span><p>{card.misconception}</p></div>
              </div>
              <div className="touch-test"><span>TOUCH IT · 3 分钟模型</span><p>{card.experiment}</p></div>
              <div className="book-route"><b>书中路径</b><span>{card.book}</span></div>
            </div>
          </div>
        </div>

        <aside className="matching-panel">
          <div className="matching-head"><span>把案例放回知识体系</span><b>{active + 1} / {studyCards.length}</b></div>
          <h3>它最主要匹配哪个知识点？</h3>
          <div className="concept-options">
            {studyConcepts.map((concept) => {
              const selected = selectedMatch === concept;
              const correct = concept === card.concept;
              return <button key={concept} className={`${selected ? "selected" : ""} ${selected && correct ? "correct" : ""} ${selected && !correct ? "wrong" : ""}`} onClick={() => setMatches((current) => ({ ...current, [card.id]: concept }))}><i>{selected ? (correct ? "✓" : "×") : ""}</i>{concept}</button>;
            })}
          </div>
          {selectedMatch && (
            <div className={isCorrect ? "match-feedback correct" : "match-feedback"}>
              <b>{isCorrect ? "匹配成立，已写入学习图谱" : "这个关系有一点道理，但还不是主导机制"}</b>
              <p>{isCorrect ? `“${card.place}”现在与“${card.concept}”形成一条双向链接：概念解释案例，案例反过来验证概念。` : "先翻面沿着荷载、变形或能量的路径再看一次，然后重新选择。"}</p>
            </div>
          )}
          {isCorrect && <button className="ai-followup-button" onClick={() => setShowFollowup((value) => !value)}>✦ 让 AI 再追问一步</button>}
          {showFollowup && <div className="ai-followup"><span>AI 追问</span><p>{card.challenge}</p><button onClick={() => setShowFollowup(false)}>我去照片上找证据 →</button></div>}

          <div className="case-strip" aria-label="切换案例卡">
            {studyCards.map((item, index) => <button key={item.id} className={active === index ? "active" : ""} onClick={() => chooseCard(index)}><span style={{ backgroundImage: `url(${item.image})` }} /><i>{matches[item.id] === item.concept ? "✓" : String(index + 1).padStart(2, "0")}</i><b>{item.place.split(" · ").at(-1)}</b></button>)}
          </div>
        </aside>
      </div>
    </section>
  );
}

type SparkIdea = {
  id: "oreo" | "ice";
  author: string;
  initials: string;
  meta: string;
  title: string;
  thought: string;
  image: string;
  imageAlt: string;
  source: string;
  sourceLabel: string;
  concepts: string[];
  growth: [string, string][];
  echoes: string[];
  likes: number;
  replies: number;
};

const sparkIdeas: SparkIdea[] = [
  {
    id: "oreo",
    author: "Sally Hayek",
    initials: "S",
    meta: "学生原作 · 宿舍里的扭转实验 · 2013",
    title: "把两片饼干当成端板，夹心会不会正在承受剪切？",
    thought: "先别急着把它叫作“扭转公式”。这个想法最动人的地方，是有人在拧开奥利奥的一秒里，看见了材料正在变形。",
    image: "./student-work/oreo-1.png",
    imageAlt: "学生作品《奥利奥中的扭转与剪应力》第一页",
    source: "https://www.sites.se.manchester.ac.uk/structural-concepts/wp-content/uploads/sites/32/2021/10/Torsion-and-Shear-Stress-in-an-Oreo.pdf",
    sourceLabel: "查看 Sally 的两页原作",
    concepts: ["扭转", "剪应力", "半径与应变", "45°脆裂"],
    growth: [["原始灵光", "一块奥利奥"], ["AI 画力", "3 张草图"], ["同伴复现", "12 种夹心"], ["长出连接", "4 个概念"]],
    echoes: ["在夹心上压一层方格，再扭一次", "比较薄夹心和双层夹心", "饼干断裂的 45° 方向也算证据吗？"],
    likes: 286,
    replies: 38,
  },
  {
    id: "ice",
    author: "Rakhshinda Ayub",
    initials: "R",
    meta: "学生原作 · 厨房里的冰梁 · 2013",
    title: "把绳子冻进冰里，竟然能把“钢筋混凝土”摸出来",
    thought: "一根普通冰梁在 1.25 kg 下断了；加入绳子的冰梁承到 11.25 kg。冰不是混凝土，绳也不是钢筋，但这个类比把受拉侧突然照亮了。",
    image: "./student-work/ice-2.png",
    imageAlt: "学生作品《绳增强冰梁》第二页，包含加载照片和受弯草图",
    source: "https://www.sites.se.manchester.ac.uk/structural-concepts/wp-content/uploads/sites/32/2021/10/Rope-inforced-Ice.pdf",
    sourceLabel: "查看 Rakhshinda 的两页原作",
    concepts: ["受弯", "脆性断裂", "受拉增强", "钢筋混凝土"],
    growth: [["原始灵光", "两根冰梁"], ["对照加载", "1.25 ↔ 11.25 kg"], ["同伴追问", "绳子放哪里？"], ["迁移到桥", "桥面梁裂缝"]],
    echoes: ["把绳子放到上面会怎样？", "盐水冰的脆性会不会不同？", "裂了但没掉下来，算不算新的承载阶段？"],
    likes: 412,
    replies: 64,
  },
];

function SparkSketch({ kind }: { kind: SparkIdea["id"] }) {
  if (kind === "oreo") {
    return (
      <div className="ai-sketch oreo-sketch" aria-label="AI 根据学生原作生成的奥利奥扭转受力草图">
        <div className="sketch-caption"><span>AI 草图 · 可由学生修改</span><b>不是标准答案</b></div>
        <div className="oreo-model">
          <span className="twist-arrow left">↶</span>
          <span className="oreo-disc first"><i /></span>
          <span className="oreo-cream"><i /><i /><i /><i /><i /></span>
          <span className="oreo-disc second"><i /></span>
          <span className="twist-arrow right">↷</span>
        </div>
        <div className="sketch-note note-a"><i />越靠外缘，候选剪应变越大</div>
        <div className="sketch-note note-b"><i />夹心网格由矩形歪成菱形</div>
        <div className="sketch-formula">γ ∝ r · φ / L</div>
        <div className="student-check"><span>同伴校正</span>“奶油不是理想弹性材料，要小心这个类比的边界。”</div>
      </div>
    );
  }
  return (
    <div className="ai-sketch ice-sketch" aria-label="AI 根据学生原作生成的冰梁受弯草图">
      <div className="sketch-caption"><span>AI 草图 · 可由学生修改</span><b>保留分歧</b></div>
      <div className="ice-model">
        <span className="load-arrow">↓<i>集中荷载</i></span>
        <span className="ice-beam"><i className="crack one" /><i className="crack two" /></span>
        <span className="rope-layer" />
        <span className="support left" /><span className="support right" />
        <span className="zone compression">上缘受压</span><span className="zone tension">下缘受拉 → 绳子接力</span>
      </div>
      <div className="load-compare"><span><b>无绳冰梁</b>1.25 kg 后脆断</span><i>→</i><span><b>绳增强冰梁</b>11.25 kg 仍承载</span></div>
      <div className="student-check"><span>同伴追问</span>“如果绳子放在中性轴附近，这个提升还会出现吗？”</div>
    </div>
  );
}

function SparkCard({ idea, onToast }: { idea: SparkIdea; onToast: (message: string) => void }) {
  const [mode, setMode] = useState<"original" | "ai">("original");
  const [showEchoes, setShowEchoes] = useState(false);
  const [branching, setBranching] = useState(false);
  const [branchType, setBranchType] = useState("我复现了");

  const submitBranch = (event: FormEvent) => {
    event.preventDefault();
    setBranching(false);
    onToast(`已把“${branchType}”接到这条灵光上；原作者的内容没有被覆盖`);
  };

  return (
    <article className={`spark-card spark-${idea.id}`}>
      <div className="spark-author">
        <span className={`avatar spark-avatar ${idea.id}`}>{idea.initials}</span>
        <span><b>{idea.author}</b><small>{idea.meta}</small></span>
        <button aria-label="更多操作">•••</button>
      </div>
      <div className="spark-question"><span>原始灵光</span><h2>{idea.title}</h2><p>{idea.thought}</p></div>

      <div className="spark-media">
        <div className="media-toggle" aria-label="切换原作和 AI 草图">
          <button className={mode === "original" ? "active" : ""} onClick={() => setMode("original")}>学生原作</button>
          <button className={mode === "ai" ? "active" : ""} onClick={() => setMode("ai")}>AI 把力画出来</button>
        </div>
        {mode === "original" ? (
          <div className="artifact-view">
            <Image className={idea.id} src={idea.image} alt={idea.imageAlt} fill sizes="(max-width: 980px) 100vw, 42vw" priority={idea.id === "oreo"} />
            <div className="artifact-caption"><span>原作缩略页 · Manchester Structural Concepts</span><a href={idea.source} target="_blank" rel="noreferrer">{idea.sourceLabel} ↗</a></div>
          </div>
        ) : <SparkSketch kind={idea.id} />}
      </div>

      <div className="idea-growth" aria-label="想法生长过程">
        {idea.growth.map(([label, value], index) => <div key={label} className={index === 0 ? "origin" : ""}><i /><span>{label}<b>{value}</b></span></div>)}
      </div>

      <div className="ai-links"><span><i>AI</i> 提议这些连接，学生可以删改</span><div>{idea.concepts.map((concept) => <button key={concept} onClick={() => onToast(`“${concept}”已保留为候选连接，等待同伴确认`)}>＋ {concept}</button>)}</div></div>

      {showEchoes && <div className="idea-echoes"><span>别人从这里又长出了什么</span>{idea.echoes.map((echo, index) => <button key={echo}><i>{index + 1}</i>{echo}<b>接上 →</b></button>)}</div>}

      {branching && (
        <form className="branch-form" onSubmit={submitBranch}>
          <div className="branch-types">{["我复现了", "我有反例", "我想到相似物", "我补了数据"].map((type) => <button type="button" key={type} className={branchType === type ? "active" : ""} onClick={() => setBranchType(type)}>{type}</button>)}</div>
          <textarea required aria-label="接着写下你的发现" placeholder="不用写完整结论。说说你做了什么、看见了什么，或者哪里不一样……" />
          <div><label><input type="file" accept="image/*,video/*,.csv" />＋ 照片 / 视频 / 数据</label><button type="submit">把这一枝接上去</button></div>
        </form>
      )}

      <div className="spark-actions">
        <button onClick={() => onToast("已收藏这条灵光")}>♡ {idea.likes}</button>
        <button onClick={() => setShowEchoes((value) => !value)}>◌ {idea.replies} 个续想</button>
        <button className="grow-button" onClick={() => setBranching((value) => !value)}>{branching ? "先收起" : "接着这个想法做"} →</button>
      </div>
    </article>
  );
}

function SparkStream({ onPublish, onToast }: { onPublish: () => void; onToast: (message: string) => void }) {
  return (
    <>
      <section className="spark-hero">
        <div className="spark-hero-copy"><span className="eyebrow">A STUDENT-LED STRUCTURAL COMMONS</span><h1>生活先开口，<br /><em>学生随时给我们惊喜。</em></h1><p>每个学生都是行走在世界里的结构感知者。拍下那块饼干、那条裂缝、那把椅子——不完整也没关系，灵光多多益善。</p><div className="live-line"><i />今天冒出 18 个新灵光 · 7 个正在被复现 · 3 个推翻了昨天的猜想</div></div>
        <div className="ai-role-card"><span><i>AI</i> 在这里做什么？</span><ul><li><b>画清楚</b>你一时说不清的力</li><li><b>找相似</b>陌生事物里的同一种思路</li><li><b>整理分歧</b>而不是急着裁决</li></ul><small>AI 不替学生下结论，也不给创意打分。</small></div>
      </section>

      <section className="spark-manifesto" aria-label="学生灵光共同宣言"><strong>灵光，<em>多多益善</em></strong><span>一天十条也欢迎</span><i /> <span>没证明也能发</span><i /> <span>被推翻也不删</span><i /> <span>AI 不抢署名</span></section>

      <section className="spark-composer" onClick={onPublish}>
        <span className="avatar coral">陈</span>
        <div><b>我刚刚看见一个有点像结构课的东西……</b><small>先发出来，不必解释完整；今天的第十条也欢迎。</small></div>
        <span className="composer-tools"><i>▣ 拍张照</i><i>〰 说两句</i><i>AI 帮我画</i></span>
        <button>留下这一秒 ＋</button>
      </section>

      <div className="spark-section-head"><div><span>STUDENT SPARKS</span><h2>正在发光的想法</h2></div><p>不是案例库的“标准答案”，而是想法长成知识的现场。</p></div>
      <section className="spark-grid">{sparkIdeas.map((idea) => <SparkCard key={idea.id} idea={idea} onToast={onToast} />)}</section>

      <section className="pocket-sparks">
        <div className="pocket-head"><span>刚刚冒出来，还没有概念名</span><b>先接住惊喜，再讨论对错</b></div>
        <div className="pocket-grid">
          {[
            ["食堂 · 12 分钟前", "掰巧克力时，裂缝为什么总从刻痕那一面开始？", "受拉，还是应力集中？"],
            ["快递站 · 31 分钟前", "瓦楞纸箱淋湿以后，不是材料少了，为什么突然就软了？", "有人想到局部屈曲"],
            ["宿舍 · 1 小时前", "晾衣绳越拉紧，中间那件湿衣服反而越难托住吗？", "3 人画出了不同力多边形"],
            ["操场 · 2 小时前", "撑杆跳的杆子是在储存能量，还是只改变了力的方向？", "等待第一个慢动作复现"],
          ].map(([meta, title, hint], index) => <article key={title}><span>{String(index + 3).padStart(2, "0")}</span><small>{meta}</small><h3>{title}</h3><p>{hint}</p><button onClick={() => onToast("已打开这条灵光的共创支线")}>我也想到一个 →</button></article>)}
        </div>
      </section>
    </>
  );
}

type Artifact = {
  id: string;
  category: string;
  title: string;
  observation: string;
  author: string;
  image: string;
  pdf: string;
  concepts: string[];
  sketch: "equilibrium" | "torsion" | "bending" | "section" | "center";
  mechanism: string;
  tryNext: string;
  size: "short" | "medium" | "tall";
  echoes: number;
  teacherScore: number;
  studentScore: number;
  teacherVotes: number;
  studentVotes: number;
};

const artifacts: Artifact[] = [
  {
    id: "angry-birds",
    category: "平衡",
    title: "小鸟撞过来之前，这座塔站得住吗？",
    observation: "游戏截图里每一块木板都能变成一个自由体。Mingxi Lu 顺着接触点，一层层找到了力往哪里走。",
    author: "Mingxi Lu",
    image: "./student-work/angry-1.png",
    pdf: "https://www.sites.se.manchester.ac.uk/structural-concepts/wp-content/uploads/sites/32/2021/10/Equilibrium-Analysis-of-the-Structures-in-Angry-Birds.pdf",
    concepts: ["平衡", "支座反力", "倾覆"],
    sketch: "equilibrium",
    mechanism: "把塔分成几块看：重力向下，接触面给出反力。只要合力还落在支承范围里，它就暂时不会翻。",
    tryNext: "换一关，先猜哪一块最先失去接触，再用慢放验证。",
    size: "tall",
    echoes: 26,
    teacherScore: 97, studentScore: 94, teacherVotes: 38, studentVotes: 218,
  },
  {
    id: "oreo",
    category: "扭转",
    title: "奥利奥一拧，夹心为什么留下扇形的错动？",
    observation: "Sally Hayek 在饼干上画了线。扭开以后，越靠外的线错得越明显。",
    author: "Sally Hayek",
    image: "./student-work/oreo-1.png",
    pdf: "https://www.sites.se.manchester.ac.uk/structural-concepts/wp-content/uploads/sites/32/2021/10/Torsion-and-Shear-Stress-in-an-Oreo.pdf",
    concepts: ["扭转", "剪应变", "半径"],
    sketch: "torsion",
    mechanism: "两片饼干像端板，夹心像一层很软的材料。转角相同时，离中心越远，夹心要走过的弧长越大。",
    tryNext: "在夹心上压出方格，比较薄夹心、厚夹心和不同直径。",
    size: "medium",
    echoes: 38,
    teacherScore: 96, studentScore: 98, teacherVotes: 44, studentVotes: 416,
  },
  {
    id: "paper-bridge",
    category: "截面",
    title: "还是那张纸，卷起来以后为什么能托住更多 DVD？",
    observation: "Bethany Reece-Smith 只改折法：平铺、手风琴、大小圆筒，结果完全不同。",
    author: "Bethany Reece-Smith",
    image: "./student-work/paper-1.png",
    pdf: "https://www.sites.se.manchester.ac.uk/structural-concepts/wp-content/uploads/sites/32/2021/10/Different-cross-sections-of-a-paper-bridge.pdf",
    concepts: ["截面", "抗弯刚度", "局部屈曲"],
    sketch: "section",
    mechanism: "材料没有变，材料离中性轴的距离变了。截面把纸放到更有效的位置，弯曲就没那么容易发生。",
    tryNext: "限定同一张 A4 纸，做出承载最大但自重不变的桥面。",
    size: "tall",
    echoes: 44,
    teacherScore: 98, studentScore: 96, teacherVotes: 51, studentVotes: 352,
  },
  {
    id: "ice-beam",
    category: "弯曲",
    title: "一根绳子冻进冰里，冰梁为什么突然能多扛十公斤？",
    observation: "Rakhshinda Ayub 做了两根冰梁：普通冰梁在 1.25 kg 断裂，带绳冰梁承到 11.25 kg。",
    author: "Rakhshinda Ayub",
    image: "./student-work/ice-1.png",
    pdf: "https://www.sites.se.manchester.ac.uk/structural-concepts/wp-content/uploads/sites/32/2021/10/Rope-inforced-Ice.pdf",
    concepts: ["弯曲", "受拉增强", "脆性断裂"],
    sketch: "bending",
    mechanism: "梁下缘先被拉开；冰擅长受压，却会在拉伸时突然开裂。绳子靠近受拉侧后，接住了原本要张开的裂缝。",
    tryNext: "把绳放在上缘、中间和下缘，各冻一根，再比较裂缝。",
    size: "tall",
    echoes: 64,
    teacherScore: 99, studentScore: 99, teacherVotes: 57, studentVotes: 508,
  },
  {
    id: "heelless-shoe",
    category: "平衡",
    title: "没有鞋跟的高跟鞋，重心落在哪里？",
    observation: "Lindah Makena Ireri 用铅垂线穿过人和鞋，去找那条看不见的重力作用线。",
    author: "Lindah Makena Ireri",
    image: "./student-work/shoe-1.png",
    pdf: "https://www.sites.se.manchester.ac.uk/structural-concepts/wp-content/uploads/sites/32/2021/10/The-Heelless-Shoe-Centre-of-mass.pdf",
    concepts: ["重心", "支承范围", "平衡"],
    sketch: "center",
    mechanism: "鞋跟可以消失，支承范围不能消失。人和鞋的总重力线仍要穿过脚下真正接触地面的区域。",
    tryNext: "拍下背包前后不同姿势，用铅垂线找身体怎样把重心移回来。",
    size: "medium",
    echoes: 17,
    teacherScore: 93, studentScore: 91, teacherVotes: 29, studentVotes: 146,
  },
  {
    id: "chocolate",
    category: "弯曲",
    title: "巧克力为什么总从刻痕那一面先裂？",
    observation: "Shahad Shah 把 KitKat、Toblerone 和普通巧克力并排掰开，裂缝像是提前知道了路线。",
    author: "Shahad Shah",
    image: "./student-work/chocolate-1.png",
    pdf: "https://www.sites.se.manchester.ac.uk/structural-concepts/wp-content/uploads/sites/32/2021/10/Chocolate-a-sweet-application-of-structural-concepts.pdf",
    concepts: ["应力集中", "弯曲", "脆断"],
    sketch: "bending",
    mechanism: "掰弯时一侧受拉；刻痕又让局部截面突然变小。裂缝通常从受拉且最薄弱的位置起跑。",
    tryNext: "同一块巧克力正着掰、反着掰，再换一块没有刻痕的。",
    size: "short",
    echoes: 31,
    teacherScore: 91, studentScore: 97, teacherVotes: 26, studentVotes: 288,
  },
  {
    id: "sponge-i-beam",
    category: "截面",
    title: "海绵也能做成 I 形梁吗？",
    observation: "Thomas Bowditch 把柔软海绵做成翼缘和腹板，再去看弯曲、剪切与扭转。",
    author: "Thomas Bowditch",
    image: "./student-work/sponge-1.png",
    pdf: "https://www.sites.se.manchester.ac.uk/structural-concepts/wp-content/uploads/sites/32/2021/10/The-Sponge-I-Beam.pdf",
    concepts: ["I 形截面", "剪切", "扭转"],
    sketch: "section",
    mechanism: "上下翼缘离中性轴最远，主要抵抗弯曲；腹板把两边连起来，也承担明显的剪切变形。",
    tryNext: "把腹板剪开一条缝，或把 I 形换成闭口盒形，再扭一次。",
    size: "medium",
    echoes: 22,
    teacherScore: 95, studentScore: 92, teacherVotes: 34, studentVotes: 174,
  },
];

function ForceSketch({ artifact }: { artifact: Artifact }) {
  const captions = {
    equilibrium: ["重力落在哪里", "支承反力把它接住"],
    torsion: ["两端反向转动", "外圈错动更明显"],
    bending: ["荷载向下", "上压 · 下拉"],
    section: ["材料相同", "离中性轴更远"],
    center: ["重力线向下", "穿过支承范围"],
  }[artifact.sketch];
  return (
    <div className={`force-diagram force-${artifact.sketch}`} role="img" aria-label={`${artifact.title}的受力草图`}>
      <div className="diagram-title"><span>力怎么走</span><b>{captions[0]}</b></div>
      <div className="diagram-stage">
        {artifact.sketch === "equilibrium" && <div className="mini-truss"><i /><i /><i /><i /><span className="force-down">↓</span><span className="reaction-left">↑</span><span className="reaction-right">↑</span></div>}
        {artifact.sketch === "torsion" && <div className="mini-torsion"><span className="disc left-disc">↺</span><i /><span className="disc right-disc">↻</span></div>}
        {artifact.sketch === "bending" && <div className="mini-bending"><span className="force-down">↓</span><i className="beam-line" /><i className="beam-tension" /><span className="support left-support" /><span className="support right-support" /></div>}
        {artifact.sketch === "section" && <div className="mini-sections"><span className="flat-section"><i /></span><span className="i-section"><i /><i /><i /></span><span className="box-section"><i /></span></div>}
        {artifact.sketch === "center" && <div className="mini-center"><i className="body-shape" /><i className="center-point" /><span className="plumb-line">↓</span><i className="support-range" /></div>}
      </div>
      <div className="diagram-caption"><i /><span>{captions[1]}</span></div>
    </div>
  );
}

type RatingGroup = "teacher" | "student";

function DualRating({ id, teacherScore, studentScore, teacherVotes, studentVotes }: { id: string; teacherScore: number; studentScore: number; teacherVotes: number; studentVotes: number }) {
  const [localVotes, setLocalVotes] = useState<Partial<Record<RatingGroup, boolean>>>({});
  const [open, setOpen] = useState<RatingGroup | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(`bridge-rating-${id}`);
    if (stored) {
      const timer = window.setTimeout(() => {
        try { setLocalVotes(JSON.parse(stored)); } catch { /* ignore a malformed local vote */ }
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [id]);

  const scoreFor = (group: RatingGroup) => {
    const baseScore = group === "teacher" ? teacherScore : studentScore;
    const baseVotes = group === "teacher" ? teacherVotes : studentVotes;
    if (localVotes[group] === undefined) return baseScore;
    return Math.round((baseScore * baseVotes / 100 + (localVotes[group] ? 1 : 0)) / (baseVotes + 1) * 100);
  };

  const countFor = (group: RatingGroup) => (group === "teacher" ? teacherVotes : studentVotes) + (localVotes[group] === undefined ? 0 : 1);

  const vote = (group: RatingGroup, fresh: boolean) => {
    const next = { ...localVotes, [group]: fresh };
    setLocalVotes(next);
    window.localStorage.setItem(`bridge-rating-${id}`, JSON.stringify(next));
    setOpen(null);
  };

  return (
    <details className="demo-scores"><summary>演示评分与本机投票</summary>
    <div className="dual-rating">
      <button className="score teacher-score" onClick={() => setOpen(open === "teacher" ? null : "teacher")} aria-label="给教师评分投票">
        <i>鲜</i><span><b>{scoreFor("teacher")}%</b><small>教师 · {countFor("teacher")} 人</small></span>
      </button>
      <button className="score student-score" onClick={() => setOpen(open === "student" ? null : "student")} aria-label="给学生评分投票">
        <i>热</i><span><b>{scoreFor("student")}%</b><small>学生 · {countFor("student")} 人</small></span>
      </button>
      {open && <div className={`rating-vote vote-${open}`}>
        <span>{open === "teacher" ? "这条结构解释成立吗？" : "这条观察启发你了吗？"}</span>
        <button onClick={() => vote(open, true)}>{open === "teacher" ? "成立" : "有启发"}</button>
        <button onClick={() => vote(open, false)}>{open === "teacher" ? "需推敲" : "没感觉"}</button>
      </div>}
    </div>
    </details>
  );
}

type LineageNode = { id: string; title: string; author: string; virtual: boolean };
type LineageRow = { link: IdeaLink; node: LineageNode; depth: number };

function findLineageNode(id: string): LineageNode | undefined {
  const artifact = artifacts.find((item) => item.id === id);
  if (artifact) return { id, title: artifact.title, author: artifact.author, virtual: false };
  const textCase = textCases.find((item) => item.id === id);
  if (textCase) return { id, title: textCase.title, author: textCase.author, virtual: false };
  const studentCase = studentCases.find((item) => item.id === id);
  if (studentCase) return { id, title: studentCase.title, author: studentCase.author, virtual: false };
  const virtual = virtualIdeaNodes.find((item) => item.id === id);
  if (virtual) return { id, title: virtual.title, author: virtual.author, virtual: true };
}

function collectIncomingIdeas(id: string, depth = 0, seen = new Set<string>()): LineageRow[] {
  if (seen.has(id) || depth > 3) return [];
  const nextSeen = new Set(seen).add(id);
  return ideaLinks.filter((link) => link.to === id).flatMap((link) => {
    const node = findLineageNode(link.from);
    if (!node) return [];
    return [{ link, node, depth }, ...collectIncomingIdeas(link.from, depth + 1, nextSeen)];
  });
}

function CitationLinks({ caseId, onOpenChange }: { caseId: string; onOpenChange?: (open: boolean) => void }) {
  const [open, setOpen] = useState(false);
  const current = findLineageNode(caseId);
  const outgoing = ideaLinks.map((link) => ({ link, node: link.from === caseId ? findLineageNode(link.to) : undefined })).filter((item): item is { link: IdeaLink; node: LineageNode } => Boolean(item.node));
  const incoming = collectIncomingIdeas(caseId);
  if (!current || (outgoing.length === 0 && incoming.length === 0)) return null;

  const jumpTo = (node: LineageNode) => {
    if (node.virtual) return;
    const target = document.getElementById(`case-${node.id}`);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.classList.add("citation-target");
    window.setTimeout(() => target.classList.remove("citation-target"), 1500);
  };

  return (
    <div className={`citation-block${open ? " open" : ""}`}>
      <button className="citation-summary" onClick={() => setOpen((value) => { const next = !value; onOpenChange?.(next); return next; })} aria-expanded={open}>
        <span>↗ 引用 {outgoing.length}</span><i /><span>↙ 被引用 {incoming.length}</span><b>{open ? "收起" : "想法家谱"} {open ? "↑" : "→"}</b>
      </button>
      {open && <div className="citation-drawer">
        <div className="citation-root"><span>当前</span><b>{current.title}</b><small>{current.author}</small></div>
        {outgoing.length > 0 && <section><h4>引用了</h4>{outgoing.map(({ link, node }) => <button key={`${link.from}-${link.to}`} onClick={() => jumpTo(node)}><i>↗</i><span><b>{node.title}</b><small>{node.author} · {link.relation}</small></span></button>)}</section>}
        {incoming.length > 0 && <section><h4>被引用</h4>{incoming.map(({ link, node, depth }) => <button key={`${link.from}-${link.to}`} className={node.virtual ? "virtual-node" : ""} style={{ marginLeft: `${depth * 13}px` }} onClick={() => jumpTo(node)}><i>{depth ? "└" : "├"}</i><span><b>{node.title}</b><small>{node.author} · {link.relation}</small></span></button>)}</section>}
      </div>}
    </div>
  );
}

function TextCaseCard({ item }: { item: TextCase }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <article id={`case-${item.id}`} className={`text-case-card${expanded ? " expanded" : ""}`}>
      <div className="text-case-top"><span>{item.category}</span><small>{item.place} · {item.author}</small></div>
      <h3>{item.title}</h3>
      <blockquote>{item.observation}</blockquote>
      <div className="md-line"><b>猜想</b><p>{item.guess}</p></div>
      {expanded && <div className="md-line try-line"><b>试一下</b><p>{item.tryIt}</p></div>}
      <div className="text-case-tags">{item.concepts.map((concept) => <span key={concept}>#{concept}</span>)}</div>
      <CitationLinks caseId={item.id} />
      <DualRating id={item.id} teacherScore={item.teacherScore} studentScore={item.studentScore} teacherVotes={item.teacherVotes} studentVotes={item.studentVotes} />
      <button className="text-expand" onClick={() => setExpanded((value) => !value)}>{expanded ? "收起" : "怎么试？"} {expanded ? "↑" : "→"}</button>
    </article>
  );
}

function StudentCaseCard({ item }: { item: StudentCase }) {
  const [flipped, setFlipped] = useState(false);
  const [lineageOpen, setLineageOpen] = useState(false);
  const originalPage = `./student-originals/original-pages/${encodeURIComponent(item.author)}.html`;
  return (
    <article id={`case-${item.id}`} className={`student-case-card${flipped ? " is-flipped" : ""}${lineageOpen ? " lineage-open" : ""}`}>
      <div className="student-case-flipper">
        <section className="student-case-face student-case-front">
          <div className="student-case-image">
            <Image src={item.image} alt={item.imageAlt} fill sizes="(max-width: 720px) 100vw, (max-width: 980px) 50vw, 33vw" />
            <span>我的观察 · {item.category}</span>
            <small>{item.place}</small>
          </div>
          <div className="student-case-copy">
            <div className="student-case-author"><i>{item.author.slice(0, 1)}</i><span><b>{item.author}</b><small>大连交通大学 · 智能建造23</small></span></div>
            <h3>{item.title}</h3>
            <blockquote>{item.observation}</blockquote>
            <div className="student-case-tags">{item.concepts.map((concept) => <span key={concept}>#{concept}</span>)}</div>
            <DualRating id={item.id} teacherScore={item.teacherScore} studentScore={item.studentScore} teacherVotes={item.teacherVotes} studentVotes={item.studentVotes} />
          </div>
          <div className="student-card-actions"><a href={originalPage} target="_blank" rel="noreferrer">查看我的原文 ↗</a><button onClick={() => setFlipped(true)}>翻面看结构 ↻</button></div>
        </section>
        <section className="student-case-face student-case-back">
          <div className="student-back-head"><span>我的观察还可以这样长</span><button onClick={() => setFlipped(false)}>↻ 翻回照片</button></div>
          <div className="student-back-author"><i>{item.author.slice(0, 1)}</i><div><small>大连交通大学 · 智能建造23</small><b>{item.author}</b></div></div>
          <h3>{item.title}</h3>
          <div className="student-back-block"><span>我正在这样理解</span><p>{item.guess}</p></div>
          <div className="student-bridge-link"><span>我把它接到桥梁</span><p>{item.bridgeLink}</p></div>
          <div className="student-try"><span>你可以从这里接着我</span><p>{item.tryIt}</p></div>
          <div className="student-case-tags">{item.concepts.map((concept) => <span key={concept}>#{concept}</span>)}</div>
          <a className="student-original-link" href={originalPage} target="_blank" rel="noreferrer">查看我的完整原文与图片 ↗</a>
          <CitationLinks caseId={item.id} onOpenChange={setLineageOpen} />
        </section>
      </div>
    </article>
  );
}

function ArtifactCard({ artifact, onToast }: { artifact: Artifact; onToast: (message: string) => void }) {
  const [flipped, setFlipped] = useState(false);
  const [branching, setBranching] = useState(false);
  const [lineageOpen, setLineageOpen] = useState(false);
  const [branchType, setBranchType] = useState("我也试了");
  const [matched, setMatched] = useState(artifact.concepts[0]);

  const submitBranch = (event: FormEvent) => {
    event.preventDefault();
    setBranching(false);
    onToast(`${branchType} · 已接到 ${artifact.author} 的作品下面`);
  };

  return (
    <article id={`case-${artifact.id}`} className={`artifact-card artifact-${artifact.size}${flipped ? " is-flipped" : ""}${lineageOpen ? " lineage-open" : ""}`}>
      <div className="artifact-flipper">
        <div className="artifact-face artifact-front">
          <div className="artifact-image">
            <Image src={artifact.image} alt={`${artifact.author} 的学生作品缩略页`} fill sizes="(max-width: 760px) 100vw, 33vw" />
            <span className="concept-tape">{artifact.category}</span>
            <a href={artifact.pdf} target="_blank" rel="noreferrer" aria-label={`打开 ${artifact.author} 的原作`}>原作 ↗</a>
          </div>
          <div className="artifact-copy">
            <div className="artifact-author"><span>{artifact.author.slice(0, 1)}</span><b>{artifact.author}</b><small>Manchester coursework</small></div>
            <h2>{artifact.title}</h2>
            <p>{artifact.observation}</p>
            <div className="artifact-tags">{artifact.concepts.map((concept) => <span key={concept}>#{concept}</span>)}</div>
            <CitationLinks caseId={artifact.id} onOpenChange={setLineageOpen} />
            <DualRating id={artifact.id} teacherScore={artifact.teacherScore} studentScore={artifact.studentScore} teacherVotes={artifact.teacherVotes} studentVotes={artifact.studentVotes} />
          </div>
          <div className="artifact-actions"><button onClick={() => setFlipped(true)}>翻面看结构 ↻</button><button onClick={() => setBranching((value) => !value)}>接着试</button><span>◌ {artifact.echoes}</span></div>
        </div>

        <div className="artifact-face artifact-back">
          <div className="back-head"><span>受力草图 · 可修改</span><button onClick={() => setFlipped(false)}>↻ 翻回作品</button></div>
          <ForceSketch artifact={artifact} />
          <h3>{artifact.mechanism}</h3>
          <div className="concept-match"><span>这张更像什么？</span><div>{artifact.concepts.map((concept) => <button key={concept} className={matched === concept ? "active" : ""} onClick={() => setMatched(concept)}>{concept}</button>)}</div></div>
          <div className="try-next"><span>接下来可以试</span><p>{artifact.tryNext}</p></div>
          <div className="artifact-actions"><button onClick={() => setBranching((value) => !value)}>我来接着试 ＋</button><a href={artifact.pdf} target="_blank" rel="noreferrer">看两页原作 ↗</a></div>
        </div>
      </div>
      {branching && <form className="artifact-branch" onSubmit={submitBranch}>
        <div>{["我也试了", "结果不一样", "我又想到一个"].map((type) => <button type="button" key={type} className={branchType === type ? "active" : ""} onClick={() => setBranchType(type)}>{type}</button>)}</div>
        <textarea required aria-label="写下你的续想" placeholder="发生了什么？" />
        <div><label><input type="file" accept="image/*,video/*" />＋ 图片 / 视频</label><button type="submit">发到这条下面</button></div>
      </form>}
    </article>
  );
}

function GalleryHome({ query, newPosts, onPublish, onToast }: { query: string; newPosts: Post[]; onPublish: (draft?: string) => void; onToast: (message: string) => void }) {
  const [category, setCategory] = useState("全部");
  const [sort, setSort] = useState("综合推荐");
  const [draft, setDraft] = useState("");
  const [compact, setCompact] = useState(() => localStorage.getItem("bridge-gallery-size") === "compact");

  function changeCardSize(size: string) {
    setCompact(size === "compact");
    localStorage.setItem("bridge-gallery-size", size);
  }
  const categories = ["全部", "平衡", "截面", "弯曲", "扭转", "稳定", "动力"];
  const normalized = query.trim().toLowerCase();
  const compareScores = <T extends { teacherScore: number; studentScore: number },>(a: T, b: T) => {
    if (sort === "教师评分") return b.teacherScore - a.teacherScore;
    if (sort === "学生评分") return b.studentScore - a.studentScore;
    if (sort === "分歧最大") return Math.abs(b.teacherScore - b.studentScore) - Math.abs(a.teacherScore - a.studentScore);
    return (b.teacherScore + b.studentScore) - (a.teacherScore + a.studentScore);
  };
  const visibleArtifacts = artifacts
    .filter((artifact) => (category === "全部" || artifact.category === category) && (!normalized || `${artifact.title}${artifact.observation}${artifact.author}${artifact.concepts.join("")}`.toLowerCase().includes(normalized)))
    .toSorted(compareScores);
  const visibleStudentCases = studentCases
    .filter((item) => (category === "全部" || item.category === category) && (!normalized || `${item.title}${item.observation}${item.guess}${item.author}${item.concepts.join("")}`.toLowerCase().includes(normalized)))
    .toSorted(compareScores);
  const visibleTextCases = textCases.slice(0, 14)
    .filter((item) => (category === "全部" || item.category === category) && (!normalized || `${item.title}${item.observation}${item.guess}${item.author}${item.concepts.join("")}`.toLowerCase().includes(normalized)))
    .toSorted(compareScores);
  const visibleCount = visibleStudentCases.length + visibleArtifacts.length + visibleTextCases.length;

  return (
    <div className={`gallery-home${compact ? " gallery-compact" : ""}`}>
      <section className="quick-post">
        <form onSubmit={(event) => { event.preventDefault(); onPublish(draft); }}>
          <span className="student-avatar">陈</span>
          <label><span>今天看见什么了？</span><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="一块饼干、一双鞋、一张纸……" /></label>
          <button type="submit">发布</button>
        </form>
        <div className="quick-tools"><button onClick={() => onPublish(draft)}>▣ 照片</button><button onClick={() => onPublish(draft)}>▶ 视频</button><button onClick={() => onPublish(draft)}>〰 随手画</button><span>50 条案例 · 29 份我们的原作 · 7 份曼大原作 · 14 条文字观察</span></div>
      </section>

      {newPosts.length > 0 && <section className="recent-posts"><span>本浏览器保存的观察</span>
        {newPosts.map((post) => <article key={post.id}>
          <b>{post.title}</b>
          <details><summary>查看我的思考记录</summary>
            <dl>{[
              ["最初的猜想", post.excerpt], ["标注或核对", post.checked],
              ["现在的解释", post.explanation], ["想请同学检验的问题", post.peerQuestion],
              ["关联材料的文件名", post.attachmentName],
            ].map(([label, value]) => value && <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
            {!post.excerpt && !post.checked && !post.explanation && !post.peerQuestion && !post.attachmentName && <p>这条观察只记录了选题。</p>}
          </details>
        </article>)}
      </section>}

      <section className="gallery-controls">
        <div>{categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <label><span>{visibleCount} 个案例</span><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="案例排序"><option>综合推荐</option><option>教师评分</option><option>学生评分</option><option>分歧最大</option></select></label>
      </section>
      <div className="display-tools">
        <div className="score-legend"><span><i className="teacher-dot">鲜</i>教师：结构解释成立</span><span><i className="student-dot">热</i>学生：这条观察有启发</span><small>评分为演示数据，投票保存在本机。</small></div>
        <div className="gallery-size">
          <label>图卡大小 <select value={compact ? "compact" : "comfortable"} onChange={(event) => changeCardSize(event.target.value)}><option value="comfortable">舒适</option><option value="compact">紧凑</option></select></label>
          <a href="../?capture=1">截屏展板 ↗</a>
        </div>
      </div>

      {visibleCount > 0 ? <>
        {visibleStudentCases.length > 0 && <section className="case-section student-original-section"><div className="case-section-head"><div><small>大连交通大学 · 智能建造23</small><h2>我们在生活中看见的结构</h2></div><span>{visibleStudentCases.length} 份我们的原作</span></div><div className="student-case-grid">{visibleStudentCases.map((item) => <StudentCaseCard key={item.id} item={item} />)}</div></section>}
        {visibleArtifacts.length > 0 && <section className="case-section"><div className="case-section-head"><h2>有图有实验</h2><span>{visibleArtifacts.length} 个完整作品</span></div><div className="artifact-grid">{visibleArtifacts.map((artifact) => <ArtifactCard key={artifact.id} artifact={artifact} onToast={onToast} />)}</div></section>}
        {visibleTextCases.length > 0 && <section className="case-section text-case-section"><div className="case-section-head"><h2>三句话也能开一条</h2><span>{visibleTextCases.length} 个文字观察</span></div><div className="text-case-grid">{visibleTextCases.map((item) => <TextCaseCard key={item.id} item={item} />)}</div></section>}
      </> : <div className="empty-search">换个物件试试：饼干、纸、鞋、冰、海绵……</div>}

      <footer className="gallery-footer"><span>作品索引参考</span><a href="https://www.sites.se.manchester.ac.uk/structural-concepts/coursework-statics/" target="_blank" rel="noreferrer">Manchester · Seeing and Touching Structural Concepts ↗</a></footer>
    </div>
  );
}

function BridgeMark() {
  return (
    <span className="bridge-mark" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

function PaperVisual() {
  return (
    <div className="card-visual paper-visual" aria-label="纸桥截面对照实验示意">
      <div className="visual-label">CONTROLLED TEST · 04</div>
      <div className="paper-load">16×</div>
      <div className="paper-shapes">
        <span className="paper-flat" />
        <span className="paper-fold" />
        <span className="paper-tube" />
      </div>
      <div className="paper-axis"><span>平铺</span><span>折叠</span><span>卷筒</span></div>
    </div>
  );
}

function CableVisual() {
  return (
    <div className="card-visual cable-visual" aria-label="斜拉桥力流示意">
      <div className="visual-label light">FORCE PATH · CABLE-STAYED</div>
      <span className="tower tower-a" />
      <span className="tower tower-b" />
      <span className="deck" />
      {Array.from({ length: 10 }).map((_, index) => (
        <span key={index} className={`cable-line cable-${index + 1}`} />
      ))}
      <span className="force-chip">塔柱受压</span>
      <span className="force-chip second">主梁弯矩 ↓</span>
    </div>
  );
}

function SensorVisual() {
  const bars = [18, 25, 42, 70, 46, 31, 22, 38, 82, 55, 34, 24, 18, 30, 51, 29];
  return (
    <div className="card-visual sensor-visual" aria-label="加速度频谱示意">
      <div className="visual-label">ACCELERATION · SAMPLE DATA</div>
      <div className="sensor-readout"><strong>2.84</strong><span>Hz 主频</span></div>
      <div className="sensor-bars">
        {bars.map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
      </div>
      <div className="sensor-footer"><span>0 Hz</span><span>FFT / AI 辅助识别</span><span>8 Hz</span></div>
    </div>
  );
}

function ArchVisual() {
  return (
    <div className="card-visual arch-visual" aria-label="拱桥与梁桥对照示意">
      <div className="visual-label">COMPARE · ARCH / BEAM</div>
      <div className="arch-scene">
        <span className="arch-ring" />
        <span className="arch-deck" />
        <span className="arch-arrow left">←</span>
        <span className="arch-arrow right">→</span>
      </div>
      <div className="arch-note"><b>新增变量</b><span>水平推力</span><i>→</i><span>更直接的压力路径</span></div>
    </div>
  );
}

function SubmittedVisual() {
  return (
    <div className="card-visual submitted-visual" aria-label="新提交案例占位图">
      <BridgeMark />
      <strong>新的节点已加入</strong>
      <span>等待同伴补充证据</span>
    </div>
  );
}

function PostVisual({ visual }: { visual: Post["visual"] }) {
  if (visual === "paper") return <PaperVisual />;
  if (visual === "cable") return <CableVisual />;
  if (visual === "sensor") return <SensorVisual />;
  if (visual === "arch") return <ArchVisual />;
  return <SubmittedVisual />;
}

function PostCard({ post, liked, onLike }: { post: Post; liked: boolean; onLike: () => void }) {
  return (
    <article className="feed-card">
      <PostVisual visual={post.visual} />
      <div className="card-body">
        <div className="card-kicker">
          <span className={`status-badge ${post.status === "待验证" ? "pending" : ""}`}>{post.status}</span>
          <span>{post.evidence}</span>
        </div>
        <h2>{post.title}</h2>
        <p>{post.excerpt}</p>
        <div className="concept-row">
          <span>#{post.concept}</span>
          <span>#桥梁结构概念</span>
        </div>
        <div className="author-row">
          <span className="avatar">{post.initials}</span>
          <span className="author-meta"><b>{post.author}</b><small>{post.role} · {post.time}</small></span>
          <button className={liked ? "metric active" : "metric"} onClick={onLike} aria-label={liked ? "取消点赞" : "点赞"}>
            <span>♡</span>{post.likes + (liked ? 1 : 0)}
          </button>
          <button className="metric" aria-label="查看讨论"><span>◌</span>{post.comments}</button>
          <button className="metric save" aria-label="收藏"><span>⌑</span></button>
        </div>
      </div>
    </article>
  );
}

function ChallengeCard({ challenge, claimed, onClaim }: { challenge: (typeof challenges)[number]; claimed: boolean; onClaim: () => void }) {
  return (
    <article className="challenge-card">
      <div className="challenge-top"><span>{challenge.concept}</span><b>{challenge.difficulty}</b></div>
      <h2>{challenge.title}</h2>
      <p>{challenge.detail}</p>
      <div className="challenge-bottom">
        <div><strong>{challenge.reward}</strong><span>{challenge.spots}</span></div>
        <button className={claimed ? "claimed" : ""} onClick={onClaim}>{claimed ? "我正在接这一枝" : "接着这个想法做"}</button>
      </div>
    </article>
  );
}

function KnowledgeGraph() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selected, setSelected] = useState("life");
  const [filter, setFilter] = useState("全部节点");
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const draw = () => {
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, rect.width, rect.height);

      const visible = new Set(classGraphNodes.filter((n) => filter === "全部节点" || n.kind === filter).map((n) => n.id));
      if (filter !== "全部节点") visible.add("life");

      classGraphEdges.forEach(({ from, to, confidence }) => {
        if (!visible.has(from) || !visible.has(to)) return;
        const a = classGraphNodes.find((n) => n.id === from)!;
        const b = classGraphNodes.find((n) => n.id === to)!;
        const ax = a.x * rect.width;
        const ay = a.y * rect.height;
        const bx = b.x * rect.width;
        const by = b.y * rect.height;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.strokeStyle = confidence < 92 ? "rgba(255, 105, 64, .34)" : "rgba(78, 132, 137, .34)";
        ctx.lineWidth = confidence > 96 ? 1.8 : 1.2;
        ctx.stroke();

        const angle = Math.atan2(by - ay, bx - ax);
        const drawArrow = (x: number, y: number, direction: number) => {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle + direction);
          ctx.beginPath();
          ctx.moveTo(5, 0);
          ctx.lineTo(-4, 3.2);
          ctx.lineTo(-4, -3.2);
          ctx.closePath();
          ctx.fillStyle = confidence < 92 ? "rgba(255, 105, 64, .7)" : "rgba(58, 118, 123, .65)";
          ctx.fill();
          ctx.restore();
        };
        drawArrow(ax + (bx - ax) * .64, ay + (by - ay) * .64, 0);
        drawArrow(ax + (bx - ax) * .36, ay + (by - ay) * .36, Math.PI);
      });

      const colors: Record<string, string> = {
        root: "#ff6940",
        concept: "#123643",
        case: "#48a9a6",
        sensor: "#8868d8",
        course: "#d6a03b",
      };

      classGraphNodes.forEach((node) => {
        if (!visible.has(node.id)) return;
        const x = node.x * rect.width;
        const y = node.y * rect.height;
        ctx.beginPath();
        ctx.arc(x, y, node.r + (selected === node.id ? 5 : 0), 0, Math.PI * 2);
        ctx.fillStyle = selected === node.id ? "rgba(255,105,64,.16)" : "rgba(255,255,255,.72)";
        ctx.fill();
        ctx.strokeStyle = selected === node.id ? "#ff6940" : colors[node.kind];
        ctx.lineWidth = selected === node.id ? 3 : 1.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, Math.max(4, node.r * 0.18), 0, Math.PI * 2);
        ctx.fillStyle = colors[node.kind];
        ctx.fill();
        ctx.font = `${node.kind === "root" ? 700 : 600} ${node.kind === "root" ? 14 : 12}px "Microsoft YaHei", sans-serif`;
        ctx.textAlign = "center";
        ctx.fillStyle = "#15313b";
        ctx.fillText(node.label, x, y + node.r + 18);
      });
    };

    const observer = new ResizeObserver(draw);
    observer.observe(parent);
    draw();
    return () => observer.disconnect();
  }, [selected, filter]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const hit = classGraphNodes.find((node) => Math.hypot(node.x * rect.width - x, node.y * rect.height - y) < node.r + 10);
    if (hit) setSelected(hit.id);
  };

  const activeNode = classGraphNodes.find((node) => node.id === selected) ?? classGraphNodes[0];
  const labels: Record<string, string> = { root: "学生观察入口", concept: "后来长出的概念", case: "生活灵光与实验", sensor: "AI 整理层", course: "迁移到的课程与工程" };
  const activeRelations = classGraphEdges.filter((edge) => edge.from === activeNode.id || edge.to === activeNode.id);

  const runUnderstanding = () => {
    if (syncing) return;
    setSyncing(true);
    window.setTimeout(() => setSyncing(false), 1600);
  };

  return (
    <section className="graph-workspace">
      <div className="graph-head">
        <div><span className="eyebrow">KNOWLEDGE GRAPH</span><h1>这些作品在说同一件事吗？</h1><p>从原作、草图、复现和反例中抽取的双向链接。</p></div>
        <button className="primary small" onClick={runUnderstanding}>{syncing ? "正在重建语义关系…" : "↻ 理解最新材料"}</button>
      </div>
      <div className="ai-understanding-bar">
        <span className={syncing ? "ai-orb thinking" : "ai-orb"}>AI</span>
        <div><b>{syncing ? "正在理解我们 29 份原作与 145 张图片" : "我们的知识场已更新"}</b><small>大连交通大学 · 智能建造23 · 29 份原作 · 145 张图片 · {classGraphEdges.length} 组双向链接</small></div>
        <span className="understanding-time">{syncing ? "语义抽取中" : "刚刚更新"}</span>
      </div>
      <div className="graph-filters" aria-label="图谱筛选">
        {[
          ["全部节点", "全部"],
          ["concept", "结构概念"],
          ["case", "案例实验"],
          ["sensor", "AI 整理"],
          ["course", "课程与工程"],
        ].map(([value, label]) => <button key={value} onClick={() => setFilter(value)} className={filter === value ? "active" : ""}>{label}</button>)}
      </div>
      <div className="graph-grid">
        <div className="graph-canvas-wrap">
          <canvas ref={canvasRef} onClick={handleCanvasClick} aria-label="可点击的桥梁知识图谱" />
          <div className="graph-legend"><span><i className="concept" />概念</span><span><i className="case" />案例</span><span><i className="sensor" />传感器</span><span><i className="course" />课程</span><span className="two-way">↔ 双向语义关系</span></div>
        </div>
        <aside className="node-inspector">
          <span className="node-type">{labels[activeNode.kind]}</span>
          <h3>{activeNode.label}</h3>
          <p>{activeNode.kind === "root" ? "来自日常观察、模型实验和课堂作品的材料入口。" : `从原作、复现和不同结果中识别出 ${activeRelations.length} 组直接关系。`}</p>
          <div className="node-stats"><span><b>{activeRelations.length}</b>直接关系</span><span><b>{activeRelations.reduce((sum, edge) => sum + edge.evidence, 0)}</b>证据片段</span><span><b>{Math.round(activeRelations.reduce((sum, edge) => sum + edge.confidence, 0) / Math.max(activeRelations.length, 1))}%</b>平均置信</span></div>
          <div className="relation-list">
            <span>双向链接</span>
            {activeRelations.slice(0, 4).map((edge) => {
              const isForward = edge.from === activeNode.id;
              const otherId = isForward ? edge.to : edge.from;
              const other = classGraphNodes.find((node) => node.id === otherId)!;
              const activeVerb = isForward ? edge.forward : edge.reverse;
              const reverseVerb = isForward ? edge.reverse : edge.forward;
              return (
                <button key={`${edge.from}-${edge.to}`} onClick={() => setSelected(other.id)}>
                  <span className="relation-title"><b>{activeNode.label}</b><i>{activeVerb} →</i><strong>{other.label}</strong></span>
                  <span className="reverse-link">反向：{other.label} <i>{reverseVerb} →</i> {activeNode.label}</span>
                  <span className="relation-proof">{edge.why}</span>
                  <span className="confidence"><i style={{ width: `${edge.confidence}%` }} />可信度 {edge.confidence}% · {edge.evidence} 条证据</span>
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </section>
  );
}

function SubmitModal({ initialTitle, onClose, onPublish }: { initialTitle?: string; onClose: () => void; onPublish: (post: Post) => void }) {
  const [title, setTitle] = useState(initialTitle ?? "");
  const [description, setDescription] = useState("");
  const [place, setPlace] = useState("");
  const [checked, setChecked] = useState("");
  const [explanation, setExplanation] = useState("");
  const [peerQuestion, setPeerQuestion] = useState("");
  const [attachmentName, setAttachmentName] = useState("");

  useEffect(() => {
    const handle = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [onClose]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onPublish({
      id: Date.now(),
      author: "我",
      initials: "我",
      role: place || "刚刚发布",
      title,
      excerpt: description || "",
      checked: checked.trim(),
      explanation: explanation.trim(),
      peerQuestion: peerQuestion.trim(),
      attachmentName,
      concept: "未匹配",
      evidence: "观察",
      status: "待验证",
      visual: "submitted",
      likes: 0,
      comments: 0,
      saved: 0,
      time: "刚刚",
    });
  };

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="submit-modal" role="dialog" aria-modal="true" aria-labelledby="submit-title">
        <div className="modal-head"><div><h2 id="submit-title">发一个发现</h2><small>文字投稿保存在此浏览器中。</small></div><button onClick={onClose} aria-label="关闭">×</button></div>
        <form onSubmit={submit}>
          <label className="field-label" htmlFor="post-title">你选了什么对象？</label>
          <input id="post-title" required autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="奥利奥的夹心被扭成了扇形" />
          <label className="field-label" htmlFor="post-description">最初，你猜它为什么会这样？ <small>选填</small></label>
          <textarea id="post-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="我觉得可能和……有关" />
          <label className="field-label" htmlFor="post-checked">你标注或核对了什么？ <small>选填</small></label>
          <textarea id="post-checked" value={checked} onChange={(event) => setChecked(event.target.value)} placeholder="例如，在照片上标出斜杆的两个连接点。" />
          <label className="field-label" htmlFor="post-explanation">现在，你怎样解释这个现象？ <small>选填</small></label>
          <textarea id="post-explanation" value={explanation} onChange={(event) => setExplanation(event.target.value)} />
          <label className="field-label" htmlFor="post-peer-question">还有什么想请同学检验？ <small>选填</small></label>
          <input id="post-peer-question" value={peerQuestion} onChange={(event) => setPeerQuestion(event.target.value)} placeholder="例如，换一种连接方式，结论还成立吗？" />
          <div className="field-pair"><label><span className="field-label">在哪里？ <small>选填</small></span><input value={place} onChange={(event) => setPlace(event.target.value)} placeholder="宿舍 / 食堂 / 路上" /></label><label><span className="field-label">什么时候？</span><select defaultValue="刚刚"><option>刚刚</option><option>今天</option><option>昨天</option><option>更早</option></select></label></div>
          <label className="upload-zone"><input type="file" accept="image/*,video/*,.csv" onChange={(event) => setAttachmentName(event.target.files?.[0]?.name ?? "")} /><span>＋</span><b>{attachmentName || "关联图片、视频或数据（仅记录文件名）"}</b></label>
          <div className="modal-actions"><button type="button" className="ghost" onClick={onClose}>取消</button><button type="submit" className="primary">发布</button></div>
        </form>
      </div>
    </div>
  );
}

export function BridgeCommunity() {
  const [view, setView] = useState<View>("discover");
  useEffect(() => {
    const revealLinkedCase = () => {
      const id = window.location.hash.slice(1);
      if (!id.startsWith("case-")) return;
      setView("discover");
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "center" }));
    };
    revealLinkedCase();
    window.addEventListener("hashchange", revealLinkedCase);
    return () => window.removeEventListener("hashchange", revealLinkedCase);
  }, []);
  const [showSubmit, setShowSubmit] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [query, setQuery] = useState("");
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [claimed, setClaimed] = useState<Set<number>>(new Set());
  const [newPosts, setNewPosts] = useState<Post[]>([]);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem("bridge-community-posts");
    if (stored) {
      const timer = window.setTimeout(() => {
        try { setNewPosts(JSON.parse(stored)); } catch { /* keep the demo usable */ }
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const publish = (post: Post) => {
    const updated = [post, ...newPosts];
    setNewPosts(updated);
    window.localStorage.setItem("bridge-community-posts", JSON.stringify(updated));
    setShowSubmit(false);
    setDraftTitle("");
    setView("discover");
    setToast("发好了");
  };

  const startPublish = (draft = "") => {
    setDraftTitle(draft);
    setShowSubmit(true);
  };

  const toggleSet = (setter: React.Dispatch<React.SetStateAction<Set<number>>>, id: number) => setter((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  return (
    <div className="commons-shell">
      <header className="commons-header">
        <button className="commons-brand" onClick={() => setView("discover")} aria-label="桥见首页"><BridgeMark /><span><b>桥见</b><small>生活里的结构</small></span></button>
        <a className="exhibition-link" href="../">返回展览首页</a>
        <nav aria-label="主导航">
          <button className={view === "discover" ? "active" : ""} onClick={() => setView("discover")}>发现</button>
          <button className={view === "challenges" ? "active" : ""} onClick={() => setView("challenges")}>接力</button>
          <button className={view === "graph" ? "active" : ""} onClick={() => setView("graph")}>图谱</button>
          <button onClick={() => setToast("收藏夹已打开")}>收藏</button>
        </nav>
        <label className="commons-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="搜索学生作品" placeholder="搜物件、问题或同学" /></label>
        <button className="header-publish" onClick={() => startPublish()}>＋ 发一条</button>
        <button className="header-avatar" aria-label="我的主页">陈</button>
      </header>

      <main className="commons-main">

        {view === "discover" && (
          <>
            {false && <StudyDeck />}
            {false && <SparkStream onPublish={() => startPublish()} onToast={setToast} />}
            {false && initialPosts.map((post) => <PostCard key={post.id} post={post} liked={liked.has(post.id)} onLike={() => toggleSet(setLiked, post.id)} />)}
            <GalleryHome query={query} newPosts={newPosts} onPublish={startPublish} onToast={setToast} />
          </>
        )}

        {view === "challenges" && (
          <section className="challenge-page">
            <div className="challenge-hero growth-hero"><span className="eyebrow">RECENT FOLLOW-UPS</span><h1>最近有人接着做了</h1><p>换材料、改条件、拍第二次，或者画了另一张图。</p><div><span><b>24</b>个续试</span><span><b>86</b>条回复</span><span><b>11</b>种不同结果</span></div></div>
            <div className="challenge-toolbar"><div><button className="active">全部</button><button>刚有新图</button><button>结果不一样</button><button>还少一次复现</button></div><select aria-label="排序"><option>最近更新</option><option>回复最多</option><option>还没人接</option></select></div>
            <div className="challenge-list">{challenges.map((challenge) => <ChallengeCard key={challenge.id} challenge={challenge} claimed={claimed.has(challenge.id)} onClaim={() => { toggleSet(setClaimed, challenge.id); setToast(claimed.has(challenge.id) ? "已收起" : "已打开续试表单"); }} />)}</div>
          </section>
        )}

        {view === "graph" && <KnowledgeGraph />}
      </main>

      <nav className="commons-mobile-nav" aria-label="移动端导航">
        <button className={view === "discover" ? "active" : ""} onClick={() => setView("discover")}><span>⌂</span>发现</button>
        <button className={view === "challenges" ? "active" : ""} onClick={() => setView("challenges")}><span>⑂</span>接力</button>
        <button className="mobile-publish" onClick={() => startPublish()}>＋</button>
        <button className={view === "graph" ? "active" : ""} onClick={() => setView("graph")}><span>⌘</span>图谱</button>
        <button onClick={() => setToast("收藏夹已打开")}><span>♡</span>收藏</button>
      </nav>

      {showSubmit && <SubmitModal initialTitle={draftTitle} onClose={() => setShowSubmit(false)} onPublish={publish} />}
      {toast && <div className="toast" role="status"><span>✓</span>{toast}</div>}
    </div>
  );
}
