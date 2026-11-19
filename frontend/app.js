/* AgentQuest — frontend dApp (static, no build step)
 *
 * Cara pakai: buka index.html di browser dengan wallet (MetaMask dsb).
 * Setelah kontrak di-deploy, isi CONTRACT_ADDRESS dan DEPLOY_BLOCK di bawah.
 */

"use strict";

/* ================= CONFIG — FILL AFTER DEPLOY ================= */
const CONTRACT_ADDRESS = "0x7A17B5b00B7a40BCf4Dc6cB2d9A7b24CC4d82a45"; // AgentQuest, deployed 19 Nov 2026, block 134383651
const DEPLOY_BLOCK = 134383651; // leaderboard scans events from here
/* ================= END CONFIG ================= */

const AGENT_ID_ADDRESS = "0x60B9262456dE011F7d15a54CdD8c48bAaa8B022F";
const BSC_CHAIN_ID = 56;
const BSC_CHAIN_ID_HEX = "0x38";
const RPC_URL = "https://bsc-dataseed.bnbchain.org";
const BSCSCAN_TX = "https://bscscan.com/tx/";
const BSCSCAN_ADDR = "https://bscscan.com/address/";
const CONTRACT_DEPLOYED =
  CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000";

/* Metadata quest (nama + deskripsi) — kontrak hanya menyimpan
 * target/minBalance/xpReward, jadi copy tampilannya dari sini.
 * Quest ini ditambahkan on-chain setelah deploy (addQuest, owner only). */
const QUEST_META = {
  3: {
    name: "Pemegang AGC",
    description:
      "Pegang minimal 1.000 AGC di wallet kamu untuk menyelesaikan quest ini.",
    target: "0x63dea5acdbe1f27c968907d08610a5f0a0284ba6",
  },
  4: {
    name: "Pemegang USDT",
    description:
      "Pegang minimal 0,01 USDT di wallet kamu untuk menyelesaikan quest ini.",
    target: "0x55d398326f99059fF775485246999027B3197955",
  },
};

/* ================= i18n (EN default, ZH, ID) =================
 * Brand/contract terms stay untranslated: AgentQuest, AQ, XP, BSC,
 * Agent ID, contract addresses, AGC / USDT.
 * Static text is bound in index.html via data-i18n / data-i18n-html;
 * every dynamic string below goes through t(). */
const I18N = {
  en: {
    title: "AgentQuest — Quest hub for Agent ID holders",
    metaDescription:
      "AgentQuest: daily check-ins and on-chain quests for Agent ID holders. No token, no fees besides gas.",
    skipIntro: "Skip intro →",
    introCardTag: "AGC HOLDER",
    introCardSub: "ON-CHAIN QUEST · BSC",
    introTagline: 'Check in. Complete quests. <span class="txt-purple">Earn XP.</span>',
    navHow: "How to Play",
    navQuest: "Quests",
    navLeaderboard: "Leaderboard",
    navContract: "Contract ↗",
    connectWallet: "Connect Wallet",
    connected: "Connected",
    wrongNetwork: "Wrong network — switch to BSC Mainnet",
    announce: "✓ CONTRACT VERIFIED · Sourcify exact match · BSC Mainnet · No token, gas only",
    deployNote: "AgentQuest is coming soon — the contract is being prepared.",
    heroEyebrow: "● QUEST HUB FOR AGENT ID",
    heroH1: 'check in.<br />complete <span class="txt-purple">quests.</span><br />level <span class="txt-green">up.</span>',
    heroSubtitle:
      "Daily check-ins, complete quests, earn XP — all recorded on-chain. For Agent ID holders only.",
    heroCtaQuest: "Start Questing ↓",
    heroCtaLb: "View Leaderboard →",
    heroMeta: "AGENTQUEST · CHECK-IN +10 XP / QUEST +50 XP · BSC MAINNET",
    tiltBackTag: "USDT HOLDER",
    tiltBackSub: "RARE · ON-CHAIN",
    tiltFrontTag: "AGC HOLDER",
    tiltFrontSub: "ACTIVE QUEST · BSC",
    sticker: "NO TOKEN.<br />GAS ONLY.",
    heroCaption: "QUEST PREVIEW — COMPLETE FOR +50 XP",
    marquee:
      "✳ DAILY CHECK-IN ✳ ON-CHAIN QUESTS ✳ EARN XP ✳ LEVEL UP ✳ LEADERBOARD ✳ AGENT ID ✳ BSC MAINNET ✳&nbsp;",
    howEyebrow: "HOW TO PLAY",
    howH2: 'Simple. <span class="txt-yellow">Three steps.</span>',
    how1Title: "Connect Wallet",
    how1Text: "Connect your BSC wallet. Every action requires an active Agent ID.",
    how2Title: "Daily Check-in",
    how2Text: "Once a day (UTC time), get +10 XP and keep your streak alive.",
    how3Title: "Complete Quests",
    how3Text: "Prove you hold a minimum token balance — each quest is +50 XP, one time only.",
    agentTitle: "Agent ID Status",
    agentStatusConnect: "Connect your wallet to check your Agent ID.",
    agentStatusOk: "Agent ID active — you can check in and complete quests.",
    agentStatusNoId:
      "You don't have an Agent ID yet — claim it in the Binance app (Wallet > Agent ID banner).",
    agentStatusFail: "Couldn't check your Agent ID. Try reloading the page.",
    statsTitle: "Your Stats",
    statLevel: "Level",
    statStreak: "Streak",
    statCheckins: "Total Check-ins",
    checkinTitle: "Daily Check-in",
    checkinDesc: "Check in once a day (UTC time) to earn +10 XP and keep your streak alive.",
    checkinBtn: "Check in today (+10 XP)",
    checkinDoneBtn: "Already checked in today",
    checkinSending: "Sending…",
    checkinNeedId: "You need an active Agent ID to check in.",
    checkinNext: "Next check-in available tomorrow (UTC time).",
    questTitle: "Quests",
    questDesc:
      "Prove you hold a minimum token balance to earn XP. Each quest can only be completed once.",
    questLoading: "Loading quests…",
    questLoadFail: "Couldn't load quests. Try reloading the page.",
    questEmpty: "No quests yet — coming soon.",
    questTarget: "Target contract: ",
    questSoon: "Coming soon",
    questConnectFirst: "Connect wallet first",
    questNeedId: "Requires Agent ID",
    questInactive: "Quest inactive",
    questDone: "Done",
    questComplete: "Complete (+{xp} XP)",
    questNotEligible: "You don't meet this quest's requirements yet.",
    questFallbackName: "Quest #",
    questFallbackDesc: "Complete this quest to earn XP.",
    questCompleteSuccess: "Quest complete! Your XP went up.",
    checkinSuccess: "Check-in successful! +10 XP.",
    lbTitle: "Leaderboard",
    lbDesc: "Top 10 XP holders, ranked by on-chain activity.",
    lbEmpty: "No activity yet — be the first!",
    lbLoadFail: "Couldn't load the leaderboard. Try again in a bit.",
    lbLevel: "Level ",
    txSent: "Transaction sent, waiting for confirmation: ",
    txDone: "Success! Transaction: ",
    streakDay: " day",
    streakDays: " days",
    errGeneric: "Something went wrong. Try again.",
    errRejected: "Transaction cancelled.",
    errAlready:
      "Transaction failed — you may have already checked in today or completed this quest.",
    errNetwork: "Couldn't connect to the network. Try again in a bit.",
    errTxFail: "Transaction failed: ",
    errTxFailShort: "Transaction failed. Try again in a bit.",
    errNoWallet: "Install MetaMask or open this page in a wallet browser.",
    errNoAccount: "No wallet account connected.",
    errAddChain: "Couldn't add BSC Mainnet to your wallet. Try switching networks manually.",
    errSwitchChain: "Switch to BSC Mainnet first to use AgentQuest.",
    errWrongChainNotice: "You're connected to the wrong network. Switch to BSC Mainnet.",
    errLib: "Couldn't load the wallet library. Check your internet connection, then reload the page.",
    errStats: "Couldn't load your stats. Try reloading the page.",
    errContractSoon: "AgentQuest is coming soon — the contract is being prepared.",
    footerTagline: "Quest hub for Agent ID holders. No token, gas only.",
    footerBsc: "Contract on BscScan ↗",
    footerSourcify: "Verified source (Sourcify) ↗",
    footerBuilt: "Built for the Agent ID Hackathon · BSC Mainnet · ©2026 AgentQuest",
  },
  zh: {
    title: "AgentQuest — Agent ID 持有者任务中心",
    metaDescription:
      "AgentQuest：面向 Agent ID 持有者的每日签到与链上任务。无代币，除 gas 外无任何费用。",
    skipIntro: "跳过介绍 →",
    introCardTag: "AGC 持有者",
    introCardSub: "链上任务 · BSC",
    introTagline: '签到。完成任务。<span class="txt-purple">赚取 XP。</span>',
    navHow: "玩法",
    navQuest: "任务",
    navLeaderboard: "排行榜",
    navContract: "合约 ↗",
    connectWallet: "连接钱包",
    connected: "已连接",
    wrongNetwork: "网络错误 — 请切换到 BSC 主网",
    announce: "✓ 合约已验证 · Sourcify 完全匹配 · BSC 主网 · 无代币，仅需 gas",
    deployNote: "AgentQuest 即将上线 — 合约准备中。",
    heroEyebrow: "● AGENT ID 专属任务中心",
    heroH1: '每日签到。<br />完成<span class="txt-purple">任务。</span><br />提升<span class="txt-green">等级。</span>',
    heroSubtitle: "每日签到、完成任务、赚取 XP —— 全部记录在链上。仅限 Agent ID 持有者。",
    heroCtaQuest: "开始任务 ↓",
    heroCtaLb: "查看排行榜 →",
    heroMeta: "AGENTQUEST · 签到 +10 XP / 任务 +50 XP · BSC 主网",
    tiltBackTag: "USDT 持有者",
    tiltBackSub: "稀有 · 链上",
    tiltFrontTag: "AGC 持有者",
    tiltFrontSub: "进行中的任务 · BSC",
    sticker: "没有代币。<br />只需 GAS。",
    heroCaption: "任务预览 — 完成可得 +50 XP",
    marquee: "✳ 每日签到 ✳ 链上任务 ✳ 赚取 XP ✳ 提升等级 ✳ 排行榜 ✳ AGENT ID ✳ BSC 主网 ✳&nbsp;",
    howEyebrow: "玩法",
    howH2: '很简单，<span class="txt-yellow">只需三步。</span>',
    how1Title: "连接钱包",
    how1Text: "连接你的 BSC 钱包。所有操作都需要激活的 Agent ID。",
    how2Title: "每日签到",
    how2Text: "每天一次（UTC 时间），获得 +10 XP 并保持连续签到。",
    how3Title: "完成任务",
    how3Text: "证明你持有最低代币余额 —— 每个任务 +50 XP，仅可完成一次。",
    agentTitle: "Agent ID 状态",
    agentStatusConnect: "连接钱包以查看你的 Agent ID。",
    agentStatusOk: "Agent ID 已激活 —— 你可以签到和完成任务。",
    agentStatusNoId: "你还没有 Agent ID —— 请在币安 App 内领取（钱包 > Agent ID 横幅）。",
    agentStatusFail: "无法检查 Agent ID，请刷新页面重试。",
    statsTitle: "我的数据",
    statLevel: "等级",
    statStreak: "连续签到",
    statCheckins: "累计签到",
    checkinTitle: "每日签到",
    checkinDesc: "每天签到一次（UTC 时间），获得 +10 XP 并保持连续签到。",
    checkinBtn: "今日签到 (+10 XP)",
    checkinDoneBtn: "今日已签到",
    checkinSending: "发送中…",
    checkinNeedId: "签到需要激活的 Agent ID。",
    checkinNext: "下次签到在明天（UTC 时间）。",
    questTitle: "任务",
    questDesc: "证明你持有最低代币余额即可获得 XP。每个任务只能完成一次。",
    questLoading: "正在加载任务…",
    questLoadFail: "无法加载任务，请刷新页面重试。",
    questEmpty: "暂无任务 — 敬请期待。",
    questTarget: "目标合约：",
    questSoon: "敬请期待",
    questConnectFirst: "请先连接钱包",
    questNeedId: "需要 Agent ID",
    questInactive: "任务未激活",
    questDone: "已完成",
    questComplete: "完成 (+{xp} XP)",
    questNotEligible: "你还不满足该任务的要求。",
    questFallbackName: "任务 #",
    questFallbackDesc: "完成该任务以获得 XP。",
    questCompleteSuccess: "任务完成！你的 XP 增加了。",
    checkinSuccess: "签到成功！+10 XP。",
    lbTitle: "排行榜",
    lbDesc: "XP 最高的 10 名持有者，按链上活动排名。",
    lbEmpty: "暂无活动 — 成为第一个吧！",
    lbLoadFail: "无法加载排行榜，请稍后再试。",
    lbLevel: "等级 ",
    txSent: "交易已发送，等待确认：",
    txDone: "成功！交易：",
    streakDay: " 天",
    streakDays: " 天",
    errGeneric: "出错了，请重试。",
    errRejected: "交易已取消。",
    errAlready: "交易失败 —— 你可能今天已签到或已完成该任务。",
    errNetwork: "无法连接到网络，请稍后再试。",
    errTxFail: "交易失败：",
    errTxFailShort: "交易失败，请稍后再试。",
    errNoWallet: "请安装 MetaMask，或在钱包浏览器中打开本页。",
    errNoAccount: "没有连接的钱包账户。",
    errAddChain: "无法将 BSC 主网添加到你的钱包，请手动切换网络。",
    errSwitchChain: "请先切换到 BSC 主网再使用 AgentQuest。",
    errWrongChainNotice: "你连接到了错误的网络，请切换到 BSC 主网。",
    errLib: "无法加载钱包库，请检查网络连接后刷新页面。",
    errStats: "无法加载数据，请刷新页面重试。",
    errContractSoon: "AgentQuest 即将上线 — 合约准备中。",
    footerTagline: "Agent ID 持有者的任务中心。无代币，仅需 gas。",
    footerBsc: "在 BscScan 上查看合约 ↗",
    footerSourcify: "已验证源码 (Sourcify) ↗",
    footerBuilt: "为 Agent ID 黑客松打造 · BSC 主网 · ©2026 AgentQuest",
  },
  id: {
    title: "AgentQuest — Quest hub untuk pemegang Agent ID",
    metaDescription:
      "AgentQuest: check-in harian dan quest on-chain untuk pemegang Agent ID. Tanpa token, tanpa biaya selain gas.",
    skipIntro: "Skip intro →",
    introCardTag: "PEMEGANG AGC",
    introCardSub: "QUEST ON-CHAIN · BSC",
    introTagline: 'Check in. Selesaikan quest. <span class="txt-purple">Dapatkan XP.</span>',
    navHow: "Cara Main",
    navQuest: "Quest",
    navLeaderboard: "Leaderboard",
    navContract: "Kontrak ↗",
    connectWallet: "Hubungkan Wallet",
    connected: "Terhubung",
    wrongNetwork: "Jaringan salah — pindah ke BSC Mainnet",
    announce: "✓ KONTRAK TERVERIFIKASI · Sourcify exact match · BSC Mainnet · Tanpa token, tanpa biaya selain gas",
    deployNote: "AgentQuest segera hadir — kontrak sedang disiapkan.",
    heroEyebrow: "● QUEST HUB UNTUK AGENT ID",
    heroH1: 'check in.<br />selesaikan <span class="txt-purple">quest.</span><br />naik <span class="txt-green">level.</span>',
    heroSubtitle:
      "Check-in harian, selesaikan quest, kumpulkan XP — semuanya tercatat on-chain. Hanya untuk pemegang Agent ID.",
    heroCtaQuest: "Mulai Quest ↓",
    heroCtaLb: "Lihat Leaderboard →",
    heroMeta: "AGENTQUEST · CHECK-IN +10 XP / QUEST +50 XP · BSC MAINNET",
    tiltBackTag: "PEMEGANG USDT",
    tiltBackSub: "RARE · ON-CHAIN",
    tiltFrontTag: "PEMEGANG AGC",
    tiltFrontSub: "QUEST AKTIF · BSC",
    sticker: "TANPA TOKEN.<br />HANYA GAS.",
    heroCaption: "QUEST PREVIEW — SELESAIKAN UNTUK +50 XP",
    marquee:
      "✳ CHECK-IN HARIAN ✳ QUEST ON-CHAIN ✳ KUMPULKAN XP ✳ NAIK LEVEL ✳ LEADERBOARD ✳ AGENT ID ✳ BSC MAINNET ✳&nbsp;",
    howEyebrow: "CARA MAIN",
    howH2: 'Simpel. <span class="txt-yellow">Tiga langkah.</span>',
    how1Title: "Hubungkan Wallet",
    how1Text: "Connect wallet BSC kamu. Semua aksi butuh Agent ID aktif.",
    how2Title: "Check-in Harian",
    how2Text: "Sekali sehari (waktu UTC), dapat +10 XP dan jaga streak kamu.",
    how3Title: "Selesaikan Quest",
    how3Text: "Buktikan kamu pegang saldo token minimum — tiap quest +50 XP, sekali saja.",
    agentTitle: "Status Agent ID",
    agentStatusConnect: "Hubungkan wallet untuk memeriksa Agent ID kamu.",
    agentStatusOk: "Agent ID aktif — kamu bisa check-in dan menyelesaikan quest.",
    agentStatusNoId:
      "Kamu belum punya Agent ID — klaim di aplikasi Binance (Wallet > banner Agent ID).",
    agentStatusFail: "Gagal memeriksa Agent ID. Coba muat ulang halaman.",
    statsTitle: "Statistik Kamu",
    statLevel: "Level",
    statStreak: "Streak",
    statCheckins: "Total Check-in",
    checkinTitle: "Check-in Harian",
    checkinDesc: "Check-in sekali sehari (waktu UTC) untuk mendapatkan +10 XP dan menjaga streak kamu.",
    checkinBtn: "Check-in hari ini (+10 XP)",
    checkinDoneBtn: "Sudah check-in hari ini",
    checkinSending: "Mengirim…",
    checkinNeedId: "Butuh Agent ID aktif untuk check-in.",
    checkinNext: "Check-in berikutnya tersedia besok (waktu UTC).",
    questTitle: "Quest",
    questDesc:
      "Buktikan kamu memegang saldo token minimum untuk mendapatkan XP. Satu quest hanya bisa diselesaikan sekali.",
    questLoading: "Memuat quest…",
    questLoadFail: "Gagal memuat quest. Coba muat ulang halaman.",
    questEmpty: "Belum ada quest — segera hadir.",
    questTarget: "Kontrak target: ",
    questSoon: "Segera hadir",
    questConnectFirst: "Hubungkan wallet dulu",
    questNeedId: "Butuh Agent ID",
    questInactive: "Quest tidak aktif",
    questDone: "Selesai",
    questComplete: "Selesaikan (+{xp} XP)",
    questNotEligible: "Kamu belum memenuhi syarat quest ini.",
    questFallbackName: "Quest #",
    questFallbackDesc: "Selesaikan quest ini untuk mendapatkan XP.",
    questCompleteSuccess: "Quest selesai! XP kamu bertambah.",
    checkinSuccess: "Check-in berhasil! +10 XP.",
    lbTitle: "Leaderboard",
    lbDesc: "Top 10 pemegang XP tertinggi, dihitung dari aktivitas on-chain.",
    lbEmpty: "Belum ada aktivitas — jadilah yang pertama!",
    lbLoadFail: "Gagal memuat leaderboard. Coba lagi sebentar lagi.",
    lbLevel: "Level ",
    txSent: "Transaksi terkirim, menunggu konfirmasi: ",
    txDone: "Berhasil! Transaksi: ",
    streakDay: " hari",
    streakDays: " hari",
    errGeneric: "Terjadi kesalahan. Coba lagi.",
    errRejected: "Transaksi dibatalkan.",
    errAlready: "Transaksi gagal — kemungkinan kamu sudah check-in hari ini atau quest sudah selesai.",
    errNetwork: "Gagal terhubung ke jaringan. Coba lagi sebentar lagi.",
    errTxFail: "Transaksi gagal: ",
    errTxFailShort: "Transaksi gagal. Coba lagi sebentar lagi.",
    errNoWallet: "Install MetaMask atau buka di browser dengan wallet.",
    errNoAccount: "Tidak ada akun wallet yang terhubung.",
    errAddChain: "Gagal menambahkan jaringan BSC Mainnet ke wallet kamu. Coba pindah jaringan secara manual.",
    errSwitchChain: "Pindah ke jaringan BSC Mainnet dulu untuk memakai AgentQuest.",
    errWrongChainNotice: "Kamu terhubung ke jaringan yang salah. Pindah ke BSC Mainnet.",
    errLib: "Gagal memuat library wallet. Periksa koneksi internet kamu lalu muat ulang halaman.",
    errStats: "Gagal memuat statistik. Coba muat ulang halaman.",
    errContractSoon: "AgentQuest segera hadir — kontrak sedang disiapkan.",
    footerTagline: "Quest hub untuk pemegang Agent ID. Tanpa token, tanpa biaya selain gas.",
    footerBsc: "Kontrak di BscScan ↗",
    footerSourcify: "Source terverifikasi (Sourcify) ↗",
    footerBuilt: "Dibangun untuk Agent ID Hackathon · BSC Mainnet · ©2026 AgentQuest",
  },
};

/* Nama + deskripsi quest per bahasa (kontrak hanya menyimpan target/min/xp). */
const QUEST_META_I18N = {
  en: {
    3: {
      name: "AGC Holder",
      description: "Hold at least 1,000 AGC in your wallet to complete this quest.",
    },
    4: {
      name: "USDT Holder",
      description: "Hold at least 0.01 USDT in your wallet to complete this quest.",
    },
  },
  zh: {
    3: {
      name: "AGC 持有者",
      description: "在你的钱包中至少持有 1,000 AGC 即可完成该任务。",
    },
    4: {
      name: "USDT 持有者",
      description: "在你的钱包中至少持有 0.01 USDT 即可完成该任务。",
    },
  },
  id: {
    3: {
      name: "Pemegang AGC",
      description: "Pegang minimal 1.000 AGC di wallet kamu untuk menyelesaikan quest ini.",
    },
    4: {
      name: "Pemegang USDT",
      description: "Pegang minimal 0,01 USDT di wallet kamu untuk menyelesaikan quest ini.",
    },
  },
};

const LANG_KEY = "aq-lang";
let currentLang = "en";

function t(key) {
  const dict = I18N[currentLang] || I18N.en;
  if (dict[key] !== undefined) return dict[key];
  return I18N.en[key] !== undefined ? I18N.en[key] : key;
}

function getQuestMeta(id, fallbackTarget) {
  const dict = QUEST_META_I18N[currentLang] || QUEST_META_I18N.en;
  const meta = dict[id] || QUEST_META_I18N.id[id];
  const base = QUEST_META[id];
  if (meta) {
    return {
      name: meta.name,
      description: meta.description,
      target: (base && base.target) || fallbackTarget,
    };
  }
  return {
    name: t("questFallbackName") + (id + 1),
    description: t("questFallbackDesc"),
    target: fallbackTarget,
  };
}

/* Terapkan bahasa ke seluruh halaman: teks statis, <html lang>, <title>,
 * meta description, lalu render ulang semua teks dinamis. */
function setLang(lang) {
  if (!I18N[lang]) lang = "en";
  currentLang = lang;
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch (e) {
    /* localStorage tidak tersedia (mis. mode privat) — bahasa tetap dipakai sesi ini. */
  }
  document.documentElement.lang = lang;
  document.title = t("title");
  const md = document.querySelector('meta[name="description"]');
  if (md) md.setAttribute("content", t("metaDescription"));
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  document.querySelectorAll(".lang-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.lang === lang);
  });
  // Label tombol connect + status Agent ID mengikuti bahasa.
  if (userAddress) {
    $("connectBtn").textContent = t("connected");
  } else {
    $("connectBtn").textContent = t("connectWallet");
    const el = $("agentStatusText");
    el.textContent = t("agentStatusConnect");
    el.className = "agent-status";
    // Tombol check-in belum punya state on-chain — label mengikuti bahasa.
    $("checkinBtn").textContent = t("checkinBtn");
    $("checkinNote").textContent = "";
  }
  // Render ulang semua konten dinamis (quest, leaderboard, statistik).
  renderQuests();
  loadLeaderboard();
  if (contract && userAddress) {
    refreshStats();
    refreshAgentStatus();
  }
}

function storedLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && I18N[saved]) return saved;
  } catch (e) {
    /* abaikan */
  }
  return "en";
}

/* ABI lengkap AgentQuest (disalin dari contracts/AgentQuest.abi.json).
 * Fungsi owner-only (addQuest, setQuestActive, transferOwnership)
 * sengaja TIDAK dipanggil dari UI mana pun. */
const AGENT_QUEST_ABI = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: true, internalType: "uint256", name: "day", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "streak", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "totalXp", type: "uint256" },
    ],
    name: "CheckIn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "previousOwner", type: "address" },
      { indexed: true, internalType: "address", name: "newOwner", type: "address" },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "questId", type: "uint256" },
      { indexed: true, internalType: "address", name: "target", type: "address" },
      { indexed: false, internalType: "uint256", name: "minBalance", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "xpReward", type: "uint256" },
    ],
    name: "QuestAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: true, internalType: "uint256", name: "questId", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "xpReward", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "totalXp", type: "uint256" },
    ],
    name: "QuestCompleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "questId", type: "uint256" },
      { indexed: false, internalType: "bool", name: "active", type: "bool" },
    ],
    name: "QuestStatusChanged",
    type: "event",
  },
  {
    inputs: [],
    name: "AGENT_ID",
    outputs: [{ internalType: "contract IBalanceOf", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "CHECKIN_XP",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "SECONDS_PER_DAY",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "target", type: "address" },
      { internalType: "uint256", name: "minBalance", type: "uint256" },
      { internalType: "uint256", name: "xpReward", type: "uint256" },
    ],
    name: "addQuest",
    outputs: [{ internalType: "uint256", name: "questId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  { inputs: [], name: "checkIn", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [{ internalType: "uint256", name: "questId", type: "uint256" }],
    name: "completeQuest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "lastCheckInDay",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_xp", type: "uint256" }],
    name: "levelOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "questCompleted",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "questCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "quests",
    outputs: [
      { internalType: "address", name: "target", type: "address" },
      { internalType: "uint256", name: "minBalance", type: "uint256" },
      { internalType: "uint256", name: "xpReward", type: "uint256" },
      { internalType: "bool", name: "active", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "questId", type: "uint256" },
      { internalType: "bool", name: "active", type: "bool" },
    ],
    name: "setQuestActive",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "streak",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "totalCheckIns",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "xp",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

/* ABI minimal untuk cek kepemilikan (Agent ID + NFT target quest). */
const BALANCE_OF_ABI = ["function balanceOf(address) returns (uint256)"];

/* ---------- State ---------- */
let browserProvider = null;
let signer = null;
let userAddress = null;
let contract = null; // AgentQuest via signer
let readContract = null; // AgentQuest via public RPC (read-only)
let readProvider = null;
let hasAgentId = false;
let isCorrectChain = false;

/* ---------- Helpers ---------- */
function $(id) {
  return document.getElementById(id);
}

function shortAddress(addr) {
  if (!addr) return "";
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

function utcDayNumber() {
  return Math.floor(Date.now() / 86400000);
}

function showNotice(msg, type) {
  const el = $("notice");
  el.textContent = msg;
  el.className = "notice" + (type ? " " + type : "");
  el.classList.remove("hidden");
}

function hideNotice() {
  const el = $("notice");
  el.classList.add("hidden");
  el.textContent = "";
}

function showTx(hash, done) {
  const el = $("txStatus");
  el.classList.remove("hidden");
  el.innerHTML =
    (done ? t("txDone") : t("txSent")) +
    '<a href="' +
    BSCSCAN_TX +
    hash +
    '" target="_blank" rel="noopener">' +
    hash +
    "</a>";
}

function hideTx() {
  const el = $("txStatus");
  el.classList.add("hidden");
  el.innerHTML = "";
}

/* Pesan error yang ramah — jangan pernah tampilkan stack trace mentah. */
function friendlyError(err) {
  if (!err) return t("errGeneric");
  const code = err.code;
  if (code === 4001 || code === "ACTION_REJECTED") return t("errRejected");
  if (code === -32603 || (err.message && /already/i.test(err.message))) {
    return t("errAlready");
  }
  if (err.message && /network|fetch|timeout|ETIMEDOUT|ECONN/i.test(err.message)) {
    return t("errNetwork");
  }
  if (err.reason) return t("errTxFail") + String(err.reason);
  if (err.message && err.message.length < 160) return t("errTxFail") + err.message;
  return t("errTxFailShort");
}

function setActionsEnabled(enabled) {
  $("checkinBtn").disabled = !enabled;
  document.querySelectorAll("#questList .quest-btn").forEach((b) => {
    if (!enabled) b.disabled = true;
  });
}

/* ---------- Read-only setup (tanpa wallet) ---------- */
function setupReadProvider() {
  if (!CONTRACT_DEPLOYED) return;
  try {
    readProvider = new ethers.JsonRpcProvider(RPC_URL);
    readContract = new ethers.Contract(CONTRACT_ADDRESS, AGENT_QUEST_ABI, readProvider);
  } catch (err) {
    console.error("Read provider gagal:", err);
  }
}

/* ---------- Wallet ---------- */
async function ensureBscChain() {
  const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
  if (parseInt(chainIdHex, 16) === BSC_CHAIN_ID) return true;
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: BSC_CHAIN_ID_HEX }],
    });
    return true;
  } catch (switchErr) {
    if (switchErr && switchErr.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: BSC_CHAIN_ID_HEX,
              chainName: "BSC Mainnet",
              nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
              rpcUrls: [RPC_URL],
              blockExplorerUrls: ["https://bscscan.com"],
            },
          ],
        });
        return true;
      } catch (addErr) {
        showNotice(t("errAddChain"), "error");
        return false;
      }
    }
    showNotice(t("errSwitchChain"), "error");
    return false;
  }
}

async function connectWallet() {
  if (!window.ethereum) {
    showNotice(t("errNoWallet"), "error");
    return;
  }
  hideNotice();
  hideTx();
  try {
    const okChain = await ensureBscChain();
    if (!okChain) return;
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    if (!accounts || accounts.length === 0) {
      showNotice(t("errNoAccount"), "error");
      return;
    }
    await initUser(accounts[0]);
  } catch (err) {
    showNotice(friendlyError(err), "error");
  }
}

async function initUser(address) {
  userAddress = address;
  browserProvider = new ethers.BrowserProvider(window.ethereum);
  signer = await browserProvider.getSigner();
  const network = await browserProvider.getNetwork();
  isCorrectChain = Number(network.chainId) === BSC_CHAIN_ID;

  $("connectBtn").textContent = t("connected");
  $("walletInfo").classList.remove("hidden");
  $("walletAddress").textContent = shortAddress(userAddress);
  const netEl = $("networkStatus");
  if (isCorrectChain) {
    netEl.textContent = "BSC Mainnet";
    netEl.className = "network-status ok";
  } else {
    netEl.textContent = t("wrongNetwork");
    netEl.className = "network-status bad";
    showNotice(t("errWrongChainNotice"), "error");
    setActionsEnabled(false);
    return;
  }

  if (!CONTRACT_DEPLOYED) {
    showNotice(t("errContractSoon"), "info");
    return;
  }

  contract = new ethers.Contract(CONTRACT_ADDRESS, AGENT_QUEST_ABI, signer);
  await refreshAgentStatus();
  await refreshStats();
  await renderQuests();
}

/* ---------- Agent ID ---------- */
async function refreshAgentStatus() {
  const el = $("agentStatusText");
  if (!userAddress) {
    el.textContent = t("agentStatusConnect");
    el.className = "agent-status";
    return;
  }
  try {
    const agentId = new ethers.Contract(AGENT_ID_ADDRESS, BALANCE_OF_ABI, browserProvider);
    const balance = await agentId.balanceOf(userAddress);
    hasAgentId = balance > 0n;
    if (hasAgentId) {
      el.textContent = t("agentStatusOk");
      el.className = "agent-status ok";
    } else {
      el.textContent = t("agentStatusNoId");
      el.className = "agent-status bad";
      setActionsEnabled(false);
    }
  } catch (err) {
    console.error("Cek Agent ID gagal:", err);
    el.textContent = t("agentStatusFail");
    el.className = "agent-status bad";
    setActionsEnabled(false);
  }
}

/* ---------- Stats & check-in ---------- */
async function refreshStats() {
  if (!contract || !userAddress) return;
  try {
    const [xpVal, streakVal, totalVal, lastDay] = await Promise.all([
      contract.xp(userAddress),
      contract.streak(userAddress),
      contract.totalCheckIns(userAddress),
      contract.lastCheckInDay(userAddress),
    ]);
    const level = await contract.levelOf(xpVal);
    $("statXp").textContent = xpVal.toString();
    $("statLevel").textContent = level.toString();
    $("statStreak").textContent =
      streakVal.toString() + (streakVal === 1n ? t("streakDay") : t("streakDays"));
    $("statCheckins").textContent = totalVal.toString();

    const btn = $("checkinBtn");
    const note = $("checkinNote");
    const alreadyToday = lastDay === BigInt(utcDayNumber());
    if (!hasAgentId) {
      btn.disabled = true;
      btn.textContent = t("checkinBtn");
      note.textContent = t("checkinNeedId");
    } else if (alreadyToday) {
      btn.disabled = true;
      btn.textContent = t("checkinDoneBtn");
      note.textContent = t("checkinNext");
    } else {
      btn.disabled = false;
      btn.textContent = t("checkinBtn");
      note.textContent = "";
    }
  } catch (err) {
    console.error("Muat statistik gagal:", err);
    showNotice(t("errStats"), "error");
  }
}

async function doCheckIn() {
  if (!contract || !userAddress || !hasAgentId) return;
  const btn = $("checkinBtn");
  btn.disabled = true;
  btn.textContent = t("checkinSending");
  hideTx();
  try {
    const tx = await contract.checkIn();
    showTx(tx.hash, false);
    await tx.wait();
    showTx(tx.hash, true);
    await refreshStats();
    await loadLeaderboard();
    showNotice(t("checkinSuccess"), "success");
  } catch (err) {
    showNotice(friendlyError(err), "error");
    await refreshStats();
  }
}

/* ---------- Quests ---------- */
function questCardHtml(id, meta, q, done, eligible, canAct) {
  const reward = q ? q.xpReward.toString() : "?";
  const target = q ? q.target : meta.target;
  let action = "";
  if (!CONTRACT_DEPLOYED) {
    action = '<span class="muted">' + t("questSoon") + "</span>";
  } else if (!userAddress) {
    action =
      '<button class="btn btn-outline btn-small quest-btn" disabled>' +
      t("questConnectFirst") +
      "</button>";
  } else if (!hasAgentId) {
    action =
      '<button class="btn btn-outline btn-small quest-btn" disabled>' +
      t("questNeedId") +
      "</button>";
  } else if (!q || !q.active) {
    action = '<span class="muted">' + t("questInactive") + "</span>";
  } else if (done) {
    action = '<span class="quest-done">' + t("questDone") + "</span>";
  } else {
    action =
      '<button class="btn btn-gold btn-small quest-btn" data-quest="' +
      id +
      '"' +
      (!eligible || !canAct ? " disabled" : "") +
      ">" +
      t("questComplete").replace("{xp}", reward) +
      "</button>";
  }
  const hint =
    CONTRACT_DEPLOYED && userAddress && hasAgentId && q && q.active && !done && !eligible
      ? '<p class="quest-hint">' + t("questNotEligible") + "</p>"
      : "";
  return (
    '<div class="quest">' +
    '<div class="quest-top"><span class="quest-name">' +
    meta.name +
    '</span><span class="quest-reward">+' +
    reward +
    " XP</span></div>" +
    '<p class="quest-desc">' +
    meta.description +
    "</p>" +
    '<p class="quest-target">' +
    t("questTarget") +
    '<a href="' +
    BSCSCAN_ADDR +
    target +
    '" target="_blank" rel="noopener">' +
    shortAddress(target) +
    "</a></p>" +
    action +
    hint +
    "</div>"
  );
}

async function renderQuests() {
  const listEl = $("questList");
  // Kontrak belum di-deploy: tampilkan quest seed sebagai "segera hadir".
  if (!CONTRACT_DEPLOYED) {
    listEl.innerHTML = Object.keys(QUEST_META)
      .map((id) => questCardHtml(Number(id), getQuestMeta(Number(id)), null, false, false, false))
      .join("");
    return;
  }
  const source = readContract || contract;
  if (!source) {
    listEl.innerHTML = '<p class="muted">' + t("questLoadFail") + "</p>";
    return;
  }
  try {
    const count = Number(await source.questCount());
    if (count === 0) {
      listEl.innerHTML = '<p class="muted">' + t("questEmpty") + "</p>";
      return;
    }
    const cards = [];
    for (let i = 0; i < count; i++) {
      const q = await source.quests(i);
      if (!q.active) continue; // Quest nonaktif tidak ditampilkan.
      const meta = getQuestMeta(i, q.target);
      let done = false;
      let eligible = false;
      if (userAddress && contract) {
        try {
          done = await contract.questCompleted(userAddress, i);
        } catch (err) {
          console.error("Cek questCompleted gagal:", err);
        }
        if (!done && hasAgentId && q.active) {
          try {
            const targetToken = new ethers.Contract(q.target, BALANCE_OF_ABI, browserProvider);
            const bal = await targetToken.balanceOf(userAddress);
            eligible = bal >= q.minBalance;
          } catch (err) {
            console.error("Cek saldo target quest gagal:", err);
            eligible = false;
          }
        }
      }
      cards.push(questCardHtml(i, meta, q, done, eligible, true));
    }
    listEl.innerHTML = cards.join("");
    listEl.querySelectorAll(".quest-btn[data-quest]").forEach((btn) => {
      btn.addEventListener("click", () => doCompleteQuest(Number(btn.dataset.quest)));
    });
  } catch (err) {
    console.error("Muat quest gagal:", err);
    listEl.innerHTML = '<p class="muted">' + t("questLoadFail") + "</p>";
  }
}

async function doCompleteQuest(questId) {
  if (!contract || !userAddress || !hasAgentId) return;
  hideTx();
  try {
    const tx = await contract.completeQuest(questId);
    showTx(tx.hash, false);
    await tx.wait();
    showTx(tx.hash, true);
    await refreshStats();
    await renderQuests();
    await loadLeaderboard();
    showNotice(t("questCompleteSuccess"), "success");
  } catch (err) {
    showNotice(friendlyError(err), "error");
    await renderQuests();
  }
}

/* ---------- Leaderboard ---------- */
async function loadLeaderboard() {
  const listEl = $("leaderboardList");
  if (!CONTRACT_DEPLOYED || DEPLOY_BLOCK <= 0 || !readContract) {
    listEl.innerHTML =
      '<p id="leaderboardNote" class="muted">' + t("lbEmpty") + "</p>";
    return;
  }
  try {
    const [checkIns, questDones] = await Promise.all([
      readContract.queryFilter(readContract.filters.CheckIn, DEPLOY_BLOCK, "latest"),
      readContract.queryFilter(readContract.filters.QuestCompleted, DEPLOY_BLOCK, "latest"),
    ]);
    // totalXp di tiap event adalah XP kumulatif user saat itu — ambil nilai max per alamat.
    const xpByAddr = new Map();
    for (const ev of [...checkIns, ...questDones]) {
      const addr = ev.args.user;
      const total = ev.args.totalXp;
      const prev = xpByAddr.get(addr) || 0n;
      if (total > prev) xpByAddr.set(addr, total);
    }
    const ranked = [...xpByAddr.entries()]
      .sort((a, b) => (b[1] > a[1] ? 1 : b[1] < a[1] ? -1 : 0))
      .slice(0, 10);
    if (ranked.length === 0) {
      listEl.innerHTML =
        '<p id="leaderboardNote" class="muted">' + t("lbEmpty") + "</p>";
      return;
    }
    const rows = await Promise.all(
      ranked.map(async ([addr, totalXp], idx) => {
        let level = "?";
        try {
          level = (await readContract.levelOf(totalXp)).toString();
        } catch (err) {
          console.error("levelOf leaderboard gagal:", err);
        }
        return (
          '<div class="lb-row"><span class="lb-rank">#' +
          (idx + 1) +
          '</span><span class="lb-addr">' +
          shortAddress(addr) +
          '</span><span class="lb-level">' +
          t("lbLevel") +
          level +
          '</span><span class="lb-xp">' +
          totalXp.toString() +
          " XP</span></div>"
        );
      })
    );
    listEl.innerHTML = rows.join("");
  } catch (err) {
    console.error("Muat leaderboard gagal:", err);
    listEl.innerHTML =
      '<p id="leaderboardNote" class="muted">' + t("lbLoadFail") + "</p>";
  }
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", async () => {
  $("connectBtn").addEventListener("click", connectWallet);
  $("checkinBtn").addEventListener("click", doCheckIn);
  document.querySelectorAll(".lang-btn").forEach((b) => {
    b.addEventListener("click", () => setLang(b.dataset.lang));
  });

  if (typeof ethers === "undefined") {
    showNotice(t("errLib"), "error");
    return;
  }

  setupReadProvider();
  setLang(storedLang());

  if (!CONTRACT_DEPLOYED) {
    $("deployNote").classList.remove("hidden");
    showNotice(t("errContractSoon"), "info");
  }

  // Data publik (quest + leaderboard) bisa dilihat tanpa wallet.
  await renderQuests();
  await loadLeaderboard();

  if (!window.ethereum) {
    showNotice(t("errNoWallet"), "error");
    $("connectBtn").disabled = true;
    return;
  }

  // Silent re-connect kalau wallet sudah pernah diotorisasi.
  try {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts && accounts.length > 0) {
      const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
      if (parseInt(chainIdHex, 16) === BSC_CHAIN_ID) {
        await initUser(accounts[0]);
      }
    }
  } catch (err) {
    console.error("Silent connect gagal:", err);
  }

  window.ethereum.on("accountsChanged", async (accounts) => {
    if (accounts && accounts.length > 0) {
      hideNotice();
      await initUser(accounts[0]);
    } else {
      userAddress = null;
      hasAgentId = false;
      $("connectBtn").textContent = t("connectWallet");
      $("walletInfo").classList.add("hidden");
      $("agentStatusText").textContent = t("agentStatusConnect");
      $("agentStatusText").className = "agent-status";
      ["statXp", "statLevel", "statStreak", "statCheckins"].forEach(
        (id) => ($(id).textContent = "—")
      );
      $("checkinBtn").disabled = true;
      $("checkinBtn").textContent = t("checkinBtn");
      $("checkinNote").textContent = "";
      await renderQuests();
    }
  });

  window.ethereum.on("chainChanged", async () => {
    if (!userAddress) return;
    hideNotice();
    await initUser(userAddress);
  });
});
