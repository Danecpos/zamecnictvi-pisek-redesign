// Stavební zámečnictví Josef Křítek — redesign demo
// Gallery data built from the categories on the original site.

const BASE = "https://www.zamecnictvipisek.cz/docs";

function pad2(n) { return n < 10 ? "0" + n : "" + n; }

function buildCategory(key, folder, prefix, start, end, label, skip = []) {
  const items = [];
  for (let i = start; i <= end; i++) {
    if (skip.includes(i)) continue;
    items.push({
      key,
      label,
      src: `${BASE}/${folder}/${prefix}${pad2(i)}.jpg`
    });
  }
  return items;
}

const GALLERY = [
  ...buildCategory("schody", "schody", "schody", 0, 20, "Schody"),
  ...buildCategory("zabradli", "zabradli", "zabradli", 1, 27, "Zábradlí", [25]),
  ...buildCategory("vrata", "vrata", "vrata_brany", 13, 19, "Brány"),
  ...buildCategory("mrize", "mrize", "mrize", 1, 9, "Mříže"),
  ...buildCategory("ruzne", "ruzne", "ruzne", 1, 5, "Různé"),
];

const INITIAL_LIMIT = 16;

const galleryEl = document.getElementById("gallery");
const filtersEl = document.getElementById("filters");
let currentFilter = "all";
let expanded = false;

function renderGallery() {
  const filtered = GALLERY.filter(g => currentFilter === "all" || g.key === currentFilter);
  const visible = expanded ? filtered : filtered.slice(0, INITIAL_LIMIT);

  galleryEl.innerHTML = "";
  visible.forEach((item, idx) => {
    const div = document.createElement("div");
    div.className = "gallery-item";
    div.dataset.filter = item.key;
    div.innerHTML = `<img src="${item.src}" alt="${item.label} — realizace" loading="lazy"><span class="tag">${item.label}</span>`;
    div.addEventListener("click", () => openLightbox(filtered, idx));
    galleryEl.appendChild(div);
  });

  let moreBtn = document.getElementById("galleryMoreBtn");
  if (moreBtn) moreBtn.remove();
  if (!expanded && filtered.length > INITIAL_LIMIT) {
    const wrap = document.createElement("div");
    wrap.className = "gallery-more";
    wrap.id = "galleryMoreBtn";
    wrap.innerHTML = `<button class="btn btn-ghost" id="showMore">Zobrazit dalších ${filtered.length - INITIAL_LIMIT} fotek</button>`;
    galleryEl.after(wrap);
    document.getElementById("showMore").addEventListener("click", () => {
      expanded = true;
      renderGallery();
    });
  }
}

filtersEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  filtersEl.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  currentFilter = btn.dataset.filter;
  expanded = false;
  renderGallery();
  document.getElementById("galerie").scrollIntoView({ behavior: "smooth", block: "start" });
});

renderGallery();

// ---- lightbox ----
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
let lbSet = [];
let lbIndex = 0;

function openLightbox(set, index) {
  lbSet = set;
  lbIndex = index;
  updateLightbox();
  lightbox.classList.add("open");
}
function updateLightbox() {
  lbImg.src = lbSet[lbIndex].src;
  lbImg.alt = lbSet[lbIndex].label;
}
document.getElementById("lbClose").addEventListener("click", () => lightbox.classList.remove("open"));
document.getElementById("lbPrev").addEventListener("click", () => {
  lbIndex = (lbIndex - 1 + lbSet.length) % lbSet.length;
  updateLightbox();
});
document.getElementById("lbNext").addEventListener("click", () => {
  lbIndex = (lbIndex + 1) % lbSet.length;
  updateLightbox();
});
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) lightbox.classList.remove("open");
});
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") lightbox.classList.remove("open");
  if (e.key === "ArrowLeft") document.getElementById("lbPrev").click();
  if (e.key === "ArrowRight") document.getElementById("lbNext").click();
});

// ---- mobile nav ----
const burger = document.getElementById("burger");
const navUl = document.querySelector("nav ul");
burger.addEventListener("click", () => {
  const open = navUl.style.display === "flex";
  navUl.style.display = open ? "none" : "flex";
  navUl.style.flexDirection = "column";
  navUl.style.position = "fixed";
  navUl.style.top = "76px";
  navUl.style.left = "0";
  navUl.style.right = "0";
  navUl.style.background = "#131110";
  navUl.style.padding = "20px 24px";
  navUl.style.gap = "18px";
  navUl.style.borderBottom = "1px solid rgba(243,238,228,0.09)";
});
document.querySelectorAll("nav a").forEach(a => {
  a.addEventListener("click", () => { if (window.innerWidth <= 900) navUl.style.display = "none"; });
});

// ---- header background on scroll ----
const header = document.querySelector("header");
window.addEventListener("scroll", () => {
  header.style.background = window.scrollY > 40 ? "rgba(19,17,16,0.97)" : "rgba(19,17,16,0.88)";
});
