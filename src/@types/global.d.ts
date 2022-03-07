// Defined by webpack on startup or compilation
declare let __COMMIT_HASH__: string;

// When using file-loader, we'll get a path to the resource
declare module "*.png" {
  const value: string;
  export default value;
}
