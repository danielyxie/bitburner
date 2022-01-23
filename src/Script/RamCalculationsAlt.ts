import {base as walkBase} from "acorn-walk";
import * as acorn from "acorn";
import {IPlayer} from '../PersonObjects/IPlayer';
import {Script} from './Script';
import {getRamCalculationForKeys, RamCalculation} from './RamCalculations';
import {RamCosts} from '../Netscript/RamCostGenerator';
import {RamCalculationErrorCode} from './RamCalculationErrorCodes';


/**
 * A mapping from identifiers to the FunctionDeclaration, VariableDeclarator, or ImportSpecifier which defines it.
 */
interface Scope {
  [x: string]: AnnotatedNode;
}

/**
 * Extension of acorn nodes which some extra helpful properties.
 */
interface AnnotatedNode extends acorn.Node {
  /**
   * The parent node of this one, or null if the root.
   */
  parent: AnnotatedNode | null;
  /**
   * Some nodes can be used in multiple ways (E.g. Identifier which can be an Expression, Pattern, Label, etc.).
   * For such nodes, the category is the specific usage.
   */
  category: string;
  /**
   * Scope which contains this node.
   */
  scope: Scope;
  /**
   * Scope "inside" this node for BlockStatements, FunctionDeclarations, etc.
   */
  innerScope?: Scope;

  [x: string]: AnnotatedNode | any;
}


/**
 * acorn-walk.base is really inconsistent and skips a bunch of children. betterBase fixes these issues.
 */
export const betterBase = Object.create(walkBase);
betterBase.LabeledStatement = (node: any, state: any, c: any) => {
  c(node.label, state, 'Label');
  c(node.body, state, 'Statement');
};
betterBase.BreakStatement = betterBase.ContinueStatement = (node: any, state: any, c: any) => {
  if(node.label)
    c(node.label, state, 'Label');
};
betterBase.Label = (node: any, state: any, c: any) => {
  c(node, state);
};
betterBase.SwitchStatement = (node: any, state: any, c: any) => {
  c(node.discriminant, state, 'Expression');
  for(const case_ of node.cases)
    c(case_, state);
};
betterBase.MemberExpression = (node: any, state: any, c: any) => {
  c(node.object, state, 'Expression');
  c(node.property, state, node.computed ? 'Expression' : undefined);
};
betterBase.ExportNamedDeclaration = (node: any, state: any, c: any) => {
  if (node.declaration)
    c(node.declaration, state, "Statement");
  for(const specifier of node.specifiers)
    c(specifier, state);
  if (node.source)
    c(node.source, state, "Expression");
};
betterBase.ExportSpecifier = (node: any, state: any, c: any) => {
  c(node.local, state);
  c(node.exported, state);
};
betterBase.ImportSpecifier = (node: any, state: any, c: any) => {
  c(node.local, state, 'Pattern');
  c(node.imported, state);
};
betterBase.ImportDefaultSpecifier = betterBase.ImportNamespaceSpecifier = (node: any, state: any, c: any) => {
  c(node.local, state, 'Pattern');
};
betterBase.MethodDefinition = betterBase.PropertyDefinition = betterBase.Property = (node: any, state: any, c: any) => {
  c(node.key, state, node.computed ? 'Expression' : undefined);
  if(node.value)
    c(node.value, state, 'Expression');
};


/**
 * Function which handles recursing into a node during a walk.
 * @param node Node to walk.
 * @param state State object passed through the tree.
 * @param c Continuation function to recurse children.
 * @param type Type of the node. Usually the same as node.type, but may be different in certain situations (e.g.
 *  "Pattern" when the node is an "Identifier")
 * @returns True if the node should be recursed with the default method, false or void if the node should be skipped.
 */
type RecurseFunction<S> = (node: AnnotatedNode, state: S, c: (node: AnnotatedNode, state: S, type?: string) => void,
                           type: string) => boolean | void;

/**
 * Function called when a node is first entered, before recursing through its children.
 * @param node Node to visit.
 * @param state State object passed through the tree.
 * @param type Type of the node. Usually the same as node.type, but may be different in certain situations (e.g.
 *  "Pattern" when the node is an "Identifier")
 */
type EnterFunction<S> = (node: AnnotatedNode, state: S, type: string) => void;

/**
 * Function called when a node is exited, after recursing through its children.
 * @param node Node to visit.
 * @param state State object passed through the tree.
 * @param type Type of the node. Usually the same as node.type, but may be different in certain situations (e.g.
 *  "Pattern" when the node is an "Identifier")
 */
type ExitFunction<S> = (node: AnnotatedNode, state: S, type: string) => void;

type Visitor<S> = {
  readonly recurse?: RecurseFunction<S> | boolean; // if a boolean, behaves like a function that returns that boolean
  readonly enter?: EnterFunction<S>;
  readonly exit?: ExitFunction<S>;
}

function defaultRecurse<S>(node: AnnotatedNode, state: S, c: any, type: string): void {
  betterBase[type](node, state, c);
}

/**
 * acorn-walk can be difficult to use if your use case doesn't fall neatly into one if it's predefined categories. It
 *  also visits on exit, which is surprising because the vast majority of use cases require enter visits. This function
 *  is designed to be a general-purpose replacement.
 * @param node Node to walk through.
 * @param state State to pass to the visitors.
 * @param visitors Mapping of node types to enter functions and/or visitors.
 * @param universalVisitor Visitor for any type. Enter/exit are call in addition to the type-specific visitor's, while
 *  recurse is used as a fallback for the type-specific visitor's.
 */
function betterWalk<S>(node: AnnotatedNode, state: S, visitors?: Record<string, EnterFunction<S> | Visitor<S>> | null, universalVisitor?: Visitor<S>): void {
  function walk(node: AnnotatedNode, state: S, type?: string): void {
    type ??= node.type;
    let visitor = visitors?.[type];
    if(visitor instanceof Function)
      visitor = {enter: visitor};

    universalVisitor?.enter?.(node, state, type);
    visitor?.enter?.(node, state, type);

    function handle(visitor: Visitor<S> | undefined): boolean {
      let recurse: any = visitor?.recurse ?? true; // missing recurse = use next recurse
      if(recurse instanceof Function)
        recurse = recurse(node, state, walk, type) ?? false; // void return means handled already
      return recurse;
    }

    handle(visitor) && handle(universalVisitor) && defaultRecurse(node, state, walk, type);

    visitor?.exit?.(node, state, type);
    universalVisitor?.exit?.(node, state, type);
  }

  walk(node, state);
}

/**
 * Annotates the given acorn node with extra information.
 * @param node_ Node to annotate.
 */
function annotateAst(node_: acorn.Node): AnnotatedNode {
  /**
   * Performs deduplication and populates parent/category.
   */
  function populateMetadata(node: AnnotatedNode): void {
    const seen = new Set<AnnotatedNode>();

    function handleChild(node: AnnotatedNode): AnnotatedNode {
      if(!seen.has(node)){
        seen.add(node);
        return node;
      }
      const copy = Object.create(Object.getPrototypeOf(node));
      Object.assign(copy, node);
      return copy;
    }

    betterWalk(node as AnnotatedNode, null, null, {
      enter(node: AnnotatedNode, prev: AnnotatedNode | null, type: string){
        //already visited this node, don't visit again
        if(node === prev)
          return;

        // deduplicate children
        //  acorn reuses node objects in some cases (e.g. `local` and `imported` for `import {xyz} from ...;`)
        //  this is fine most of the time, but it messes with our annotating, so detect such cases and copy the children
        //  as needed
        seen.clear();
        for(const [key, child] of Object.entries(node)){
          if(child instanceof acorn.Node){
            node[key] = handleChild(child as AnnotatedNode);
          }else if(child instanceof Array){
            for(let i = 0; i < child.length; i++){
              const ele = child[i];
              if(ele instanceof acorn.Node)
                child[i] = handleChild(ele as AnnotatedNode);
            }
          }
        }

        node.parent = prev;
        node.category = type;
      },
      recurse(node: AnnotatedNode, _: AnnotatedNode | null, c: any, type: string){
        defaultRecurse(node, node, c, type);
      }
    });
  }

  /**
   * Populates scope/innerScope
   */
  function createScopes(node: AnnotatedNode): void {
    /**
     * Creates a new scope.
     * @param root Node to create the scope for.
     * @param parent Parent scope for this one.
     */
    function newScope(root: AnnotatedNode, parent: Scope | null): Scope {
      const scope: Scope = Object.create(parent);
      root.innerScope = scope;
      return scope;
    }

    const visitors: Record<string, any> = {
      CatchClause: {
        recurse(node: AnnotatedNode, scope: Scope | null, c: any): void {
          scope = newScope(node, scope);
          if(node.param) c(node.param, scope, 'Pattern');
          c(node.body, scope, 'Statement');
        }
      },
      BlockStatement: {
        recurse(node: AnnotatedNode, scope: Scope | null, c: any): void {
          //don't introduce a new scope if the parent is a catch clause or a function, because we already did that for
          //  its arguments
          if(!['CatchClause', 'Function'].includes(node.parent?.category as any))
            scope = newScope(node, scope);

          for(const stmt of node.body)
            c(stmt, scope, 'Statement');
        }
      },
      Function: {
        recurse(node: AnnotatedNode, scope: Scope | null, c: any): void {
          //id is outside the scope
          if(node.id)
            c(node.id, scope, 'Pattern');
          scope = newScope(node, scope);
          for(const param of node.params)
            c(param, scope, 'Pattern');
          c(node.body, scope, node.expression ? 'Expression' : 'Statement');
        }
      },
      VariablePattern(node: AnnotatedNode){
        // to find what we're supposed to bind to, walk upward till we hit something that's not a pattern
        let parent: AnnotatedNode | null = node;
        while(parent != null && parent.category === 'Pattern')
          parent = parent.parent;
        if(parent == null)
          throw new Error('Failed to find parent for node');
        node.scope[node.name] = parent;
      }
    };
    visitors.Program = visitors.StaticBlock = visitors.BlockStatement;
    betterWalk(node, null, visitors, {
      enter(node: AnnotatedNode, scope: Scope | null){
        node.scope = scope as Scope;
      }
    });

    // technically the program's scope is null (because there's nothing outside it), but just set it to the inner scope
    //  because that eliminates a bunch of special cases later
    node.scope = node.innerScope as Scope;
  }

  const node = node_ as AnnotatedNode;
  populateMetadata(node);
  createScopes(node);
  return node;
}

/**
 * Finds a tree-shaken list of every reference used by the given entry point.
 * @param path Path of the entry module.
 * @param entry Identifier of the entry point.
 * @param loader Loader which returns the source code for the given path, or `false` for an "external" module.
 * @returns A mapping of module paths to sets of symbols used. Note, the symbols sets will contain `null` if
 *  everything is used.
 */
export function getTreeShakenReferences(path: string, entry: string, loader: (path: string) => string | false
  ): Map<string | null, Set<string | null>>
{
  /**
   * An export is either
   * 1) a node in the current file or
   * 2) a file path with an optional name (if name is null then the entire ns is exported)
   */
  type Export = AnnotatedNode | [string, string | null];

  /**
   * A filter is a stack of member keys that we use to tree shake namespaces.
   * E.g.
   * For an access like this:
   *  a.b.c.d.e
   * We'd have a filter stack like this:
   * ['e', 'd', 'c', 'b', 'a']
   */
  type Filter = string[];

  interface Program extends AnnotatedNode {
    /**
     * Named exports of the file.
     */
    exports: Map<string, Export>;
    /**
     * Wildcard exports of the file (i.e. `export * from ...;`)
     */
    exportAlls: Set<string>;
  }

  /**
   * Cache for loaded files
   */
  const cache = new Map<string, Program | string>();
  /**
   * Seen sets for each file
   */
  const fileSeenSets = new Map<string | null, Set<string | null>>();
  /**
   * Seen sets for each node
   */
  const nodeSeenSets = new Map<AnnotatedNode, Set<string | null>>();

  /**
   * Resolves the given import path relative to the given source.
   * @param source File we're importing _from_
   * @param path Path we're importing
   */
  function resolve(source: string, path: string): string {
    if(path.startsWith('./'))
      path = path.slice(2);
    return path;
    // If directories were real...
    // if(!path.match(/^\.\.?\//))
    //   return path;
    // return Path.resolve(Path.dirname(source), path);
  }

  /**
   * Loads the given path.
   * @param path Path to load.
   */
  function load(path: string): Program | string {
    //check the cache first
    let prog = cache.get(path);
    if(prog != null)
      return prog;

    const content = loader(path);
    //file is "external"
    if(content === false){
      prog = path;
      cache.set(path, prog);
      return prog;
    }

    //parse and annotate the file
    const ast = acorn.parse(content, {sourceType: 'module', ecmaVersion: 'latest'});
    prog = annotateAst(ast) as Program;

    //calculate the exports
    prog.exports = new Map<string, [string, string | null] | AnnotatedNode>();
    prog.exportAlls = new Set<string>();

    for(const child of prog.body){
      switch(child.type){
        case 'ExportNamedDeclaration': {
          if(child.declaration){
            switch(child.declaration.type){
              // export function ... or export class ...
              case 'FunctionDeclaration':
              case 'ClassDeclaration': {
                const name = child.declaration.id.name;
                prog.exports.set(name, child.declaration);
                break;
              }
              // export let ...
              case 'VariableDeclaration': {
                for(const dec of child.declaration.declarations){
                  betterWalk(dec.id, null, {
                    Identifier(node: AnnotatedNode){
                      if(node.category === 'Pattern')
                        (prog as Program).exports.set(node.name, dec.init);
                    },
                    //don't bother to walk any of the default value expressions
                    Expression: {recurse: false}
                  });
                }
                break;
              }
              default: throw new Error('Not implemented');
            }
          }else{
            if(child.source == null){
              // export { ... }
              for(const spec of child.specifiers){
                const name = spec.exported.name;
                prog.exports.set(spec.local.name, prog.scope[name]);
              }
            }else{
              // export { ... } from ...
              const source = resolve(path, child.source.value);
              for(const spec of child.specifiers){
                const name = spec.exported.name as string;
                prog.exports.set(spec.local.name, [source, name]);
              }
            }
          }
          break;
        }
        case 'ExportDefaultDeclaration': {
          // export default ...
          prog.exports.set('default', child.declaration);
          break;
        }
        case 'ExportAllDeclaration': {
          const source = resolve(path, child.source.value);
          if(child.exported != null){
            // export * as xyz from ...
            prog.exports.set(child.exported.name, [source, null]);
          }else{
            // export * from ...
            prog.exportAlls.add(source);
          }
          break;
        }
      }
    }

    cache.set(path, prog);
    return prog;
  }

  /**
   * Returns true if we've already processed the given reference. Adds the reference if it hasn't yet been seen.
   * @param seen Set of symbols that have already been seen.
   * @param name Name of the entry in seen that we're modifying
   * @param filter Filter path that we're processing.
   */
  function isSeen<K>(seen: Map<K, Set<string | null>>, name: K, filter: Filter): boolean {
    let seenSet = seen.get(name);
    if(seenSet == null){
      seenSet = new Set<string | null>();
      seen.set(name, seenSet);
    }

    //if we've already seen the wildcard, we're done
    if(seenSet.has(null))
      return true;

    //wildcard filter
    if(filter.length === 0){
      seenSet.add(null);
      return false;
    }

    //check each parent namespace. if we've already wildcard-visited one of them, we're already visited too
    let i = filter.length;
    let key = filter[--i];
    if(seenSet.has(key))
      return true;
    while(i > 0){
      key = `${key}.${filter[--i]}`;
      if(seenSet.has(key))
        return true;
    }

    //wasn't found. add the key and return
    seenSet.add(key);
    return false;
  }

  /**
   * Explores the given export with the given filter
   * @param exp Export to explore
   * @param filter Filter to apply
   */
  function exploreExport(exp: Export, filter: Filter): boolean {
    //export is in the current file, explore it
    if(exp instanceof acorn.Node){
      exploreNode(path, exp, filter);
      return true;
    }

    //export is from another file
    const [sourcePath, sourceName] = exp;

    //export is namespace, use unmodified filter
    if(sourceName == null)
      return exploreFile(sourcePath, filter);

    //export is a specific key from another file, apply that key on top of the filter
    filter.push(sourceName);
    try{
      return exploreFile(sourcePath, filter);
    }finally{
      filter.pop();
    }
  }

  /**
   * Explores the given file, returning true if the filtered value was found.
   * @param path Path of the file to explore.
   * @param filter Filter to limit the breadth of our exploration.
   * @param disallowExternal Disallows the value to come from an external file. Used to prevent
   *  `export * from <external>` from becoming a black hole that consumes everything.
   * @returns True if the value specified by our filter was found.
   */
  function exploreFile(path: string, filter: Filter, disallowExternal?: boolean): boolean {
    if(isSeen(fileSeenSets, path, filter))
      return true;

    // debugging:
    // console.log(path, filter);

    const prog = load(path);
    if(typeof prog === 'string')
      return !disallowExternal;

    // wildcard filter, explore everything
    if(filter.length === 0){
      for(const exp of prog.exports.values())
        exploreExport(exp, filter);
      for(const other of prog.exportAlls)
        exploreFile(other, filter);
      return true;
    }

    // if exports has the top part of our filter, pop it and search that node with the new filter
    const key = filter.pop() as string;
    try{
      const exp = prog.exports.get(key);
      if(exp != null)
        return exploreExport(exp, filter);
    }finally{
      filter.push(key);
    }

    // check all the `export * from ...` as a backup
    for(const other of prog.exportAlls){
      if(exploreFile(other, filter, true))
        return true;
    }

    // didn't find it :(
    return false;
  }

  /**
   * Explores the given node.
   * @param path Path of the containing file.
   * @param root Node we're exploring.
   * @param filter Filter to limit the breadth of our exploration.
   */
  function exploreNode(path: string, root: AnnotatedNode, filter: Filter): void {
    if(isSeen(nodeSeenSets, root, filter))
      return;

    // debugging:
    // console.log(path, root, filter);

    // all imports go through here
    if(root.parent?.type === 'ImportDeclaration'){
      const sourcePath = resolve(path, root.parent.source.value);
      let name;
      switch(root.type){
        // import { xyz } from ...
        case 'ImportSpecifier': name = root.imported.name; break;
        // import xyz from ...
        case 'ImportDefaultSpecifier': name = 'default'; break;
        // import * as xyz from ...
        case 'ImportNamespaceSpecifier': name = null; break;
        default: throw new Error('Not implemented');
      }

      // namespace import, don't add anything to the filter
      if(name == null){
        exploreFile(sourcePath, filter);
        return;
      }

      // named import, add the key to the filter
      filter.push(name);
      try{
        exploreFile(sourcePath, filter);
      }finally{
        filter.pop();
      }
      return;
    }

    //everything else goes through this
    betterWalk(root, null, {
      // don't explore any functions (except the root)
      FunctionDeclaration: {
        recurse: node => node === root
      },
      Identifier(node: AnnotatedNode){
        // only explore expression identifiers (i.e. references to other nodes)
        if(node.category !== 'Expression')
          return;

        const refed = node.scope[node.name];
        if(refed == null){
          // global and/or undefined reference
          isSeen(fileSeenSets, null, [node.name]);
          return;
        }

        // build a new filter by walking up the parent chain until we hit something that isn't a MemberExpression
        const newFilter = [];
        let parent = node.parent;
        while(parent?.type === 'MemberExpression'){
          const prop = parent.property;
          if(prop.type !== 'Identifier') // computed property, bail out
            break;
          newFilter.push(prop.name);
          parent = parent.parent;
        }
        newFilter.reverse(); // reverse to get the stack-order we desire
        exploreNode(path, refed, newFilter);
      }
    });
  }

  const mainProg = load(path);
  if(typeof mainProg === 'string')
    throw new Error('Entry file is not loaded?!');

  const filter = [];
  // If the main program has the entry in its exports, use it.
  //  Otherwise, we'll explore wildcard to collect the cost of the entire file.
  if(mainProg.exports.has(entry))
    filter.push(entry);
  exploreFile(path, filter);
  return fileSeenSets;
}

export function calculateRamUsage(
  player: IPlayer,
  filename: string,
  code: string,
  otherScripts: Script[],
): RamCalculation {
  try{
    const lookup = new Map<string, string>();

    for(const script of otherScripts){
      // only NS2 supported, sorry
      if(!script.filename.endsWith('.js'))
        continue;
      // register the file both with and without the extension
      lookup.set(script.filename, script.code);
      lookup.set(script.filename.slice(0, -3), script.code);
    }
    lookup.set(filename, code);

    const refs = getTreeShakenReferences(filename, 'main', path => {
      // externalize both url and ^ns imports
      if(path.match(/^(\w+:\/\/|ns(\/|$))/))
        return false;
      // look for a file with the given name
      return lookup.get(path) ?? false;
    });

    // debugging:
    // console.log(refs);

    // build the key set from the imports from each of the ns modules
    const keys = new Set<string>();

    // check the globals
    const globals = refs.get(null);
    if(globals != null){
      for(const global of ['document', 'window']){
        if(globals.has(global))
          keys.add(global);
      }
    }

    // check the ns modules
    for(const namespace of [null, 'bladeburner', 'codingcontract', 'stanek', 'gang', 'sleeve', 'stock', 'ui', 'heart']) {
      let module = 'ns';
      let costs = RamCosts;
      if(namespace != null){
        module = `${module}/${namespace}`;
        costs = costs[namespace];
      }

      const moduleRefs = refs.get(module);
      if(moduleRefs == null || moduleRefs.size === 0)
        continue;

      if(namespace != null)
        keys.add(namespace);

      let used: Iterable<string> = moduleRefs as Set<string>;
      if(moduleRefs.has(null))
        used = Object.keys(costs);
      for(const key of used)
        keys.add(key);
    }

    return getRamCalculationForKeys(player, keys);
  } catch (e) {
    // debugging:
    // console.error(`Failed to parse script for RAM calculations:`);
    // console.error(e);
    return { cost: RamCalculationErrorCode.SyntaxError };
  }
}
