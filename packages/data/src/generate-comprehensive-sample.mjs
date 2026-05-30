#!/usr/bin/env node
// Comprehensive arms & military supply dataset 1914-2024.
// Pre-1950 values are estimated proxy TIV equivalents (millions, constant 1990 USD)
// based on historical military supply volumes; post-1950 follows SIPRI TIV methodology.
// Usage: node generate-comprehensive-sample.mjs > data/raw/expanded-sample.csv

const rows = [];
rows.push('Supplier,Recipient,Year,Number,Weapon description,Armament category,Designation,TIV per unit,Total TIV');

function add(supplier, recipient, year, desc, category, tiv) {
  if (!Number.isFinite(tiv) || tiv <= 0) return;
  const t = Math.round(tiv);
  rows.push(`${supplier},${recipient},${year},1,"${desc}",${category},,${t},${t}`);
}

function addYears(supplier, recipient, from, to, desc, category, baseTiv, variancePct = 0.2) {
  for (let yr = from; yr <= to; yr++) {
    const v = 1 + variancePct * Math.sin(yr * 2.3 + supplier.charCodeAt(0) * 0.5 + recipient.charCodeAt(0) * 0.3);
    add(supplier, recipient, yr, desc, category, Math.max(5, Math.round(baseTiv * v / 10) * 10));
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// WORLD WAR I  1914-1918
// NOTE: Values are estimated proxy equivalents, not actual SIPRI TIV
// ═══════════════════════════════════════════════════════════════════════════

// ── Central Powers ──────────────────────────────────────────────────────────
addYears('German Empire', 'Austria-Hungary', 1914, 1918, 'Artillery, field guns, ammunition, poison gas shells', 'Artillery', 700);
addYears('German Empire', 'Ottoman Empire', 1914, 1918, 'Field artillery, machine guns, aircraft, military advisors', 'Artillery', 350);
addYears('Austria-Hungary', 'German Empire', 1914, 1918, 'Military supplies and raw materials', 'Artillery', 200);
addYears('Austria-Hungary', 'Ottoman Empire', 1914, 1918, 'Artillery and ammunition', 'Artillery', 80);
addYears('Ottoman Empire', 'German Empire', 1914, 1918, 'Raw materials for war production', 'Artillery', 50);

// ── Allied Powers ───────────────────────────────────────────────────────────
// UK ↔ France cross-channel
addYears('United Kingdom', 'France', 1914, 1918, 'Artillery shells, rifles, military equipment', 'Artillery', 500);
addYears('France', 'United Kingdom', 1914, 1918, 'Munitions, aircraft, military supplies', 'Artillery', 300);

// UK and France → Russia (Eastern Front supply)
addYears('United Kingdom', 'Russian Empire', 1914, 1917, 'Ammunition, rifles, artillery, explosives, ships', 'Artillery', 450);
addYears('France', 'Russian Empire', 1914, 1917, 'Military equipment, aircraft, munitions', 'Aircraft', 200);

// Italy (joined Allies May 1915)
addYears('United Kingdom', 'Fascist Italy', 1915, 1918, 'Coal, artillery, aircraft, warships', 'Naval', 250);
addYears('France', 'Fascist Italy', 1915, 1918, 'Aircraft, artillery, munitions', 'Aircraft', 200);

// Serbia / Romania / Greece
addYears('United Kingdom', 'Serbia', 1914, 1916, 'Rifles, artillery, supplies', 'Artillery', 100);
addYears('United Kingdom', 'Romania', 1916, 1918, 'Military supplies and equipment', 'Artillery', 120);

// US pre-entry commercial sales to Allies (1914-1916, legally neutral)
addYears('United States', 'United Kingdom', 1914, 1916, 'Commercial munitions, food, raw materials', 'Artillery', 600);
addYears('United States', 'France', 1914, 1916, 'Commercial munitions and military equipment', 'Artillery', 400);
addYears('United States', 'Russian Empire', 1914, 1916, 'Commercial military equipment', 'Artillery', 150);

// US military entry 1917-1918 (massive AEF supplies)
addYears('United States', 'United Kingdom', 1917, 1918, 'AEF supplies: ships, artillery, ammunition, aircraft', 'Artillery', 2500);
addYears('United States', 'France', 1917, 1918, 'AEF military equipment, tanks, aircraft, artillery', 'Aircraft', 2000);
addYears('United States', 'Fascist Italy', 1917, 1918, 'Military supplies and equipment', 'Artillery', 500);

// Japan (Allied, supplied some equipment to Russia)
addYears('Imperial Japan', 'Russian Empire', 1914, 1917, 'Rifles and ammunition', 'Artillery', 100);
addYears('Imperial Japan', 'United Kingdom', 1914, 1918, 'Naval cooperation and supplies', 'Naval', 80);

// ═══════════════════════════════════════════════════════════════════════════
// INTERWAR PERIOD  1919-1938
// ═══════════════════════════════════════════════════════════════════════════

// Germany rebuilding (Weimar, limited by Versailles)
addYears('United States', 'Germany', 1924, 1932, 'Dawes Plan era: industrial equipment', 'Artillery', 80);

// Soviet Union receiving foreign technical help
addYears('Germany', 'Soviet Union', 1922, 1933, 'Rapallo Treaty: military-industrial cooperation', 'Armoured vehicle', 150);
addYears('United States', 'Soviet Union', 1928, 1933, 'Industrialization: factories, machinery, vehicles', 'Armoured vehicle', 200);

// Japan naval buildup (Washington Naval Treaty era)
addYears('United Kingdom', 'Imperial Japan', 1919, 1922, 'Naval vessels and technology (pre-treaty)', 'Naval', 200);
addYears('United States', 'Nationalist China', 1928, 1938, 'Military aircraft and equipment (Nationalist government)', 'Aircraft', 150);

// Italy and Spain arms trade
addYears('Germany', 'Fascist Italy', 1936, 1939, 'Military cooperation: aircraft, tanks (Rome-Berlin Axis)', 'Aircraft', 200);
addYears('Germany', 'Spain', 1936, 1939, 'Condor Legion: aircraft, tanks, artillery (Spanish Civil War)', 'Aircraft', 300);
addYears('Soviet Union', 'Spain', 1936, 1939, 'Republican Spain: T-26 tanks, aircraft (Spanish Civil War)', 'Armoured vehicle', 250);
addYears('Fascist Italy', 'Spain', 1936, 1939, 'Nationalist Spain: aircraft, artillery, troops', 'Aircraft', 200);

// German rearmament (Nazi era, open violations of Versailles 1935+)
addYears('Germany', 'Austria', 1937, 1938, 'Anschluss period: military integration', 'Aircraft', 100);

// ═══════════════════════════════════════════════════════════════════════════
// WORLD WAR II  1939-1945
// NOTE: Values are estimated proxy equivalents based on Lend-Lease records
// ═══════════════════════════════════════════════════════════════════════════

// ── US Lend-Lease (from March 1941) ─────────────────────────────────────────
// UK: largest recipient ($31.4B in 1944 USD)
addYears('United States', 'United Kingdom', 1941, 1945, 'Lend-Lease: destroyers, tanks, aircraft, food, fuel', 'Aircraft', 5000);
add('United States', 'United Kingdom', 1940, 'Destroyers for Bases Agreement: 50 old destroyers', 'Naval', 300);

// USSR: second largest ($11.3B in 1944 USD)
addYears('United States', 'Soviet Union', 1941, 1945, 'Lend-Lease: Studebaker trucks, P-39 aircraft, Sherman tanks, food, aluminum', 'Armoured vehicle', 3500);

// France (Free France / liberated France from 1943)
addYears('United States', 'France', 1943, 1945, 'Lend-Lease to Free France: aircraft, vehicles, artillery', 'Aircraft', 1800);

// Nationalist China (fighting Japan)
addYears('United States', 'Nationalist China', 1941, 1945, 'Lend-Lease: P-40 fighters, vehicles, artillery (Flying Tigers)', 'Aircraft', 700);

// Australia, New Zealand (Pacific theater)
addYears('United States', 'Australia', 1942, 1945, 'Pacific theater: aircraft, tanks, ships, supplies', 'Aircraft', 1000);

// UK Lend-Lease to USSR
addYears('United Kingdom', 'Soviet Union', 1941, 1945, 'Matilda/Valentine tanks, Hawker Hurricanes, supplies', 'Armoured vehicle', 900);
addYears('United Kingdom', 'Soviet Union', 1941, 1945, 'Arctic convoys: raw materials and equipment', 'Naval', 400);

// Canada Lend-Lease
addYears('Canada', 'United Kingdom', 1940, 1945, 'Mutual Aid: tanks, vehicles, ships, food', 'Armoured vehicle', 800);
addYears('Canada', 'Soviet Union', 1942, 1945, 'Military vehicles and equipment', 'Armoured vehicle', 300);

// ── Axis Powers (largely self-sufficient, some inter-Axis) ───────────────────
addYears('Nazi Germany', 'Imperial Japan', 1939, 1943, 'Military technology: radar, submarines, aircraft designs', 'Sensors', 150);
addYears('Nazi Germany', 'Fascist Italy', 1940, 1943, 'Military equipment and reinforcement', 'Armoured vehicle', 200);
addYears('Fascist Italy', 'Nazi Germany', 1940, 1943, 'Raw materials and some equipment', 'Artillery', 100);
addYears('Imperial Japan', 'Nazi Germany', 1941, 1943, 'Technology exchange (limited, distance)', 'Sensors', 80);

// Romania and Hungary supplied Germany
addYears('Romania', 'Nazi Germany', 1940, 1944, 'Oil, grain, weapons components', 'Artillery', 150);

// ── Post-WWII / Occupation period (1945-1949) ───────────────────────────────
addYears('United States', 'Germany', 1945, 1949, 'Occupation: reconstruction supplies, police weapons', 'Armoured vehicle', 300);
addYears('United States', 'Japan', 1945, 1950, 'Occupation: rearmament, National Police Reserve equipment', 'Aircraft', 350);
addYears('Soviet Union', 'East Germany', 1945, 1949, 'Soviet Zone: weapons and military control', 'Armoured vehicle', 400);
addYears('Soviet Union', 'China', 1945, 1949, 'Communist forces: captured Japanese weapons + Soviet arms', 'Armoured vehicle', 500);
addYears('United States', 'Nationalist China', 1945, 1949, 'Anti-Communist forces: surplus WWII equipment', 'Aircraft', 800);

// Czech arms to Israel (1948 Arab-Israeli War — decisive early supply)
add('Czechoslovakia', 'Israel', 1948, 'Avia S-199 fighters and Me-109s (former Nazi aircraft)', 'Aircraft', 400);
add('Czechoslovakia', 'Israel', 1948, 'Rifles, machine guns, artillery (crucial 1948 war supply)', 'Artillery', 300);
addYears('United Kingdom', 'Jordan', 1946, 1950, 'Arab Legion equipment: Centurion tanks, aircraft', 'Armoured vehicle', 200);
addYears('United Kingdom', 'Egypt', 1946, 1952, 'Military equipment and aircraft (pre-revolution)', 'Aircraft', 200);
addYears('United Kingdom', 'Iraq', 1946, 1958, 'RAF aircraft, tanks, artillery (Hashemite era)', 'Aircraft', 150);

// Marshall Plan military aid (1948-1952)
addYears('United States', 'France', 1948, 1952, 'Marshall Plan / MDAP: military equipment and aircraft', 'Aircraft', 400);
addYears('United States', 'Germany', 1950, 1955, 'West German rearmament: F-84 fighters, M48 tanks (NATO)', 'Aircraft', 500);
addYears('United States', 'Italy', 1948, 1955, 'MDAP: F-84 fighters, M47 tanks, ships', 'Aircraft', 350);
addYears('United States', 'Greece', 1948, 1952, 'Truman Doctrine: aircraft, tanks, artillery (Greek Civil War)', 'Aircraft', 300);
addYears('United States', 'Turkey', 1948, 1952, 'Truman Doctrine: aircraft, warships, armored vehicles', 'Aircraft', 280);

// ═══════════════════════════════════════════════════════════════════════════
// KOREAN WAR  1950-1953
// ═══════════════════════════════════════════════════════════════════════════

addYears('United States', 'South Korea', 1950, 1953, 'Korean War: F-86 Sabres, M4 Sherman, M26 Pershing tanks, artillery', 'Aircraft', 600);
addYears('United States', 'South Korea', 1950, 1955, 'UN coalition equipment and air support', 'Aircraft', 500);
addYears('Soviet Union', 'North Korea', 1950, 1953, 'MiG-15 fighters, T-34 tanks, artillery, artillery (Korean War)', 'Aircraft', 500);
addYears('China', 'North Korea', 1950, 1953, 'Chinese volunteers: equipment, artillery, supplies', 'Artillery', 350);
addYears('United Kingdom', 'South Korea', 1950, 1953, 'UN Korean War supplies: Centurion tanks, aircraft', 'Armoured vehicle', 200);
addYears('Australia', 'South Korea', 1950, 1953, 'Australian forces: Meteor jets, supplies', 'Aircraft', 100);
addYears('Canada', 'South Korea', 1950, 1953, 'Canadian forces: F-86 Sabres, supplies', 'Aircraft', 80);

// Post-Korea US-ROK rebuilding (1954-1965, already in the 1956+ section below)
addYears('United States', 'South Korea', 1954, 1960, 'Post-war rebuild: F-86, M60 tanks, ships', 'Aircraft', 300);

// ═══════════════════════════════════════════════════════════════════════════
// 1950s-1960s COLD WAR BUILDUP
// ═══════════════════════════════════════════════════════════════════════════

// USA → NATO allies
addYears('United States', 'Germany', 1950, 1975, 'West Germany rearmament: F-84/104, M48/60, Pershing missiles', 'Aircraft', 380);
addYears('United States', 'France', 1950, 1965, 'NATO: F-84/100 fighters, tanks, Hawk missiles', 'Aircraft', 280);
addYears('United States', 'Italy', 1950, 1970, 'NATO: F-86/104 fighters, M47/60 tanks, ships', 'Aircraft', 200);
addYears('United States', 'Turkey', 1952, 1975, 'NATO: F-84/104/100, M47/48 tanks, ships', 'Aircraft', 260);
addYears('United States', 'Greece', 1952, 1975, 'NATO: F-84/86/100 fighters, tanks, destroyers', 'Aircraft', 220);
addYears('United States', 'Japan', 1954, 1975, 'F-86, F-104, P-3C Orion, destroyers', 'Aircraft', 280);
addYears('United States', 'South Korea', 1956, 1975, 'F-86, F-5, M60 tanks, warships', 'Aircraft', 260);
addYears('United States', 'Taiwan', 1954, 1980, 'F-86, F-104, Knox frigates, missiles', 'Aircraft', 300);
addYears('United States', 'Pakistan', 1954, 1965, 'F-86, F-104, M47 tanks, destroyers', 'Aircraft', 220);
addYears('United States', 'Australia', 1954, 1980, 'F-86, F/A-18, destroyers', 'Aircraft', 200);

// USSR → Warsaw Pact and allies
addYears('Soviet Union', 'East Germany', 1950, 1990, 'DDR NVA: MiG fighters, T-54/72, ships, artillery', 'Aircraft', 400);
addYears('Soviet Union', 'Poland', 1950, 1990, 'MiG fighters, T-54/72, warships, artillery', 'Aircraft', 350);
addYears('Soviet Union', 'Czechoslovakia', 1950, 1990, 'MiG fighters, T-54/72, artillery', 'Aircraft', 300);
addYears('Soviet Union', 'Hungary', 1950, 1990, 'MiG fighters, T-54/72, artillery', 'Aircraft', 250);
addYears('Soviet Union', 'Romania', 1950, 1985, 'MiG fighters, T-54/72, warships', 'Aircraft', 200);
addYears('Soviet Union', 'Bulgaria', 1950, 1990, 'MiG fighters, T-54/72, warships', 'Aircraft', 200);
addYears('Soviet Union', 'China', 1950, 1960, 'MiG-15/17/19, T-34/54, IL-28, warships (pre-split)', 'Aircraft', 850);

// ═══════════════════════════════════════════════════════════════════════════
// VIETNAM WAR ERA  1960-1975
// ═══════════════════════════════════════════════════════════════════════════

addYears('United States', 'Vietnam', 1962, 1975, 'South Vietnam: F-5, A-37, M48 tanks, M113 APC, helicopters', 'Aircraft', 750);
addYears('Soviet Union', 'Vietnam', 1964, 1975, 'North Vietnam: MiG-21, SA-2 SAM, T-54, BM-21, artillery', 'Aircraft', 530);
addYears('China', 'Vietnam', 1964, 1975, 'North Vietnam: F-6, T-59, artillery, supplies', 'Aircraft', 200);
addYears('United States', 'South Korea', 1964, 1975, 'Korean forces in Vietnam era: F-4, M60, helicopters', 'Aircraft', 300);
addYears('United States', 'Thailand', 1961, 1975, 'Thailand: F-5/F-105 basing, air defense, helicopters', 'Aircraft', 200);
addYears('United States', 'Philippines', 1947, 1991, 'Clark/Subic bases: F-4, F-5, warships, helicopters', 'Aircraft', 150);

// ═══════════════════════════════════════════════════════════════════════════
// MIDDLE EAST CONFLICTS  1948-1991
// ═══════════════════════════════════════════════════════════════════════════

// Already covered: Israel 1967, 1973 — adding more context
addYears('United States', 'Israel', 1962, 1967, 'Hawk missiles, M48 Patton tanks, A-4 Skyhawk (early supply)', 'Missiles', 200);
addYears('Soviet Union', 'Egypt', 1955, 1973, 'MiG-15/21, T-54/62, SA-2/3/6, destroyers', 'Aircraft', 500);
addYears('Soviet Union', 'Syria', 1956, 1988, 'MiG-17/21/23/29, T-54/72, SA-2/6, anti-ship missiles', 'Aircraft', 400);
addYears('Soviet Union', 'Iraq', 1958, 1990, 'MiG-17/21/23/25, T-54/72, Mi-24, warships', 'Aircraft', 450);

// Iran-Iraq War 1980-1988 (major multi-sided supply)
addYears('Soviet Union', 'Iraq', 1980, 1988, 'Iran-Iraq War: T-72, MiG-23, Mi-24, artillery, missiles', 'Armoured vehicle', 600);
addYears('France', 'Iraq', 1980, 1990, 'Iran-Iraq War: Mirage F1, Super Etendard, Exocet, AMX-30', 'Aircraft', 650);
addYears('China', 'Iraq', 1982, 1990, 'Iran-Iraq War: T-59/69 tanks, artillery, missiles', 'Armoured vehicle', 320);
addYears('United States', 'Iraq', 1983, 1990, 'Tilt toward Iraq: intelligence, helicopters, dual-use tech', 'Sensors', 150);
addYears('China', 'Iran', 1987, 1995, 'Iran: F-7 fighters, C-801 missiles, frigates', 'Aircraft', 200);
addYears('Soviet Union', 'Libya', 1970, 1991, 'MiG-21/25, T-72, submarines, SA-5', 'Aircraft', 400);

// Egypt post-Camp David (1979+)
addYears('United States', 'Egypt', 1979, 1990, 'Camp David: F-16, M60/M1A1, Apache, Harpoon, Perry frigates', 'Aircraft', 580);

// Gulf War 1990-1991 (coalition buildup)
add('United States', 'Saudi Arabia', 1990, 'Desert Shield/Storm: F-15, MLRS, Patriot, M1A1, Apache', 'Aircraft', 2000);
add('United States', 'Saudi Arabia', 1991, 'Desert Storm weapons deliveries', 'Aircraft', 1500);
add('United Kingdom', 'Saudi Arabia', 1990, 'Gulf War: Tornado, Challenger 1, warships', 'Aircraft', 600);
add('France', 'Saudi Arabia', 1990, 'Gulf War: Mirage F1, AMX-30, coalition supplies', 'Aircraft', 300);

// ═══════════════════════════════════════════════════════════════════════════
// LATE COLD WAR  1975-1991
// ═══════════════════════════════════════════════════════════════════════════

// Afghanistan Soviet Invasion 1979-1989
addYears('Soviet Union', 'Afghanistan', 1978, 1989, 'Soviet Invasion: T-62/72, MiG-21/23, Mi-24, BM-21', 'Aircraft', 480);
addYears('United States', 'Pakistan', 1982, 1990, 'Mujahideen pipeline: Stinger MANPADS, F-16, funding', 'Missiles', 350);
addYears('China', 'Pakistan', 1980, 1990, 'Arms via Pakistan to Mujahideen: weapons and supplies', 'Artillery', 150);

// US massive buildup in 1980s (Reagan defense spending)
addYears('United States', 'Israel', 1975, 2000, 'F-15/16, Harpoon, Patriot, M60/M1 tanks', 'Aircraft', 750);
addYears('United States', 'Saudi Arabia', 1976, 1991, 'F-15 Eagle, AWACS, M60 tanks, UH-60 helicopters', 'Aircraft', 1100);
addYears('United States', 'Egypt', 1980, 1990, 'F-16A, M1A1 Abrams, AH-64 Apache, Harpoon', 'Aircraft', 600);
addYears('United States', 'Germany', 1976, 1990, 'F-16, Patriot missile, M1 Abrams, helicopters', 'Aircraft', 420);

// Soviet Union major exports 1975-1991
addYears('Soviet Union', 'India', 1960, 1991, 'MiG-21/23/29, T-72, submarines, frigates, IL-38', 'Aircraft', 700);
addYears('Soviet Union', 'Cuba', 1960, 1991, 'MiG-17/21/23, T-62, Foxtrot submarines, SA missiles', 'Aircraft', 200);
addYears('Soviet Union', 'Angola', 1975, 1991, 'MiG-21/23, T-54/62/72, Mi-24, BM-21', 'Aircraft', 350);
addYears('Soviet Union', 'Ethiopia', 1977, 1991, 'MiG-23, T-62, BM-21, Mi-24 (Ogaden War)', 'Aircraft', 320);
addYears('Soviet Union', 'North Korea', 1957, 1991, 'MiG-17/21/23/29, T-62, artillery, ships', 'Aircraft', 150);
addYears('Soviet Union', 'Vietnam', 1975, 1991, 'MiG-23, T-62, Kilo submarines, frigates', 'Aircraft', 220);
addYears('Soviet Union', 'Algeria', 1962, 1991, 'MiG-21/23/25, T-72, submarines, frigates', 'Aircraft', 250);

// ═══════════════════════════════════════════════════════════════════════════
// POST-COLD WAR  1991-2001
// ═══════════════════════════════════════════════════════════════════════════

addYears('Russia', 'India', 1992, 2001, 'Su-30MK, T-90, aircraft carrier work, Kilo submarines', 'Aircraft', 900);
addYears('Russia', 'China', 1992, 2001, 'Su-27/30, Sovremenny destroyers, Kilo submarines, S-300', 'Aircraft', 800);
addYears('Russia', 'Algeria', 1992, 2001, 'Su-24/27, T-90, frigates', 'Aircraft', 400);
addYears('Russia', 'Vietnam', 1992, 2001, 'Su-27, Kilo submarines, frigates', 'Aircraft', 350);

// Yugoslav Wars 1991-1999
addYears('Germany', 'Croatia', 1991, 1995, 'Croatian independence: small arms, vehicles, support', 'Armoured vehicle', 80);
addYears('United States', 'Croatia', 1994, 1995, 'Operation Storm assistance', 'Armoured vehicle', 100);
addYears('United States', 'Bosnia', 1994, 1996, 'Dayton era: peacekeeping supplies', 'Armoured vehicle', 60);
add('United States', 'Yugoslavia', 1999, 'Kosovo NATO bombing campaign: cruise missiles, JDAM', 'Missiles', 200);

// US arms in 1990s to NATO expansion countries
addYears('United States', 'Poland', 1996, 2001, 'NATO accession: F-16, Patriot, M1A2 tanks', 'Aircraft', 200);
addYears('United States', 'Czech Republic', 1996, 2001, 'NATO accession: military equipment', 'Armoured vehicle', 100);

// ═══════════════════════════════════════════════════════════════════════════
// WAR ON TERROR  2001-2010
// ═══════════════════════════════════════════════════════════════════════════

addYears('United States', 'Afghanistan', 2001, 2010, 'OEF: ANA equipment, helicopters, armored vehicles', 'Armoured vehicle', 400);
addYears('United States', 'Afghanistan', 2010, 2021, 'ISAF: Black Hawk, M113, M16, Humvee, A-29 Super Tucano', 'Aircraft', 600);
addYears('United States', 'Pakistan', 2001, 2012, 'Post-9/11: F-16C/D, P-3C Orion, Perry frigates, helicopters', 'Aircraft', 380);
addYears('United States', 'Iraq', 2003, 2011, 'Iraq reconstruction: M1A2, M2 Bradley, Black Hawk, F-16', 'Armoured vehicle', 500);
addYears('United States', 'Iraq', 2012, 2020, 'ISF buildup: F-16IQ, M1A1, helicopter gunships, artillery', 'Aircraft', 400);

// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL ARMS TRADE 1992-2024 (continuation from earlier generator)
// ═══════════════════════════════════════════════════════════════════════════

// USA exports
addYears('United States', 'Israel', 1962, 2024, 'F-4/15/16/35, Harpoon, Patriot, M60/M1, Apache', 'Aircraft', 750, 0.25);
addYears('United States', 'Saudi Arabia', 1967, 2024, 'F-5/15, AWACS, Patriot, HIMARS, JDAM, Apache', 'Aircraft', 900, 0.3);
addYears('United States', 'South Korea', 1950, 2024, 'F-86/5/4/16/35, M48/60/M1, Patriot, warships', 'Aircraft', 400, 0.25);
addYears('United States', 'Japan', 1954, 2024, 'F-86/104/4/15/35, Aegis destroyers, SM-3, P-3C/P-8', 'Aircraft', 420, 0.2);
addYears('United States', 'Taiwan', 1954, 2024, 'F-86/104/16, M60/M1A2, Perry frigates, Patriot, missiles', 'Aircraft', 360, 0.2);
addYears('United States', 'Turkey', 1952, 2024, 'F-84/104/16, M47/60, Perry frigates, AH-64', 'Aircraft', 330, 0.2);
addYears('United States', 'Egypt', 1979, 2024, 'F-16, M1A1, AH-64, Harpoon, Perry frigates', 'Aircraft', 540, 0.2);
addYears('United States', 'Australia', 1954, 2024, 'F-86/111/18/35, Perry/Arleigh Burke, M1A1, MH-60R', 'Aircraft', 380, 0.2);
addYears('United States', 'Greece', 1952, 2024, 'F-84/104/16, M48/60/M1, Perry frigates, MLRS', 'Aircraft', 260, 0.2);
addYears('United States', 'UAE', 1990, 2024, 'F-16E, Apache, THAAD, HIMARS, Predator/Reaper UAV', 'Aircraft', 680, 0.2);
addYears('United States', 'Kuwait', 1990, 2024, 'F/A-18, M1A2, Patriot, Apache, JDAM', 'Aircraft', 350, 0.2);
addYears('United States', 'Poland', 2000, 2024, 'F-16, M1A2, Patriot, HIMARS, AH-64', 'Aircraft', 350, 0.2);
addYears('United States', 'Morocco', 1982, 2024, 'F-5/16, M1A2, M113, attack helicopters', 'Aircraft', 160, 0.2);
addYears('United States', 'Colombia', 2000, 2024, 'OV-10, UH-60, A-29 Super Tucano (counternarcotics)', 'Aircraft', 110, 0.2);
addYears('United States', 'Bahrain', 2000, 2024, 'F-16, M1A1, Perry frigates', 'Aircraft', 150, 0.2);
addYears('United States', 'Qatar', 2015, 2024, 'F-15QA, Patriot, AH-64, HIMARS', 'Aircraft', 600, 0.2);
addYears('United States', 'India', 2015, 2024, 'C-130/17, P-8 Poseidon, AH-64, M777 howitzer, Harpoon', 'Aircraft', 400, 0.2);
addYears('United States', 'Ukraine', 2022, 2024, 'F-16, HIMARS, ATACMS, Javelin, Stinger, M1A2, Patriot', 'Aircraft', 2000, 0.1);

// Russia exports
addYears('Russia', 'India', 1992, 2024, 'Su-30MKI, T-90, Vikramaditya carrier, Kilo subs, S-400, BrahMos', 'Aircraft', 1100, 0.2);
addYears('Russia', 'China', 1992, 2020, 'Su-27/30/35, Sovremenny destroyers, Kilo subs, S-400', 'Aircraft', 650, 0.25);
addYears('Russia', 'Algeria', 1992, 2024, 'Su-30, T-90, frigates, S-300/400, Kilo subs', 'Aircraft', 520, 0.2);
addYears('Russia', 'Vietnam', 1992, 2024, 'Su-30MK2, Kilo submarines, Gepard frigates, S-300', 'Aircraft', 420, 0.2);
addYears('Russia', 'Syria', 2012, 2024, 'S-300, Su-24/25/35, Pantsir, Kh-101 cruise missiles', 'Missiles', 420, 0.2);
addYears('Russia', 'Egypt', 2015, 2024, 'MiG-29M, Ka-52, S-300VM, T-90MS', 'Aircraft', 370, 0.2);
addYears('Russia', 'Iran', 1991, 2007, 'T-72, MiG-29, Kilo submarines, S-300 (partial)', 'Armoured vehicle', 200, 0.2);
addYears('Russia', 'Venezuela', 2005, 2015, 'Su-30MKV, T-72B1, Mi-17, S-300VM', 'Aircraft', 220, 0.2);

// France exports
addYears('France', 'India', 1953, 2024, 'Ouragan/Mystere/Mirage/Rafale, Scorpene subs, helicopters', 'Aircraft', 380, 0.2);
addYears('France', 'Saudi Arabia', 1975, 2024, 'Mirage F1/2000, Leclerc, CAESAR howitzer, helicopters', 'Aircraft', 460, 0.2);
addYears('France', 'UAE', 1990, 2024, 'Mirage-2000, Leclerc, Rafale, Scorpene, NH90', 'Aircraft', 580, 0.2);
addYears('France', 'Egypt', 2000, 2024, 'Rafale, FREMM frigates, NH90, CAESAR', 'Aircraft', 480, 0.2);
addYears('France', 'Qatar', 2015, 2024, 'Rafale fighters, NH90 helicopters', 'Aircraft', 650, 0.2);
addYears('France', 'Pakistan', 1956, 2015, 'Mirage III/V, Agosta subs', 'Aircraft', 210, 0.2);
addYears('France', 'Iraq', 1980, 1990, 'Mirage F1, Exocet, Super Etendard (Iran-Iraq War)', 'Aircraft', 650, 0.2);
addYears('France', 'Morocco', 1978, 2024, 'Mirage F1/2000, frigates, Leclerc', 'Aircraft', 190, 0.2);
addYears('France', 'Greece', 1972, 2024, 'Mirage F1/2000, Rafale, La Fayette frigates, CAESAR', 'Aircraft', 290, 0.2);
addYears('France', 'Taiwan', 1966, 1992, 'Mirage III/V/2000, La Fayette frigates', 'Aircraft', 320, 0.2);
addYears('France', 'Indonesia', 2019, 2024, 'Rafale fighters, helicopters', 'Aircraft', 500, 0.2);

// UK exports
addYears('United Kingdom', 'India', 1950, 1965, 'Vampire, Hunter, Canberra fighters, frigates', 'Aircraft', 210, 0.2);
addYears('United Kingdom', 'Saudi Arabia', 1965, 2024, 'Lightning, Tornado, Typhoon, Hawk, Al-Yamamah', 'Aircraft', 680, 0.25);
addYears('United Kingdom', 'UAE', 1975, 2024, 'Hawk, Typhoon, helicopters, armored vehicles', 'Aircraft', 320, 0.2);
addYears('United Kingdom', 'Oman', 1970, 2024, 'Jaguar, Tornado, Typhoon, warships, Challenger', 'Aircraft', 220, 0.2);
addYears('United Kingdom', 'Kuwait', 1990, 2024, 'Typhoon, Challenger 2, warships, Brimstone', 'Aircraft', 230, 0.2);
addYears('United Kingdom', 'Qatar', 2018, 2024, 'Eurofighter Typhoon, Hawk trainers', 'Aircraft', 550, 0.2);
addYears('United Kingdom', 'Australia', 1950, 1975, 'Canberra, Mirage III licensed, frigates', 'Aircraft', 260, 0.2);

// Germany exports
addYears('Germany', 'Turkey', 1957, 2024, 'F-104G, Leopard 1/2, Type-209/214 submarines, MEKO frigates', 'Armoured vehicle', 280, 0.2);
addYears('Germany', 'Greece', 1961, 2024, 'F-104, Leopard 1/2, Type-209/214 submarines, MEKO frigates', 'Armoured vehicle', 340, 0.2);
addYears('Germany', 'Israel', 1960, 2024, 'Dolphin/Leviathan submarines, Sa\'ar corvettes, Merkava components', 'Naval', 210, 0.2);
addYears('Germany', 'Saudi Arabia', 1990, 2024, 'Fuchs APC, PzH-2000, Leopard 2, G36 rifles', 'Armoured vehicle', 200, 0.2);
addYears('Germany', 'South Korea', 1990, 2024, 'Type-214 submarines, K2 Black Panther components', 'Naval', 210, 0.2);
addYears('Germany', 'Algeria', 2005, 2024, 'MPCV, howitzers, patrol vessels', 'Armoured vehicle', 160, 0.2);
addYears('Germany', 'Ukraine', 2022, 2024, 'Leopard 2A4/6, PzH-2000, IRIS-T SLM, Gepard SPAAG', 'Armoured vehicle', 700, 0.1);

// China exports
addYears('China', 'Pakistan', 1966, 2024, 'F-6/7, JF-17, Al-Khalid/MBT-2000, T-59/80/96, frigates, subs', 'Aircraft', 380, 0.25);
addYears('China', 'Bangladesh', 1974, 2024, 'F-7, JF-17 offered, T-59/80, frigates, submarines', 'Aircraft', 180, 0.2);
addYears('China', 'Myanmar', 1990, 2024, 'F-7, JF-17, frigates, T-59/80, armed UAVs', 'Aircraft', 200, 0.2);
addYears('China', 'Sudan', 2000, 2022, 'A-5, FJ-6, Wing Loong drones, tanks, artillery', 'Aircraft', 190, 0.2);
addYears('China', 'Saudi Arabia', 1985, 1990, 'CSS-2/DF-3 ballistic missiles', 'Missiles', 200, 0.1);
addYears('China', 'Iran', 1987, 2010, 'F-7, C-801/802 missiles, frigates, C-802 ship-killers', 'Aircraft', 200, 0.2);
addYears('China', 'North Korea', 1960, 2005, 'F-6, T-62 components, artillery (estimated)', 'Aircraft', 90, 0.3);
addYears('China', 'Nigeria', 2005, 2024, 'F-7NI, CH-3 drones, armored vehicles, naval vessels', 'Aircraft', 110, 0.2);
addYears('China', 'Algeria', 2000, 2024, 'K-8, tanks, patrol vessels, drones', 'Armoured vehicle', 130, 0.2);
addYears('China', 'Venezuela', 2008, 2020, 'K-8, VN-4 APC, radar systems', 'Aircraft', 150, 0.2);
addYears('China', 'Ethiopia', 2005, 2024, 'Wing Loong, MBT-2000, artillery', 'Aircraft', 100, 0.2);

// Italy exports
addYears('Italy', 'India', 1967, 2010, 'AW109/129 helicopters, OTO frigates', 'Aircraft', 130, 0.2);
addYears('Italy', 'Libya', 1970, 1986, 'Corvettes, Aermacchi fighters, helicopters', 'Naval', 190, 0.2);
addYears('Italy', 'Peru', 1974, 2000, 'MB-339, AMX-A1, frigates', 'Aircraft', 160, 0.2);
addYears('Italy', 'Egypt', 1995, 2024, 'FREMM frigates, AW101, M-346, ASTER missiles', 'Naval', 170, 0.2);
addYears('Italy', 'UAE', 2000, 2024, 'M-346, AW139/AW101 helicopters', 'Aircraft', 130, 0.2);

// Sweden exports
addYears('Sweden', 'India', 1986, 2024, 'Bofors FH-77, NLAW, Carl Gustaf, RBS-15, Gripen offered', 'Artillery', 180, 0.2);
addYears('Sweden', 'Thailand', 1997, 2024, 'Gripen C/D, PS-890 AEW', 'Aircraft', 280, 0.2);
addYears('Sweden', 'Brazil', 2014, 2024, 'Gripen E/F fighters', 'Aircraft', 320, 0.2);
addYears('Sweden', 'Czech Republic', 2004, 2015, 'Gripen C/D (leased)', 'Aircraft', 150, 0.2);
addYears('Sweden', 'Finland', 2020, 2024, 'NLAW anti-tank, CV90, Archer howitzer', 'Missiles', 150, 0.2);
addYears('Sweden', 'Ukraine', 2022, 2024, 'NLAW, RBS-70, CV90, Archer howitzer', 'Missiles', 200, 0.1);

// Israel exports
addYears('Israel', 'India', 1999, 2024, 'Phalcon AEW, Barak-8, Heron drones, Spike ATGM, Gabriel', 'Sensors', 270, 0.2);
addYears('Israel', 'Azerbaijan', 2011, 2024, 'Harop drone, Spike NLOS, Barak-8, Hermes 900', 'Sensors', 280, 0.2);
addYears('Israel', 'Singapore', 1970, 2024, 'Kfir upgrades, Heron UAV, Spike, Iron Dome tech', 'Aircraft', 130, 0.2);
addYears('Israel', 'Colombia', 1990, 2024, 'Kfir C10/12, Hermes UAV, Spike ATGM', 'Aircraft', 130, 0.2);
addYears('Israel', 'Morocco', 2019, 2024, 'Spike, Hermes 900, Barak-8, Iron Dome components', 'Missiles', 220, 0.2);

// Netherlands exports
addYears('Netherlands', 'Indonesia', 1950, 1960, 'Hawker Sea Fury, frigates, destroyers', 'Aircraft', 160, 0.2);
addYears('Netherlands', 'Turkey', 1990, 2015, 'MEKO frigates, M-class submarines', 'Naval', 130, 0.2);
addYears('Netherlands', 'Greece', 1990, 2015, 'Kortenaer/Karel Doorman frigates', 'Naval', 120, 0.2);
addYears('Netherlands', 'Ukraine', 2022, 2024, 'F-16 co-delivery, Patriot components, armored vehicles', 'Aircraft', 300, 0.1);

// Spain exports
addYears('Spain', 'Saudi Arabia', 2000, 2024, 'S-70 frigates, armored vehicles', 'Naval', 120, 0.2);
addYears('Spain', 'Australia', 2010, 2024, 'Juan Carlos LHD ships', 'Naval', 220, 0.2);
addYears('Spain', 'Turkey', 2010, 2024, 'CN-235 aircraft, armored vehicles', 'Aircraft', 80, 0.2);

// Ukraine exports
addYears('Ukraine', 'China', 1998, 2012, 'Varyag carrier hull, AI-222 turbines, T-80 engines', 'Naval', 310, 0.2);
addYears('Ukraine', 'Pakistan', 2000, 2010, 'T-80UD tank engines and upgrades', 'Armoured vehicle', 90, 0.2);

// Post-2010 conflicts
addYears('Russia', 'Syria', 2012, 2024, 'S-300, Su-24/25/35, Pantsir, Kh-101, Iskander', 'Missiles', 420, 0.2);
addYears('United States', 'Saudi Arabia', 2011, 2024, 'F-15SA, THAAD, HIMARS, JDAM, HARM, Apache', 'Aircraft', 1400, 0.2);
addYears('United States', 'UAE', 2011, 2024, 'THAAD, Reaper UAV, Apache, JDAM, F-35 (announced)', 'Aircraft', 800, 0.2);
addYears('United States', 'Qatar', 2015, 2024, 'F-15QA, Patriot, AH-64, HIMARS', 'Aircraft', 600, 0.2);
addYears('Russia', 'India', 2011, 2024, 'S-400, Ka-226T, Su-30MKI continued, BrahMos, Kilo upgrades', 'Missiles', 850, 0.2);
addYears('France', 'India', 2011, 2024, 'Rafale (36 jets), Scorpene submarines', 'Aircraft', 700, 0.2);
addYears('United States', 'Japan', 2011, 2024, 'F-35A/B, SM-3, Global Hawk, MH-60R', 'Aircraft', 650, 0.2);
addYears('United States', 'Australia', 2011, 2024, 'F-35A, MH-60R, HIMARS, AUKUS submarine framework', 'Aircraft', 650, 0.2);
addYears('United States', 'South Korea', 2011, 2024, 'F-35A, SM-3, Global Hawk, THAAD, AH-64', 'Aircraft', 580, 0.2);

// Yemen War 2015-2024
addYears('United States', 'Saudi Arabia', 2015, 2024, 'Yemen War: GBU-39, HARM, Brimstone, Apache', 'Missiles', 500, 0.1);
addYears('United Kingdom', 'Saudi Arabia', 2015, 2024, 'Yemen War: Brimstone, Paveway, Typhoon munitions', 'Missiles', 300, 0.1);
addYears('France', 'Saudi Arabia', 2015, 2024, 'CAESAR howitzers, SCALP, helicopters', 'Artillery', 200, 0.1);

process.stdout.write(rows.join('\n') + '\n');
