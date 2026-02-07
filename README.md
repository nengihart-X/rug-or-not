# RugOrNot? 🕵️‍♂️ (Hackathon Project)

**RugOrNot** is an AI-powered crypto security platform on the **Base** blockchain. It helps users analyze tokens, stake on their legitimacy using **$RUGNOT**, and earn rewards for correct predictions.
<img width="1920" height="880" alt="image" src="https://github.com/user-attachments/assets/24903aed-e19d-4924-89c4-5b4258cad18e" />


## 🏗 Project Structure

This is a **monorepo** containing the full stack application:

*   **`apps/web`**: Next.js 15 (App Router) Frontend. Built with shadcn/ui, Tailwind CSS, and ether.js.
*   **`apps/api`**: Node.js/Express Backend. Handles AI analysis (Cerebras), database (Prisma/PostgreSQL), and caching.
*   **`contracts`**: Hardhat project. Contains the `$RUGNOT` ERC20 token and Staking smart contracts.

## 🚀 Deployment

### 1. Frontend (Vercel)
Deploy the `apps/web` directory.
*   **Env Variables**:
    *   `NEXT_PUBLIC_BASE_RPC_URL`: `https://mainnet.base.org`
    *   `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: Your credentials.

### 2. Backend (Railway/Render)
Deploy the `apps/api` directory.
*   **Env Variables**:
    *   `DATABASE_URL`: Connection string for PostgreSQL (e.g., Supabase transaction pooler).
    *   `CEREBRAS_API_KEY`: API key for AI analysis.
    *   `PORT`: `5000`

### 3. Smart Contracts (Base Mainnet)
Located in `contracts/`.
*   Includes `RugNotToken.sol` (1M Fixed Supply) and `RugNotStaking.sol`.
*   Deploy with `npx hardhat run scripts/deploy_full.ts --network baseMainnet`.

## 🛠 Setup Locally

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Start Backend**:
    ```bash
    cd apps/api
    npx tsx src/index.ts
    ```
3.  **Start Frontend**:
    ```bash
    cd apps/web
    npm run dev
    ```

## 🤖 AI & Logic
*   **Honeypot Detection**: Integrates HoneyPot.is API.
*   **Deep Analysis**: Uses **Cerebras (Llama-3.1-70b)** to analyze contract code and metadata for hidden risks.
*   **Staking**: Users stake $RUGNOT on "Legit" or "Rug". Winners split the losers' pool.

---
Built for the **Base Hackathon** 🔵
