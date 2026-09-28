## CO₂-Emissionen

Die CO₂-Emissionen von Erdgas und Mineralöl werden nach der Methodik von
[co2-emissions-austria](https://github.com/ElijahStaengl/co2_fuel_combustion_final)
berechnet und an der österreichischen Treibhausgas-Inventur (NID 2026 des
Umweltbundesamts) kalibriert:

- **Erdgas:** Der Inlandsverbrauch wird vom Brennwert auf den Heizwert umgerechnet
  und um den nicht-energetischen Einsatz für die Ammoniakproduktion reduziert.
- **Mineralöl:** Für Gasöl und Diesel, Benzin, Heizöl, Flüssiggas und Kerosin werden
  länderspezifische Heizwerte und Emissionsfaktoren verwendet. Der Kerosin-Absatz für
  internationale Flüge wird abgezogen, da er nicht zu den nationalen Emissionen zählt.
  Ein konstanter Betrag pro Monat gleicht die Differenz zur Inventur aus (Verbrennung,
  die den erfassten Produkten nicht zugeordnet werden kann).
- **Internationaler Flugverkehr:** Kerosin-Absatz an internationale Flüge laut eurostat,
  kalibriert an den Emissionen der Luftschadstoff-Inventur des Umweltbundesamts
  (Durchschnitt der letzten drei verfügbaren Jahre).
- **Kohle:** Steinkohle, Braunkohle und Koks mit Standard-Emissionsfaktoren, ohne Kalibrierung.

Die Abweichung zu den jährlichen Werten der Inventur liegt seit 2014 für Erdgas und
Mineralöl bei maximal rund 2,5 %, für den internationalen Flugverkehr bei maximal rund 4 %.
