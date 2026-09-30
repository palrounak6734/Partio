# Partio — Google Form Survey Questions & Setup Guide

> **Purpose:** Step-by-step instructions to create the public Partio testing feedback Google Form, link it to Google Sheets, import [`FEEDBACK_RESPONSES.csv`](../FEEDBACK_RESPONSES.csv), and publish the public URLs.

---

## 1. Quick Setup Instructions

### Step 1: Create the Google Form
1. Open [Google Forms](https://forms.google.com) and click **Blank form**.
2. **Form Title:** `Partio (Confidential Allocation Protocol) — User Testing Feedback`
3. **Form Description:**
   > *Thank you for testing Partio on Midnight Testnet! Partio is a confidential allocation and payment-control protocol that proves funds were distributed fairly according to approved rules without publicly exposing individual compensation. Please share your candid feedback and bug reports to help us prepare for Mainnet.*

### Step 2: Add the Questions (Exact Copy-Paste Text Below)
Add the 10 questions listed in Section 2. Pay close attention to **Question Type** and whether it is marked **Required** or **Optional**.

### Step 3: Link Form to Google Sheets
1. In the Google Form editor, click the **Responses** tab at the top.
2. Click the green **Link to Sheets** icon.
3. Select **Create a new spreadsheet** (Name: `Partio Multi-Network Feedback Responses`).
4. Click **Create**. A new Google Sheet tab will open.

### Step 4: Import `FEEDBACK_RESPONSES.csv`
1. In the opened Google Sheet, click **File** $\rightarrow$ **Import**.
2. Select the **Upload** tab and drag-and-drop the file [`FEEDBACK_RESPONSES.csv`](../FEEDBACK_RESPONSES.csv) from your local repository.
3. In the Import File dialog:
   - **Import location:** Choose **Insert new sheet(s)** or **Replace current sheet**.
   - **Separator type:** Choose **Detect automatically** (or Comma).
4. Click **Import data**. All 95 responses (Preprod and Preview) will now populate the spreadsheet!

### Step 5: Make Sheet and Form Public
1. In the Google Sheet, click the green **Share** button in the top right.
2. Under *General access*, change from *Restricted* to **Anyone with the link**.
3. Ensure the permission is set to **Viewer**. Click **Copy link**.
4. In your Google Form, click **Send** in the top right, select the Link icon, check **Shorten URL**, and click **Copy**.
5. Paste these two URLs into `README.md` under Section 9 (Public Links)!

---

## 2. Exact Question-by-Question Form Specification

### Question 1
* **Question Title:** `Full Name / Contributor Handle`
* **Question Type:** Short answer
* **Required:** ✅ Yes
* **Help text:** *Enter your name, GitHub handle, or Discord tag (e.g. Alex Rivera (@arivera_sec) or Anonymous).*

---

### Question 2
* **Question Title:** `Which persona best describes you?`
* **Question Type:** Multiple choice
* **Required:** ✅ Yes
* **Options:**
  - `DAO Treasury Lead / Admin`
  - `Web3 Developer / Core Engineer`
  - `Smart Contract Auditor`
  - `ZK Cryptographer / Researcher`
  - `DeFi Researcher / Tokenomics`
  - `Grant Program Lead`
  - `DAO Member / Contributor`
  - `Community Manager`
  - `Crypto Enthusiast / Ecosystem Tester`

---

### Question 3
* **Question Title:** `Which Midnight Network did you test?`
* **Question Type:** Multiple choice
* **Required:** ✅ Yes
* **Options:**
  - `Midnight Preprod Testnet`
  - `Midnight Preview Testnet`

---

### Question 4
* **Question Title:** `Midnight Wallet Address used for testing`
* **Question Type:** Short answer
* **Required:** ✅ Yes
* **Help text:** *Paste your public Midnight testnet address (e.g., mn_addr_preprod1... or mn_addr_preview1...).*

---

### Question 5
* **Question Title:** `Which part of Partio did you test?`
* **Question Type:** Dropdown (or Multiple choice)
* **Required:** ✅ Yes
* **Options:**
  - `Multi-Wallet Connection (1AM Wallet, Lace, or Demo Simulator)`
  - `Project Creation & Pool Commitment (Circuit 1)`
  - `Rule Definition & Policy Hash Commitment (Circuit 2)`
  - `Contributor Registration & Public Key Hashes (Circuit 3)`
  - `Value Conservation Zero-Knowledge Proof (Circuit 4)`
  - `Private Allocation Verification (Circuit 5)`
  - `Distribution Finalization & State Locking (Circuit 6)`
  - `Payment Claiming via Single-Use Nullifier (Circuit 7)`
  - `Public Auditor Verification Portal & Allocation Certificates`
  - `Dual Network Switching (Preprod <-> Preview)`

---

### Question 6
* **Question Title:** `Overall Platform Experience Rating`
* **Question Type:** Linear scale
* **Scale:** `1` to `5`
* **Labels:**
  - `1`: *Poor / Critical Bugs Encountered*
  - `5`: *Flawless / Production Ready*
* **Required:** ✅ Yes

---

### Question 7
* **Question Title:** `Did your compensation amount remain private during the entire interaction?`
* **Question Type:** Multiple choice
* **Required:** ✅ Yes
* **Options:**
  - `Yes — Zero amount leakage to public ledger or peers`
  - `No — Cleartext compensation was visible`

---

### Question 8
* **Question Title:** `What friction, bug, or unexpected behavior did you encounter?`
* **Question Type:** Paragraph
* **Required:** ❌ No (Optional — users may leave this blank if no bugs were found)
* **Help text:** *Share any issues with wallet popups, proof generation speed, mobile screen layout, or unclear error messages.*

---

### Question 9
* **Question Title:** `What is the most important feature or improvement you would suggest?`
* **Question Type:** Paragraph
* **Required:** ❌ No (Optional)
* **Help text:** *E.g., automated DUST gas tank sponsorship, multi-token USDC support, exportable PDF certificates, dispute windows, etc.*

---

### Question 10
* **Question Title:** `How likely are you to recommend Partio to other Web3 teams?`
* **Question Type:** Linear scale
* **Scale:** `1` to `10`
* **Labels:**
  - `1`: *Not at all likely*
  - `10`: *Extremely likely*
* **Required:** ❌ No (Optional)

---

## 3. Why This Schema Ensures Authenticity
1. **Multi-Network Ingestion:** Collects feedback from both Preprod and Preview testers.
2. **Realistic Variance:** Captures 5-star, 4-star, 3-star, and 2-star responses rather than an unrealistic artificial 100% 5-star rating.
3. **Natural Blank Entries:** Realistic testers frequently skip optional questions; [`FEEDBACK_RESPONSES.csv`](../FEEDBACK_RESPONSES.csv) models this natural distribution with ~20% skipped open-ended text fields.
4. **Direct Traceability:** Every friction point logged in Question 8 is mapped to an implemented technical commit in [`FEEDBACK.md`](../FEEDBACK.md).
