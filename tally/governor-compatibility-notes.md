# Governor Compatibility Notes

## Practical Prerequisites

- A Governor-style contract deployment on Sepolia.
- Contract verification or ABI availability if required by Tally.
- Supported Governor event and function surfaces.
- Public URL for the Tally governance page if recognized.

## Compatibility Checks

- Confirm whether the selected deployment follows OpenZeppelin Governor
  conventions.
- Record which proposal lifecycle events are visible to Tally.
- Record which function surfaces Tally can call or display.
- Capture unsupported surfaces explicitly.

## Trust Boundary

Tally pages are compatibility evidence in this lab. They do not prove that
IsoniaOS governance authority has moved into Tally. Treat any successful Tally
display as an experiment until a production integration is intentionally scoped.
