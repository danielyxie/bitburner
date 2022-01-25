// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jest, describe, expect } from "@jest/globals";
import { getTreeShakenReferences } from '../../src/Script/RamCalculationsAlt';

describe("Netscript Static RAM Calculation/Generation Tests - Alt", function () {
  /**
   * @param {Record<string, string>} files
   * @param {string?} entry
   * @return {Set<string>}
   */
  function getNsKeys(files, entry){
    const refs = getTreeShakenReferences('main.js', entry, path => {
      if(path.match(/^(\w+:\/\/|ns(\/|$))/))
        return false;
      return files[path] ?? false;
    });
    const keys = new Set();
    for(const [path, used] of refs.entries()){
      if(path == null){
        for(const use of used)
          keys.add(use);
        continue;
      }
      if(!path.match(/^ns(\/|$)/))
        continue;
      for(const use of used)
        keys.add(`${path}/${use}`);
    }
    return keys;
  }

  describe("Basic Functionality", function(){
    it("Basic Functionality", function(){
      expect(getNsKeys({
        'main.js': `
        import {getWeakenTime} from 'ns';

        export async function main(ns){
          getWeakenTime(ns);
        }
      `
      })).toEqual(new Set(['ns/getWeakenTime']));
    });

    it("DOM", function(){
      expect(getNsKeys({
        'main.js': `
        export async function main(ns){
          document.getElementById('xyz');
        }
      `
      })).toEqual(new Set(['document']));
    });
  });

  describe("Tree Shaking", function(){
    it("Basic Tree Shaking", function(){
      expect(getNsKeys({
        'main.js': `
        import {getWeakenTime, getGrowTime} from 'ns';

        export async function main(ns){
          getWeakenTime(ns);
        }
      `
      })).toEqual(new Set(['ns/getWeakenTime']));
    });

    it("Namespace Tree Shaking", function(){
      expect(getNsKeys({
        'main.js': `
        import * as Ns from 'ns';

        export async function main(ns){
          Ns.getWeakenTime(ns);
        }
      `
      })).toEqual(new Set(['ns/getWeakenTime']));
    });

    it("Function Tree Shaking", function(){
      expect(getNsKeys({
        'main.js': `
        import {getWeakenTime, getGrowTime} from 'ns';

        function weakenTime(ns){
          return getWeakenTime(ns);
        }

        function growTime(ns){
          return getGrowTime(ns);
        }

        export async function main(ns){
          weakenTime(ns);
        }
      `
      })).toEqual(new Set(['ns/getWeakenTime']));
    });

    it("Multi-file Tree Shaking", function(){
      expect(getNsKeys({
        'main.js': `
        import {weakenTime} from 'util.js';

        export async function main(ns){
          weakenTime(ns);
        }
      `,
        'util.js': `
        import {getWeakenTime, getGrowTime} from 'ns';

        export function weakenTime(ns){
          return getWeakenTime(ns);
        }

        export function growTime(ns){
          return getGrowTime(ns);
        }
      `
      })).toEqual(new Set(['ns/getWeakenTime']));
    });

    it("Extreme Tree Shaking", function(){
      const files = {
        'main.js': `
        import * as a from 'a.js';

        export async function main1(ns){
          a.c.weakenTime(ns);
        }

        export async function main2(ns){
          a.c.growTime(ns);
        }
      `,
        'a.js': `
        export * from 'b.js';
      `,
        'b.js': `
        export * as c from 'c.js';
      `,
        'c.js': `
        export * from 'd.js';
      `,
        'd.js': `
        import {getWeakenTime, getGrowTime} from 'e.js';

        export const weakenTime = getWeakenTime;

        export function growTime(ns) {
          let obj = {xyz: getGrowTime};
          return (() => {
            obj.xyz(ns);
          })();
        }
      `,
        'e.js': `
        export {getWeakenTime, getGrowTime, getHackTime} from 'ns';
      `
      };
      expect(getNsKeys(files, 'main1')).toEqual(new Set(['ns/getWeakenTime']));
      expect(getNsKeys(files, 'main2')).toEqual(new Set(['ns/getGrowTime']));
    });
  });
});
