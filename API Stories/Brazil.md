# RentACarMole — Brazil Car Rental API Integration

> Work on this AFTER localisation (TODO4) is complete.

## What the user needs to arrange

| Service | Registration | Notes |
|---|---|---|
| **Rentcars.com.br affiliate** | https://www.rentcars.com/en/affiliates | Brazilian aggregator. Covers Localiza, Movida, Unidas. |
| **Localiza affiliate** | https://www.localiza.com | Dominant company (~50% market share). No API — affiliate redirect only. |

New env vars: `NEXT_PUBLIC_RENTCARS_BR_AFFILIATE`, `NEXT_PUBLIC_LOCALIZA_AFFILIATE`.

Note: Localiza, Movida, Unidas have no public APIs. Affiliate redirects are the only option for Brazil.

## Tasks

### 1. AffiliateCarSearch — Brazilian providers
When `country === "BR"`, replace/extend grid with:
- **Rentcars.com.br** — `https://www.rentcars.com/en/rental-cars/brazil/{location}/?pickUpDate=...&aff={affiliate}`
- **Localiza Hertz** — `https://www.localiza.com/brasil/pt-br/reserve?local={location}&retirada={date}&devolucao={date}`
- **Movida** — `https://www.movida.com.br/aluguel-de-carros?origem={location}&data_retirada={date}&data_devolucao={date}`
- Keep Rentalcars.com and Expedia (both cover Brazil)

### 2. Popular Brazilian pickup locations (add to search.ts)
GRU (São Paulo Guarulhos), GIG (Rio Galeão), BSB (Brasília), SSA (Salvador), FOR (Fortaleza), FLN (Florianópolis), IGU (Foz do Iguaçu)
