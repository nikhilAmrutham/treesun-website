/* Treesun content-manager UI prototype.
 * No authentication. Data remains in THIS BROWSER ONLY, not in GitHub or Wix.
 * Production permissions and storage MUST come from Wix Dashboard + Wix CMS.
 */
(() => {
  "use strict";
  const STORAGE_KEY = "treesun-demo-testimonials-v1";
  let editingId = null;
  let filter = "all";
  let message = "";
  let fallback = [];
  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[char]));
  const read = () => {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(data) ? data.filter(x => x && typeof x === "object") : [];
    } catch (_) { return fallback; }
  };
  const write = entries => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); fallback=entries; return true; }
    catch (_) { message="Changes could not be saved in this browser. Check storage settings."; return false; }
  };
  const publicEntries = () => read().filter(x => x.status === "published" && x.consent === true && x.customer && x.quote);
  const statusTag = x => x.status === "published" ? '<span class="admin-status published">Published</span>' :
    x.consent ? '<span class="admin-status ready">Ready for approval</span>' :
      '<span class="admin-status draft">Draft</span>';
  const fmt = s => escapeHTML(s).replace(/\n/g, "<br>");
  const dateLabel = x => x.updatedAt ? new Date(x.updatedAt).toLocaleDateString() : "—";
  function publicSection() {
    const entries=publicEntries().slice(0,6);
    return '<section class="section" id="customer-stories">' +
      '<div class="section-head"><div><div class="eyebrow">CUSTOMER STORIES</div><h2>Trusted partnerships.<br>Real experiences.</h2>' +
      '<p>Only approved customer statements appear here.</p></div></div>' +
      (entries.length ? '<div class="grid three testimonial-grid">' + entries.map(x =>
          '<figure class="testimonial-card"><blockquote>“'+fmt(x.quote)+'”</blockquote>'+
          '<figcaption><strong>'+escapeHTML(x.customer)+'</strong>'+
          (x.position || x.company ? '<span>'+escapeHTML([x.position,x.company].filter(Boolean).join(" · "))+'</span>' : '')+
          '</figcaption></figure>').join('')+'</div>' :
        '<div class="testimonials-empty"><strong>Customer stories will appear here.</strong>'+
        '<p>We will publish testimonials only after verifying the feedback and receiving permission from the customer.</p></div>')+
      '</section>';
  }
  function form() {
    const current = read().find(x => x.id === editingId) || {};
    const checked = current.consent ? " checked" : "";
    const options = ["Industrial Engineering","3D Printing & Scale Models","General"].map(x =>
      '<option value="'+escapeHTML(x)+'"'+(current.division === x ? " selected" : "")+'>'+escapeHTML(x)+'</option>').join("");
    return '<div class="admin-card admin-form-card"><div class="admin-card-head"><div><div class="eyebrow">TESTIMONIAL RECORD</div>'+
      '<h2>'+(editingId?"Edit testimonial":"Add a testimonial")+'</h2></div></div>'+
      '<form id="testimonialForm" class="form-grid" autocomplete="off">' +
      '<label class="field">Customer name *<input name="customer" maxlength="90" required placeholder="Use real, approved attribution" value="'+escapeHTML(current.customer)+'"></label>'+
      '<label class="field">Company (optional)<input name="company" maxlength="90" placeholder="Only with permission" value="'+escapeHTML(current.company)+'"></label>'+
      '<label class="field">Job title (optional)<input name="position" maxlength="90" placeholder="Role or designation" value="'+escapeHTML(current.position)+'"></label>'+
      '<label class="field">Business division<select name="division">'+options+'</select></label>'+
      '<label class="field full">Customer feedback *<textarea name="quote" required maxlength="1000" placeholder="Enter the exact customer-approved wording">'+escapeHTML(current.quote)+'</textarea></label>'+
      '<label class="field full admin-consent"><input type="checkbox" name="consent"'+checked+'><span>I have verified this statement and have recorded the customer’s permission to publish it on Treesun’s website.</span></label>'+
      '<div class="full admin-form-actions"><button type="submit" class="btn dark">Save as Draft</button>'+
      (editingId?'<button type="button" class="btn" data-admin-cancel>Cancel edit</button>':'')+
      '</div></form><p class="admin-note">Demo only: edits stay in this browser. Do not enter confidential or personal customer information in this prototype.</p></div>';
  }
  function table() {
    let entries=read();
    if(filter==="published") entries=entries.filter(x=>x.status==="published");
    if(filter==="draft") entries=entries.filter(x=>x.status!=="published");
    return '<div class="admin-card"><div class="admin-card-head"><div><div class="eyebrow">MODERATION QUEUE</div><h2>All testimonials</h2></div>'+
      '<div class="pills admin-pills"><button class="pill'+(filter==="all"?" active":"")+'" data-admin-filter="all">All</button>'+
      '<button class="pill'+(filter==="draft"?" active":"")+'" data-admin-filter="draft">Drafts</button>'+
      '<button class="pill'+(filter==="published"?" active":"")+'" data-admin-filter="published">Published</button></div></div>'+
      (entries.length ? '<div class="admin-list">'+entries.map(x => '<article class="admin-record">'+
        '<div class="admin-record-top"><div><strong>'+escapeHTML(x.customer)+'</strong>'+
        '<p>'+escapeHTML([x.position,x.company].filter(Boolean).join(" · ")||x.division||"Uncategorised")+'</p></div>'+statusTag(x)+'</div>'+
        '<p class="admin-record-quote">“'+escapeHTML(x.quote)+'”</p>'+
        '<div class="admin-record-footer"><span>Updated '+escapeHTML(dateLabel(x))+'</span><div class="admin-record-actions">'+
        '<button type="button" data-admin-edit="'+escapeHTML(x.id)+'">Edit</button>'+
        (x.status==="published" ? '<button type="button" data-admin-unpublish="'+escapeHTML(x.id)+'">Unpublish</button>':
        '<button type="button" data-admin-publish="'+escapeHTML(x.id)+'"'+(!x.consent?' disabled title="Customer permission is required"':'')+'>Publish</button>')+
        '<button type="button" class="danger" data-admin-delete="'+escapeHTML(x.id)+'">Delete</button>'+
        '</div></div></article>').join("")+'</div>' :
        '<div class="admin-empty"><h3>No testimonials in this view.</h3><p>Add a verified customer statement as a draft to get started.</p></div>')+
      '</div>';
  }
  function page() {
    const entries=read();
    const published=publicEntries().length;
    const drafts=entries.filter(x=>x.status!=="published").length;
    return '<section class="admin-shell"><div class="admin-heading"><div><div class="eyebrow">TREESUN · CONTENT MANAGEMENT</div>'+
      '<h1>Content dashboard</h1><p>Manage customer stories and prepare them for publication.</p></div>'+
      '<a class="btn dark" href="https://manage.wix.com/" target="_blank" rel="noopener noreferrer">Wix Dashboard ↗</a></div>'+
      '<div class="admin-alert"><strong>Interactive admin demonstration — NOT A SECURE LOGIN</strong>'+
      '<p>This static GitHub prototype has no authentication or shared database. Testimonials here are saved only in your current browser and are never sent to Wix or GitHub. The production admin login will be your Wix account.</p></div>'+
      '<div class="admin-stats"><div><span>Total records</span><strong>'+entries.length+'</strong></div>'+
      '<div><span>Awaiting publication</span><strong>'+drafts+'</strong></div>'+
      '<div><span>Published in local preview</span><strong>'+published+'</strong></div></div>'+
      '<div class="admin-layout"><aside class="admin-side"><div class="eyebrow">CONTENT AREAS</div>'+
      '<div class="admin-nav-item selected">Customer testimonials <span>Active demo</span></div>'+
      '<div class="admin-nav-item">Projects & services <span>Wix CMS</span></div>'+
      '<div class="admin-nav-item">Shop products <span>Wix Stores</span></div>'+
      '<div class="admin-nav-item">Enquiries & quotes <span>Wix Forms</span></div>'+
      '<a href="#/" class="text-link" style="margin-top:18px;display:inline-block">← View customer homepage</a>'+
      '</aside><div class="admin-content">'+(message?'<div class="admin-toast" role="status">'+escapeHTML(message)+'</div>':'')+
      form()+table()+'</div></div></section>';
  }
  function renderAdmin(focus=false) {
    if(location.hash!=="#/admin") return;
    const el=document.querySelector("#app");
    if(el) el.innerHTML=page();
    if(focus) el.querySelector('input[name="customer"]')?.focus();
    message="";
  }
  document.addEventListener("submit", event => {
    if(event.target.id!=="testimonialForm") return;
    event.preventDefault();
    const fields=new FormData(event.target);
    const customer=String(fields.get("customer")||"").trim().slice(0,90);
    const quote=String(fields.get("quote")||"").trim().slice(0,1000);
    if(!customer||!quote){message="Customer and feedback are required.";renderAdmin();return;}
    const entries=read(), current=entries.find(x=>x.id===editingId);
    const payload={
      id: current?.id || ("demo-"+Date.now()+"-"+Math.random().toString(36).slice(2,8)),
      customer, quote,
      company:String(fields.get("company")||"").trim().slice(0,90),
      position:String(fields.get("position")||"").trim().slice(0,90),
      division:String(fields.get("division")||"General"),
      consent:fields.has("consent"),
      status:"draft", // Editing a published item requires a fresh approval step.
      updatedAt:new Date().toISOString()
    };
    const next=current?entries.map(x=>x.id===current.id?payload:x):[payload,...entries];
    if(write(next)){editingId=null;message="Draft saved locally. Review consent before publishing.";}
    renderAdmin();
  });
  document.addEventListener("click", event => {
    const found=event.target.closest("[data-admin-edit],[data-admin-delete],[data-admin-publish],[data-admin-unpublish],[data-admin-filter],[data-admin-cancel]");
    if(!found)return;
    if(found.hasAttribute("data-admin-cancel")){editingId=null;message="Editing cancelled.";renderAdmin();return;}
    if(found.hasAttribute("data-admin-filter")){filter=found.dataset.adminFilter;renderAdmin();return;}
    if(found.hasAttribute("data-admin-edit")){editingId=found.dataset.adminEdit;message="Editing will return this testimonial to Draft until approved again.";renderAdmin(true);return;}
    const id=found.dataset.adminDelete||found.dataset.adminPublish||found.dataset.adminUnpublish;
    const entries=read(), current=entries.find(x=>x.id===id);
    if(!current)return;
    if(found.hasAttribute("data-admin-delete")){
      if(!confirm("Delete this testimonial from your local demo? This cannot be undone."))return;
      if(write(entries.filter(x=>x.id!==id))){if(editingId===id)editingId=null;message="Deleted from local demo.";}
    } else if(found.hasAttribute("data-admin-publish")){
      if(!current.consent||!current.customer||!current.quote){message="Cannot publish without a customer name, feedback and confirmed permission.";renderAdmin();return;}
      if(write(entries.map(x=>x.id===id?{...x,status:"published",updatedAt:new Date().toISOString()}:x)))message="Published in this browser preview only.";
    } else if(found.hasAttribute("data-admin-unpublish")){
      if(write(entries.map(x=>x.id===id?{...x,status:"draft",updatedAt:new Date().toISOString()}:x)))message="Unpublished from local preview.";
    }
    renderAdmin();
  });
  window.TreesunAdmin = { page, publicSection };
})();