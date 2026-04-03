---
name: build-app
description: >
  Orchestrates the full four-agent pipeline to generate a complete
  full-stack app (React + Vite frontend, Kotlin + Ktor backend, SQLite).
  Saves each output file before passing it to the next agent.
  Produces design.md, frontend_output.md, backend_output.md, REVIEW.md,
  and RUNBOOK.md.
args:
  - name: project_idea
    description: One-line description of the app to build (e.g. "a habit tracker")
    required: true
---

<!-- ============================================================
     SKILL FILE: skills/build-app.md
     ---------------------------------------------------------------
     FILE CHAIN:
       [your idea] → 01_design_agent  → design.md
       design.md   → 02_frontend_agent → frontend_output.md → frontend/
       design.md   → 03_backend_agent  → backend_output.md  → backend/
       design.md + frontend_output.md + backend_output.md
                   → 04_review_agent  → REVIEW.md
       All of the above → RUNBOOK.md

     HOW TO INSTALL:
       claude skill install skills/build-app.md

     HOW TO INVOKE:
       /build-app "habit tracker"
       /build-app "recipe box"
============================================================ -->

## Step 1 — Design Agent
Run the design agent with the project idea.
Save output to design.md — the shared contract for all other agents.

```bash
# Mac / Linux
claude -p "$(sed \
  -e 's|{PROJECT_IDEA}|{{project_idea}}|g' \
  prompts/01_design_agent.md)" > design.md

echo "✓ design.md saved ($(wc -l < design.md) lines)"
```

```powershell
# Windows PowerShell
$prompt = (Get-Content prompts\01_design_agent.md -Raw) `
  -replace '\{PROJECT_IDEA\}','{{project_idea}}'
claude -p $prompt | Out-File -Encoding utf8 design.md
Write-Host "✓ design.md saved"
```

Verify before continuing:
`grep "^## API Spec\|^## DB Schema\|^## Component Tree" design.md`

---

## Step 2 — Frontend Agent
Run the frontend agent using design.md as context.
Save output to frontend_output.md, then extract into frontend/.

```bash
# Mac / Linux
claude -p "$(cat prompts/02_frontend_agent.md)" \
  --context "$(cat design.md)" > frontend_output.md
python3 scripts/extract_files.py frontend_output.md
echo "✓ frontend_output.md saved, frontend/ extracted"
```

```powershell
# Windows PowerShell
$p = Get-Content prompts\02_frontend_agent.md -Raw
$c = Get-Content design.md -Raw
claude -p $p --context $c | Out-File -Encoding utf8 frontend_output.md
python scripts\extract_files.py frontend_output.md
Write-Host "✓ frontend_output.md saved"
```

---

## Step 3 — Backend Agent (Kotlin + Ktor)
Run the backend agent using design.md as context.
Save output to backend_output.md, then extract into backend/.

```bash
# Mac / Linux
claude -p "$(cat prompts/03_backend_agent.md)" \
  --context "$(cat design.md)" > backend_output.md
python3 scripts/extract_files.py backend_output.md
echo "✓ backend_output.md saved, backend/ extracted"
```

```powershell
# Windows PowerShell
$p = Get-Content prompts\03_backend_agent.md -Raw
$c = Get-Content design.md -Raw
claude -p $p --context $c | Out-File -Encoding utf8 backend_output.md
python scripts\extract_files.py backend_output.md
Write-Host "✓ backend_output.md saved"
```

---

## Step 4 — Review Agent
Read all three files and save the audit to REVIEW.md.

```bash
# Mac / Linux
claude -p "$(cat prompts/04_review_agent.md)" \
  --context "$(printf '# DESIGN\n'; cat design.md; \
               printf '\n\n# FRONTEND\n'; cat frontend_output.md; \
               printf '\n\n# BACKEND\n'; cat backend_output.md)" \
  > REVIEW.md
echo "✓ REVIEW.md saved"
```

```powershell
# Windows PowerShell
$p  = Get-Content prompts\04_review_agent.md -Raw
$cx = "# DESIGN`n" + (Get-Content design.md -Raw) + `
      "`n`n# FRONTEND`n" + (Get-Content frontend_output.md -Raw) + `
      "`n`n# BACKEND`n" + (Get-Content backend_output.md -Raw)
claude -p $p --context $cx | Out-File -Encoding utf8 REVIEW.md
Write-Host "✓ REVIEW.md saved"
```

---

## Step 5 — Write RUNBOOK.md

```markdown
# RUNBOOK — {{project_idea}}
Backend: Kotlin + Ktor + Exposed + SQLite

## Prerequisites
- [ ] JDK 21+: `java -version`
- [ ] Node.js 18+: `node --version`
- [ ] All output files present: design.md, frontend_output.md, backend_output.md, REVIEW.md

## Step 1 — Extract Generated Files
python3 scripts/extract_files.py frontend_output.md
python3 scripts/extract_files.py backend_output.md

## Step 2 — Start the Backend (Kotlin/Ktor)
cd backend
./gradlew run          (Mac/Linux)
gradlew.bat run        (Windows)
→ API running at http://localhost:3001
  First run downloads Gradle dependencies (~1-2 min)

## Step 3 — Start the Frontend (React/Vite)
Open a second terminal tab:
cd frontend
npm install
npm run dev
→ App running at http://localhost:5173

## Step 4 — Open in Browser
http://localhost:5173

## Resetting the Database
rm backend/data/app.db    (Mac/Linux)
del backend\data\app.db   (Windows)
Restart the backend — tables and seed data are recreated automatically.
```

---

## Step 6 — Summary

```bash
echo ""
echo "========================================="
echo " /build-app complete — {{project_idea}}"
echo "========================================="
echo " design.md          $(wc -l < design.md) lines"
echo " frontend_output.md $(wc -l < frontend_output.md) lines"
echo " backend_output.md  $(wc -l < backend_output.md) lines"
echo " REVIEW.md          $(wc -l < REVIEW.md) lines"
echo " RUNBOOK.md         written"
echo ""
echo " Backend stack: Kotlin + Ktor + Exposed + SQLite"
echo " Next: follow RUNBOOK.md to start your app"
echo "========================================="
```
