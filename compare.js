const cases = {
  bed: {
    title: '宿舍床架的斜撑怎样传力？',
    summary: '题目里，支座和荷载已经画好。面对一张上铺照片，第一步是决定把哪一部分单独拿出来看。',
    givenTitle: '读出横梁的支承与荷载',
    modelAlt: '给定模型：两端简支的横梁承受竖向均布荷载 q，两端支座可提供向上的反力。',
    caption: '给定简支横梁及均布荷载 q · 教学重绘',
    prompt: '指出梁的两个支点，并用竖向平衡解释两端支承力如何共同承担床面荷载。',
    studentTitle: '从床架照片选出横梁和斜撑',
    photos: [
      ['bed.jpg','宿舍床架侧面，学生以红色箭头标出上铺荷载和连接位置。','床架现场照片与受力标注'],
      ['bed-diagram.png','学生绘制的床架简图，示出横杆、斜撑、端部连接及均布荷载。','学生从实物中提取的简图','diagram']
    ],
    note: '用向下的箭头表示床面荷载，把横梁和斜撑抽成线条。',
    question: '图上的支座对应照片中的哪处连接？哪些约束仍需查看实物？',
    mechanics: '床面荷载传给横梁，斜撑在连接处提供支承。判断斜杆拉压时，要先说明荷载和连接条件。',
    transfer: '换成没有斜撑的床架，先指出哪个连接仍能限制横梁转动，再画模型。',
    credit: '学生图文取自王俊博《宿舍双层床支撑结构的力学分析与设计原理解读》。课堂模型、讲解与提问为本次展示补充。'
  },
  hose: {
    title: '扎紧一圈钢丝，软管为什么不易滑脱？',
    summary: '课内算的是已知压紧力下的抗滑条件。到了水龙头边，要先找出哪两个表面可能发生相对滑动。',
    givenTitle: '读出接触面上的受力',
    modelAlt: '给定模型：物块紧压平面，向右的拖力、向左的静摩擦力、法向力和压紧力作用在物块上。',
    caption: '局部平面接触及拖动力 T · 教学重绘',
    prompt: '给定法向力 N 和静摩擦系数 μ 后，判断接触面最多能提供多大的静摩擦力。',
    studentTitle: '在捆扎前后辨认同一处接头',
    photos: [
      ['hose-before.jpg','钢丝捆扎前的水龙头与软管接头，图片带学生的力学标注。','捆扎前 · 学生标出的接触力'],
      ['hose-after.jpg','钢丝扎紧软管接头后的局部照片及学生受力标注。','捆扎后 · 学生标出的箍紧位置']
    ],
    note: '在接头局部标出力的方向，并比较捆扎前后管壁的受压情况。',
    question: '钢丝向哪里压？软管要脱开时，摩擦力作用在哪一对接触面上？',
    mechanics: '张紧的钢丝压紧软管，使管壁与接头间的法向压力增大。其他条件相同时，可提供的最大静摩擦力随之增大。',
    transfer: '若把接触面换得更光滑，即使同样扎紧，抗滑能力会怎样变化？',
    credit: '学生图文取自晋卓凡的钢丝捆扎水管案例。课堂模型、讲解与提问为本次展示补充。'
  },
  bracket: {
    title: '从书立到空调支架，多出的斜杆做了什么？',
    summary: '看出三角形之后，还可以沿着受力的杆件追问，空调外机的重量怎样传到了墙上？',
    givenTitle: '判断理想三角架的杆力',
    modelAlt: '理想铰接三角架，水平杆和下方斜杆在右端相交，右端节点承受竖向向下荷载 F。',
    caption: '铰接三角架，端节点受力 F · 教学重绘',
    prompt: '以受载端点为研究对象，沿两根杆的方向画力，根据节点平衡判断哪根受拉、哪根受压。',
    studentTitle: '对照书立与墙上的三角支架',
    photos: [
      ['bookend.jpg','学生在L形书立图上标注荷载、弯矩和变形位置。','L 形书立 · 学生的受弯标注'],
      ['bracket.jpg','学生在空调支架图上用线和箭头标注荷载、连接和斜杆。','空调支架 · 学生标出杆件与荷载']
    ],
    note: '书立图标出了根部弯矩，支架图另用箭头标出了斜杆的受力方向。',
    question: '从空调外机的荷载出发，能沿构件一直追到墙上的两个连接点吗？',
    mechanics: 'L 形构件以弯曲承担外荷载。对端节点受竖向力的理想铰接三角架，水平杆受拉、下斜杆受压。',
    transfer: '若把竖向荷载移到水平杆中部，水平杆还能只按轴向受力来解释吗？',
    credit: '学生图文取自王鹤然《从“受弯”到“轴力”的跨越》。课堂模型、讲解与提问为本次展示补充。'
  }
};

const $ = (id) => document.getElementById(id);

function diagram(name) {
  const canvas = $('model');
  const ctx = canvas.getContext('2d');
  const w = 420, h = 217;
  ctx.setTransform(canvas.width / w, 0, 0, canvas.height / h, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const green = '#174d42', orange = '#a74828', quiet = '#60776a';
  function line(ax, ay, bx, by, color = green, width = 2.3) {
    ctx.strokeStyle = color; ctx.lineWidth = width;
    ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
  }
  function arrow(ax, ay, bx, by, color = orange) {
    line(ax, ay, bx, by, color, 2.7);
    const angle = Math.atan2(by - ay, bx - ax);
    ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(bx, by);
    for (const d of [-0.46, 0.46]) ctx.lineTo(bx-9*Math.cos(angle+d), by-9*Math.sin(angle+d));
    ctx.closePath(); ctx.fill();
  }
  function label(x, y, text, color = quiet, size = 15) {
    ctx.textAlign = 'center'; ctx.fillStyle = color;
    ctx.font = '600 ' + size + 'px "Microsoft YaHei",sans-serif';
    ctx.fillText(text, x, y);
  }
  function joint(x, y) {
    ctx.beginPath(); ctx.arc(x, y, 4.4, 0, Math.PI * 2);
    ctx.fillStyle = '#faf8f2'; ctx.fill(); ctx.strokeStyle = green; ctx.lineWidth = 2; ctx.stroke();
  }
  if (name === 'bed') {
    line(46,111,373,111,green,6);
    line(54,61,366,61,orange,1.6);
    for (let x=54;x<=366;x+=39) arrow(x,61,x,99);
    label(211,44,'q',orange,20);
    for (const x of [57,363]) {
      joint(x,112);
      line(x,119,x-12,138); line(x-12,138,x+12,138); line(x+12,138,x,119);
      if (x===363) {
        for (const nx of [356,370]) {
          ctx.beginPath(); ctx.arc(nx,144,3,0,2*Math.PI); ctx.strokeStyle=green; ctx.lineWidth=1.8;ctx.stroke();
        }
      }
      const y=x===57?143:151; line(x-21,y,x+21,y);
      for (let t=-15;t<20;t+=7) line(x+t,y+2,x+t-5,y+9,quiet,1.2);
    }
    label(56,185,'铰支座'); label(362,185,'滚动支座');
  } else if (name === 'hose') {
    ctx.fillStyle='#ccddcf'; ctx.fillRect(140,85,140,49);
    ctx.strokeStyle=green;ctx.lineWidth=2;ctx.strokeRect(140,85,140,49);
    line(54,136,364,136,green,3);
    for(let x=61;x<363;x+=12)line(x,137,x-10,146,quiet,1.1);
    arrow(210,27,210,80);label(250,52,'压紧力',orange);
    arrow(209,180,209,138,green);label(237,174,'N',green);
    arrow(282,104,343,104);label(320,92,'T',orange,18);
    arrow(180,128,113,128);label(122,116,'f',orange,18);
  } else {
    line(80,46,80,177,quiet,3);
    for(let y=51;y<177;y+=11)line(78,y,68,y+9,quiet,1.4);
    line(81,73,335,73,green,6);line(81,161,335,73,green,6);
    for(const p of [[81,73],[81,161],[335,73]])joint(p[0],p[1]);
    arrow(335,22,335,63);label(355,49,'F',orange,19);
    label(188,58,'水平杆');label(228,143,'下斜杆');
  }
}

const buttons = [...document.querySelectorAll('[data-case]')];
function selectCase(key, updateUrl) {
  if (!Object.hasOwn(cases, key)) key = 'bed';
  const item = cases[key];
  const fields = {'case-title':'title','case-summary':'summary','given-heading':'givenTitle',
    'model-caption':'caption','given-prompt':'prompt','student-heading':'studentTitle',
    'student-note':'note','reader-prompt':'question','mechanics':'mechanics','transfer-prompt':'transfer','credit':'credit'};
  for (const [id, property] of Object.entries(fields)) $(id).textContent = item[property];
  $('model').setAttribute('role','img'); $('model').setAttribute('aria-label',item.modelAlt);
  item.photos.forEach(([filename, description, caption, mountClass], i) => {
    const suffix=i ? 'b' : 'a'; const photo=$('photo-'+suffix);
    photo.src='./assets/'+filename; photo.alt=description;
    photo.parentElement.classList.toggle('diagram', mountClass==='diagram');
    $('caption-'+suffix).textContent=caption;
  });
  diagram(key);
  for (const button of buttons) button.setAttribute('aria-pressed',String(button.dataset.case===key));
  if (updateUrl) {
    const url=new URL(location.href);
    url.searchParams.set('case',key);
    try { history.replaceState(null,'',url); } catch { /* Local file previews may restrict history changes. */ }
    $('status').textContent='已切换至'+item.title;
  }
}
for (const [index,button] of buttons.entries()) {
  button.addEventListener('click',()=>selectCase(button.dataset.case,true));
  button.addEventListener('keydown',event=>{
    let next;
    if (event.key==='ArrowRight') next=(index+1)%buttons.length;
    else if (event.key==='ArrowLeft') next=(index+buttons.length-1)%buttons.length;
    else if (event.key==='Home') next=0;
    else if (event.key==='End') next=buttons.length-1;
    else return;
    event.preventDefault(); buttons[next].focus(); buttons[next].click();
  });
}
selectCase(new URL(location.href).searchParams.get('case'),false);
