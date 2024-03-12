# cold-storage-plugin

# Overview

- You have some NFTs that are really, really valuable. You don’t want to lose these NFTs, **even if the rest of your account is compromised, including your owner key.**
- Today, you might put your NFTs in a separate EOA and lock the private key in a bank vault.
  - But then you can’t use the NFTs to get into exclusive events!
- The Cold Storage plugin will let you secure your NFTs just as hard, but as part of your main modular account!

<img width="705" alt="Screenshot 2024-03-12 at 3 34 20 PM" src="https://github.com/OMGWINNING/cold-storage-plugin/assets/3278577/06249da0-9b5c-40b8-a9b2-a127f91966f8">

# Core Plugin Functions

1. Installing the Cold Storage Plugin
    - The owner specifies a highly secure storage key when installing the plugin
2. Locking an NFT
    - The owner can lock NFTs (all ERC721s, collections, or tokens) and place them in cold storage
3. Transferring NFT as the Owner 
    - Transferring a locked NFT is blocked
    - Transferring a NFT that isn’t locked is fine
4. Transferring a Locked NFT with Storage Key
    - The storage key has permission to transfer locked NFTs

# Addtional Plugin Functions
1. The storage key also has permissions to unlock NFTs and change the storage key
2. Uninstalling the Plugin
    - The plugin **blocks uninstalls** when there locked NFTs

## Demo

<details>
  <img width="400" alt="Screenshot 2024-03-12 at 2 28 20 PM" src="https://github.com/OMGWINNING/cold-storage-plugin/assets/3278577/e6f090ce-0135-4531-a90f-0b792ebc56dc">
  <img width="400" alt="Screenshot 2024-03-12 at 2 28 43 PM" src="https://github.com/OMGWINNING/cold-storage-plugin/assets/3278577/8fd2e28c-fa3f-472b-ad4e-aa0dcc549420">
  <img width="400" alt="Screenshot 2024-03-12 at 2 28 58 PM" src="https://github.com/OMGWINNING/cold-storage-plugin/assets/3278577/b4cad54a-cb6a-4e30-aaee-070aaf189331">
  <img width="400" alt="Screenshot 2024-03-12 at 2 29 16 PM" src="https://github.com/OMGWINNING/cold-storage-plugin/assets/3278577/9749a4eb-2719-4436-8636-c752d648e638">
  <img width="400" alt="Screenshot 2024-03-12 at 2 29 55 PM" src="https://github.com/OMGWINNING/cold-storage-plugin/assets/3278577/e2f2db57-bf38-41c2-9ee7-eec4f15d1b75">
  <img width="400" alt="Screenshot 2024-03-12 at 2 30 13 PM" src="https://github.com/OMGWINNING/cold-storage-plugin/assets/3278577/9d737b42-6858-45f0-b3da-f8a1aaa002d5">
  <img width="400" alt="Screenshot 2024-03-12 at 2 30 42 PM" src="https://github.com/OMGWINNING/cold-storage-plugin/assets/3278577/3deab2ce-0884-45aa-b944-4a126b440eb3">
  <img width="400" alt="Screenshot 2024-03-12 at 2 30 58 PM" src="https://github.com/OMGWINNING/cold-storage-plugin/assets/3278577/75675010-cccc-46c5-b3ea-5863fe1e323b">
</details>

# Presentation Slides

[Google Doc](https://docs.google.com/presentation/d/1mxz7FeNv8RusC-3xfPAZddxZ6RGAJKknIlGMCPiQVvQ/)

## Development

- `git clone git@github.com:OMGWINNING/cold-storage-plugin.git`
- `cd cold-storage-plugin`
- `yarn install`
- `yarn run dev` to load the site at http://localhost:3000

## Environment variables

After you run init, your `.env` file should look like this

```bash
NODE_ENV=development

# https://dashboard.alchemy.com/apps
ALCHEMY_API_KEY=<YOUR_ALCHEMY_API_KEY>

# you can also use Access Keys of your account
# https://dashboard.alchemy.com/settings/access-keys
ALCHEMY_ACCESS_KEY=<YOUR_ALCHEMY_ACCESS_KEY>

# https://dashboard.alchemy.com/gas-manager
NEXT_PUBLIC_ALCHEMY_GAS_MANAGER_POLICY_ID=<YOUR_ALCHEMY_GAS_MANAGER_POLICY_ID>

NEXT_TELEMETRY_DISABLED=1
```
