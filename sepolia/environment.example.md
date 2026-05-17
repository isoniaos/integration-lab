# Sepolia Environment Example

Use this file as a checklist for a live Sepolia run. Do not commit private keys,
RPC credentials, wallet seed phrases, API keys, or account recovery material.

## Required

- Sepolia RPC URL.
- Operator wallet address.
- Sepolia test ETH balance.
- Selected IsoniaOS deployment manifest.
- Block explorer base URL.
- Control Plane endpoint configured for the selected deployment.
- App Core endpoint configured for the selected Control Plane.

## Optional

- Snapshot testnet space or proposal link.
- Safe Sepolia address.
- Safe transaction service link.
- Tally Governor URL.
- Agora URL.
- GitHub issue or pull request link.
- Discourse discussion link.

## Notes

Keep live Sepolia settings separate from pinned-fork settings. A forked run can
replay chain state, but external provider APIs and UIs generally only observe
public live testnet transactions.
