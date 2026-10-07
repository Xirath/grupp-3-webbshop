# ADR-01: Val av Databas istället för Json server

- **Status:** Föreslagen
- **Datum:** 2026-10-01
- **Deltagare:** Daniel , Luisa , Isabelle, Sandra
- **Relaterad Issue/Ticket:** #26

---

## 1. Kontext & Problemställning

I den nuvarande versionen av projektet används en db.json-fil tillsammans med JSON Server som backend och datakälla. JSON Server tillhandahåller ett enkelt REST API ovanpå JSON-filen, vilket har gjort det möjligt att snabbt utveckla och testa frontend-applikationen.

Den nuvarande lösningen fungerar bra för prototypning, men har begränsningar när projektet utvecklas och behöver hantera mer strukturerad och relationsbaserad data. En JSON-fil ger exempelvis inte samma stöd för relationer, dataintegritet och komplexa frågor som en relationsdatabas.

Vi har valt PostgreSQL som databas, där databasen hostas av Supabase och Prisma som ORM mellan Next.js-applikationen och databasen.

Viktiga krav är att lösningen ska:

- Fungera bra tillsammans med Next.js.
- Göra det enkelt att skapa, läsa, uppdatera och ta bort data.
- Ge möjlighet att utveckla och förändra datamodellen på ett strukturerat sätt.
- Vara tillräckligt robust för projektets fortsatta utveckling.

## 2. Övervägda Alternativ

### Alternativ A: Fortsätta med JSON Server och db.json

- **Fördelar:** Enkel lösning som redan används i projektet. Kräver lite konfiguration. Enkelt att läsa och ändra data direkt i db.json. Passar bra för prototyper och tidig frontend-utveckling.
- **Nackdelar:** Begränsade möjligheter att hantera relationer mellan data. Mindre lämpligt när applikationen blir mer komplex.

### Alternativ B: Supabase(PostgreSQL) med Prisma

- **Fördelar:** PostgreSQL är en etablerad relationsdatabas med stöd för relationer och dataintegritet. Prisma gör det enklare att arbeta med databasen från TypeScript/Next.js. Prisma ger ett typat API för att kommunicera med databasen. Datamodellen kan definieras tydligt genom Prisma-schema. Prisma Migrate kan användas för att hantera förändringar i databasschemat. Lösningen är mer skalbar och produktionslik än db.json och JSON Server. Teamet får erfarenhet av en vanlig teknikstack för moderna webbapplikationer.

- **Nackdelar:** Mer komplex att sätta upp än JSON Server. Teamet behöver lära sig Prisma och grundläggande databashantering. Databasmigrationer behöver hanteras när datamodellen förändras.

---

## 3. Beslut

Vi beslutar att ersätta den nuvarande db.json + JSON Server-lösningen med Supabase(PostgreSQL) och Prisma.

PostgreSQL används som den faktiska databasen, där databasen hostas av Supabase och Prisma används som ORM för kommunikationen mellan Next.js-applikationen och databasen.

Beslutet grundar sig främst i att PostgreSQL ger bättre stöd för relationsbaserad och persistent data än den nuvarande JSON-filen. Prisma kompletterar detta genom att ge ett typat och strukturerat sätt att arbeta med databasen från vår TypeScript-kod.

Den nuvarande db.json-filen och JSON Server kommer därför inte längre att vara den primära datakällan när migreringen är genomförd.

---

## 4. Konsekvenser

### Positiva konsekvenser

- db.json behöver inte längre användas som permanent datalagring.
- Vi får en riktig relationsdatabas med stöd för relationer och dataintegritet.
- Lösningen blir mer produktionslik och kan enklare byggas ut i framtiden.
- Teamet får erfarenhet av PostgreSQL, Prisma och relationsdatabaser.

### Negativa konsekvenser / Risker

- Lösningen kräver mer konfiguration än JSON Server.
- Teamet behöver förstå både Prisma och grundläggande relationsdatabaser.
- Migreringen från db.json till PostgreSQL behöver genomföras korrekt så att befintlig data och datamodell inte går förlorad.


---

## 5. Hur vi verifierar beslutet

- [ ] Next.js-applikationen kan ansluta till PostgreSQL via Prisma.
- [ ] Den tidigare datan från db.json har migrerats till PostgreSQL där det är relevant.
- [ ] Applikationen kan skapa, läsa, uppdatera och ta bort data via Prisma.
- [ ] Relationer mellan relevanta datamodeller fungerar korrekt.
- [ ] Data finns kvar efter att applikationen eller utvecklingsservern startas om.
- [ ] De viktigaste funktionerna som tidigare använde JSON Server fungerar utan db.json och JSON Server.
- [ ] Databasschemat kan uppdateras med Prisma Migrate på ett kontrollerat sätt.

Förväntat slutresultat:
db.json + JSON Server ersätts som backend/databaskälla av PostgreSQL + Prisma, medan Next.js fortsatt används som applikationens ramverk.

---
