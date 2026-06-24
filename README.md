# BoardroomCost.com — Guide de mise en ligne

Site complet : calculatrice de coût des réunions en temps réel, 10 articles de blog B2B, pages légales AdSense.

---

## 📁 Structure des fichiers

```
boardroomcost/
├── index.html          ← Page d'accueil (la calculatrice)
├── blog.html           ← Liste des 10 articles
├── blog-post.html      ← Modèle d'article (dynamique)
├── about.html
├── contact.html
├── privacy.html
├── terms.html
├── robots.txt
├── sitemap.xml
├── css/style.css
├── js/
│   ├── main.js         ← Thème, menu, FAQ, back-to-top
│   ├── calculator.js   ← Moteur de calcul temps réel
│   ├── blog.js         ← Moteur du blog
│   └── adsense.js      ← Emplacements pub
└── data/posts.json     ← Les 10 articles de blog
```

⚠️ **Important** : garde cette structure de dossiers exacte. Si `css/style.css` se retrouve à la racine, le design disparaît.

---

## 🟦 Mise en ligne sur GitHub Pages (même méthode que PayHourCalc)

**ÉTAPE 1** : Va sur [github.com/new](https://github.com/new) → nomme le repository `boardroomcost` → Public → Create repository

**ÉTAPE 2** : Clique "uploading an existing file" → sélectionne **tout le contenu** du dossier `boardroomcost` dézippé (Ctrl+A) → glisse-dépose → Commit changes

**ÉTAPE 3** : Settings → Pages → main / (root) → Save → attends 1-2 min → ton lien apparaît

---

## 🌐 Connecter BoardroomCost.com (Namecheap → GitHub Pages)

### Sur GitHub :
Settings → Pages → Custom domain → tape `boardroomcost.com` → Save → coche "Enforce HTTPS"

### Sur Namecheap :
Domain List → Manage → Advanced DNS → ajoute ces enregistrements :

| Type | Host | Value |
|---|---|---|
| A Record | @ | 185.199.108.153 |
| A Record | @ | 185.199.109.153 |
| A Record | @ | 185.199.110.153 |
| A Record | @ | 185.199.111.153 |
| CNAME | www | TON-PSEUDO.github.io |

Propagation DNS : 5 minutes à 24h.

---

## ✏️ Ajouter un article de blog

Modifie uniquement `data/posts.json` sur GitHub (crayon ✏️) :
- Copie un article existant comme modèle
- Modifie `id`, `title`, `excerpt`, `date`, `category`, `content`
- Le `content` est en HTML (`<p>`, `<h2 id="...">`, `<ul>`, etc.)
- Utilise `[AD1]` et `[AD2]` dans le contenu pour placer les pubs
- Valide le JSON sur [jsonlint.com](https://jsonlint.com) avant de sauvegarder

---

## 💰 Activer Google AdSense

1. Attends que le site soit en ligne sur `boardroomcost.com` (avec du contenu et un peu de trafic)
2. Postule sur [adsense.google.com](https://adsense.google.com)
3. Une fois approuvé, colle le code dans le `<head>` de chaque page HTML à l'endroit `<!-- REPLACE WITH YOUR ADSENSE CODE -->`
4. Remplace chaque `.adsense-slot` par tes vrais blocs `<ins class="adsbygoogle">` (voir `js/adsense.js` pour les instructions)

---

## 🔍 SEO — Prochaines étapes

1. [Google Search Console](https://search.google.com/search-console) → ajoute ton site → soumets `sitemap.xml`
2. Demande l'indexation manuelle de chaque page
3. Partage les articles sur LinkedIn (le public B2B idéal pour ce site)
4. Teste sur [pagespeed.web.dev](https://pagespeed.web.dev)

---

## ✅ Fonctionnalités incluses

- **Calculatrice temps réel** : coût par réunion, par mois, par an — mise à jour instantanée à chaque frappe
- **Multiplicateur overhead 1.3×** : reflète le coût réel chargé (salaire + charges)
- **Shock factor** : phrase de choc générée automatiquement + comparaisons (développeurs, MacBooks, formations)
- **ROI Calculator** : glissière pour modéliser les économies si on réduit les réunions
- **"Email to Manager"** : message pré-formaté prêt à envoyer
- **Export CSV** : rapport de réunion téléchargeable
- **10 articles B2B** : sujets à fort CPC ($15-40) — coût des réunions, Amazon two-pizza rule, async work, statistiques, etc.
- **Dark mode** par défaut (parfait pour le public B2B/tech) + light mode toggle
- **Schéma.org** : WebApplication, FAQPage, Article
- **robots.txt + sitemap.xml** prêts

Bonne mise en ligne ! 🚀
