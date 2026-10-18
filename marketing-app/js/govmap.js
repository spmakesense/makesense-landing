/* GovMap real-estate deals (Israel Tax Authority register, served by govmap.gov.il public API).
   Shared by the browser app and server.js — `http(url, {method, body})` must resolve to parsed JSON. */
(function (root) {
  'use strict';
  const BASE = 'https://www.govmap.gov.il/api';

  const ym = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  const floorNum = v => { if (v == null || v === '') return ''; if (typeof v === 'number') return v; if (/קרקע/.test(v)) return 0; const m = String(v).match(/-?\d+/); return m ? +m[0] : ''; };
  const parsePoint = shape => {
    const m = /^POINT\s*\(\s*([\d.\-]+)\s+([\d.\-]+)\s*\)/i.exec(String(shape || ''));
    return m ? [+m[1], +m[2]] : null;
  };
  const listOf = r => Array.isArray(r) ? r : Array.isArray(r?.data) ? r.data : Array.isArray(r?.results) ? r.results : [];

  async function geocode(address, http) {
    const r = await http(`${BASE}/search-service/autocomplete`, { method: 'POST', body: { searchText: address, language: 'he', isAccurate: false, maxResults: 10 } });
    const hit = listOf(r).map(x => ({ text: x.text, point: parsePoint(x.shape) })).find(x => x.point);
    if (!hit) throw new Error('הכתובת לא אותרה ב-GovMap');
    return hit;
  }

  function normalize(d, src) {
    const street = d.streetNameHeb || d.streetName || '';
    const house = d.houseNum ?? d.houseNumber ?? '';
    return {
      govId: d.objectid,
      address: [street, house].filter(x => x !== '' && x != null).join(' ') + (d.settlementNameHeb ? `, ${d.settlementNameHeb}` : ''),
      date: String(d.dealDate || '').slice(0, 10),
      price: +d.dealAmount || '',
      sqm: +d.assetArea || '',
      rooms: +d.assetRoomNum || '',
      floor: d.floorNumber != null ? d.floorNumber : floorNum(d.floor),
      propType: d.propertyTypeDescription || '',
      neighborhood: d.neighborhood || '',
      scope: src
    };
  }

  /** Recent deals around an address. opts: years, radius (m), dealType (2 = יד שנייה, 1 = חדש מקבלן), maxPolygons, limit */
  async function findDeals(address, opts = {}) {
    const { http, years = 2, radius = 100, dealType = 2, maxPolygons = 6, limit = 300 } = opts;
    const geo = await geocode(address, http);
    let polys = [];
    for (const r of [radius, Math.max(radius, 300)]) {
      polys = listOf(await http(`${BASE}/real-estate/deals/${geo.point[0]},${geo.point[1]}/${Math.min(r, 5000)}`, { method: 'GET' }));
      if (polys.length) break;
    }
    const seenPoly = new Set();
    polys = polys.filter(p => p.polygon_id != null && !seenPoly.has(p.polygon_id) && seenPoly.add(p.polygon_id)).slice(0, maxPolygons);
    if (!polys.length) return { matched: geo.text, point: geo.point, deals: [] };
    const now = new Date(), from = new Date(now.getFullYear() - years, now.getMonth(), 1);
    const qs = `limit=${limit}&dealType=${dealType}&startDate=${ym(from)}&endDate=${ym(now)}`;
    const jobs = polys.map(p => [`${BASE}/real-estate/street-deals/${p.polygon_id}?${qs}`, 'street']);
    jobs.push([`${BASE}/real-estate/neighborhood-deals/${polys[0].polygon_id}?${qs}`, 'neighborhood']);
    const seen = new Set(), deals = [];
    for (const [url, src] of jobs) {
      let rows = [];
      try { rows = listOf(await http(url, { method: 'GET' })); } catch (e) { if (src === 'street' && !deals.length && url === jobs[0][0]) throw e; }
      for (const d of rows) {
        if (d.objectid == null || seen.has(d.objectid)) continue;
        seen.add(d.objectid); deals.push(normalize(d, src));
      }
    }
    deals.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    return { matched: geo.text, point: geo.point, deals };
  }

  const api = { findDeals, geocode, normalize, BASE };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Govmap = api;
})(typeof window !== 'undefined' ? window : globalThis);
