import * as dirHelpers from "../../src/Terminal/DirectoryHelpers";

describe("Terminal Directory Tests", function () {
  describe("removeLeadingSlash()", function () {
    const removeLeadingSlash = dirHelpers.removeLeadingSlash;

    it("should remove first slash in a string", function () {
      expect(removeLeadingSlash("/")).toEqual("");
      expect(removeLeadingSlash("/foo.txt")).toEqual("foo.txt");
      expect(removeLeadingSlash("/foo/file.txt")).toEqual("foo/file.txt");
    });

    it("should only remove one slash", function () {
      expect(removeLeadingSlash("///")).toEqual("//");
      expect(removeLeadingSlash("//foo")).toEqual("/foo");
    });

    it("should do nothing for a string that doesn't start with a slash", function () {
      expect(removeLeadingSlash("foo.txt")).toEqual("foo.txt");
      expect(removeLeadingSlash("foo/test.txt")).toEqual("foo/test.txt");
    });

    it("should not fail on an empty string", function () {
      expect(removeLeadingSlash.bind(null, "")).not.toThrow();
      expect(removeLeadingSlash("")).toEqual("");
    });
  });

  describe("removeTrailingSlash()", function () {
    const removeTrailingSlash = dirHelpers.removeTrailingSlash;

    it("should remove last slash in a string", function () {
      expect(removeTrailingSlash("/")).toEqual("");
      expect(removeTrailingSlash("foo.txt/")).toEqual("foo.txt");
      expect(removeTrailingSlash("foo/file.txt/")).toEqual("foo/file.txt");
    });

    it("should only remove one slash", function () {
      expect(removeTrailingSlash("///")).toEqual("//");
      expect(removeTrailingSlash("foo//")).toEqual("foo/");
    });

    it("should do nothing for a string that doesn't end with a slash", function () {
      expect(removeTrailingSlash("foo.txt")).toEqual("foo.txt");
      expect(removeTrailingSlash("foo/test.txt")).toEqual("foo/test.txt");
    });

    it("should not fail on an empty string", function () {
      expect(removeTrailingSlash.bind(null, "")).not.toThrow();
      expect(removeTrailingSlash("")).toEqual("");
    });
  });

  describe("isValidFilename()", function () {
    const isValidFilename = dirHelpers.isValidFilename;

    it("should return true for valid filenames", function () {
      expect(isValidFilename("test.txt")).toEqual(true);
      expect(isValidFilename("123.script")).toEqual(true);
      expect(isValidFilename("foo123.b")).toEqual(true);
      expect(isValidFilename("my_script.script")).toEqual(true);
      expect(isValidFilename("my-script.script")).toEqual(true);
      expect(isValidFilename("_foo.lit")).toEqual(true);
      expect(isValidFilename("mult.periods.script")).toEqual(true);
      expect(isValidFilename("mult.per-iods.again.script")).toEqual(true);
      expect(isValidFilename("BruteSSH.exe-50%-INC")).toEqual(true);
      expect(isValidFilename("DeepscanV1.exe-1.01%-INC")).toEqual(true);
      expect(isValidFilename("DeepscanV2.exe-1.00%-INC")).toEqual(true);
      expect(isValidFilename("AutoLink.exe-1.%-INC")).toEqual(true);
    });

    it("should return false for invalid filenames", function () {
      expect(isValidFilename("foo")).toEqual(false);
      expect(isValidFilename("my script.script")).toEqual(false);
      expect(isValidFilename("a^.txt")).toEqual(false);
      expect(isValidFilename("b#.lit")).toEqual(false);
      expect(isValidFilename("lib().js")).toEqual(false);
      expect(isValidFilename("foo.script_")).toEqual(false);
      expect(isValidFilename("foo._script")).toEqual(false);
      expect(isValidFilename("foo.hyphened-ext")).toEqual(false);
      expect(isValidFilename("")).toEqual(false);
      expect(isValidFilename("AutoLink-1.%-INC.exe")).toEqual(false);
      expect(isValidFilename("AutoLink.exe-1.%-INC.exe")).toEqual(false);
      expect(isValidFilename("foo%.exe")).toEqual(false);
      expect(isValidFilename("-1.00%-INC")).toEqual(false);
    });
  });

  describe("isValidDirectoryName()", function () {
    const isValidDirectoryName = dirHelpers.isValidDirectoryName;

    it("should return true for valid directory names", function () {
      expect(isValidDirectoryName("a")).toEqual(true);
      expect(isValidDirectoryName("foo")).toEqual(true);
      expect(isValidDirectoryName("foo-dir")).toEqual(true);
      expect(isValidDirectoryName("foo_dir")).toEqual(true);
      expect(isValidDirectoryName(".a")).toEqual(true);
      expect(isValidDirectoryName("1")).toEqual(true);
      expect(isValidDirectoryName("a1")).toEqual(true);
      expect(isValidDirectoryName(".a1")).toEqual(true);
      expect(isValidDirectoryName("._foo")).toEqual(true);
      expect(isValidDirectoryName("_foo")).toEqual(true);
    });

    it("should return false for invalid directory names", function () {
      expect(isValidDirectoryName("")).toEqual(false);
      expect(isValidDirectoryName("foo.dir")).toEqual(false);
      expect(isValidDirectoryName("1.")).toEqual(false);
      expect(isValidDirectoryName("foo.")).toEqual(false);
      expect(isValidDirectoryName("dir#")).toEqual(false);
      expect(isValidDirectoryName("dir!")).toEqual(false);
      expect(isValidDirectoryName("dir*")).toEqual(false);
      expect(isValidDirectoryName(".")).toEqual(false);
    });
  });

  describe("isValidDirectoryPath()", function () {
    const isValidDirectoryPath = dirHelpers.isValidDirectoryPath;

    it("should return false for empty strings", function () {
      expect(isValidDirectoryPath("")).toEqual(false);
    });

    it("should return true only for the forward slash if the string has length 1", function () {
      expect(isValidDirectoryPath("/")).toEqual(true);
      expect(isValidDirectoryPath(" ")).toEqual(false);
      expect(isValidDirectoryPath(".")).toEqual(false);
      expect(isValidDirectoryPath("a")).toEqual(false);
    });

    it("should return true for valid directory paths", function () {
      expect(isValidDirectoryPath("/a")).toEqual(true);
      expect(isValidDirectoryPath("/dir/a")).toEqual(true);
      expect(isValidDirectoryPath("/dir/foo")).toEqual(true);
      expect(isValidDirectoryPath("/.dir/foo-dir")).toEqual(true);
      expect(isValidDirectoryPath("/.dir/foo_dir")).toEqual(true);
      expect(isValidDirectoryPath("/.dir/.a")).toEqual(true);
      expect(isValidDirectoryPath("/dir1/1")).toEqual(true);
      expect(isValidDirectoryPath("/dir1/a1")).toEqual(true);
      expect(isValidDirectoryPath("/dir1/.a1")).toEqual(true);
      expect(isValidDirectoryPath("/dir_/._foo")).toEqual(true);
      expect(isValidDirectoryPath("/dir-/_foo")).toEqual(true);
    });

    it("should return false if the path does not have a leading slash", function () {
      expect(isValidDirectoryPath("a")).toEqual(false);
      expect(isValidDirectoryPath("dir/a")).toEqual(false);
      expect(isValidDirectoryPath("dir/foo")).toEqual(false);
      expect(isValidDirectoryPath(".dir/foo-dir")).toEqual(false);
      expect(isValidDirectoryPath(".dir/foo_dir")).toEqual(false);
      expect(isValidDirectoryPath(".dir/.a")).toEqual(false);
      expect(isValidDirectoryPath("dir1/1")).toEqual(false);
      expect(isValidDirectoryPath("dir1/a1")).toEqual(false);
      expect(isValidDirectoryPath("dir1/.a1")).toEqual(false);
      expect(isValidDirectoryPath("dir_/._foo")).toEqual(false);
      expect(isValidDirectoryPath("dir-/_foo")).toEqual(false);
    });

    it("should accept dot notation", function () {
      expect(isValidDirectoryPath("/dir/./a")).toEqual(true);
      expect(isValidDirectoryPath("/dir/../foo")).toEqual(true);
      expect(isValidDirectoryPath("/.dir/./foo-dir")).toEqual(true);
      expect(isValidDirectoryPath("/.dir/../foo_dir")).toEqual(true);
      expect(isValidDirectoryPath("/.dir/./.a")).toEqual(true);
      expect(isValidDirectoryPath("/dir1/1/.")).toEqual(true);
      expect(isValidDirectoryPath("/dir1/a1/..")).toEqual(true);
      expect(isValidDirectoryPath("/dir1/.a1/..")).toEqual(true);
      expect(isValidDirectoryPath("/dir_/._foo/.")).toEqual(true);
      expect(isValidDirectoryPath("/./dir-/_foo")).toEqual(true);
      expect(isValidDirectoryPath("/../dir-/_foo")).toEqual(true);
    });
  });

  describe("isValidFilePath()", function () {
    const isValidFilePath = dirHelpers.isValidFilePath;

    it("should return false for strings that are too short", function () {
      expect(isValidFilePath("/a")).toEqual(false);
      expect(isValidFilePath("a.")).toEqual(false);
      expect(isValidFilePath(".a")).toEqual(false);
      expect(isValidFilePath("/.")).toEqual(false);
    });

    it("should return true for arguments that are just filenames", function () {
      expect(isValidFilePath("test.txt")).toEqual(true);
      expect(isValidFilePath("123.script")).toEqual(true);
      expect(isValidFilePath("foo123.b")).toEqual(true);
      expect(isValidFilePath("my_script.script")).toEqual(true);
      expect(isValidFilePath("my-script.script")).toEqual(true);
      expect(isValidFilePath("_foo.lit")).toEqual(true);
      expect(isValidFilePath("mult.periods.script")).toEqual(true);
      expect(isValidFilePath("mult.per-iods.again.script")).toEqual(true);
    });

    it("should return true for valid filepaths", function () {
      expect(isValidFilePath("/foo/test.txt")).toEqual(true);
      expect(isValidFilePath("/../123.script")).toEqual(true);
      expect(isValidFilePath("/./foo123.b")).toEqual(true);
      expect(isValidFilePath("/dir/my_script.script")).toEqual(true);
      expect(isValidFilePath("/dir1/dir2/dir3/my-script.script")).toEqual(true);
      expect(isValidFilePath("/dir1/dir2/././../_foo.lit")).toEqual(true);
      expect(isValidFilePath("/.dir1/./../.dir2/mult.periods.script")).toEqual(true);
      expect(isValidFilePath("/_dir/../dir2/mult.per-iods.again.script")).toEqual(true);
    });

    it("should return false for strings that end with a slash", function () {
      expect(isValidFilePath("/foo/")).toEqual(false);
      expect(isValidFilePath("foo.txt/")).toEqual(false);
      expect(isValidFilePath("/")).toEqual(false);
      expect(isValidFilePath("/_dir/")).toEqual(false);
    });

    it("should return false for invalid arguments", function () {
      expect(isValidFilePath(null)).toEqual(false);
      expect(isValidFilePath()).toEqual(false);
      expect(isValidFilePath(5)).toEqual(false);
      expect(isValidFilePath({})).toEqual(false);
    });
  });

  describe("getFirstParentDirectory()", function () {
    const getFirstParentDirectory = dirHelpers.getFirstParentDirectory;

    it("should return the first parent directory in a filepath", function () {
      expect(getFirstParentDirectory("/dir1/foo.txt")).toEqual("dir1/");
      expect(getFirstParentDirectory("/dir1/dir2/dir3/dir4/foo.txt")).toEqual("dir1/");
      expect(getFirstParentDirectory("/_dir1/dir2/foo.js")).toEqual("_dir1/");
    });

    it("should return '/' if there is no first parent directory", function () {
      expect(getFirstParentDirectory("")).toEqual("/");
      expect(getFirstParentDirectory(" ")).toEqual("/");
      expect(getFirstParentDirectory("/")).toEqual("/");
      expect(getFirstParentDirectory("//")).toEqual("/");
      expect(getFirstParentDirectory("foo.script")).toEqual("/");
      expect(getFirstParentDirectory("/foo.txt")).toEqual("/");
    });
  });

  describe("getAllParentDirectories()", function () {
    const getAllParentDirectories = dirHelpers.getAllParentDirectories;

    it("should return all parent directories in a filepath", function () {
      expect(getAllParentDirectories("/")).toEqual("/");
      expect(getAllParentDirectories("/home/var/foo.txt")).toEqual("/home/var/");
      expect(getAllParentDirectories("/home/var/")).toEqual("/home/var/");
      expect(getAllParentDirectories("/home/var/test/")).toEqual("/home/var/test/");
    });

    it("should return an empty string if there are no parent directories", function () {
      expect(getAllParentDirectories("foo.txt")).toEqual("");
    });
  });

  describe("isInRootDirectory()", function () {
    const isInRootDirectory = dirHelpers.isInRootDirectory;

    it("should return true for filepaths that refer to a file in the root directory", function () {
      expect(isInRootDirectory("a.b")).toEqual(true);
      expect(isInRootDirectory("foo.txt")).toEqual(true);
      expect(isInRootDirectory("/foo.txt")).toEqual(true);
    });

    it("should return false for filepaths that refer to a file that's NOT in the root directory", function () {
      expect(isInRootDirectory("/dir/foo.txt")).toEqual(false);
      expect(isInRootDirectory("dir/foo.txt")).toEqual(false);
      expect(isInRootDirectory("/./foo.js")).toEqual(false);
      expect(isInRootDirectory("../foo.js")).toEqual(false);
      expect(isInRootDirectory("/dir1/dir2/dir3/foo.txt")).toEqual(false);
    });

    it("should return false for invalid inputs (inputs that aren't filepaths)", function () {
      expect(isInRootDirectory(null)).toEqual(false);
      expect(isInRootDirectory(undefined)).toEqual(false);
      expect(isInRootDirectory("")).toEqual(false);
      expect(isInRootDirectory(" ")).toEqual(false);
      expect(isInRootDirectory("a")).toEqual(false);
      expect(isInRootDirectory("/dir")).toEqual(false);
      expect(isInRootDirectory("/dir/")).toEqual(false);
      expect(isInRootDirectory("/dir/foo")).toEqual(false);
    });
  });

  describe("evaluateDirectoryPath()", function () {
    //const evaluateDirectoryPath = dirHelpers.evaluateDirectoryPath;
    // TODO
  });

  describe("evaluateFilePath()", function () {
    //const evaluateFilePath = dirHelpers.evaluateFilePath;
    // TODO
  });
});
