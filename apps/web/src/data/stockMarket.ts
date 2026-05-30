// Approximate Dow Jones Industrial Average year-end closing values, 1914–2024
export const DOW_JONES: Record<number, number> = {
  1914: 54,  1915: 88,  1916: 99,  1917: 74,  1918: 82,  1919: 108,
  1920: 71,  1921: 64,  1922: 100, 1923: 96,  1924: 120, 1925: 156,
  1926: 158, 1927: 202, 1928: 300, 1929: 248,
  1930: 165, 1931: 77,  1932: 60,  1933: 99,  1934: 104, 1935: 150,
  1936: 184, 1937: 179, 1938: 155, 1939: 131, 1940: 131, 1941: 113,
  1942: 119, 1943: 136, 1944: 152, 1945: 192, 1946: 178, 1947: 181,
  1948: 177, 1949: 200, 1950: 235, 1951: 269, 1952: 292, 1953: 281,
  1954: 404, 1955: 488, 1956: 499, 1957: 436, 1958: 584, 1959: 679,
  1960: 616, 1961: 731, 1962: 652, 1963: 763, 1964: 874, 1965: 969,
  1966: 786, 1967: 906, 1968: 944, 1969: 800, 1970: 838, 1971: 890,
  1972: 1020,1973: 851, 1974: 616, 1975: 852, 1976: 1005,1977: 831,
  1978: 805, 1979: 839, 1980: 964, 1981: 875, 1982: 1047,1983: 1259,
  1984: 1212,1985: 1547,1986: 1896,1987: 1939,1988: 2169,1989: 2753,
  1990: 2634,1991: 3169,1992: 3301,1993: 3754,1994: 3834,1995: 5117,
  1996: 6448,1997: 7908,1998: 9181,1999: 11497,2000: 10788,
  2001: 10022,2002: 8342,2003: 10454,2004: 10783,2005: 10718,
  2006: 12463,2007: 13265,2008: 8776,2009: 10428,2010: 11578,
  2011: 12218,2012: 13104,2013: 16577,2014: 17823,2015: 17425,
  2016: 19763,2017: 24719,2018: 23327,2019: 28538,2020: 30606,
  2021: 36338,2022: 33147,2023: 37689,2024: 44910,
};

export interface MarketAnnotation {
  year: number;
  label: string;
  type: 'crash' | 'boom' | 'event';
}

export const MARKET_ANNOTATIONS: MarketAnnotation[] = [
  { year: 1914, label: 'NYSE closed 4 months (WWI outbreak)', type: 'event' },
  { year: 1929, label: 'Black Tuesday — Wall Street Crash', type: 'crash' },
  { year: 1932, label: 'Great Depression trough (−89% from peak)', type: 'crash' },
  { year: 1933, label: 'FDR New Deal & bank holiday', type: 'event' },
  { year: 1941, label: 'Pearl Harbor — US enters WWII', type: 'event' },
  { year: 1945, label: 'WWII ends — post-war boom begins', type: 'boom' },
  { year: 1966, label: 'Vietnam inflation concerns', type: 'event' },
  { year: 1973, label: 'Oil Crisis — OPEC embargo', type: 'crash' },
  { year: 1974, label: 'Watergate + recession bottom', type: 'crash' },
  { year: 1987, label: 'Black Monday (Oct 19: −22% in one day)', type: 'crash' },
  { year: 1991, label: 'Gulf War + recession', type: 'event' },
  { year: 1999, label: 'Dot-com peak', type: 'boom' },
  { year: 2000, label: 'Dot-com crash begins', type: 'crash' },
  { year: 2001, label: '9/11 attacks — markets closed 4 days', type: 'event' },
  { year: 2008, label: 'Global Financial Crisis (−54% peak-trough)', type: 'crash' },
  { year: 2009, label: 'Markets bottom — Fed QE begins', type: 'boom' },
  { year: 2020, label: 'COVID crash + recovery', type: 'event' },
  { year: 2022, label: 'Ukraine war + Fed rate hikes', type: 'crash' },
];
