## CO₂-Emissionen aus fossilen Energieträgern

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
- **Kohle:** Steinkohle, Braunkohle und importierter Koks mit den länderspezifischen
  Emissionsfaktoren der Inventur. In Österreich erzeugter Koks wird nicht gezählt, da er aus
  der bereits erfassten Steinkohle hergestellt wird. Enthalten sind auch die Emissionen aus
  Kohle und Koks, die im Hochofen als Reduktionsmittel eingesetzt werden. Diese werden in der
  Inventur unter den Industrieprozessen verbucht.

Die Abweichung zu den jährlichen Werten der Inventur liegt seit 2014 für Erdgas und
Mineralöl bei maximal rund 2,5 %, für Kohle und den internationalen Flugverkehr bei
maximal rund 4,5 %. Nicht enthalten sind Emissionen aus der Verbrennung des fossilen
Anteils von Abfällen (rund 2 Mt CO₂ pro Jahr) sowie Prozessemissionen, die nicht aus
fossilen Brennstoffen stammen (z. B. aus Kalkstein in der Zementherstellung).
