export type IdeaRelation = "换材料" | "复现" | "继续测量" | "相反结果" | "相似现象" | "共同解释" | "迁移到桥梁";

export type IdeaLink = {
  from: string;
  to: string;
  relation: IdeaRelation;
};

export type VirtualIdeaNode = {
  id: string;
  title: string;
  author: string;
  kind: "branch" | "bridge";
};

export const virtualIdeaNodes: VirtualIdeaNode[] = [
  { id: "oreo-sandwich", title: "换成普通夹心饼干再扭一次", author: "麦小冬", kind: "branch" },
  { id: "oreo-grid", title: "在奶油上压出方格", author: "唐予安", kind: "branch" },
  { id: "oreo-measure", title: "测量方格外圈的错动", author: "许闻舟", kind: "branch" },
  { id: "oreo-opposite", title: "厚夹心出现了相反结果", author: "周沐", kind: "branch" },
  { id: "box-girder", title: "把同一种扭转画到箱梁上", author: "顾行", kind: "bridge" },
  { id: "ice-position", title: "把绳子移到冰梁上缘、中间和下缘", author: "麦小冬", kind: "branch" },
  { id: "ice-crack-map", title: "给三根冰梁画裂缝地图", author: "叶听澜", kind: "branch" },
  { id: "paper-failure", title: "只收集纸桥第一次失效的位置", author: "林知夏", kind: "branch" },
  { id: "angry-slow", title: "录下塔倒塌前第一个失去接触的木块", author: "白砚", kind: "branch" },
  { id: "bridge-cantilever", title: "挑臂与支座：偏心荷载怎样回到桥墩", author: "桥梁知识场", kind: "bridge" },
  { id: "bridge-truss", title: "桁架与横向联结：把弯曲改写成拉压路径", author: "桥梁知识场", kind: "bridge" },
  { id: "bridge-box", title: "箱梁与截面效率：把材料推离中性轴", author: "桥梁知识场", kind: "bridge" },
  { id: "bridge-arch", title: "系杆拱：让压力线与水平推力都有去处", author: "桥梁知识场", kind: "bridge" },
  { id: "bridge-prestress", title: "预应力与索力：先建立有益的初始内力", author: "桥梁知识场", kind: "bridge" },
  { id: "bridge-wind", title: "桥塔与风：整体弯矩怎样变成两侧拉压", author: "桥梁知识场", kind: "bridge" },
  { id: "bridge-detail", title: "桥梁细部：连接、薄弱环节与可控破坏", author: "桥梁知识场", kind: "bridge" },
];

// from 引用了 to；同一条记录会在 from 端显示“引用了”，在 to 端显示“被引用”。
export const ideaLinks: IdeaLink[] = [
  { from: "oreo-sandwich", to: "oreo", relation: "换材料" },
  { from: "oreo-grid", to: "oreo", relation: "复现" },
  { from: "oreo-measure", to: "oreo-grid", relation: "继续测量" },
  { from: "oreo-opposite", to: "oreo", relation: "相反结果" },
  { from: "box-girder", to: "oreo", relation: "迁移到桥梁" },
  { from: "bottle-twist", to: "oreo", relation: "相似现象" },
  { from: "chalk-twist", to: "oreo", relation: "共同解释" },

  { from: "ice-position", to: "ice-beam", relation: "复现" },
  { from: "ice-crack-map", to: "ice-position", relation: "继续测量" },
  { from: "tree-branch", to: "ice-beam", relation: "相似现象" },

  { from: "paper-failure", to: "paper-bridge", relation: "继续测量" },
  { from: "tape-measure", to: "paper-bridge", relation: "共同解释" },
  { from: "takeaway-lid", to: "paper-bridge", relation: "相似现象" },
  { from: "paper-cup-rim", to: "paper-bridge", relation: "相似现象" },
  { from: "popsicle-bridge", to: "paper-bridge", relation: "迁移到桥梁" },

  { from: "angry-slow", to: "angry-birds", relation: "继续测量" },
  { from: "card-tower", to: "angry-birds", relation: "相似现象" },
  { from: "phone-stand", to: "angry-birds", relation: "共同解释" },

  { from: "book-cantilever", to: "heelless-shoe", relation: "共同解释" },
  { from: "backpack-straps", to: "heelless-shoe", relation: "相似现象" },
  { from: "shopping-bag", to: "chocolate", relation: "共同解释" },
  { from: "tofu-crack", to: "chocolate", relation: "相似现象" },
  { from: "straw-bundle", to: "sponge-i-beam", relation: "换材料" },
  { from: "shoe-box-divider", to: "sponge-i-beam", relation: "共同解释" },
  { from: "chain-bridge", to: "clothesline", relation: "迁移到桥梁" },

  { from: "class-phone-support", to: "bridge-cantilever", relation: "迁移到桥梁" },
  { from: "class-acrylic-stand", to: "class-phone-support", relation: "复现" },
  { from: "class-five-star-base", to: "class-phone-support", relation: "共同解释" },
  { from: "class-desk-gusset", to: "bridge-truss", relation: "迁移到桥梁" },
  { from: "class-triangle-bracket", to: "class-desk-gusset", relation: "共同解释" },
  { from: "class-dorm-bed", to: "class-desk-gusset", relation: "共同解释" },
  { from: "class-bicycle-frame", to: "class-dorm-bed", relation: "相似现象" },
  { from: "class-z-chair", to: "bridge-cantilever", relation: "迁移到桥梁" },

  { from: "class-folding-chair-dong", to: "bridge-truss", relation: "迁移到桥梁" },
  { from: "class-folding-chair-fu", to: "class-folding-chair-dong", relation: "复现" },
  { from: "class-folding-chair-ding", to: "class-folding-chair-dong", relation: "复现" },
  { from: "class-x-table", to: "class-folding-chair-dong", relation: "相似现象" },
  { from: "class-folding-table", to: "class-corrugated-paper", relation: "共同解释" },

  { from: "class-drying-rack", to: "bridge-wind", relation: "迁移到桥梁" },
  { from: "class-eiffel", to: "class-drying-rack", relation: "共同解释" },
  { from: "class-umbrella", to: "class-eiffel", relation: "相似现象" },
  { from: "class-tripod", to: "class-five-star-base", relation: "共同解释" },

  { from: "class-corrugated-paper", to: "bridge-box", relation: "迁移到桥梁" },
  { from: "class-racket-shaft", to: "bridge-box", relation: "共同解释" },
  { from: "class-clothes-rod", to: "class-racket-shaft", relation: "复现" },
  { from: "class-drawer-front", to: "class-corrugated-paper", relation: "共同解释" },
  { from: "class-suitcase-rod", to: "class-racket-shaft", relation: "相似现象" },

  { from: "class-arch-chair", to: "bridge-arch", relation: "迁移到桥梁" },
  { from: "class-guitar-prestress", to: "bridge-prestress", relation: "迁移到桥梁" },
  { from: "class-wire-hose", to: "class-guitar-prestress", relation: "共同解释" },

  { from: "class-pencil-sharpener", to: "bridge-detail", relation: "迁移到桥梁" },
  { from: "class-bottle-cap", to: "class-pencil-sharpener", relation: "共同解释" },
  { from: "class-towel-wheel", to: "class-pencil-sharpener", relation: "相似现象" },
  { from: "class-game-coating", to: "bridge-detail", relation: "迁移到桥梁" },
];
