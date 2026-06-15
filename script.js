// ======================================
// 登录 + 注册功能（本地存储版）
// ======================================
window.onload = function() {
  checkLogin();
  initKnowledgeTree();
  initChapter1Data();
  initChapter2Data();
  initChapter3Data();
  
  // 初始化三个章节的答题卡
  loadQuizQuestion('ch1');
  loadQuizQuestion('ch2');
  loadQuizQuestion('ch3');
  
  loadPdfNotes();
  initTabEvents();
  initChapterCardEvents();
  if(!localStorage.getItem("userList")){
    localStorage.setItem("userList", JSON.stringify([]));
  }
}

// 初始化选项卡事件
function initTabEvents() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.removeEventListener('click', handleTabClick);
    btn.addEventListener('click', handleTabClick);
  });
}

function handleTabClick(e) {
  const btn = e.currentTarget;
  const targetId = btn.getAttribute('data-tab');
  const chapterPage = btn.closest('.page');
  if (!chapterPage) return;
  const panels = chapterPage.querySelectorAll('.module-panel');
  panels.forEach(panel => panel.classList.remove('active'));
  const targetPanel = chapterPage.querySelector('#' + targetId);
  if (targetPanel) targetPanel.classList.add('active');
  const btns = chapterPage.querySelectorAll('.tab-btn');
  btns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// 初始化章节卡片点击事件
function initChapterCardEvents() {
  document.querySelectorAll('.chapter-card').forEach(card => {
    card.removeEventListener('click', handleCardClick);
    card.addEventListener('click', handleCardClick);
  });
}

function handleCardClick(e) {
  const card = e.currentTarget;
  const page = card.getAttribute('data-page');
  if (page === 'chapter1') showPage('chapter1Page');
  else if (page === 'chapter2') showPage('chapter2Page');
  else if (page === 'chapter3') showPage('chapter3Page');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function checkLogin() {
  let user = localStorage.getItem("loginUser");
  if (user) {
    showContent(user);
  } else {
    showLogin();
  }
}

function showLogin() {
  const mask = document.getElementById("loginMask");
  if (mask) mask.style.display = "flex";
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  if (loginForm) loginForm.style.display = "block";
  if (registerForm) registerForm.style.display = "none";
  const userInfo = document.getElementById("userInfo");
  if (userInfo) userInfo.style.display = "none";
  const loginTips = document.getElementById("loginTips");
  if (loginTips) loginTips.style.display = "none";
  const regTips = document.getElementById("regTips");
  if (regTips) regTips.style.display = "none";
}

function showRegister() {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  if (loginForm) loginForm.style.display = "none";
  if (registerForm) registerForm.style.display = "block";
  const loginTips = document.getElementById("loginTips");
  if (loginTips) loginTips.style.display = "none";
  const regTips = document.getElementById("regTips");
  if (regTips) regTips.style.display = "none";
}

function showContent(username) {
  const mask = document.getElementById("loginMask");
  if (mask) mask.style.display = "none";
  const userInfo = document.getElementById("userInfo");
  if (userInfo) {
    userInfo.style.display = "flex";
    const userNameSpan = document.getElementById("userName");
    if (userNameSpan) userNameSpan.innerText = username;
  }
}

function doLogin() {
  let user = document.getElementById("loginUser").value.trim();
  let pwd = document.getElementById("loginPwd").value.trim();
  let tips = document.getElementById("loginTips");
  let userList = JSON.parse(localStorage.getItem("userList") || "[]");
  let find = userList.find(item => item.user === user && item.pwd === pwd);
  if (find) {
    localStorage.setItem("loginUser", user);
    showContent(user);
    if (tips) tips.style.display = "none";
  } else {
    if (tips) {
      tips.style.display = "block";
      tips.innerText = "账号或密码错误！";
    }
  }
}

function doRegister() {
  let user = document.getElementById("regUser").value.trim();
  let pwd = document.getElementById("regPwd").value.trim();
  let pwd2 = document.getElementById("regPwd2").value.trim();
  let tips = document.getElementById("regTips");
  if (tips) tips.style.display = "block";
  if (!user || !pwd || !pwd2) {
    if (tips) tips.innerText = "请填写完整信息！";
    return;
  }
  if (pwd !== pwd2) {
    if (tips) tips.innerText = "两次密码不一致！";
    return;
  }
  let userList = JSON.parse(localStorage.getItem("userList") || "[]");
  if (userList.some(item => item.user === user)) {
    if (tips) tips.innerText = "账号已存在！";
    return;
  }
  userList.push({ user, pwd });
  localStorage.setItem("userList", JSON.stringify(userList));
  if (tips) {
    tips.style.color = "#2d8557";
    tips.innerText = "注册成功！正在跳转登录...";
  }
  setTimeout(() => {
    showLogin();
    const loginUserInput = document.getElementById("loginUser");
    if (loginUserInput) loginUserInput.value = user;
  }, 1200);
}

function doLogout() {
  localStorage.removeItem("loginUser");
  showLogin();
}

// ======================================
// 页面切换逻辑
// ======================================
function showPage(pageId) {
  const pages = ['homePage', 'textbookPage', 'chapter1Page', 'chapter2Page', 'chapter3Page'];
  pages.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  const activePage = document.getElementById(pageId);
  if (activePage) activePage.style.display = 'block';
  
  const navLinks = document.querySelectorAll('.nav-menu a');
  navLinks.forEach(link => {
    link.classList.remove('active');
    const linkPage = link.getAttribute('data-page');
    if ((linkPage === 'home' && pageId === 'homePage') ||
        (linkPage === 'textbook' && pageId === 'textbookPage') ||
        (linkPage === 'chapter1' && pageId === 'chapter1Page') ||
        (linkPage === 'chapter2' && pageId === 'chapter2Page') ||
        (linkPage === 'chapter3' && pageId === 'chapter3Page')) {
      link.classList.add('active');
    }
  });
}

// 导航栏链接点击事件
document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const page = link.getAttribute('data-page');
    if (page === 'home') showPage('homePage');
    else if (page === 'textbook') showPage('textbookPage');
    else if (page === 'chapter1') showPage('chapter1Page');
    else if (page === 'chapter2') showPage('chapter2Page');
    else if (page === 'chapter3') showPage('chapter3Page');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.innerWidth <= 768) {
      document.getElementById('navMenu').classList.remove('show');
    }
  });
});

// 深色模式切换
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const btn = document.querySelector('.theme-toggle');
  if (document.body.classList.contains('dark-mode')) {
    btn.textContent = '☀️ 亮色';
  } else {
    btn.textContent = '🌙 深色';
  }
}

// 移动端菜单切换
function toggleMenu() {
  const menu = document.getElementById('navMenu');
  menu.classList.toggle('show');
}

// ======================================
// PDF 笔记功能（教材页面）
// ======================================
function savePdfNotes() {
  const notes = document.getElementById('pdfNotes');
  if (notes) {
    localStorage.setItem('pdf_notes', notes.value);
    alert('笔记已保存');
  }
}

function loadPdfNotes() {
  const savedNotes = localStorage.getItem('pdf_notes');
  const notesArea = document.getElementById('pdfNotes');
  if (savedNotes && notesArea) {
    notesArea.value = savedNotes;
  }
}

// ======================================
// 模态框PDF预览功能
// ======================================
let currentModalPdfFile = '';
let currentModalPdfName = '';

function openPdfModal(pdfFile, pdfName) {
  currentModalPdfFile = pdfFile;
  currentModalPdfName = pdfName;
  const modal = document.getElementById('pdfModal');
  const title = document.getElementById('pdfModalTitle');
  const iframe = document.getElementById('pdfModalIframe');
  const downloadLink = document.getElementById('pdfModalDownload');
  const notesArea = document.getElementById('pdfModalNotes');
  
  title.textContent = '📄 ' + pdfName;
  iframe.src = pdfFile;
  downloadLink.href = pdfFile;
  downloadLink.download = pdfName;
  
  const savedNote = localStorage.getItem('pdf_modal_note_' + pdfFile.replace(/[\/\\:]/g, '_'));
  if (savedNote) {
    notesArea.value = savedNote;
  } else {
    notesArea.value = '';
  }
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePdfModal() {
  const modal = document.getElementById('pdfModal');
  const iframe = document.getElementById('pdfModalIframe');
  modal.classList.remove('active');
  iframe.src = '';
  document.body.style.overflow = '';
}

function saveModalNotes() {
  const notes = document.getElementById('pdfModalNotes').value;
  const key = 'pdf_modal_note_' + currentModalPdfFile.replace(/[\/\\:]/g, '_');
  localStorage.setItem(key, notes);
  alert('笔记已保存');
}

document.addEventListener('click', function(e) {
  const modal = document.getElementById('pdfModal');
  if (e.target === modal) {
    closePdfModal();
  }
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closePdfModal();
  }
});

// ======================================
// 完整知识图谱数据
// ======================================
const completeKnowledgeDataCh1 = [
  {
    name: "一、核心知识总览",
    children: [
      { name: "数据可视化基础概念"}, 
      { name: "Python+Matplotlib绘图全流程" },
      { name: "Jupyter Notebook基础使用" },
      { name: "变量、列表数据存储"},
      { name: "plt.plot()折线图绘制" },
      { name: "数据名片实战"}
    ]
  },
  {
    name: "二、数据可视化核心",
    children: [
      { name: "定义：将抽象数据转为直观图形" },
      { name: "作用：快速理解规律、清晰表达信息" },
      { name: "价值：解决原始数据零散枯燥问题" },
      { name: "数据分析完整流程：明确问题→收集数据→整理数据→可视化→得出结论" },
      { name: "应用场景：销售、医疗、成绩、舆情、科研、媒体、个人生活" }
    ]
  },
  {
    name: "三、工具与环境",
    children: [
      { name: "Python：编程语言基础" },
      { name: "Matplotlib：核心绘图库" },
      { name: "VS Code：代码编辑平台" },
      { name: "Jupyter Notebook：交互式运行环境" },
      { name: "安装步骤：VS Code→安装Python扩展→启动Jupyter→运行测试代码" },
      { name: "环境测试代码：import matplotlib.pyplot as plt" }
    ]
  },
  {
    name: "四、Python基础语法",
    children: [
      { name: "变量：存储单个数据" },
      { name: "列表：存储一组有序数据" },
      { name: "绘图要求：X轴与Y轴数据长度必须一致" }
    ]
  },
  {
    name: "五、Matplotlib绘图技能",
    children: [
      { name: "折线图要求：标题、X轴、Y轴、折线、数据点、图例" },
      { name: "核心函数：plt.plot(x, y)" },
      { name: "标准绘图步骤：导库→设置中文字体→准备数据→绘图→添加标题→显示图表" },
      { name: "中文乱码解决：设置字体SimHei" },
      { name: "图表美化：颜色、线宽、填充、标题样式" }
    ]
  },
  {
    name: "六、数据名片项目实战",
    children: [
      { name: "A：兴趣雷达图", children: [
        { name: "5-6个兴趣维度" },
        { name: "1-10分打分" },
        { name: "Matplotlib+NumPy实现" }
      ]},
      { name: "B：一周心情折线图", children: [
        { name: "周一至周日数据" },
        { name: "1-5分打分" },
        { name: "plt.plot()实现" }
      ]}
    ]
  },
  {
    name: "七、本章必会清单",
    children: [
      { name: "完成环境搭建" },
      { name: "用列表存储数据" },
      { name: "独立绘制折线图" },
      { name: "解决中文乱码问题" },
      { name: "完成个人数据名片" }
    ]
  }
];

const knowledgeDataCh2 = [
  {
    name: "一、核心知识总览",
    children: [
      "7 种常用图表的功能与适用场景",
      "Matplotlib 基础绘图代码结构",
      "图表类型的选择依据",
      "图表美化与标注规范"
    ]
  },
  {
    name: "二、类别对比图表",
    children: [
      "柱状图：plt.bar() —— 类别短、数量少",
      "条形图：plt.barh() —— 类别长、数量多",
      "适用：比较不同类别数值大小"
    ]
  },
  {
    name: "三、趋势走势图表",
    children: [
      "折线图：plt.plot() —— 时间/有序数据趋势",
      "直方图：plt.hist() —— 连续数据分布",
      "区别：折线看变化，直方看分布"
    ]
  },
  {
    name: "四、结构占比图表",
    children: [
      "饼图：plt.pie() —— 部分与整体关系",
      "可突出显示、显示百分比",
      "适用：展示占比、成分结构"
    ]
  },
  {
    name: "五、统计分析图表（进阶）",
    children: [
      "箱线图：plt.boxplot() —— 看分布、异常值",
      "热力图：sns.heatmap() —— 看强弱、相关性",
      "适用：深度数据分析、多维度对比"
    ]
  },
  {
    name: "六、绘图通用技能",
    children: [
      "解决中文乱码：plt.rcParams",
      "添加标题、坐标轴标签",
      "数值标注、图表保存",
      "颜色、样式、字体美化"
    ]
  },
  {
    name: "七、本章必会清单",
    children: [
      "区分7种图表的适用场景",
      "独立写出每种图表代码",
      "根据数据选择正确图表",
      "完成校园数据可视化任务"
    ]
  }
];

const knowledgeDataCh3 = [
  {
    name: "一、核心知识总览",
    children: [
      "数据可视化完整流程：提出问题、收集数据、整理数据、绘制图表、解读结论",
      "校园场景数据采集与整理方法",
      "根据任务选择对应图表",
      "用图表分析并表达数据规律"
    ]
  },
  {
    name: "二、任务一：作业量调查",
    children: [
      "数据：一周各科作业数量统计",
      "图表：柱状图",
      "目的：对比各科作业量多少"
    ]
  },
  {
    name: "三、任务二：一周心情变化",
    children: [
      "数据：一周心情指数（1-5分）",
      "图表：折线图 + 箱线图",
      "目的：看趋势、看波动、找异常值"
    ]
  },
  {
    name: "四、任务三：食堂窗口排队",
    children: [
      "数据：各窗口排队时间测量",
      "图表：条形图 + 直方图",
      "目的：对比效率、看时间分布"
    ]
  },
  {
    name: "五、任务四：班级成绩分布",
    children: [
      "数据：考试成绩（匿名）",
      "图表：直方图 + 箱线图",
      "目的：看分数分布、中位数、异常值"
    ]
  },
  {
    name: "六、任务五：我的校园一天",
    children: [
      "数据：一天时间分配、一周精力状态",
      "图表：饼图 + 热力图",
      "目的：展示时间占比、时段活跃度"
    ]
  },
  {
    name: "七、项目能力目标",
    children: [
      "能提出可量化的问题",
      "能收集、整理真实校园数据",
      "能正确选择并绘制图表",
      "能从图表得出结论"
    ]
  }
];

function buildCompleteTree(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  const ul = document.createElement('ul');
  ul.className = 'tree-node';
  
  data.forEach(item => {
    const li = document.createElement('li');
    const div = document.createElement('div');
    const hasChildren = item.children && item.children.length > 0;
    div.className = hasChildren ? 'folder' : 'file';
    div.innerHTML = `<span class="icon">${hasChildren ? '📁' : '📄'}</span><span>${item.name}</span>`;
    
    if (hasChildren) {
      div.onclick = (e) => {
        e.stopPropagation();
        const childrenDiv = li.querySelector('.children');
        if (childrenDiv) childrenDiv.classList.toggle('show');
      };
    }
    li.appendChild(div);
    
    if (hasChildren) {
      const childrenDiv = document.createElement('div');
      childrenDiv.className = 'children';
      const childUl = document.createElement('ul');
      childUl.className = 'tree-node';
      
      item.children.forEach(child => {
        const childLi = document.createElement('li');
        const childDiv = document.createElement('div');
        const childHasChildren = child.children && child.children.length > 0;
        childDiv.className = childHasChildren ? 'folder' : 'file';
        childDiv.innerHTML = `<span class="icon">${childHasChildren ? '📁' : '📄'}</span><span>${child.name}</span>`;
        
        if (childHasChildren) {
          childDiv.onclick = (e) => {
            e.stopPropagation();
            const grandChildrenDiv = childLi.querySelector('.children');
            if (grandChildrenDiv) grandChildrenDiv.classList.toggle('show');
          };
          childLi.appendChild(childDiv);
          
          const grandChildrenDiv = document.createElement('div');
          grandChildrenDiv.className = 'children';
          const grandChildUl = document.createElement('ul');
          grandChildUl.className = 'tree-node';
          
          child.children.forEach(grandChild => {
            const grandChildLi = document.createElement('li');
            const grandChildDiv = document.createElement('div');
            grandChildDiv.className = 'file';
            grandChildDiv.innerHTML = `<span class="icon">📄</span><span>${grandChild.name}</span>`;
            grandChildLi.appendChild(grandChildDiv);
            grandChildUl.appendChild(grandChildLi);
          });
          
          grandChildrenDiv.appendChild(grandChildUl);
          childLi.appendChild(grandChildrenDiv);
        } else {
          childLi.appendChild(childDiv);
        }
        childUl.appendChild(childLi);
      });
      
      childrenDiv.appendChild(childUl);
      li.appendChild(childrenDiv);
    }
    ul.appendChild(li);
  });
  container.appendChild(ul);
}

function buildSimpleTree(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  const ul = document.createElement('ul');
  ul.className = 'tree-node';
  
  data.forEach(item => {
    const li = document.createElement('li');
    const div = document.createElement('div');
    const hasChildren = item.children && item.children.length > 0;
    div.className = hasChildren ? 'folder' : 'file';
    div.innerHTML = `<span class="icon">${hasChildren ? '📁' : '📄'}</span><span>${item.name}</span>`;
    
    if (hasChildren) {
      div.onclick = (e) => {
        e.stopPropagation();
        const childrenDiv = li.querySelector('.children');
        if (childrenDiv) childrenDiv.classList.toggle('show');
      };
      li.appendChild(div);
      
      const childrenDiv = document.createElement('div');
      childrenDiv.className = 'children';
      const childUl = document.createElement('ul');
      childUl.className = 'tree-node';
      
      item.children.forEach(child => {
        const childLi = document.createElement('li');
        const childDiv = document.createElement('div');
        childDiv.className = 'file';
        childDiv.innerHTML = `<span class="icon">📄</span><span>${child}</span>`;
        childLi.appendChild(childDiv);
        childUl.appendChild(childLi);
      });
      
      childrenDiv.appendChild(childUl);
      li.appendChild(childrenDiv);
    } else {
      li.appendChild(div);
    }
    ul.appendChild(li);
  });
  container.appendChild(ul);
}

function initKnowledgeTree() {
  buildCompleteTree('kg-tree-ch1-complete', completeKnowledgeDataCh1);
  buildSimpleTree('kg-tree-ch2', knowledgeDataCh2);
  buildSimpleTree('kg-tree-ch3', knowledgeDataCh3);
}

// ======================================
// 渲染资源列表
// ======================================
function renderPDFList(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  data.forEach((pdf, idx) => {
    const card = document.createElement('div');
    card.className = 'resource-card';
    card.innerHTML = `
      <div class="resource-icon">📕</div>
      <div class="resource-title">${pdf.name}.pdf</div>
      <div class="resource-desc">${pdf.desc}</div>
      <button class="btn btn-sm" onclick="openPdfModal('${pdf.file}', '${pdf.name}.pdf')">👁️ 预览PDF</button>
      <a href="${pdf.file}" class="btn btn-sm" download>⬇️ 下载PDF</a>
    `;
    container.appendChild(card);
  });
}

function renderCodeGuideList(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  data.forEach((guide, idx) => {
    const card = document.createElement('div');
    card.className = 'resource-card';
    card.innerHTML = `
      <div class="resource-icon">📘</div>
      <div class="resource-title">${guide.name}</div>
      <div class="resource-desc">${guide.desc}</div>
      <button class="btn btn-sm" onclick="openPdfModal('${guide.file}', '${guide.name}.pdf')">👁️ 预览代码指南</button>
      <a href="${guide.file}" class="btn btn-sm" download>⬇️ 下载代码指南</a>
    `;
    container.appendChild(card);
  });
}

function renderHomeworkSections(containerId, sections) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  
  sections.forEach((section, secIdx) => {
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'homework-section';
    
    const header = document.createElement('div');
    header.className = 'homework-section-header';
    header.innerHTML = `
      <span>📁 ${section.title}</span>
      <span class="toggle-icon">▼</span>
    `;
    header.onclick = () => {
      const content = sectionDiv.querySelector('.homework-section-content');
      const icon = header.querySelector('.toggle-icon');
      content.classList.toggle('collapsed');
      header.classList.toggle('collapsed');
    };
    sectionDiv.appendChild(header);
    
    const content = document.createElement('div');
    content.className = 'homework-section-content';
    
    section.items.forEach((item, itemIdx) => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'homework-item';
      itemDiv.innerHTML = `
        <div class="homework-item-title">${item.title}</div>
        <div class="homework-item-desc">${item.desc}</div>
        <button class="btn btn-sm" onclick="openPdfModal('${item.file}', '${item.title}.pdf')">👁️ 预览作业</button>
        <a href="${item.file}" class="btn btn-sm" download>⬇️ 下载作业</a>
      `;
      content.appendChild(itemDiv);
    });
    
    sectionDiv.appendChild(content);
    container.appendChild(sectionDiv);
  });
}

// ======================================
// 各章节数据初始化
// ======================================
function initChapter1Data() {
  const pptData = [
    { name: "1.0 体验探索", desc: "课程导入与核心目标", file: "第一章/1.0体验探索.pdf" },
    { name: "1.1 搭建数字画板", desc: "环境搭建与工具介绍", file: "第一章/1.1搭建数字画板.pdf" },
    { name: "1.2 开启可视化之旅", desc: "Python基础与折线图", file: "第一章/1.2开启可视化之旅.pdf" },
    { name: "1.3 完成数据名片", desc: "雷达图项目实践", file: "第一章/1.3完成数据名片.pdf" }
  ];
  renderPDFList('ppt-list-ch1', pptData);
  
  const codeGuideData = [
    { name: "1.1 折线图绘制指南", desc: "plt.plot()基础用法与代码示例", file: "第一章/1.1折线图绘制指南.pdf" },
    { name: "1.2 雷达图绘制指南", desc: "极坐标雷达图绘制步骤", file: "第一章/1.2雷达图绘制指南.pdf" },
    { name: "1.3 环境配置指南", desc: "Python与Matplotlib环境安装", file: "第一章/1.3环境配置指南.pdf" }
  ];
  renderCodeGuideList('code-list-ch1', codeGuideData);
  
  const homeworkSections = [
    {
      title: "1.1 搭建数字画板 练习题",
      items: [{ title: "1.1 搭建数字画板练习题", desc: "包含填空题、判断题、选择题与实践题", file: "第一章/1.1作业.pdf" }]
    },
    {
      title: "1.2 认识画笔和颜料 练习题",
      items: [{ title: "1.2 认识画笔和颜料练习题", desc: "包含填空题、判断题、选择题、简答题与实践题", file: "第一章/1.2作业.pdf" }]
    },
    {
      title: "1.3 完成数据名片 练习题",
      items: [{ title: "1.3 完成数据名片练习题", desc: "包含填空题、判断题、选择题、简答题与实践题", file: "第一章/1.3作业.pdf" }]
    }
  ];
  renderHomeworkSections('homework-container-ch1', homeworkSections);
}

function initChapter2Data() {
  const pptData = [
    { name: "2.1 柱状图与条形图", desc: "类别对比图表详解", file: "第二章/2.1柱状图与条形图.pdf" },
    { name: "2.2 折线图与直方图", desc: "趋势与分布图表详解", file: "第二章/2.2折线图与直方图.pdf" },
    { name: "2.3 饼图", desc: "结构占比图表详解", file: "第二章/2.3饼图.pdf" },
    { name: "2.4 箱线图与热力图", desc: "统计分析图表详解", file: "第二章/2.4箱线图与热力图.pdf" }
  ];
  renderPDFList('ppt-list-ch2', pptData);
  
  const codeGuideData = [
    { name: "2.1 柱状图代码指南", desc: "plt.bar() 函数详解与示例", file: "第二章/2.1柱状图代码指南.pdf" },
    { name: "2.1 条形图代码指南", desc: "plt.barh() 函数详解与示例", file: "第二章/2.1条形图代码指南.pdf" },
    { name: "2.2 折线图代码指南", desc: "plt.plot() 进阶用法", file: "第二章/2.2折线图代码指南.pdf" },
    { name: "2.2 直方图代码指南", desc: "plt.hist() 函数详解与示例", file: "第二章/2.2直方图代码指南.pdf" },
    { name: "2.3 饼图代码指南", desc: "plt.pie() 函数详解", file: "第二章/2.3饼图代码指南.pdf" },
    { name: "2.4 箱线图代码指南", desc: "plt.boxplot() 统计分析方法", file: "第二章/2.4箱线图代码指南.pdf" },
    { name: "2.4 热力图代码指南", desc: "sns.heatmap() 可视化方法", file: "第二章/2.4热力图代码指南.pdf" }
  ];
  renderCodeGuideList('code-list-ch2', codeGuideData);
  
  const homeworkSections = [
    {
      title: "第二章 练习题",
      items: [
        { title: "2.1 柱状图与条形图练习题", desc: "类别对比图表实践", file: "第二章/2.1作业.pdf" },
        { title: "2.2 折线图与直方图练习题", desc: "趋势与分布图表实践", file: "第二章/2.2作业.pdf" },
        { title: "2.3 饼图练习题", desc: "结构占比图表实践", file: "第二章/2.3作业.pdf" },
        { title: "2.4 箱线图与热力图练习题", desc: "统计分析图表实践", file: "第二章/2.4作业.pdf" }
      ]
    }
  ];
  renderHomeworkSections('homework-container-ch2', homeworkSections);
}

function initChapter3Data() {
  const pptData = [
    { name: "3.1 作业量调查", desc: "柱状图项目课件", file: "第三章/3.1作业量调查.pdf" },
    { name: "3.2 一周心情变化", desc: "折线图+箱线图项目课件", file: "第三章/3.2一周心情变化.pdf" },
    { name: "3.3 食堂排队时间", desc: "条形图+直方图项目课件", file: "第三章/3.3食堂排队时间.pdf" },
    { name: "3.4 班级成绩分布", desc: "直方图+箱线图项目课件", file: "第三章/3.4班级成绩分布.pdf" },
    { name: "3.5 我的校园一天", desc: "饼图+热力图项目课件", file: "第三章/3.5我的校园一天.pdf" }
  ];
  renderPDFList('ppt-list-ch3', pptData);
  
  const codeGuideData = [
    { name: "3.1 作业量调查代码指南", desc: "柱状图项目完整代码", file: "第三章/3.1作业量调查代码指南.pdf" },
    { name: "3.2 一周心情代码指南", desc: "折线图+箱线图分析代码", file: "第三章/3.2一周心情代码指南.pdf" },
    { name: "3.3 食堂排队代码指南", desc: "条形图+直方图分析代码", file: "第三章/3.3食堂排队代码指南.pdf" },
    { name: "3.4 成绩分布代码指南", desc: "直方图+箱线图分析代码", file: "第三章/3.4成绩分布代码指南.pdf" },
    { name: "3.5 校园一天代码指南", desc: "饼图+热力图分析代码", file: "第三章/3.5校园一天代码指南.pdf" }
  ];
  renderCodeGuideList('code-list-ch3', codeGuideData);
  
  const homeworkSections = [
    {
      title: "第三章 项目作业",
      items: [
        { title: "3.1 作业量调查", desc: "统计一周各科作业量并绘制柱状图", file: "第三章/3.1作业.pdf" },
        { title: "3.2 一周心情变化", desc: "记录心情指数并绘制折线图+箱线图", file: "第三章/3.2作业.pdf" },
        { title: "3.3 食堂窗口排队时间", desc: "测量排队时间并绘制条形图+直方图", file: "第三章/3.3作业.pdf" },
        { title: "3.4 班级成绩分布", desc: "分析成绩数据并绘制直方图+箱线图", file: "第三章/3.4作业.pdf" },
        { title: "3.5 我的校园一天", desc: "时间分配饼图 + 一周精力热力图", file: "第三章/3.5作业.pdf" }
      ]
    }
  ];
  renderHomeworkSections('homework-container-ch3', homeworkSections);
}

// ======================================
// 各章题库及答题逻辑
// ======================================
const allQuizzes = {
  ch1: [
    { question: "【1.1 填空1】本课程使用的核心绘图库是哪个？在代码中通常简写为：", options: ["A. NumPy (简写为 np)", "B. Pandas (简写为 pd)", "C. Matplotlib (简写为 plt)", "D. Seaborn (简写为 sns)"], answer: 2, explanation: "Matplotlib 是本课程的核心绘图库。代码中习惯简写为 plt。" },
    { question: "【1.1 填空2】解决 Matplotlib 中文显示乱码的代码中，方括号内应填写的参数是：plt.rcParams['______'] = ['SimHei']", options: ["A. font.family", "B. font.sans-serif", "C. font.serif", "D. font.size"], answer: 1, explanation: "解决中文显示乱码需要将默认的无衬线字体设置为中文字体黑体 'SimHei'。" },
    { question: "【1.1 填空3】关于 VS Code、Jupyter Notebook、Matplotlib 三者的关系，以下表述正确的是：", options: ["A. Matplotlib 是绘图核心库，Jupyter 是交互式编程工作台，VS Code 是整合开发环境", "B. Jupyter 是绘图核心库，VS Code 是交互式编程工作台，Matplotlib 是整合开发环境", "C. Matplotlib 是整合开发环境，Jupyter 是绘图核心库，VS Code 是交互式编程工作台", "D. VS Code 是绘图核心库，Matplotlib 是整合开发环境，Jupyter 是交互式编程工作台"], answer: 0, explanation: "Matplotlib 是底层的核心画图库；Jupyter 提供了交互式的单元格编写模式；VS Code 则是能够将所有环节管理集成的开发平台。" },
    { question: "【1.1 判断1】没有安装 Matplotlib 库，也能直接在 VS Code 中运行绘图代码。", options: ["A. 正确 (√)", "B. 错误 (×)"], answer: 1, explanation: "必须先通过终端运行安装指令安装库，否则代码运行时会报错。" },
    { question: "【1.1 判断2】Jupyter Notebook 支持“边写代码边看图表”的交互式体验。", options: ["A. 正确 (√)", "B. 错误 (×)"], answer: 0, explanation: "Jupyter 提供了即时的单元格代码执行及绘图反馈。" },
    { question: "【1.1 判断3】安装 VS Code 时必须勾选“添加到 PATH”，否则无法直接用终端命令启动。", options: ["A. 正确 (√)", "B. 错误 (×)"], answer: 0, explanation: "勾选此项会添加到环境变量，在终端输入 'code' 即可快捷拉起编辑器。" },
    { question: "【1.1 选择1】下列不属于数据可视化应用场景的是：", options: ["A. 用折线图展示每月消费变化", "B. 用表格罗全班同学的原始成绩", "C. 用饼图展示一天时间分配", "D. 用热力图呈现一周心情变化"], answer: 1, explanation: "用表格简单地罗列数字数据并未经过图形化映射，不属于数据可视化。" },
    { question: "【1.2 填空1】在 Python 中，存储单个数据的容器是______，存储一系列有序数据的容器是______。", options: ["A. 列表，变量", "B. 变量，元组", "C. 变量，列表", "D. 字典，列表"], answer: 2, explanation: "变量用来装载单个信息，列表能够按顺序批量打包多个对象。" },
    { question: "【1.2 填空2】绘制折线图的核心函数和添加图表标题的函数分别是：", options: ["A. plt.plot()，plt.xlabel()", "B. plt.plot()，plt.title()", "C. plt.show()，plt.title()", "D. plt.plot()，plt.show()"], answer: 1, explanation: "折线图的基础绘制函数是 plt.plot()。设置图表标题则要调用 plt.title()。" },
    { question: "【1.2 判断1】days = ['周一', '周二'] 和 scores = [3, 4] 两个列表长度不一致也能正常绘图。", options: ["A. 正确 (√)", "B. 错误 (×)"], answer: 1, explanation: "绘图时横纵轴的数据必须配对对应，长度不一致会报错。" },
    { question: "【1.2 判断2】折线图的横轴可以是无序的班级名称，比如“1 班、2 班、3 班”。", options: ["A. 正确 (√)", "B. 错误 (×)"], answer: 1, explanation: "折线图的横轴必须是有序的，班级名之间不具备时序逻辑。" },
    { question: "【1.2 判断3】不调用 plt.show()，绘制的图表也会自动弹出显示。", options: ["A. 正确 (√)", "B. 错误 (×)"], answer: 1, explanation: "必须显式调用 plt.show()，可视化窗口才会被拉起展示。" },
    { question: "【1.3 填空1】在描述综合性能的雷达图中，它的横轴和纵轴的映射逻辑分别对应的是什么？", options: ["A. 单个评价维度，分值", "B. 多个评价维度（多轴分布），分值", "C. 连续的时间，数值大小", "D. 任意分类，占比百分比"], answer: 1, explanation: "雷达图通过极坐标系多角度放射状建立起多个独立维度分轴。" },
    { question: "【1.3 填空2】在绘制极坐标雷达图时，为了能够使围成的多边形线条自动闭合，需要把第一个数据进行什么处理？", options: ["A. 从列表中删除", "B. 置空处理", "C. 追加（复制）到列表末尾", "D. 倒序排列"], answer: 2, explanation: "需要复制首个元素并追加在数据集末尾，使画线的终点能回到起点上闭合。" },
    { question: "【1.3 填空3】在第一章的个性化实践中，“数据名片”项目推荐可以选择哪两种风格进行设计？", options: ["A. 类别条形图 或 占比饼图", "B. 极坐标玫瑰图 或 直方图", "C. 兴趣雷达图 或 心情折线图", "D. 箱线图 或 散点图"], answer: 2, explanation: "两项案例分别是：展现多元兴趣倾向的雷达图，以及展现心情时序波动的折线图。" },
    { question: "【1.3 判断1】雷达图的维度越多越好，最好超过 10 个才能更全面地展示个人特征。", options: ["A. 正确 (√)", "B. 错误 (×)"], answer: 1, explanation: "雷达图不宜过多，一般建议 5-6 个属性维度。" },
    { question: "【1.3 判断2】折线图适合展示单维度的时序变化，比如一周心情指数。", options: ["A. 正确 (√)", "B. 错误 (×)"], answer: 0, explanation: "折线图的核心场景就是观察一个因变量随有序自变量的趋势变动。" },
    { question: "【1.3 判断3】绘制雷达图需要先安装 numpy 库，用来生成角度和闭合曲线。", options: ["A. 正确 (√)", "B. 错误 (×)"], answer: 0, explanation: "需要配合 NumPy 计算分布弧度和进行角度拼接。" },
    { question: "【1.3 选择1】如果要展示“音乐、运动、阅读、编程、美食”5个领域的喜好程度，最合适的图表是：", options: ["A. 柱状图", "B. 折线图", "C. 雷达图", "D. 饼图"], answer: 2, explanation: "多领域且无时序关系的五维性能对比，最佳表现图表首选雷达图。" }
  ],
  ch2: [
    { question: "【2.1 填空/选择】绘制垂直柱状图和水平条形图使用的函数分别是？", options: ["A. plt.bar() 和 plt.plot()", "B. plt.bar() 和 plt.barh()", "C. plt.barh() 和 plt.bar()", "D. plt.hist() 和 plt.bar()"], answer: 1, explanation: "垂直柱状图使用 plt.bar()，水平条形图使用 plt.barh()。" },
    { question: "【2.1 判断】当需要展示的类别名称很长时（如各个长名称的社团满意度），应该优先使用垂直柱状图。", options: ["A. 正确 (√)", "B. 错误 (×)"], answer: 1, explanation: "错误。类别名称很长时，使用垂直的柱状图会导致横轴文字重叠挤压，此时更适合使用水平条形图。" },
    { question: "【2.1 填空】为了让 Matplotlib 图表中的中文正常显示，需要设置参数 plt.rcParams['font.sans-serif'] = ______？", options: ["A. ['Arial']", "B. ['Times New Roman']", "C. ['Microsoft YaHei'] 或 ['SimHei']", "D. ['Consolas']"], answer: 2, explanation: "在不同系统中常用 'SimHei'（黑体）或 'Microsoft YaHei'（微软雅黑）来解决中文乱码问题。" },
    { question: "【2.2 填空/选择】折线图和直方图的主要用途分别是展示数据的？", options: ["A. 结构占比，变化趋势", "B. 变化趋势，分布情况", "C. 分布情况，类别对比", "D. 集中趋势，异常值"], answer: 1, explanation: "折线图用于看数据随时间或有序序列的变化趋势；直方图用于看连续数据在各个区间的分布情况。" },
    { question: "【2.2 判断】直方图的横轴表示的是连续的数值区间，且柱子之间通常是没有空隙的。", options: ["A. 正确 (√)", "B. 错误 (×)"], answer: 0, explanation: "正确。直方图展示连续数据的分布，横轴是切分好的数值区间（bins），所以相邻的区间柱子紧密相连无空隙。" },
    { question: "【2.3 填空/选择】饼图用于展示部分与整体的关系。若要在饼图中显示百分比，需要设置哪个参数？", options: ["A. explode", "B. labels", "C. autopct", "D. colors"], answer: 2, explanation: "autopct 参数用于格式化显示饼图中的百分比数值（如 '%1.1f%%'）。explode 用于突出某一部分。" },
    { question: "【2.3 判断】饼图非常适合展示 10 个以上不同类别的数据分布情况。", options: ["A. 正确 (√)", "B. 错误 (×)"], answer: 1, explanation: "错误。饼图类别过多（最好不超过6-8个）会导致扇形切片过碎，难以分辨，此时更适合用条形图或柱状图。" },
    { question: "【2.4 填空/选择】箱线图除了可以观察数据的集中趋势、中位数等，还可以非常快速直观地发现数据中的______？", options: ["A. 相关性", "B. 变化趋势", "C. 异常值", "D. 总体占比"], answer: 2, explanation: "箱线图非常擅长通过上下边缘及单独的数据点（圆圈）来直观暴露数据集中的异常值。" },
    { question: "【2.4 选择】绘制热力图需要二维数据，并且常使用颜色深浅来表示数值大小，通常需要导入哪个进阶绘图库？", options: ["A. NumPy", "B. Seaborn", "C. Pandas", "D. SciPy"], answer: 1, explanation: "本课程中通过导入 Seaborn 库（import seaborn as sns），并使用 sns.heatmap() 函数来轻松绘制热力图。" }
  ],
  ch3: [
    { question: "【3.1 课间活动调查】当我们统计了跳绳、聊天、看书等 5 种不同课间活动的参与人数，为了直观对比各项活动的人数多少，最适合的图表是？", options: ["A. 柱状图", "B. 折线图", "C. 箱线图", "D. 直方图"], answer: 0, explanation: "不同活动属于离散的类别，对比各类别的数量大小差异，最适合用柱状图（或条形图）。" },
    { question: "【3.2 阅读时长分析】如果要观察一周内每天课外阅读时长的起伏变化规律，我们应该选择的图表是？", options: ["A. 饼图", "B. 热力图", "C. 直方图", "D. 折线图"], answer: 3, explanation: "折线图非常适合用来展示数据随时间（如周一到周日）推移而发生的连续变化趋势。" },
    { question: "【3.3 食堂排队探究】在绘制排队时间直方图时，设置参数 bins=3 或 bins=9 会导致图表呈现不同的粗细形态。bins 参数的作用是？", options: ["A. 控制图表的颜色", "B. 控制直方图数据被分成的区间（箱子）数量", "C. 控制柱子之间的间距", "D. 设定坐标轴的最大值"], answer: 1, explanation: "bins 参数决定了把连续数据划分成多少个“段落”（如等待时间段），设置合理才能最清晰地反映数据真实的分布特征。" },
    { question: "【3.4 班级成绩分布】在观察生成的班级成绩箱线图时，发现上下边缘外出现了单独的圆圈点。这些点通常代表？", options: ["A. 班级平均分", "B. 数据收集错误", "C. 异常值（如极高或极低分）", "D. 及格线以上的成绩"], answer: 2, explanation: "箱线图中的圆圈表示超出正常范围（通常指超出1.5倍四分位距）的异常值或离群点。" },
    { question: "【3.5 我的校园一天】要绘制“专属学霸/摸鱼日历”热力图展示一周各科作业耗时，代码 sns.heatmap(data, cmap='YlGnBu') 中的 cmap 参数有什么作用？", options: ["A. 改变网格线样式", "B. 改变热力图的渐变颜色主题", "C. 调整图表大小", "D. 给图表添加标题"], answer: 1, explanation: "cmap 参数用于指定热力图的颜色映射表（Color Map），比如 'YlGnBu' 代表黄-绿-蓝渐变，颜色深浅直观反映数值的大小。" }
  ]
};

const quizState = {
  ch1: { index: 0, score: 0, answered: false },
  ch2: { index: 0, score: 0, answered: false },
  ch3: { index: 0, score: 0, answered: false }
};

function loadQuizQuestion(ch) {
  const state = quizState[ch];
  const questions = allQuizzes[ch];
  state.answered = false;

  const feedbackEl = document.getElementById(`quiz-feedback-${ch}`);
  const nextBtn = document.getElementById(`quiz-next-btn-${ch}`);
  if (feedbackEl) feedbackEl.style.display = 'none';
  if (nextBtn) nextBtn.style.display = 'none';

  // 测试结束
  if (state.index >= questions.length) {
    showQuizSummary(ch);
    return;
  }

  const currentQuestion = questions[state.index];
  const progressSpan = document.getElementById(`quiz-progress-${ch}`);
  if (progressSpan) progressSpan.textContent = `第 ${state.index + 1} / ${questions.length} 题`;
  
  const quizBody = document.getElementById(`quiz-body-${ch}`);
  if (quizBody) {
    quizBody.style.display = 'block';
    quizBody.innerHTML = `
      <div class="quiz-question" id="quiz-question-${ch}"></div>
      <div class="quiz-options" id="quiz-options-${ch}"></div>
    `;
    const qEl = document.getElementById(`quiz-question-${ch}`);
    if (qEl) qEl.textContent = currentQuestion.question;
    
    const optionsContainer = document.getElementById(`quiz-options-${ch}`);
    if (optionsContainer) {
      optionsContainer.innerHTML = '';
      currentQuestion.options.forEach((optionText, idx) => {
        const button = document.createElement('button');
        button.className = 'quiz-option';
        button.textContent = optionText;
        button.onclick = () => selectQuizOption(ch, idx);
        optionsContainer.appendChild(button);
      });
    }
  }
}

function selectQuizOption(ch, selectedIndex) {
  const state = quizState[ch];
  if (state.answered) return;
  state.answered = true;

  const questions = allQuizzes[ch];
  const currentQuestion = questions[state.index];
  
  const optionsContainer = document.getElementById(`quiz-options-${ch}`);
  const optionButtons = optionsContainer.querySelectorAll('.quiz-option');

  // 禁用所有按钮
  optionButtons.forEach(btn => btn.classList.add('disabled'));

  // 判定是否正确
  const isCorrect = selectedIndex === currentQuestion.answer;
  if (isCorrect) {
    state.score++;
    optionButtons[selectedIndex].classList.add('correct');
  } else {
    optionButtons[selectedIndex].classList.add('wrong');
    optionButtons[currentQuestion.answer].classList.add('correct');
  }

  // 显示反馈
  const statusEl = document.getElementById(`feedback-status-${ch}`);
  if (statusEl) {
    if (isCorrect) {
      statusEl.textContent = '✓ 回答正确！';
      statusEl.className = 'feedback-status status-correct';
    } else {
      statusEl.textContent = '✗ 回答错误。';
      statusEl.className = 'feedback-status status-wrong';
    }
  }

  const correctLetter = String.fromCharCode(65 + currentQuestion.answer);
  const correctAnswerSpan = document.getElementById(`correct-answer-text-${ch}`);
  if (correctAnswerSpan) correctAnswerSpan.textContent = correctLetter;
  
  const explanationSpan = document.getElementById(`feedback-explanation-${ch}`);
  if (explanationSpan) explanationSpan.textContent = currentQuestion.explanation;
  
  const feedbackEl = document.getElementById(`quiz-feedback-${ch}`);
  if (feedbackEl) feedbackEl.style.display = 'block';

  const nextBtn = document.getElementById(`quiz-next-btn-${ch}`);
  if (nextBtn) {
    if (state.index === questions.length - 1) {
      nextBtn.textContent = '查看成绩';
    } else {
      nextBtn.textContent = '下一题';
    }
    nextBtn.style.display = 'block';
  }
}

function handleNext(ch) {
  quizState[ch].index++;
  loadQuizQuestion(ch);
}

function showQuizSummary(ch) {
  const state = quizState[ch];
  const questions = allQuizzes[ch];
  
  const progressSpan = document.getElementById(`quiz-progress-${ch}`);
  if (progressSpan) progressSpan.textContent = '自测结束';
  
  const quizBody = document.getElementById(`quiz-body-${ch}`);
  const accuracy = Math.round((state.score / questions.length) * 100);
  
  let chapterName = ch === 'ch1' ? '第一章' : (ch === 'ch2' ? '第二章' : '第三章');
  
  if (quizBody) {
    quizBody.innerHTML = `
      <div class="quiz-summary">
        <h3>测试完成！</h3>
        <p style="margin: 10px 0;">${chapterName} 随堂自测成绩</p>
        <div class="quiz-summary-score">${state.score} / ${questions.length} 题</div>
        <p style="margin-bottom: 20px;">您的正确率为 <strong>${accuracy}%</strong></p>
        <button class="btn" onclick="restartQuiz('${ch}')">重新开始</button>
      </div>
    `;
  }
  
  const feedbackEl = document.getElementById(`quiz-feedback-${ch}`);
  if (feedbackEl) feedbackEl.style.display = 'none';
  const nextBtn = document.getElementById(`quiz-next-btn-${ch}`);
  if (nextBtn) nextBtn.style.display = 'none';
}

function restartQuiz(ch) {
  quizState[ch].index = 0;
  quizState[ch].score = 0;
  loadQuizQuestion(ch);
}

window.showPage = showPage;
window.toggleDarkMode = toggleDarkMode;
window.toggleMenu = toggleMenu;
window.doLogin = doLogin;
window.doRegister = doRegister;
window.showLogin = showLogin;
window.showRegister = showRegister;
window.doLogout = doLogout;
window.savePdfNotes = savePdfNotes;
window.loadPdfNotes = loadPdfNotes;
window.openPdfModal = openPdfModal;
window.closePdfModal = closePdfModal;
window.saveModalNotes = saveModalNotes;
window.selectQuizOption = selectQuizOption;
window.handleNext = handleNext;
window.restartQuiz = restartQuiz;

// ======================================
// DeepSeek AI 助手功能
// ======================================

let isChatOpen = false;
let conversationHistory = [];

// 切换聊天面板
function toggleChatPanel() {
  const panel = document.getElementById('aiChatPanel');
  isChatOpen = !isChatOpen;
  if (isChatOpen) {
    panel.classList.add('active');
    document.getElementById('aiChatInput').focus();
  } else {
    panel.classList.remove('active');
  }
}

// 添加示例问题
function insertExample(question) {
  document.getElementById('aiChatInput').value = question;
  document.getElementById('aiChatInput').focus();
}

// 清空对话
function clearChat() {
  const chatBody = document.getElementById('aiChatBody');
  chatBody.innerHTML = `
    <div class="message ai-message">
      <div class="message-avatar">🤖</div>
      <div class="message-content">
        <div class="message-text">你好！我是 DeepSeek AI 助手，专门帮助您学习 Python 数据可视化。</div>
        <div class="message-text">我可以：</div>
        <div class="message-text">1. 解答 Matplotlib 代码问题</div>
        <div class="message-text">2. 解释图表绘制原理</div>
        <div class="message-text">3. 调试错误代码</div>
        <div class="message-text">4. 提供学习建议</div>
        <div class="message-time">刚刚</div>
      </div>
    </div>
  `;
  conversationHistory = [];
  scrollToBottom();
}

// 发送消息
function sendMessage() {
  const input = document.getElementById('aiChatInput');
  const message = input.value.trim();
  
  if (!message) return;
  
  // 添加用户消息
  addUserMessage(message);
  input.value = '';
  
  // 显示AI正在输入
  showTypingIndicator();
  
  // 模拟AI回复（实际使用时替换为DeepSeek API调用）
  simulateAIResponse(message);
}

// 添加用户消息
function addUserMessage(text) {
  const chatBody = document.getElementById('aiChatBody');
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message user-message';
  messageDiv.innerHTML = `
    <div class="message-avatar">👤</div>
    <div class="message-content">
      <div class="message-text">${escapeHtml(text)}</div>
      <div class="message-time">${time}</div>
    </div>
  `;
  
  chatBody.appendChild(messageDiv);
  conversationHistory.push({ role: 'user', content: text });
  scrollToBottom();
}

// 添加AI消息
function addAIMessage(text) {
  removeTypingIndicator();
  
  const chatBody = document.getElementById('aiChatBody');
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // 处理代码块
  const processedText = formatCodeBlocks(text);
  
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message ai-message';
  messageDiv.innerHTML = `
    <div class="message-avatar">🤖</div>
    <div class="message-content">
      ${processedText}
      <div class="message-time">${time}</div>
    </div>
  `;
  
  chatBody.appendChild(messageDiv);
  conversationHistory.push({ role: 'assistant', content: text });
  scrollToBottom();
}

// 显示正在输入指示器
function showTypingIndicator() {
  const chatBody = document.getElementById('aiChatBody');
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message ai-message typing-indicator';
  typingDiv.id = 'typingIndicator';
  typingDiv.innerHTML = `
    <div class="message-avatar">🤖</div>
    <div class="message-content">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  
  chatBody.appendChild(typingDiv);
  scrollToBottom();
}

// 移除正在输入指示器
function removeTypingIndicator() {
  const typingIndicator = document.getElementById('typingIndicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

// 滚动到底部
function scrollToBottom() {
  const chatBody = document.getElementById('aiChatBody');
  chatBody.scrollTop = chatBody.scrollHeight;
}

// 转义HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 格式化代码块
function formatCodeBlocks(text) {
  // 检测代码块
  const codeBlockRegex = /```(.*?)```/gs;
  const pythonCodeRegex = /```python\s*\n([\s\S]*?)```/g;
  
  let formatted = text;
  
  // 处理Python代码块
  formatted = formatted.replace(pythonCodeRegex, (match, code) => {
    return `<div class="code-block">${escapeHtml(code.trim())}</div>`;
  });
  
  // 处理普通代码块
  formatted = formatted.replace(codeBlockRegex, (match, code) => {
    if (!code.toLowerCase().includes('python')) {
      return `<div class="code-block">${escapeHtml(code.trim())}</div>`;
    }
    return match;
  });
  
  // 处理提示框
  formatted = formatted.replace(/💡[^\n]*/g, match => {
    return `<div class="tip-box">${match}</div>`;
  });
  
  // 处理换行
  formatted = formatted.split('\n').map(line => {
    if (line.trim() && !line.includes('<div')) {
      return `<div class="message-text">${line}</div>`;
    }
    return line;
  }).join('');
  
  return formatted;
}

// 模拟AI回复（实际使用时替换为真实的DeepSeek API调用）
function simulateAIResponse(userMessage) {
  setTimeout(() => {
    const responses = {
      '你好': '你好！很高兴能帮助您学习Python数据可视化。有什么问题我可以帮您解答吗？',
      '如何绘制折线图': '绘制折线图的基本步骤如下：\n\n1. 导入库：`import matplotlib.pyplot as plt`\n2. 准备数据：`x = [1, 2, 3, 4, 5]`，`y = [2, 4, 6, 8, 10]`\n3. 绘制图形：`plt.plot(x, y)`\n4. 添加标签：`plt.xlabel("X轴")`，`plt.ylabel("Y轴")`\n5. 显示图形：`plt.show()`\n\n💡 记得解决中文乱码问题：`plt.rcParams[\'font.sans-serif\'] = [\'SimHei\']`',
      '中文乱码怎么解决': 'Matplotlib中文乱码的解决方法：\n\n```python\nimport matplotlib.pyplot as plt\n# Windows系统\nplt.rcParams[\'font.sans-serif\'] = [\'SimHei\']  # 黑体\n# Mac系统\n# plt.rcParams[\'font.sans-serif\'] = [\'Arial Unicode MS\']\nplt.rcParams[\'axes.unicode_minus\'] = False  # 解决负号显示问题\n```\n\n💡 确保系统中安装了相应的中文字体',
      '什么是雷达图': '雷达图（Radar Chart）是一种多维数据可视化图表，适用于展示多个维度的数据对比。\n\n特点：\n1. 中心向外辐射的轴线代表不同维度\n2. 每个轴线的长度表示该维度的数值\n3. 多边形的面积表示综合表现\n\n应用场景：\n• 个人技能评估\n• 产品特性比较\n• 多维性能分析',
      'plt.plot()代码怎么写': '`plt.plot()`的基本语法：\n\n```python\nimport matplotlib.pyplot as plt\n\n# 基础折线图\nplt.plot([1, 2, 3, 4], [1, 4, 9, 16])\n\n# 带样式的折线图\nplt.plot([1, 2, 3, 4], [1, 4, 9, 16], \n         color=\'blue\',     # 颜色\n         linewidth=2,      # 线宽\n         marker=\'o\',       # 标记点\n         linestyle=\'--\')   # 线型\n\nplt.title(\'示例折线图\')\nplt.show()\n```'
    };
    
    let response = responses[userMessage] || 
      `关于"${userMessage}"，我可以为您提供以下帮助：\n\n` +
      `1. 如果您需要具体的代码示例，可以告诉我您想要绘制的图表类型\n` +
      `2. 如果您遇到错误，可以把错误信息发给我\n` +
      `3. 如果您想了解某个概念，我会为您详细解释\n\n` +
      `💡 提示：您可以具体描述您的问题，我会更好地帮助您！`;
    
    addAIMessage(response);
  }, 1000 + Math.random() * 1000); // 模拟思考时间
}

// 监听回车键
document.addEventListener('DOMContentLoaded', function() {
  const chatInput = document.getElementById('aiChatInput');
  if (chatInput) {
    chatInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }
  
  // 初始化对话历史
  clearChat();
});