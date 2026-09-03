import { describe, expect, it } from 'vitest';
import { runLegacy } from './legacy/dom-shim';

/**
 * Proves the harness itself works before it is trusted to validate the port.
 * Uses the exact defaults the live page ships with (paritas.html:327-387):
 * US parent, 2 flip years, Poland only, €600k dev flow, <€2M revenue,
 * nothing on paper, FY end 2025-12-31, "this quarter" urgency.
 */
describe('legacy DOM shim', () => {
  const ids = {
    flipYears: '2',
    fDev: '600000',
    fMgmt: '0',
    fLoan: '0',
    fIp: '0',
    fyEnd: '2025-12-31',
    ddEntities: '2',
    ddInstr: '1',
  };
  const names = {
    parent: 'us',
    c_pl: true,
    c_hu: false,
    c_cz: false,
    c_ro: false,
    rev: '1',
    smallco: '0',
    d_agree: false,
    d_bench: false,
    d_lf: false,
    d_5471: false,
    d_room: false,
    urgency: '1.1',
    ddside: 'buy',
    ddscope: 'rf',
    ddrev: '1',
    ddacct: '1.15',
    ddroom: '1',
    ddmodel: '1',
    dd_consol: false,
    dd_rush: false,
    dd_tp: true,
    dd_tax: false,
    dd_stamp: false,
  };

  const out = runLegacy(ids, names);

  it('renders the TP obligations panel', () => {
    expect(out.html.obligOut).toBeTruthy();
    expect(out.html.obligOut).toContain('PL');
  });

  it('renders a TP quote rather than the failure fallback', () => {
    expect(out.html.tpQuoteOut).toBeTruthy();
    expect(out.html.tpQuoteOut).not.toContain('Something went wrong');
  });

  it('renders an exposure figure', () => {
    expect(out.text.expOut).toBeTruthy();
  });

  it('renders deadlines', () => {
    expect(out.html.dlOut).toBeTruthy();
  });

  it('renders a DD quote rather than the failure fallback', () => {
    expect(out.html.ddQuoteOut).toBeTruthy();
    expect(out.html.ddQuoteOut).not.toContain('Something went wrong');
  });
});
